const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const twilioRoutes = require('./routes/twilioRoutes');
const callHistoryRoutes = require('./routes/callHistoryRoutes');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/', twilioRoutes);
app.use('/api', callHistoryRoutes);

app.use((error, req, res, next) => {
  console.error('Application error:', error);
  res.status(500).send({ error: error.message });
  next(error);
});

module.exports = app;