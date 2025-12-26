import dotenv from 'dotenv';
dotenv.config(); // Initialize dotenv immediately

import connectDB from './src/config/db.js'; // Note .js
import app from './src/app.js'; // Note .js

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});