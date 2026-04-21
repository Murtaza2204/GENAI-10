const fs = require('fs');
const path = require('path');

const questionsFilePath = path.join(__dirname, '../data/questions.json');

// Read all questions
function getAllQuestions() {
  try {
    const data = fs.readFileSync(questionsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading questions:', error.message);
    return [];
  }
}

// Get random question
function getRandomQuestion() {
  const questions = getAllQuestions();
  if (questions.length === 0) return null;
  return questions[Math.floor(Math.random() * questions.length)];
}

// Get questions by category
function getQuestionsByCategory(category) {
  const questions = getAllQuestions();
  return questions.filter((q) => q.category === category);
}

// Add a new question
function addQuestion(question) {
  try {
    const questions = getAllQuestions();
    const newQuestion = {
      id: Date.now(),
      ...question,
      createdAt: new Date(),
    };
    questions.push(newQuestion);
    fs.writeFileSync(questionsFilePath, JSON.stringify(questions, null, 2));
    return newQuestion;
  } catch (error) {
    console.error('Error adding question:', error.message);
    throw error;
  }
}

module.exports = {
  getAllQuestions,
  getRandomQuestion,
  getQuestionsByCategory,
  addQuestion,
};
