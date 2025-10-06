import { decrypt, encrypt } from '$lib';
import type { Cookies } from '@sveltejs/kit';
import { redis } from './redis';

export interface WordEntry {
	word: string;
	part_of_speech: string;
	meaning: string;
	example: string;
	pronunciation: string;
}

export interface IdiomEntry {
	idiom: string;
	meaning: string;
	example: string;
	origin: string;
}

export interface FactEntry {
	title: string;
	fact: string;
}

interface Daily {
	date: string;
	word: WordEntry;
	idiom: IdiomEntry;
	fact: FactEntry;
}

export async function getDaily(cookies: Cookies): Promise<Daily | null> {
	const dailyCookie = cookies.get('daily');
	if (dailyCookie) {
		try {
			return JSON.parse(await decrypt(dailyCookie));
		} catch {
			console.log('Failed to decrypt daily cookie');
		}
	}

	const dailyRedis = await redis.get('daily');
	if (dailyRedis) {
		try {
			return JSON.parse(await decrypt(dailyRedis));
		} catch {
			console.log('Failed to decrypt daily redis');
		}
	}

	return null;
}

export async function setDaily(cookies: Cookies, daily: Daily) {
	const encrypted = await encrypt(JSON.stringify(daily));

	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);

	cookies.set('daily', encrypted, {
		path: '/',
		expires: tomorrow,
		secure: true,
		sameSite: 'lax'
	});

	await redis.set('daily', encrypted, 'EX', 24 * 60 * 60);
}
