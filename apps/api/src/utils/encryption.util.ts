import crypto from 'crypto';
import { config } from '../config/env.config';

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(config.SECRET_KEY, 'salt', 32);
const iv = crypto.scryptSync(config.ENCRYPTION_IV, 'salt', 16);

export function encrypt(text: string): string {
  try {
    const cipher = crypto.createCipher(algorithm, key);
    cipher.setAutoPadding(true);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export function decrypt(encryptedText: string): string {
  try {
    const decipher = crypto.createDecipher(algorithm, key);
    decipher.setAutoPadding(true);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

export function hashData(data: string): string {
  try {
    return crypto.createHash('sha256').update(data).digest('hex');
  } catch (error) {
    console.error('Hashing error:', error);
    throw new Error('Failed to hash data');
  }
}

export function generateSecureToken(length: number = 32): string {
  try {
    return crypto.randomBytes(length).toString('hex');
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Failed to generate secure token');
  }
}

export function validateEncryptionKey(key: string): boolean {
  return key && key.length >= 32;
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>\"'&]/g, (match) => {
    const escapeMap: { [key: string]: string } = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;'
    };
    return escapeMap[match];
  });
}