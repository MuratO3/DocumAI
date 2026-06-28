const chatMessages = document.querySelector('.assistant-messages');
const chatInput = document.querySelector('.assistant-input');
const sendButton = document.querySelector('.assistant-send');
const quickButtons = document.querySelectorAll('.quick-chip');
const fileInput = document.getElementById('fileInput');
const uploadedFiles = document.getElementById('uploadedFiles');
const langButtons = document.querySelectorAll('.lang-btn');
const assistantTitle = document.querySelector('.assistant-header h3');
const assistantSubtitle = document.querySelector('.assistant-subtitle');
const uploadBoxText = document.querySelector('.upload-box span:nth-child(2)');
const uploadHint = document.querySelector('.upload-hint');
const heroEyebrow = document.getElementById('heroEyebrow');
const heroTitle = document.getElementById('heroTitle');
const heroText = document.getElementById('heroText');
const benefit1 = document.getElementById('benefit1');
const benefit2 = document.getElementById('benefit2');
const benefit3 = document.getElementById('benefit3');
const formTitle = document.getElementById('formTitle');
const langLabel = document.getElementById('langLabel');
const nameLabel = document.getElementById('nameLabel');
const phoneLabel = document.getElementById('phoneLabel');
const documentTypeLabel = document.getElementById('documentTypeLabel');
const questionLabel = document.getElementById('questionLabel');
const explanationLangLabel = document.getElementById('explanationLangLabel');
const submitButton = document.getElementById('submitButton');
const nameInput = document.getElementById('nameInput');
const phoneInput = document.getElementById('phoneInput');
const documentTypeSelect = document.getElementById('documentTypeSelect');
const questionInput = document.getElementById('questionInput');
const explanationLangSelect = document.getElementById('explanationLangSelect');
const docRent = document.getElementById('docRent');
const docJob = document.getElementById('docJob');
const docAgreement = document.getElementById('docAgreement');
const docSale = document.getElementById('docSale');
const docOther = document.getElementById('docOther');
const langRu = document.getElementById('langRu');
const langUz = document.getElementById('langUz');
const langBoth = document.getElementById('langBoth');
const assistantSection = document.querySelector('.assistant-section');
const resultsSection = document.getElementById('resultsSection');
const backBtn = document.getElementById('backBtn');
const continueBtn = document.getElementById('continueBtn');
const downloadBtn = document.getElementById('downloadBtn');
let uploadedFileList = [];
let currentLang = 'ru';

const translations = {
  ru: {
    title: 'ИИ-консультант',
    subtitle: 'Спросите о договоре простыми словами — и получите короткий и понятный ответ.',
    uploadText: 'Загрузите PDF, DOCX, JPG, PNG, сканы и другие файлы',
    uploadHint: 'Поддерживаются: PDF, DOCX, JPG/JPEG, PNG, TIFF, BMP, TXT',
    intro: 'Привет! Я — ИИ-консультант. Скажите, какой документ хотите разобрать, или загрузите PDF, DOCX, фото или скан.',
    placeholder: 'Напишите ваш вопрос...',
    button: 'Отправить',
    fileLoaded: 'Загружен файл: ',
    help: 'Я могу помочь объяснить его содержание простыми словами.',
    heroEyebrow: 'Для жителей Узбекистана',
    heroTitle: 'Отправьте договор — и ИИ-консультант объяснит его понятно и ясно.',
    heroText: 'Вы получите простое объяснение прав, обязанностей, сроков и рисков. Подходит для аренды, трудового договора, соглашений и покупок.',
    benefits: [
      'Понятный пересказ на простом языке',
      'Объяснение скрытых условий и опасных пунктов',
      'Поддержка на русском и узбекском'
    ],
    formTitle: 'Единая форма запроса',
    langLabel: 'Язык:',
    nameLabel: 'Ваше имя',
    phoneLabel: 'Телефон',
    documentTypeLabel: 'Тип документа',
    questionLabel: 'Что нужно понять',
    explanationLangLabel: 'Язык объяснения',
    submitButton: 'Отправить запрос',
    namePlaceholder: 'Азиз',
    phonePlaceholder: '+998 90 123 45 67',
    questionPlaceholder: 'Например: какие у меня права, какие штрафы и что будет при досрочном расторжении?',
    docRent: 'Аренда',
    docJob: 'Трудовой договор',
    docAgreement: 'Соглашение',
    docSale: 'Покупка и продажа',
    docOther: 'Другое',
    langRu: 'Русский',
    langUz: 'Узбекский',
    langBoth: 'Оба варианта'
  },
  uz: {
    title: 'AI-konsultant',
    subtitle: 'Shartnomangizni oddiy til bilan so‘rang — va qisqa va tushunarli javob oling.',
    uploadText: 'PDF, DOCX, JPG, PNG, skan va boshqa fayllarni yuklang',
    uploadHint: 'Qo‘llab-quvvatlanadi: PDF, DOCX, JPG/JPEG, PNG, TIFF, BMP, TXT',
    intro: 'Salom! Men AI-konsultantman. Qaysi hujjatni tushuntirmoqchisiz, yoki PDF, DOCX, surat yoki skan yuklang.',
    placeholder: 'Savolingizni yozing...',
    button: 'Yuborish',
    fileLoaded: 'Fayl yuklandi: ',
    help: 'Men uning mazmunini oddiy til bilan tushuntirishga yordam beraman.',
    heroEyebrow: 'O‘zbekiston fuqarolari uchun',
    heroTitle: 'Shartnomani yuboring — AI-konsultant uni oddiy va aniq til bilan tushuntiradi.',
    heroText: 'Siz huquqlar, majburiyatlar, muddatlar va xavflarning oddiy tushuntirishini olasiz. Ijara, mehnat shartnomasi, kelishuvlar va sotib olish uchun mos.',
    benefits: [
      'Oddiy til bilan qisqacha tushuntirish',
      'Yashirin shartlar va xavfli bandlarni tushuntirish',
      'Rus va o‘zbek tillarida qo‘llab-quvvatlash'
    ],
    formTitle: 'Yagona so‘rov shakli',
    langLabel: 'Til:',
    nameLabel: 'Ismingiz',
    phoneLabel: 'Telefon',
    documentTypeLabel: 'Hujjat turi',
    questionLabel: 'Nimani tushunmoqchisiz',
    explanationLangLabel: 'Tushuntirish tili',
    submitButton: 'So‘rovni yuborish',
    namePlaceholder: 'Aziz',
    phonePlaceholder: '+998 90 123 45 67',
    questionPlaceholder: 'Masalan: mening huquqlarim qanday, qanday jarimalar bor va muddatidan oldin bekor qilsam nima bo‘ladi?',
    docRent: 'Ijara',
    docJob: 'Mehnat shartnomasi',
    docAgreement: 'Kelishuv',
    docSale: 'Sotib olish va sotish',
    docOther: 'Boshqa',
    langRu: 'Ruscha',
    langUz: 'O‘zbekcha',
    langBoth: 'Ikkala variant'
  }
};

function addMessage(text, type = 'assistant') {
  const message = document.createElement('div');
  message.className = `message ${type}`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];

  if (assistantTitle) assistantTitle.textContent = t.title;
  if (assistantSubtitle) assistantSubtitle.textContent = t.subtitle;
  if (uploadBoxText) uploadBoxText.textContent = t.uploadText;
  if (uploadHint) uploadHint.textContent = t.uploadHint;
  if (heroEyebrow) heroEyebrow.textContent = t.heroEyebrow;
  if (heroTitle) heroTitle.textContent = t.heroTitle;
  if (heroText) heroText.textContent = t.heroText;
  if (benefit1) benefit1.textContent = t.benefits[0];
  if (benefit2) benefit2.textContent = t.benefits[1];
  if (benefit3) benefit3.textContent = t.benefits[2];
  if (formTitle) formTitle.textContent = t.formTitle;
  if (langLabel) langLabel.textContent = t.langLabel;
  if (nameLabel) nameLabel.textContent = t.nameLabel;
  if (phoneLabel) phoneLabel.textContent = t.phoneLabel;
  if (documentTypeLabel) documentTypeLabel.textContent = t.documentTypeLabel;
  if (questionLabel) questionLabel.textContent = t.questionLabel;
  if (explanationLangLabel) explanationLangLabel.textContent = t.explanationLangLabel;
  if (submitButton) submitButton.textContent = t.submitButton;
  if (nameInput) nameInput.placeholder = t.namePlaceholder;
  if (phoneInput) phoneInput.placeholder = t.phonePlaceholder;
  if (questionInput) questionInput.placeholder = t.questionPlaceholder;
  if (docRent) docRent.textContent = t.docRent;
  if (docJob) docJob.textContent = t.docJob;
  if (docAgreement) docAgreement.textContent = t.docAgreement;
  if (docSale) docSale.textContent = t.docSale;
  if (docOther) docOther.textContent = t.docOther;
  if (langRu) langRu.textContent = t.langRu;
  if (langUz) langUz.textContent = t.langUz;
  if (langBoth) langBoth.textContent = t.langBoth;
  chatInput.placeholder = t.placeholder;
  sendButton.textContent = t.button;

  langButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.lang === lang);
  });

  chatMessages.innerHTML = '';
  addMessage(t.intro, 'assistant');
}

function getReply(text) {
  const value = text.toLowerCase();

  if (currentLang === 'uz') {
    if (value.includes('ijara') || value.includes('kvartira') || value.includes('arenda')) {
      return 'Ijara shartnomasida quyidagilarni tekshiring: muddat, depozit, to‘lov shartlari, jarima va muddatidan oldin bekor qilish sharti. Agar xohlasangiz, men bu punktlarni qadam-baqadam aytib beraman.';
    }

    if (value.includes('mehnat') || value.includes('ish')) {
      return 'Mehnat shartnomasida ish haqi, ish grafigi, ta’til, ishdan bo‘shatish shartlari va kim qanday majburiyatlarni bajarishini ko‘rib chiqing. Men har bir punktni oddiy til bilan tushuntirishga yordam beraman.';
    }

    if (value.includes('xavf') || value.includes('xatar') || value.includes('danger')) {
      return 'Eng xavfli punktlar — yashirin jarimalar, avtomatik uzaytirish, rad etish huquqi yo‘qligi va tomonlarning aniq bo‘lmagan majburiyatlari. Men ularni tezda aniqlashga yordam beraman.';
    }

    if (value.includes('nimani') || value.includes('imzol')) {
      return 'Imzolashdan oldin 3 narsani o‘qing: kim, nimani va qancha muddatga. Agar nimadir tushunarsiz bo‘lsa, nega bu kerak va shart bajarilmasa nima bo‘ladi deb so‘rang.';
    }

    return 'Men shartnomani oddiy til bilan tushuntiraman: asosiy punktlarni ajrataman, xavflarni ko‘rsataman va imzolashdan oldin nimani tekshirish kerakligini aytaman.';
  }

  if (value.includes('аренд') || value.includes('квартира')) {
    return 'Для аренды важно проверить: срок договора, депозит, условия оплаты, штрафы и что будет при досрочном расторжении. Если хотите, я могу выделить эти пункты по шагам.';
  }

  if (value.includes('труд') || value.includes('работа')) {
    return 'В трудовом договоре смотрите: зарплату, график, отпуск, условия увольнения и кто отвечает за обязанности. Я могу помочь объяснить каждый пункт простыми словами.';
  }

  if (value.includes('риск') || value.includes('опасн')) {
    return 'Самые опасные пункты — это скрытые штрафы, автоматическое продление, отсутствие права на отказ и неясные обязанности сторон. Я помогу найти их быстро.';
  }

  if (value.includes('что делать') || value.includes('подпис')) {
    return 'Перед подписанием прочитайте 3 вещи: кто, что и на сколько. Если что-то непонятно — спросите, зачем это нужно и что будет, если не выполнить условие.';
  }

  return 'Я могу объяснить договор простым языком: выделю главные пункты, покажу риски и скажу, что важно проверить перед подписанием.';
}

function renderFiles() {
  uploadedFiles.innerHTML = '';

  uploadedFileList.forEach((file) => {
    const item = document.createElement('div');
    item.className = 'uploaded-file';

    if (file.type.startsWith('image/')) {
      const preview = document.createElement('img');
      preview.src = URL.createObjectURL(file);
      preview.alt = file.name;
      item.appendChild(preview);
    }

    const name = document.createElement('span');
    name.textContent = file.name;
    item.appendChild(name);

    uploadedFiles.appendChild(item);
  });
}

function handleFiles(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  uploadedFileList = uploadedFileList.concat(files);
  renderFiles();

  const names = files.map((file) => file.name).join(', ');
  addMessage(`${translations[currentLang].fileLoaded}${names}. ${translations[currentLang].help}`, 'assistant');
}

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  chatInput.value = '';

  const formData = new FormData();
  formData.append('message', text);
  formData.append('lang', currentLang);

  uploadedFileList.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await fetch('/api/assistant', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const reply = data.reply || (currentLang === 'uz'
      ? 'Shartnoma haqida qisqacha tushuntirish tayyor.'
      : 'Краткое объяснение договора готово.');

    addMessage(reply, 'assistant');

    if (data.analysis) {
      setTimeout(() => showResults(data.analysis, data.docType), 1000);
    }
  } catch (error) {
    const fallbackText = currentLang === 'uz'
      ? 'Server vaqtincha ishlamayapti. Men tezkor lokal tahlilni ko\'rsataman.'
      : 'Сервер временно недоступен. Я покажу быстрый локальный анализ.';

    addMessage(fallbackText, 'assistant');
    showResults(getReply(text), null);
  }
}

function showResults(analysis, docType) {
  const resultsSection = document.getElementById('resultsSection');
  const keyPointsList = document.getElementById('keyPointsList');
  const risksList = document.getElementById('risksList');
  const resultsSummary = document.getElementById('resultsSummary');
  const resultsAction = document.getElementById('resultsAction');

  if (!resultsSection) return;

  keyPointsList.innerHTML = '';
  risksList.innerHTML = '';

  const summary = `<p class="summary-text">${analysis.summary}</p>`;
  resultsSummary.innerHTML = summary;

  analysis.keyPoints.forEach((point) => {
    const li = document.createElement('li');
    li.textContent = point;
    keyPointsList.appendChild(li);
  });

  analysis.risks.forEach((risk) => {
    const li = document.createElement('li');
    li.textContent = risk;
    risksList.appendChild(li);
  });

  const action = `<p class="action-text">${analysis.action}</p>`;
  resultsAction.innerHTML = action;

  if (assistantSection) assistantSection.style.display = 'none';
  resultsSection.style.display = 'block';
  window.scrollTo(0, 0);
}

sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

quickButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const text = button.dataset.prompt;
    chatInput.value = text;
    chatInput.focus();
  });
});

fileInput.addEventListener('change', handleFiles);

langButtons.forEach((button) => {
  button.addEventListener('click', () => setLanguage(button.dataset.lang));
});

if (backBtn) {
  backBtn.addEventListener('click', () => {
    resultsSection.style.display = 'none';
    assistantSection.style.display = 'block';
    window.scrollTo(0, 0);
  });
}

if (continueBtn) {
  continueBtn.addEventListener('click', () => {
    resultsSection.style.display = 'none';
    assistantSection.style.display = 'block';
    chatInput.focus();
  });
}

if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    const content = document.querySelector('.results-content').innerText;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contract_analysis_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  });
}

setLanguage('ru');
