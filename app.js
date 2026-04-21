const express = require('express');
const app = express();

app.use(express.json());

// Routes
app.use('/daily', require('./routes/daily'));
// Add other routes as needed, e.g., app.use('/company', require('./routes/company'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});