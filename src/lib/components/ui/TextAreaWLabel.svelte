<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import TextStyleBar from './TextStyleBar.svelte';
	import { Label } from '$lib/components/ui/label/index.js';

	export let bg;
	export let height;
	export let label;
</script>

<div
	class="h-[{height}] bg-black bg-{bg} txt-shadow flex h-[50%] flex-col gap-1.5 rounded-xl border-2 border-white p-3"
>
	<div class="grid h-[20px] w-full grid-cols-2 grid-rows-1 p-0 align-middle">
		<Label style="font-size: 20px;" class=" text-left font-bold" for="message">{label}</Label>
		<div class="justify-self-end align-middle">
			<TextStyleBar></TextStyleBar>
		</div>
	</div>
	<Separator class="m-0 h-[2px] border-white bg-white p-0 align-top"></Separator>
	<Textarea
		class="h-full resize-none border-none"
		placeholder="Type your message here."
		id="message"
	/>
</div>

<style>
	.txt-shadow {
		box-shadow: -3px 3px white;
	}
</style>
