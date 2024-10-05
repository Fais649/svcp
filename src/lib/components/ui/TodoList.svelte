<script lang="ts">
	import { tick } from 'svelte';
	import Label from './label/label.svelte';
	import Input from './input/input.svelte';

	export let boxHeight;
	export let label;
	export let isFocused: boolean = false;
	export let headerHeight: string = '20px';
	export let headerFontSize: string = '12px';
	export let fontSize: number = 12;
	export let parentDiv: HTMLElement;

	interface TodoItem {
		text: string;
		completed: boolean;
		editing: boolean;
	}

	let todos: TodoItem[] = [];

	export function getTodosAsString() {
		return JSON.stringify(todos);
	}

	export function loadTodos(jsonString: string) {
		loadTodosFromTodoString(jsonString);
	}

	function loadTodosFromTodoString(jsonString: string) {
		try {
			let jsonObj = JSON.parse(jsonString) as TodoItem[];
			todos = jsonObj;
			todos = todos.filter((todo) => todo.text.trim() !== '');
		} catch (error) {
			console.error('Couldnt load Todos from TodoString: ', error);
		}
		console.log(todos);
	}

	export function clearTodos() {
		todos = [];
	}

	async function addTodoItem() {
		todos = [...todos, { text: '', completed: false, editing: true }];
		await tick();
		const input = document.querySelector('.todo-input') as HTMLInputElement;
		if (input) {
			input.scrollIntoView();
			input.focus();
		}
	}

	function finishEditingTodoItem(index: number) {
		const text = todos[index].text.trim();
		if (text === '') {
			todos.splice(index, 1);
		} else {
			todos[index].editing = false;
		}
		todos = [...todos];

		if (parentDiv) {
			parentDiv.focus();
			parentDiv.blur();
		}
	}

	function toggleCompleteTodoItem(index: number) {
		todos[index].completed = !todos[index].completed;
		todos = [...todos];
	}

	async function toggleEditableTodoItem(index: number) {
		todos[index].editing = true;
		await tick();
		const input = document.querySelector('.todo-input') as HTMLInputElement;
		if (input) input.focus();
	}

	let touchStartX: number;

	function handleTouchStart(event: TouchEvent) {
		touchStartX = event.touches[0].clientX;
	}

	function handleTouchEnd(event: TouchEvent, index: number) {
		const touchEndX = event.changedTouches[0].clientX;
		const swipeDistance = touchStartX - touchEndX;
		const swipeThreshold = 50; // Adjust this value as needed

		if (swipeDistance > swipeThreshold) {
			deleteTodoItem(index);
		}
	}

	function deleteTodoItem(index: number) {
		todos.splice(index, 1);
		todos = [...todos]; // Update the array to trigger reactivity
	}
</script>

<div
	style="height:{boxHeight}; border-right: {isFocused
		? '1px solid'
		: '1px dotted'}; border-top: {isFocused
		? '1px solid'
		: '1px dotted'}; border-left: 1px solid; border-bottom: 1px solid;"
	class="{isFocused
		? ''
		: 'txt-shadow '} gap-1.5 rounded-2xl border-[1px] p-3 shadow-none transition-all"
>
	<div
		style="height: {headerHeight};"
		class="grid w-full grid-cols-2 grid-rows-1 border-b-[1px] border-dotted p-0 align-middle"
	>
		<Label style="font-size: {headerFontSize};" class=" text-left font-bold" for="message"
			>{label}</Label
		>
		<div class="justify-self-end align-middle"></div>
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="box h-[90%] resize-none overflow-y-scroll border-none pb-8 pt-2"
		on:click={(event) => {
			if (event.currentTarget === event.target) addTodoItem();
		}}
	>
		{#if todos.length === 0}{/if}

		{#each todos as todo, index (todo)}
			<div
				style="font-size: {fontSize}px;"
				class="mt-2 flex w-[100%] flex-row items-center justify-start pl-4"
			>
				<div
					style="font-size: 15px;"
					class="w-1/6 items-center justify-self-center text-center align-middle"
					on:pointerdown={(e) => {
						e.preventDefault();
						toggleCompleteTodoItem(index);
					}}
				>
					{#if todo.completed}
						[x]
					{:else}
						[ ]
					{/if}
				</div>
				{#if todo.editing}
					<Input
						style="font-size: {fontSize}px;"
						class="todo-input ml-2 h-[50%] w-5/6 rounded-xl border-[1px] border-dotted ring-0"
						bind:value={todo.text}
						on:blur={() => finishEditingTodoItem(index)}
					/>
				{:else}
					<div
						on:click={(event) => {
							if (event.currentTarget === event.target) toggleEditableTodoItem(index);
						}}
						class="todo-text ml-2 h-[50%] w-5/6 text-left align-middle ring-0 {todo.completed
							? 'line-through'
							: ''}"
						on:touchstart={(event) => handleTouchStart(event)}
						on:touchend={(event) => handleTouchEnd(event, index)}
					>
						{todo.text}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.txt-shadow {
		box-shadow: -2px 2px;
	}
</style>
