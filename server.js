const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const { createWorker } = require('tesseract.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const uploadDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });
app.use(express.json());
app.use(express.static(__dirname, {
  maxAge: 0,
  etag: false,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function analyzeDocumentType(message, contextText = '') {
  const text = (message + ' ' + contextText).toLowerCase();
  console.log('Analyzing text:', text.substring(0, 100));
  if (text.includes('ijara') || text.includes('arenda') || text.includes('аренд') || text.includes('квартир')) return 'rent';
  if (text.includes('mehnat') || text.includes('труд') || text.includes('работ') || text.includes('трудов')) return 'labor';
  if (text.includes('sotish') || text.includes('покуп') || text.includes('прода') || text.includes('продаж')) return 'sale';
  if (text.includes('kelishuv') || text.includes('соглаш') || text.includes('контракт')) return 'agreement';
  return 'general';
}

function buildSmartReply(message, lang, docType, contextText) {
  const isUz = lang === 'uz';
  
  const responses = {
    rent: {
      ru: {
        summary: 'Вот ключевые пункты аренды:',
        keyPoints: [
          '✓ Сроки: как долго вы снимаете',
          '✓ Депозит: сколько вносите авансом',
          '✓ Плата: какая сумма и день оплаты',
          '✓ Условия расторжения: как выйти из договора'
        ],
        risks: [
          '⚠ Скрытые платежи — коммунальные, управление',
          '⚠ Порядок возврата депозита не четкий',
          '⚠ Штрафы за досрочное расторжение',
          '⚠ Кто отвечает за ремонт и поломки'
        ],
        action: 'Обязательно уточните до подписания!'
      },
      uz: {
        summary: 'Ijara shartnomasining asosiy punktlari:',
        keyPoints: [
          '✓ Muddat: qancha vaqt uchun ijara',
          '✓ Depozit: qancha so\'rov puli',
          '✓ To\'lov: summa va to\'lov kuni',
          '✓ Bekor qilish: qanday chiqib ketish mumkin'
        ],
        risks: [
          '⚠ Yashirin to\'lovlar — mutil, boshqaruv',
          '⚠ Depozit qaytarish tartibi noto\'g\'ri',
          '⚠ Muddat uchun jarimalar',
          '⚠ Kim ta\'mir va buzilish uchun javob'
        ],
        action: 'Imzolashdan oldin albatta aniqlang!'
      }
    },
    labor: {
      ru: {
        summary: 'Ключевые условия трудового договора:',
        keyPoints: [
          '✓ Зарплата: размер и график платежей',
          '✓ График работы: сколько часов в день/неделю',
          '✓ Отпуск: сколько дней в год',
          '✓ Условия увольнения и компенсации'
        ],
        risks: [
          '⚠ Испытательный срок — можно уволить без причины',
          '⚠ Штрафы и удержания не оговорены',
          '⚠ Тайные условия о неразглашении',
          '⚠ Ответственность за ущерб компании'
        ],
        action: 'Обсудите неясные моменты с HR перед подписью!'
      },
      uz: {
        summary: 'Mehnat shartnomasining asosiy shartlari:',
        keyPoints: [
          '✓ Ish haqi: miqdor va to\'lov grafigi',
          '✓ Ish grafigi: kun/hafta soatlar',
          '✓ Ta\'til: yil davomida kunlar',
          '✓ Ishdan bo\'shatish va kompensasiyalar'
        ],
        risks: [
          '⚠ Sinov muddati — sababsiz ishdan bo\'satish',
          '⚠ Jarima va kesish prototiplari aniq emas',
          '⚠ Yashirin sirni saqlash shartlari',
          '⚠ Kompaniyaning ziyoni uchun mas\'uliyat'
        ],
        action: 'Noto\'g\'ri nuqtalarni HR bilan imzolashdan oldin munozara qiling!'
      }
    },
    sale: {
      ru: {
        summary: 'Главные пункты договора покупки-продажи:',
        keyPoints: [
          '✓ Цена: полная сумма и условия платежа',
          '✓ Товар: что именно продается',
          '✓ Доставка и передача: кто и когда переносит',
          '✓ Гарантия и возврат товара'
        ],
        risks: [
          '⚠ Нет описания состояния товара — брак незащищен',
          '⚠ Способ оплаты не безопасен — риск мошенничества',
          '⚠ Гарантия слишком короткая или отсутствует',
          '⚠ Ответственность за потери во время доставки'
        ],
        action: 'Проверьте товар перед платежом и получите распечатку условий!'
      },
      uz: {
        summary: 'Sotish-sotib olish shartnomasi asosiy nuqtalari:',
        keyPoints: [
          '✓ Narx: jami summa va to\'lov shartlari',
          '✓ Tovar: aynan nima sotilayotgani',
          '✓ Etkazib berish: kim va qachon o\'tkazadi',
          '✓ Kafolat va tovarni qaytarish'
        ],
        risks: [
          '⚠ Tovarning holati tavsiflanmagan — tuxi xavf',
          '⚠ To\'lov usuli xavfsiz emas — firibgarlik',
          '⚠ Kafolat qisqa yoki yo\'q',
          '⚠ Yetkazib berishda yo\'qolish uchun mas\'uliyat'
        ],
        action: 'To\'lovdan oldin tovarni tekshiring va shartlarning nusxasini oling!'
      }
    }
  };

  const template = responses[docType] ? responses[docType][lang] : 
                   { 
                     summary: isUz ? 'Shartnomani tahlil qilmoqdaman:' : 'Анализирую договор:',
                     keyPoints: [
                       isUz ? '✓ Asosiy shartlarni o\'qib chiqing' : '✓ Прочитайте основные условия',
                       isUz ? '✓ Muddatni tekshiring' : '✓ Проверьте сроки',
                       isUz ? '✓ Pul shartlarini aniqlashtiring' : '✓ Уточните финансовые условия'
                     ],
                     risks: [
                       isUz ? '⚠ Yashirin shartlar' : '⚠ Скрытые условия',
                       isUz ? '⚠ Aniq bo\'lmagan jarima' : '⚠ Неясные штрафы',
                       isUz ? '⚠ Shaffofsiz o\'zgarishlar' : '⚠ Непрозрачные изменения'
                     ],
                     action: isUz ? 'Noto\'g\'ri nuqtalarni aniqlang!' : 'Выясните неясные моменты!'
                   };

  return template;
}

async function extractTextFromFile(filePath, mimetype) {
  const ext = path.extname(filePath).toLowerCase();

  if (mimetype === 'application/pdf' || ext === '.pdf') {
    const data = await pdf(fs.readFileSync(filePath));
    return data.text;
  }

  if (mimetype.includes('word') || ext === '.docx' || ext === '.doc') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  if (mimetype.startsWith('image/') || ['.png', '.jpg', '.jpeg', '.webp', '.tif', '.tiff', '.bmp'].includes(ext)) {
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(filePath);
    await worker.terminate();
    return text;
  }

  if (mimetype === 'text/plain' || ext === '.txt' || ext === '.rtf') {
    return fs.readFileSync(filePath, 'utf8');
  }

  return '';
}

app.post('/api/assistant', upload.array('files', 5), async (req, res) => {
  try {
    const { message, lang = 'ru' } = req.body;
    const files = req.files || [];

    let contextText = '';

    for (const file of files) {
      const text = await extractTextFromFile(file.path, file.mimetype);
      if (text) {
        contextText += `\n--- Файл: ${file.originalname} ---\n${text}`;
      }
    }

    const systemPrompt = lang === 'uz'
      ? 'Ты — полезный помощник, который объясняет юридические документы простым языком для пользователей из Узбекистана. Отвечай кратко, понятно, по делу, на узбекском языке. Если есть документ, используй его содержание. Подчеркивай риски, сроки, обязательства и выводы.'
      : 'Ты — полезный помощник, который объясняет юридические документы простым языком для пользователей из Узбекистана. Отвечай кратко, понятно, по делу, на русском языке. Если есть документ, используй его содержание. Подчеркивай риски, сроки, обязательства и выводы.';

    const docType = analyzeDocumentType(message, contextText);

    if (!openai) {
      const analysis = buildSmartReply(message, lang, docType, contextText);
      return res.json({ 
        reply: analysis.summary,
        analysis: analysis,
        docType: docType
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Вопрос пользователя: ${message}\n\nСодержимое загруженных файлов:\n${contextText || 'Нет загруженных файлов.'}` }
      ],
      temperature: 0.5
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: 'Извините, сейчас не удалось обработать запрос. Проверьте API-ключ OpenAI.' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/analyze/:docType/:lang', (req, res) => {
  const { docType, lang } = req.params;
  const analysis = buildSmartReply('', lang, docType, '');
  res.json(analysis);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
