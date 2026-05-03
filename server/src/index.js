const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'budhathokikushal170@gmail.com';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '12345';

const createDefaultAdmin = async () => {
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

// Connect DB
connectDB().then(createDefaultAdmin);

app.get('/', (req, res) => res.send({status: 'shoe-shop server running'}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
