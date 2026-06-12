import connectDB from '@/lib/mongodb';
import { Admin } from '@/lib/models/Admin';
import bcrypt from 'bcryptjs';

export async function initializeDefaults() {
  try {
    if (!process.env.DEFAULT_ADMIN_EMAIL || !process.env.DEFAULT_ADMIN_PASSWORD) {
      console.warn(
        'Skipping default admin creation: DEFAULT_ADMIN_EMAIL or DEFAULT_ADMIN_PASSWORD not set'
      );
      return;
    }

    await connectDB();

    const existingAdmin = await Admin.findOne({
      email: process.env.DEFAULT_ADMIN_EMAIL,
    });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, salt);
      await Admin.create({
        email: process.env.DEFAULT_ADMIN_EMAIL,
        password: hashed,
      });
      console.log(`✅ Default admin created: ${process.env.DEFAULT_ADMIN_EMAIL}`);
    }
  } catch (err: any) {
    console.error('❌ Failed to initialize defaults:', err.message);
  }
}
