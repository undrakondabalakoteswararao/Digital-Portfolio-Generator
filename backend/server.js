require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

(async () => {
  const missing = ['MONGODB_URI', 'JWT_SECRET'].filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`Missing environment variables: ${missing.join(', ')}. Copy .env.example to .env and fill it in.`);
    process.exit(1);
  }
  if (process.env.JWT_SECRET.length < 16) {
    console.error('JWT_SECRET is too short. Use a long random string (32+ characters).');
    process.exit(1);
  }
  await connectDB();
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
})();
