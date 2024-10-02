<script lang="ts">
	import { Footer } from '$lib/components/ui/card';
	import DatePicker from '$lib/components/ui/DatePicker.svelte';
	import TextAreaWLabel from '$lib/components/ui/TextAreaWLabel.svelte';

	let todo: HTMLElement;
	let body: HTMLElement;

	function handleFocusIn(event: FocusEvent) {
		let el = event.currentTarget as HTMLElement;
		el.style.transform = 'translateY(-200px) scale(1.1)';
		el.style.width = getComputedStyle(body).width;
		el.style.position = 'fixed';
	}

	function handleFocusOut(event: FocusEvent) {
		let el = event.currentTarget as HTMLElement;
		el.style.transform = 'translateY(0) scale(1)';
		el.style.position = 'relative';
	}
</script>

<div class="container h-[100vh]">
	<div class="h-[90vh] w-4/5" bind:this={body}>
		<div class="h-[20px]" />
		<div class="h-[200px]">
			<div
				class="textarea-wrapper"
				on:focusin={handleFocusIn}
				on:focusout={handleFocusOut}
				style=" transition: transform 0.3s ease; transform-origin: top; transform: translateY(0) scale(1);"
			>
				<TextAreaWLabel height="200px" bg="black" label="todo;" />
			</div>
		</div>

		<div class="h-[20px]" />

		<div class="min-h-[20px]">
			<div
				class="textarea-wrapper"
				on:focusin={handleFocusIn}
				on:focusout={handleFocusOut}
				style=" transition: transform 0.3s ease; transform-origin: top; transform: translateY(0) scale(1);"
			>
				<TextAreaWLabel height="200px" bg="transparent" label="note;" />
			</div>
		</div>
	</div>
	<Footer>
		<DatePicker />
	</Footer>
</div>

<style>
	.container {
		margin: 0;
		padding-top: 20px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		text-align: center;
		position: fixed;
	}
</style>
