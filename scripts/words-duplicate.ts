import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

interface WordEntry {
	word: string;
	part_of_speech: string;
	meaning: string;
	example: string;
	pronunciation: string;
}

const filePath = path.join(__dirname, '../static/collections/words.json');

async function main() {
	if (!fs.existsSync(filePath)) {
		console.error('File not found:', filePath);
		return;
	}

	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const words: WordEntry[] = JSON.parse(fileContent);

	const entryMap: Record<string, WordEntry[]> = {};
	words.forEach((entry) => {
		const key = `${entry.word}||${entry.part_of_speech}`;
		if (!entryMap[key]) entryMap[key] = [];
		entryMap[key].push(entry);
	});

	const duplicates = Object.entries(entryMap).filter(([, entries]) => entries.length > 1);

	if (duplicates.length === 0) {
		console.log('No duplicate word + part_of_speech entries found.');
		return;
	}

	console.log(`Found ${duplicates.length} duplicate entry group(s).`);

	const keysToRemove: { key: string; removeIndexes: number[] }[] = [];

	for (const [key, entries] of duplicates) {
		const [word, part_of_speech] = key.split('||');
		console.log(`\nDuplicate: "${word}" (${part_of_speech})`);

		const choices = entries.map((entry, index) => ({
			name: `Meaning: ${entry.meaning}\n   Example: ${entry.example}`,
			value: index
		}));

		const answers = await inquirer.prompt<{ toRemove: number[] }>([
			{
				type: 'checkbox',
				name: 'toRemove',
				message: 'Select the entries you want to remove:',
				choices,
				validate: (ans) => {
					if (ans.length !== entries.length - 1) {
						return `You must select exactly ${entries.length - 1} entry(ies) to delete so that one remains.`;
					}
					return true;
				}
			}
		]);

		if (answers.toRemove.length > 0) {
			keysToRemove.push({ key, removeIndexes: answers.toRemove });
		}
	}

	if (keysToRemove.length === 0) {
		console.log('No entries selected for deletion. Exiting.');
		return;
	}

	const confirm = await inquirer.prompt<{ confirmDelete: boolean }>([
		{
			type: 'confirm',
			name: 'confirmDelete',
			message: `Are you sure you want to delete all selected entries (${keysToRemove.reduce(
				(acc, k) => acc + k.removeIndexes.length,
				0
			)})?`,
			default: true
		}
	]);

	if (!confirm.confirmDelete) {
		console.log('No entries were deleted.');
		return;
	}

	const cleanedWords: WordEntry[] = [];

	Object.entries(entryMap).forEach(([key, entries]) => {
		const toRemove = keysToRemove.find((k) => k.key === key)?.removeIndexes || [];
		entries.forEach((entry, idx) => {
			if (!toRemove.includes(idx)) {
				cleanedWords.push(entry);
			}
		});
	});

	fs.writeFileSync(filePath, JSON.stringify(cleanedWords, null, 2), 'utf-8');
	console.log(`\nCleaned JSON saved to ${filePath}`);
}

main().catch(console.error);
