const defaultTopics = [
  {
    title: 'Modda va uning xossalari',
    theory: `
      <p>Modda - bu massa va hajmga ega bo'lgan barcha narsalardir. Ular qattiq, suyuq va gazsimon holatlarda bo'lishi mumkin.</p>
      <p>Har bir modda o'ziga xos xossalarga ega: zichlik, erish harorati, qaynash nuqtasi va kimyoviy tarkib.</p>
    `,
    question: 'Modda qaysi holatlarda bo'lishi mumkin?',
    answer: 3,
    choices: ['faqat qattiq', 'faqat suyuq', 'qattiq, suyuq va gazsimon']
  },
  {
    title: 'Atom va molekula',
    theory: `
      <p>Atom - kimyoviy elementning eng kichik zarrachasi bo'lib, uning tarkibida proton, neytron va elektronlar mavjud.</p>
      <p>Molekula ikki yoki undan ortiq atomlarning birikishidan hosil bo'ladi. Ular moddaning kimyoviy xossalarini belgilaydi.</p>
    `,
    question: 'Molekula nima hisoblanadi?',
    answer: 2,
    choices: ['faqat bitta atom', 'ikki yoki undan ortiq atomning birikmasi', 'faqat neytron']
  },
  {
    title: 'Kislotalar va ishqorlar',
    theory: `
      <p>Kislotalar suvda H+ ionlarini ajratadi, ishqorlar esa OH- ionlarini berishga moyildir.</p>
      <p>Bu moddalar o'rtasidagi reaksiyalar turli mahsulotlar va rang o'zgarishlarga olib keladi.</p>
    `,
    question: 'Kislotalar suvda qaysi ionlarni ajratadi?',
    answer: 1,
    choices: ['OH-', 'H+', 'Na+']
  }
];

const state = {
  score: 0,
  currentTopicIndex: 0,
  topics: structuredClone(defaultTopics)
};

const badgeTitle = document.getElementById('badge-title');
const scoreEl = document.getElementById('score');
const lessonTitle = document.getElementById('lesson-title');
const lessonTheory = document.getElementById('lesson-theory');
const lessonQuestion = document.getElementById('lesson-question');
const userAnswer = document.getElementById('user-answer');
const resultMessage = document.getElementById('result-message');
const progressPercent = document.getElementById('progress-percent');
const progressFill = document.getElementById('progress-fill');
const topicList = document.querySelector('.topic-list');
const adminPanel = document.getElementById('admin-panel');
const addTopicForm = document.getElementById('add-topic-form');

function getBadgeLabel() {
  if (state.score >= 80) return '🧪 Kimyo mutaxassisi';
  if (state.score >= 40) return '🧪 Kimyo o\'quvchisi';
  if (state.score >= 20) return '🧪 Boshlang\'ich kimyogar';
  return '🧪 Novice Kimyogar';
}

function updateScore() {
  scoreEl.textContent = `${state.score} ball`;
  badgeTitle.textContent = getBadgeLabel();
}

function calculateProgress() {
  const completed = state.topics.filter((topic) => topic.completed).length;
  const percent = Math.round((completed / state.topics.length) * 100);
  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;
  return percent;
}

function renderTopics() {
  topicList.innerHTML = '';

  state.topics.forEach((topic, index) => {
    const item = document.createElement('li');
    item.textContent = `${index + 1}-mavzu: ${topic.title}`;
    item.classList.toggle('active', index === state.currentTopicIndex);
    item.addEventListener('click', () => {
      state.currentTopicIndex = index;
      renderCurrentTopic();
      renderTopics();
    });
    topicList.appendChild(item);
  });
}

function renderCurrentTopic() {
  const topic = state.topics[state.currentTopicIndex];
  lessonTitle.textContent = `${state.currentTopicIndex + 1}-mavzu: ${topic.title}`;
  lessonTheory.innerHTML = topic.theory;
  lessonQuestion.textContent = topic.question;
  userAnswer.value = '';
  resultMessage.textContent = '';
  resultMessage.className = '';
  userAnswer.focus();
  renderTopics();
  calculateProgress();
}

function handleCheckAnswer() {
  const topic = state.topics[state.currentTopicIndex];
  const typedValue = Number(userAnswer.value);

  if (userAnswer.value.trim() === '') {
    showResult('Javobni kiriting!', 'error');
    return;
  }

  if (Number.isNaN(typedValue)) {
    showResult('Faqat raqam kiriting!', 'error');
    return;
  }

  if (typedValue === topic.answer) {
    state.score += 10;
    topic.completed = true;
    showResult('To\'g\'ri! +10 ball', 'success');
  } else {
    showResult(`Noto\'g\'ri. To\'g\'ri javob: ${topic.answer}`, 'error');
  }

  updateScore();
  calculateProgress();

  setTimeout(() => {
    if (state.currentTopicIndex < state.topics.length - 1) {
      state.currentTopicIndex += 1;
      renderCurrentTopic();
    } else {
      resultMessage.textContent = 'Barchasi bajarildi! Kurs yakunlandi.';
      resultMessage.className = 'success';
    }
  }, 700);
}

function showResult(message, type) {
  resultMessage.textContent = message;
  resultMessage.className = type;
}

function handleAddTopic(event) {
  event.preventDefault();

  const title = document.getElementById('new-title').value.trim();
  const theory = document.getElementById('new-theory').value.trim();
  const question = document.getElementById('new-question').value.trim();
  const answer = Number(document.getElementById('new-answer').value);

  if (!title || !theory || !question || Number.isNaN(answer)) {
    showResult('Barcha maydonlarni to\'ldiring!', 'error');
    return;
  }

  state.topics.push({
    title,
    theory: `<p>${theory.replace(/\n/g, '</p><p>')}</p>`,
    question,
    answer,
    completed: false
  });

  addTopicForm.reset();
  renderTopics();
  calculateProgress();
  renderCurrentTopic();
}

function toggleAdminPanel() {
  const isHidden = adminPanel.style.display === 'none';
  adminPanel.style.display = isHidden ? 'block' : 'none';
}

function resetScore() {
  state.score = 0;
  state.topics = structuredClone(defaultTopics);
  state.currentTopicIndex = 0;
  updateScore();
  renderCurrentTopic();
}

document.getElementById('check-answer-btn').addEventListener('click', handleCheckAnswer);
userAnswer.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleCheckAnswer();
  }
});

document.querySelector('.btn-admin-toggle').addEventListener('click', toggleAdminPanel);
document.getElementById('btn-reset-score').addEventListener('click', resetScore);
addTopicForm.addEventListener('submit', handleAddTopic);

updateScore();
renderCurrentTopic();
