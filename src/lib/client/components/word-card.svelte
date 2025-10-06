<script lang="ts">
	import VolumeLoudIcon from '~icons/solar/volume-loud-line-duotone';
	import VolumeCrossLineDuotoneIcon from '~icons/solar/volume-cross-line-duotone';
	import BookmarkIcon from '~icons/solar/bookmark-line-duotone';
	import BookmarkBoldIcon from '~icons/solar/bookmark-bold-duotone';
	import { onMount } from 'svelte';
	import { createAudioPlayer } from '../utils/player.svelte';

	let { word } = $props();

	const audioPlayer = createAudioPlayer();

	let wordAudioEl: HTMLAudioElement;
	let exampleAudioEl: HTMLAudioElement;

	let bookmarks: string[] = $state([]);

	onMount(() => {
		audioPlayer.register('word', wordAudioEl, word.word);
		audioPlayer.register('word_example', exampleAudioEl, word.example);

		const savedBookmarks = localStorage.getItem('wb');

		if (savedBookmarks) {
			bookmarks = JSON.parse(savedBookmarks);
		}

		return () => {
			audioPlayer.cleanup();
		};
	});

	const toggleBookmark = () => {
		bookmarks = bookmarks.includes(word.word)
			? bookmarks.filter((w) => w !== word.word)
			: [...bookmarks, word.word];
		localStorage.setItem('wb', JSON.stringify(bookmarks));
	};

	const isBookmarked = $derived(bookmarks.includes(word.word));
</script>

<article
	class="-rotate-1 break-inside-avoid-column rounded-3xl border-4 border-white bg-zinc-50 p-8 shadow-2xl shadow-black/10 transition-transform duration-500 hover:rotate-0"
>
	<header class="flex items-center justify-between">
		<h2 class="font-handwriting text-3xl">Word of the Day</h2>
		<button
			class="text-xl transition-colors {isBookmarked
				? 'text-zinc-800 hover:text-zinc-700'
				: 'text-zinc-500 hover:text-zinc-800'}"
			aria-label="Save word"
			onclick={toggleBookmark}
		>
			{#if isBookmarked}
				<BookmarkBoldIcon />
			{:else}
				<BookmarkIcon />
			{/if}
		</button>
	</header>

	<div class="mt-4 flex items-center justify-between">
		<span class="text-lg tracking-wide" aria-label="Pronunciation">{word.pronunciation}</span>
		<span
			class="rounded-full bg-zinc-800 px-3 py-0.5 text-sm tracking-wide text-white"
			aria-label="Part of speech">{word.part_of_speech}</span
		>
	</div>

	<div class="flex items-center gap-2">
		<h3 class="text-4xl underline decoration-wavy decoration-2">{word.word}</h3>
		<button
			class="text-2xl text-zinc-500 hover:text-zinc-800"
			aria-label="Hear pronunciation"
			onclick={() => audioPlayer.toggle('word')}
		>
			{#if audioPlayer.isPlaying('word')}
				<VolumeCrossLineDuotoneIcon />
			{:else}
				<VolumeLoudIcon />
			{/if}
			<audio class="hidden" bind:this={wordAudioEl} src="/sounds/words/{word.word}/word.mp3"
			></audio>
		</button>
	</div>

	<section class="mt-6">
		<h4 class="mb-1 text-lg font-semibold">Meaning</h4>
		<p>{word.meaning}</p>
	</section>

	<blockquote class="mt-4 rounded-2xl border-l-4 border-zinc-400 bg-zinc-100 p-4">
		<p class="font-medium">
			"{word.example}"
			<button
				class="text-lg text-zinc-500 hover:text-zinc-800"
				aria-label="Hear example"
				onclick={() => audioPlayer.toggle('word_example')}
			>
				{#if audioPlayer.isPlaying('word_example')}
					<VolumeCrossLineDuotoneIcon />
				{:else}
					<VolumeLoudIcon />
				{/if}
				<audio class="hidden" bind:this={exampleAudioEl} src="/sounds/words/{word.word}/example.mp3"
				></audio>
			</button>
		</p>
	</blockquote>
</article>
