const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const { expireOldTrendingShoes } = require('./controllers/shoeController');

dotenv.config();

const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET'];
const missingEnv = REQUIRED_ENV.filter((name) => !process.env[name]);
if (missingEnv.length) {
  console.error(`Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173'];

const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL;
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD;

const app = express();
app.set('trust proxy', process.env.TRUST_PROXY === 'true');
app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.options('*', cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());
app.use(xssClean());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later',
});
app.use('/api/', apiLimiter);

const adminRoutes = require('./routes/adminRoutes');
const shoeRoutes = require('./routes/shoeRoutes');
app.use('/api/admin', adminRoutes);
app.use('/api/shoes', shoeRoutes);

const createDefaultAdmin = async () => {
  if (!DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PASSWORD) {
    console.warn('Skipping default admin creation because DEFAULT_ADMIN_EMAIL or DEFAULT_ADMIN_PASSWORD is not configured.');
    return;
  }

  try {
    const existingAdmin = await Admin.findOne({ email: DEFAULT_ADMIN_EMAIL });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, salt);
      await Admin.create({ email: DEFAULT_ADMIN_EMAIL, password: hashed });
      console.log(`Default admin created: ${DEFAULT_ADMIN_EMAIL}`);
    }
  } catch (err) {
    console.error('Unable to create default admin:', err.message);
  }
};

const startMaintenance = async () => {
  await createDefaultAdmin();
  await expireOldTrendingShoes();

  const interval = setInterval(() => {
    expireOldTrendingShoes().catch((err) => {
      console.error('Unable to expire old trending shoes:', err.message);
    });
  }, 60 * 60 * 1000);

  interval.unref?.();
};

// Connect DB
connectDB().then(() => startMaintenance()).catch((err) => {
  console.error('Failed to connect to DB:', err.message);
  process.exit(1);
});

app.get('/', (req, res) => res.send({ status: 'shoe-shop server running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 
