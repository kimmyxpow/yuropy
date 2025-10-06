<script lang="ts">
	import VolumeLoudIcon from '~icons/solar/volume-loud-line-duotone';
	import BookmarkIcon from '~icons/solar/bookmark-line-duotone';
	import VolumeCrossLineDuotoneIcon from '~icons/solar/volume-cross-line-duotone';
	import BookmarkBoldIcon from '~icons/solar/bookmark-bold-duotone';
	import { createAudioPlayer } from '../utils/player.svelte';
	import { onMount } from 'svelte';

	let { idiom } = $props();

	const audioPlayer = createAudioPlayer();

	let idiomAudioEl: HTMLAudioElement;
	let exampleAudioEl: HTMLAudioElement;

	let bookmarks: string[] = $state([]);

	onMount(() => {
		audioPlayer.register('idiom', idiomAudioEl, idiom.idiom);
		audioPlayer.register('idiom_example', exampleAudioEl, idiom.example);

		const savedBookmarks = localStorage.getItem('ib');

		if (savedBookmarks) {
			bookmarks = JSON.parse(savedBookmarks);
		}

		return () => {
			audioPlayer.cleanup();
		};
	});

	const toggleBookmark = () => {
		bookmarks = bookmarks.includes(idiom.idiom)
			? bookmarks.filter((w) => w !== idiom.idiom)
			: [...bookmarks, idiom.idiom];
		localStorage.setItem('ib', JSON.stringify(bookmarks));
	};

	const isBookmarked = $derived(bookmarks.includes(idiom.idiom));
</script>

<article
	class="rotate-2 break-inside-avoid-column rounded-3xl border-4 border-white bg-zinc-50 p-8 shadow-2xl shadow-black/10 transition-transform duration-500 hover:rotate-0"
>
	<header class="flex items-center justify-between">
		<h2 class="font-handwriting text-3xl">Idiom of the Day</h2>
		<button
			class="text-xl transition-colors {isBookmarked
				? 'text-zinc-800 hover:text-zinc-700'
				: 'text-zinc-500 hover:text-zinc-800'}"
			aria-label="Save idiom"
			onclick={toggleBookmark}
		>
			{#if isBookmarked}
				<BookmarkBoldIcon />
			{:else}
				<BookmarkIcon />
			{/if}
		</button>
	</header>

	<div class="mt-4 flex items-center gap-2">
		<h3 class="text-4xl underline decoration-wavy decoration-2">
			"{idiom.idiom}"
		</h3>
		<button
			onclick={() => audioPlayer.toggle('idiom')}
			class="text-2xl text-zinc-500 hover:text-zinc-800"
			aria-label="Hear idiom"
		>
			{#if audioPlayer.isPlaying('idiom')}
				<VolumeCrossLineDuotoneIcon />
			{:else}
				<VolumeLoudIcon />
			{/if}
		</button>
		<audio class="hidden" bind:this={idiomAudioEl} src="/sounds/idioms/{idiom.idiom}/idiom.mp3"
		></audio>
	</div>

	<section class="mt-6">
		<h4 class="mb-1 text-lg font-semibold">Meaning</h4>
		<p>{idiom.meaning}</p>
	</section>

	<blockquote class="mt-4 rounded-2xl border-l-4 border-zinc-400 bg-zinc-100 p-4">
		<p class="font-medium">
			"{idiom.example}"
			<button
				class="text-lg text-zinc-500 hover:text-zinc-800"
				aria-label="Hear example"
				onclick={() => audioPlayer.toggle('idiom_example')}
			>
				{#if audioPlayer.isPlaying('idiom_example')}
					<VolumeCrossLineDuotoneIcon />
				{:else}
					<VolumeLoudIcon />
				{/if}
				<audio
					class="hidden"
					bind:this={exampleAudioEl}
					src="/sounds/idioms/{idiom.idiom}/example.mp3"
				></audio>
			</button>
		</p>
	</blockquote>

	<section class="mt-6">
		<h4 class="mb-1 text-lg font-semibold">Origin</h4>
		<p>
			{idiom.origin}
		</p>
	</section>
</article>
