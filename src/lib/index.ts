import { env } from '$env/dynamic/private';
import crypto from 'crypto';

const SECRET_KEY = env.DAILY_SECRET;

const KEY = crypto.createHash('sha256').update(SECRET_KEY).digest();

export const encrypt = (text: string): string => {
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv('aes-256-cbc', KEY, iv);
	let encrypted = cipher.update(text, 'utf-8', 'base64');
	encrypted += cipher.final('base64');
	return `${iv.toString('base64')}:${encrypted}`;
};

export const decrypt = (data: string): string => {
	const [ivBase64, encrypted] = data.split(':');
	const iv = Buffer.from(ivBase64, 'base64');
	const decipher = crypto.createDecipheriv('aes-256-cbc', KEY, iv);
	let decrypted = decipher.update(encrypted, 'base64', 'utf-8');
	decrypted += decipher.final('utf-8');
	return decrypted;
};

export const rand = <T>(arr: T[]): T => {
	if (arr.length === 0) throw new Error('Array is empty');
	const index = Math.floor(Math.random() * arr.length);
	return arr[index];
};
