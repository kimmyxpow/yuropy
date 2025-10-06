import fs from 'fs';
import path from 'path';

interface WordEntry {
	word: string;
	part_of_speech: string;
	meaning: string;
	example: string;
	pronunciation: string;
}

const filePath = path.join(__dirname, '../static/collections/words.json');

function main() {
	if (!fs.existsSync(filePath)) {
		console.error('File not found:', filePath);
		return;
	}

	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const words: WordEntry[] = JSON.parse(fileContent);

	const totalWords = words.length;

	const uniqueWordsSet = new Set(words.map((w) => w.word));
	const uniqueWords = uniqueWordsSet.size;

	const wordCount: Record<string, number> = {};
	words.forEach((w) => {
		wordCount[w.word] = (wordCount[w.word] || 0) + 1;
	});
	const duplicateWords = Object.values(wordCount).filter((count) => count > 1).length;

	const groupCount: Record<string, number> = {};
	words.forEach((w) => {
		const key = `${w.word}||${w.part_of_speech}`;
		groupCount[key] = (groupCount[key] || 0) + 1;
	});
	const duplicateGroups = Object.values(groupCount).filter((count) => count > 1).length;

	console.log(`Total entries: ${totalWords}`);
	console.log(`Unique words: ${uniqueWords}`);
	console.log(`Duplicate words: ${duplicateWords}`);
	console.log(`Duplicate groups (word + part_of_speech): ${duplicateGroups}`);
}

main();
