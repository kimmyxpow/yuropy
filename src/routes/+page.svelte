<script lang="ts">
	import UsersGroupTwoIcon from '~icons/solar/users-group-two-rounded-bold-duotone';
	import StarsLineBoldDuotoneIcon from '~icons/solar/stars-line-bold-duotone';
	import UserHandUpBoldDuotoneIcon from '~icons/solar/user-hand-up-bold-duotone';
	import CloudSun2BoldDuotoneIcon from '~icons/solar/cloud-sun-2-bold-duotone';
	import ThreeSquaresBoldDuotoneIcon from '~icons/solar/three-squares-bold-duotone';
	import HandHeartBoldDuotoneIcon from '~icons/solar/hand-heart-bold-duotone';
	import WordCard from '$lib/client/components/word-card.svelte';
	import IdiomCard from '$lib/client/components/idiom-card.svelte';
	import FactCard from '$lib/client/components/fact-card.svelte';

	let { data } = $props();
</script>

<header
	class="fixed inset-x-0 top-0 z-10 border-b border-dashed border-zinc-300 bg-zinc-100/30 backdrop-blur-2xl"
>
	<div class="inner flex items-center justify-between py-6">
		<a class="text-xl font-medium" href="/">yuropy</a>
		<div class="flex gap-6">
			<a class="font-medium text-zinc-500 transition-colors hover:text-zinc-900" href="/translator">
				Home
			</a>
			<a class="font-medium text-zinc-500 transition-colors hover:text-zinc-900" href="/translator">
				Translator
			</a>
			<a class="font-medium text-zinc-500 transition-colors hover:text-zinc-900" href="/translator">
				Ask AI
			</a>
			<a class="font-medium text-zinc-500 transition-colors hover:text-zinc-900" href="/translator">
				Bookmarks
			</a>
		</div>
	</div>
</header>

<main>
	<div class="inner py-30 border-x border-dashed border-zinc-300 px-12">
		<h1 class="text-5xl font-black">Today's Learning</h1>
		<p class="mt-2">will reset every day</p>
		<div class="mt-10 grid grid-cols-2 items-start gap-10">
			<div class="space-y-10">
				<WordCard word={data.daily.word} />
				<FactCard fact={data.daily.fact} />
			</div>
			<IdiomCard idiom={data.daily.idiom} />
		</div>
	</div>
</main>

<section class="border-y border-dashed border-zinc-300">
	<div class="inner border-x border-dashed border-zinc-300 p-12">
		<h2 class="text-5xl font-black">Learning Tips</h2>
		<div class="mt-10 space-y-6">
			<div class="flex gap-6">
				<span
					class="mt-1 grid size-12 shrink-0 place-items-center rounded-2xl border border-zinc-300 text-2xl ring-4 ring-zinc-200"
				>
					<UsersGroupTwoIcon />
				</span>
				<div class="space-y-2">
					<h3 class="text-xl font-black">Talk to real people, not just apps.</h3>
					<p>
						English is made for conversations. The fastest way to level up is by hanging out with
						people from different countries, even if you just talk about food, music, or random
						memes. If you want an easy start, we’ve got a hangout server where you can meet new
						friends 👉
						<a
							href="https://discord.gg/compilecafe"
							target="_blank"
							class="hover:rotate-4 inline-block text-pink-600 underline decoration-wavy transition-transform"
						>
							Join here
						</a>!
					</p>
				</div>
			</div>
			<div class="flex gap-6">
				<span
					class="mt-1 grid size-12 shrink-0 place-items-center rounded-2xl border border-zinc-300 text-2xl ring-4 ring-zinc-200"
				>
					<StarsLineBoldDuotoneIcon />
				</span>
				<div class="space-y-2">
					<h3 class="text-xl font-black">Repeat like a parrot 🦜</h3>
					<p>
						When you hear a phrase you like (from Netflix, TikTok, or even your new friends), say it
						out loud a few times. The more your mouth practices, the more natural it feels.
					</p>
				</div>
			</div>
			<div class="flex gap-6">
				<span
					class="mt-1 grid size-12 shrink-0 place-items-center rounded-2xl border border-zinc-300 text-2xl ring-4 ring-zinc-200"
				>
					<ThreeSquaresBoldDuotoneIcon />
				</span>
				<div class="space-y-2">
					<h3 class="text-xl font-black">Think in small English chunks.</h3>
					<p>
						Keep ready-to-go phrases in your pocket like “That makes sense,” “No worries,” or
						“Sounds good.” They’re quick, natural, and save you from translating in your head.
					</p>
				</div>
			</div>
			<div class="flex gap-6">
				<span
					class="mt-1 grid size-12 shrink-0 place-items-center rounded-2xl border border-zinc-300 text-2xl ring-4 ring-zinc-200"
				>
					<CloudSun2BoldDuotoneIcon />
				</span>
				<div class="space-y-2">
					<h3 class="text-xl font-black">Expose yourself daily (to English 😏).</h3>
					<p>
						Five minutes of English every day is better than one long session once a week. Scroll
						memes, watch short videos, or read funny comments. It all counts.
					</p>
				</div>
			</div>
			<div class="flex gap-6">
				<span
					class="mt-1 grid size-12 shrink-0 place-items-center rounded-2xl border border-zinc-300 text-2xl ring-4 ring-zinc-200"
				>
					<UserHandUpBoldDuotoneIcon />
				</span>
				<div class="space-y-2">
					<h3 class="text-xl font-black">Don’t study alone forever.</h3>
					<p>
						Practicing with friends or in group chats makes everything easier. You’ll laugh, make
						mistakes, and pick up new words without even realizing it.
					</p>
				</div>
			</div>
			<div class="flex gap-6">
				<span
					class="mt-1 grid size-12 shrink-0 place-items-center rounded-2xl border border-zinc-300 text-2xl ring-4 ring-zinc-200"
				>
					<HandHeartBoldDuotoneIcon />
				</span>
				<div class="space-y-2">
					<h3 class="text-xl font-black">Support the project if you like it.</h3>
					<p>
						This little website is a one-person project made with love. If it helps you, sharing it
						with a friend or dropping some support means the world and keeps it alive.
					</p>
					<a
						href="https://ko-fi.com/kimmyxpow"
						target="_blank"
						class="inline-flex h-14 items-center rounded-2xl bg-zinc-800 px-6 text-zinc-200 shadow-2xl shadow-black/30 transition-colors hover:bg-zinc-700"
					>
						Support me on Ko-fi 🩷
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
<div class="inner">
	<div
		class="bg-size-[10px_10px] [--pattern-foreground:var(--color-gray-300)]/50 h-10 border-x border-dashed border-zinc-300 bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)]"
	></div>
</div>
