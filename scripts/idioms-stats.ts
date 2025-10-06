import fs from 'fs';
import path from 'path';

interface IdiomEntry {
	idiom: string;
	meaning: string;
	example: string;
	origin: string;
}

const filePath = path.join(__dirname, '../static/collections/idioms.json');

function main() {
	if (!fs.existsSync(filePath)) {
		console.error('File not found:', filePath);
		return;
	}

	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const idioms: IdiomEntry[] = JSON.parse(fileContent);

	const totalEntries = idioms.length;

	const uniqueIdiomsSet = new Set(idioms.map((i) => i.idiom.trim().toLowerCase()));
	const uniqueIdioms = uniqueIdiomsSet.size;

	const idiomCount: Record<string, number> = {};
	idioms.forEach((i) => {
		const key = i.idiom.trim().toLowerCase();
		idiomCount[key] = (idiomCount[key] || 0) + 1;
	});
	const duplicateIdioms = Object.values(idiomCount).filter((count) => count > 1).length;

	// Optional: count duplicates per idiom + example combination
	const groupCount: Record<string, number> = {};
	idioms.forEach((i) => {
		const key = `${i.idiom.trim().toLowerCase()}||${i.example.trim()}`;
		groupCount[key] = (groupCount[key] || 0) + 1;
	});
	const duplicateGroups = Object.values(groupCount).filter((count) => count > 1).length;

	console.log(`Total entries: ${totalEntries}`);
	console.log(`Unique idioms: ${uniqueIdioms}`);
	console.log(`Duplicate idioms: ${duplicateIdioms}`);
	console.log(`Duplicate groups (idiom + example): ${duplicateGroups}`);
}

main();
