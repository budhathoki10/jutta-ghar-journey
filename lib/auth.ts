import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export async function generateToken(adminId: string, email: string) {
  const token = await new SignJWT({ id: adminId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);
  
  return token;
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload;
  } catch (err) {
    return null;
  }
}
