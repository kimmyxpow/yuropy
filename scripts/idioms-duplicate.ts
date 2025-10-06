import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

interface IdiomEntry {
	idiom: string;
	meaning: string;
	example: string;
	origin: string;
}

const filePath = path.join(__dirname, '../static/collections/idioms.json');

async function main() {
	if (!fs.existsSync(filePath)) {
		console.error('File not found:', filePath);
		return;
	}

	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const idioms: IdiomEntry[] = JSON.parse(fileContent);

	// Group entries by idiom text
	const entryMap: Record<string, IdiomEntry[]> = {};
	idioms.forEach((entry) => {
		const key = entry.idiom.trim().toLowerCase(); // case-insensitive
		if (!entryMap[key]) entryMap[key] = [];
		entryMap[key].push(entry);
	});

	// Find duplicates
	const duplicates = Object.entries(entryMap).filter(([, entries]) => entries.length > 1);

	if (duplicates.length === 0) {
		console.log('No duplicate idiom entries found.');
		return;
	}

	console.log(`Found ${duplicates.length} duplicate idiom group(s).`);

	const keysToRemove: { key: string; removeIndexes: number[] }[] = [];

	for (const [key, entries] of duplicates) {
		console.log(`\nDuplicate idiom: "${entries[0].idiom}"`);

		const choices = entries.map((entry, index) => ({
			name: `Meaning: ${entry.meaning}\nExample: ${entry.example}\nOrigin: ${entry.origin}`,
			value: index
		}));

		const answers = await inquirer.prompt<{ toRemove: number[] }>([
			{
				type: 'checkbox',
				name: 'toRemove',
				message: 'Select the entries you want to remove (leave one to keep):',
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

	const cleanedIdioms: IdiomEntry[] = [];

	Object.entries(entryMap).forEach(([key, entries]) => {
		const toRemove = keysToRemove.find((k) => k.key === key)?.removeIndexes || [];
		entries.forEach((entry, idx) => {
			if (!toRemove.includes(idx)) {
				cleanedIdioms.push(entry);
			}
		});
	});

	fs.writeFileSync(filePath, JSON.stringify(cleanedIdioms, null, 2), 'utf-8');
	console.log(`\nCleaned JSON saved to ${filePath}`);
}

main().catch(console.error);
