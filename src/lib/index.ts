import { env } from '$env/dynamic/private';

const SECRET_KEY = env.DAILY_SECRET;

async function getKey() {
	const enc = new TextEncoder();
	const keyMaterial = enc.encode(SECRET_KEY);
	const hash = await crypto.subtle.digest('SHA-256', keyMaterial);
	return crypto.subtle.importKey('raw', hash, { name: 'AES-CBC' }, false, ['encrypt', 'decrypt']);
}

export async function encrypt(text: string): Promise<string> {
	const key = await getKey();
	const iv = crypto.getRandomValues(new Uint8Array(16));
	const enc = new TextEncoder();
	const data = enc.encode(text);

	const encrypted = await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, data);

	const ivBase64 = btoa(String.fromCharCode(...iv));
	const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)));

	return `${ivBase64}:${encryptedBase64}`;
}

export async function decrypt(data: string): Promise<string> {
	const [ivBase64, encryptedBase64] = data.split(':');
	if (!ivBase64 || !encryptedBase64) throw new Error('Invalid encrypted format');

	const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));
	const encrypted = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0));

	const key = await getKey();

	const decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, encrypted);

	const dec = new TextDecoder();
	return dec.decode(decrypted);
}

export const rand = <T>(arr: T[]): T => {
	if (arr.length === 0) throw new Error('Array is empty');
	const index = Math.floor(Math.random() * arr.length);
	return arr[index];
};
