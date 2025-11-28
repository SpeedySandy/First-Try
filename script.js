const questions = [
  {
    prompt: 'Which language runs in a web browser?',
    choices: ['Java', 'C', 'Python', 'JavaScript'],
    answer: 'JavaScript',
  },
  {
    prompt: 'Which HTML tag is used for the largest heading?',
    choices: ['<h1>', '<heading>', '<h6>', '<header>'],
    answer: '<h1>',
  },
  {
    prompt: 'What does CSS stand for?',
    choices: [
      'Creative Style System',
      'Cascading Style Sheets',
      'Computer Style Sheets',
      'Colorful Style Syntax',
    ],
    answer: 'Cascading Style Sheets',
  },
  {
    prompt: 'Which array method adds an item to the end of an array in JavaScript?',
    choices: ['push()', 'shift()', 'pop()', 'unshift()'],
    answer: 'push()',
  },
  {
    prompt: 'What keyword declares a constant in modern JavaScript?',
    choices: ['var', 'let', 'const', 'static'],
    answer: 'const',
  },
];

let currentIndex = 0;
let score = 0;
let selectedChoice = null;

const questionText = document.getElementById('question');
const choicesContainer = document.getElementById('choices');
const nextButton = document.getElementById('next');
const restartButton = document.getElementById('restart');
const playAgainButton = document.getElementById('play-again');
const scoreDisplay = document.getElementById('score');
const progressDisplay = document.getElementById('progress');
const resultText = document.getElementById('result');
const summaryCard = document.getElementById('summary');
const summaryText = document.getElementById('summary-text');

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function resetState() {
  selectedChoice = null;
  resultText.textContent = '';
  resultText.className = 'result';
  nextButton.disabled = true;
  choicesContainer.innerHTML = '';
}

function renderQuestion() {
  if (currentIndex >= questions.length) {
    showSummary();
    return;
  }

  const current = questions[currentIndex];
  const shuffledChoices = shuffle(current.choices);

  questionText.textContent = current.prompt;
  progressDisplay.textContent = `Question ${currentIndex + 1} / ${questions.length}`;

  shuffledChoices.forEach((choiceText, index) => {
    const button = document.createElement('button');
    button.className = 'choice';
    button.setAttribute('role', 'listitem');
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-disabled', 'false');
    button.addEventListener('click', () => handleChoice(button, choiceText, current.answer));

    const badge = document.createElement('span');
    badge.className = 'badge neutral';
    badge.textContent = String.fromCharCode(65 + index);

    const label = document.createElement('span');
    label.textContent = choiceText;

    button.appendChild(badge);
    button.appendChild(label);
    choicesContainer.appendChild(button);
  });
}

function handleChoice(button, choiceText, answer) {
  if (selectedChoice || nextButton.disabled === false) return;

  selectedChoice = choiceText;
  const isCorrect = choiceText === answer;
  resultText.textContent = isCorrect ? 'Correct!' : 'Not quite. Keep going!';
  resultText.classList.toggle('correct', isCorrect);
  resultText.classList.toggle('incorrect', !isCorrect);

  if (isCorrect) {
    score += 1;
    scoreDisplay.textContent = score;
  }

  Array.from(choicesContainer.children).forEach((choice) => {
    const badge = choice.querySelector('.badge');
    const choiceLabel = choice.querySelector('span:nth-child(2)').textContent;
    const correct = choiceLabel === answer;

    choice.setAttribute('aria-disabled', 'true');
    if (choice === button) {
      choice.setAttribute('aria-pressed', 'true');
      badge.className = `badge ${correct ? 'correct' : 'incorrect'}`;
      badge.textContent = correct ? '✓' : '✕';
    } else if (correct) {
      badge.className = 'badge correct';
      badge.textContent = '✓';
    }
  });

  nextButton.disabled = false;
}

function showSummary() {
  summaryCard.hidden = false;
  summaryText.textContent = `You answered ${score} out of ${questions.length} correctly.`;
  document.querySelector('.card').hidden = true;
}

function restartQuiz() {
  currentIndex = 0;
  score = 0;
  scoreDisplay.textContent = score;
  summaryCard.hidden = true;
  document.querySelector('.card').hidden = false;
  resetState();
  renderQuestion();
}

nextButton.addEventListener('click', () => {
  currentIndex += 1;
  resetState();
  renderQuestion();
});

restartButton.addEventListener('click', restartQuiz);
playAgainButton.addEventListener('click', restartQuiz);

resetState();
renderQuestion();
