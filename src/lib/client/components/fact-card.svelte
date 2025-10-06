<script lang="ts">
	import BookmarkIcon from '~icons/solar/bookmark-line-duotone';
	import BookmarkBoldIcon from '~icons/solar/bookmark-bold-duotone';
	import { onMount } from 'svelte';

	let { fact } = $props();

	let bookmarks: string[] = $state([]);

	onMount(() => {
		const savedBookmarks = localStorage.getItem('fb');

		if (savedBookmarks) {
			bookmarks = JSON.parse(savedBookmarks);
		}
	});

	const toggleBookmark = () => {
		bookmarks = bookmarks.includes(fact.title)
			? bookmarks.filter((w) => w !== fact.title)
			: [...bookmarks, fact.title];
		localStorage.setItem('fb', JSON.stringify(bookmarks));
	};

	const isBookmarked = $derived(bookmarks.includes(fact.title));
</script>

<article
	class="rotate-2 break-inside-avoid-column rounded-3xl border-4 border-white bg-zinc-50 p-8 shadow-2xl shadow-black/10 transition-transform duration-500 hover:rotate-0"
>
	<header class="flex items-center justify-between">
		<h2 class="font-handwriting text-3xl">Did You Know?</h2>
		<button
			class="text-xl transition-colors {isBookmarked
				? 'text-zinc-800 hover:text-zinc-700'
				: 'text-zinc-500 hover:text-zinc-800'}"
			aria-label="Save fact"
			onclick={toggleBookmark}
		>
			{#if isBookmarked}
				<BookmarkBoldIcon />
			{:else}
				<BookmarkIcon />
			{/if}
		</button>
	</header>

	<h3 class="mt-4 text-4xl">{fact.title}</h3>

	<p class="mt-2">
		{fact.fact}
	</p>
</article>
