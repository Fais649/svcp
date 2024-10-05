<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	export let boxHeight;
	export let fontSize: number = 12;
	export let headerHeight: string = '20px';
	export let headerFontSize: string = '12px';
	export let label;
	export let isFocused;

	export let noteString: string = '';
</script>

<div
	style="height:{boxHeight};  border-right: {isFocused
		? '1px solid'
		: '1px dotted'}; border-top: {isFocused
		? '1px solid'
		: '1px dotted'}; border-left: 1px solid; border-bottom: 1px solid;"
	class=" box {isFocused
		? ''
		: 'txt-shadow '} gap-1.5 rounded-2xl border-[1px] p-3 shadow-none transition-all"
>
	<div
		style="height: {headerHeight};"
		class="grid w-full grid-cols-2 grid-rows-1 border-b-[1px] border-dotted p-0 align-middle"
	>
		<Label
			style="font-size: {headerFontSize};"
			class="box h-[50%] text-left font-bold"
			for="message">{label}</Label
		>
		<div class=" justify-self-end align-middle"></div>
	</div>
	<Textarea
		style="font-size: {fontSize}px;"
		class=" h-[87%] resize-none border-none pt-4 shadow-none outline-none ring-0 focus-visible:ring-0"
		placeholder=">..."
		id="message"
		bind:value={noteString}
	/>
</div>

<style>
	.txt-shadow {
		box-shadow: -2px 2px;
		/*box-shadow: -2px 2px 4px -1px;*/
	}
</style>
