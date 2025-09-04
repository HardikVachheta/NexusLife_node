const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const companyRoutes = require('./routes/companyRoutes');
const authRoutes = require('./routes/authRoutes.js');
const mailRoutes = require('./routes/MailRoutes');
const profileRoutes = require('./routes/profileRoutes');
const jobRoutes = require('./routes/jobScrapesRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  credentials: true // Only if you're using cookies
}));
app.use(express.json());

app.use('/api/companies', companyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/mails', mailRoutes);
app.use('/api/profile', profileRoutes); 
app.use('/api/job', jobRoutes);


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  console.log("MongoDB connected");
}).catch(err => console.error(err));
