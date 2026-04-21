const fs = require('fs');
const path = require('path');

let questions = null;

function loadQuestions() {
  if (!questions) {
    const filePath = path.join(__dirname, '../data/questions.json');
    const data = fs.readFileSync(filePath, 'utf8');
    questions = JSON.parse(data);
  }
  return questions;
}

function getRandomQuestion(type) {
  const q = loadQuestions();
  const list = q[type];
  if (!list || list.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

function getDailyQuestions() {
  const aptitude = getRandomQuestion('aptitude');
  const coding = getRandomQuestion('coding');
  return { aptitude, coding };
}

function getQuestionById(id) {
  const q = loadQuestions();
  for (const type of ['aptitude', 'coding']) {
    const question = q[type].find(q => q.id === id);
    if (question) return question;
  }
  return null;
}

module.exports = {
  getDailyQuestions,
  getRandomQuestion,
  getQuestionById
};