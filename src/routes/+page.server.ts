import { decrypt, encrypt, rand } from '$lib';
import type { PageServerLoad } from './$types';

interface WordEntry {
	word: string;
	part_of_speech: string;
	meaning: string;
	example: string;
	pronunciation: string;
}

interface IdiomEntry {
	idiom: string;
	meaning: string;
	example: string;
	origin: string;
}

interface FactEntry {
	title: string;
	fact: string;
}

interface Daily {
	date: string;
	word: WordEntry;
	idiom: IdiomEntry;
	fact: FactEntry;
}

async function fetchRandom<T>(fetch: typeof window.fetch, url: string): Promise<T> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch ${url} (${response.status})`);
	}

	try {
		const data: T[] = await response.json();
		return rand(data);
	} catch (err) {
		throw new Error(`Invalid JSON from ${url}: ${(err as Error).message}`);
	}
}

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const dailyCookie = cookies.get('daily');
	let daily: Daily | null = null;

	if (dailyCookie) {
		try {
			daily = JSON.parse(await decrypt(dailyCookie));
		} catch {
			daily = null;
		}
	}

	const today = new Date().getDate();
	if (!daily || new Date(daily.date).getDate() !== today) {
		const [word, idiom, fact] = await Promise.all([
			fetchRandom<WordEntry>(fetch, '/collections/words.json'),
			fetchRandom<IdiomEntry>(fetch, '/collections/idioms.json'),
			fetchRandom<FactEntry>(fetch, '/collections/facts.json')
		]);

		const newDaily: Daily = {
			date: new Date().toISOString(),
			word: word,
			idiom: idiom,
			fact: fact
		};

		const encrypted = await encrypt(JSON.stringify(newDaily));

		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		cookies.set('daily', encrypted, {
			path: '/',
			expires: tomorrow,
			secure: true,
			sameSite: 'lax'
		});

		return { daily: newDaily };
	}

	return { daily };
};
