const fs = require('fs');
const path = require('path');

let questions = null;

function loadQuestions() {
  if (!questions) {
    const filePath = path.join(__dirname, '../data/questions.json');
    questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
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

module.exports = {
  getDailyQuestions,
  getRandomQuestion
};