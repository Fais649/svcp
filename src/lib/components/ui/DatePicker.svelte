<script lang="ts">
	import CalendarIcon from 'svelte-radix/Calendar.svelte';
	import { DateFormatter, type DateValue, getLocalTimeZone, today } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	const df = new DateFormatter('de-DE', {
		dateStyle: 'medium'
	});

	export let value: DateValue | undefined = undefined;
	export let dateString = ''; // The variable you want to bind
	export let cssClass = '';
	export let isFocused;

	let dayOfWeek = '';

	const formatDate = (date: DateValue) => {
		return df.format(date.toDate(getLocalTimeZone()));
	};

	const dayOfWeekFormatter = new DateFormatter('de-DE', { weekday: 'short' });
	const getDayOfWeek = (date: DateValue) => {
		return dayOfWeekFormatter.format(date.toDate(getLocalTimeZone()));
	};

	$: dateString = value ? formatDate(value) : formatDate(today(getLocalTimeZone()));
	$: dayOfWeek = value ? getDayOfWeek(value) : getDayOfWeek(today(getLocalTimeZone()));

	const items = [
		{ value: -7, label: '󰇙󰇙' },
		{ value: -3, label: '󰇙' },
		{ value: -1, label: '' },
		{ value: 0, label: '' },
		{ value: 1, label: '' },
		{ value: 3, label: '󰇙' },
		{ value: 7, label: '󰇙󰇙' }
	];

	function decrementDate() {
		if (value) {
			value = value.subtract({ days: 1 });
		} else {
			value = today(getLocalTimeZone()).subtract({ days: 1 });
		}
	}

	function incrementDate() {
		if (value) {
			value = value.add({ days: 1 });
		} else {
			value = today(getLocalTimeZone()).add({ days: 1 });
		}
	}

	function changeDateBy(days: number) {
		console.log('changing date');
		console.log(days);
		if (days === 0) {
			value = today(getLocalTimeZone());
		} else if (value) {
			value = value.add({ days });
		} else value = today(getLocalTimeZone()).add({ days });
	}
</script>

<div
	class=" {isFocused
		? ''
		: 'txt-shadow '} {cssClass} mb-4 flex w-fit flex-row items-center justify-center overflow-hidden rounded-2xl border-[1px] border-dotted"
>
	<Button
		variant="ghost"
		on:click={decrementDate}
		class={cn('w-full justify-start text-left font-normal')}></Button
	>
	<Popover.Root openFocus>
		<Popover.Trigger asChild let:builder>
			<Button
				variant="ghost"
				class={cn('w-full justify-start text-left font-normal')}
				builders={[builder]}
			>
				{dayOfWeek + ' : ' + dateString}
			</Button>
		</Popover.Trigger>
		<Popover.Content
			class="flex aspect-square flex-col overflow-clip rounded-xl border-[1px] border-dotted p-0"
		>
			<div class="w-full rounded-md border-0">
				<Calendar class="w-full border-0" bind:value />
				<div class="flex w-full flex-row">
					{#each items as item}
						<Button variant="ghost" class="w-[14%]" on:click={() => changeDateBy(item.value)}
							>{item.label}</Button
						>
					{/each}
				</div>
			</div>
		</Popover.Content>
	</Popover.Root>

	<Button variant="ghost" on:click={incrementDate}></Button>
</div>

<style>
	.txt-shadow {
		box-shadow: -1px 1px;
	}
</style>
