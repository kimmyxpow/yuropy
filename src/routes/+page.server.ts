import { rand } from '$lib';
import type { PageServerLoad } from './$types';
import {
	getDaily,
	setDaily,
	type FactEntry,
	type IdiomEntry,
	type WordEntry
} from '$lib/server/daily';

async function fetchRandom<T>(fetch: typeof window.fetch, url: string): Promise<T> {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`Failed to fetch ${url} (${response.status})`);

	const data: T[] = await response.json();
	return rand(data);
}

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	let daily = await getDaily(cookies);
	const today = new Date().getDate();

	if (!daily || new Date(daily.date).getDate() !== today) {
		const [word, idiom, fact] = await Promise.all([
			fetchRandom<WordEntry>(fetch, '/collections/words.json'),
			fetchRandom<IdiomEntry>(fetch, '/collections/idioms.json'),
			fetchRandom<FactEntry>(fetch, '/collections/facts.json')
		]);

		daily = { date: new Date().toISOString(), word, idiom, fact };
		await setDaily(cookies, daily);
	}

	return { daily };
};
