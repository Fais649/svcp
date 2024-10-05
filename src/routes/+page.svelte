<script lang="ts">
	import { Footer } from '$lib/components/ui/card';
	import DatePicker from '$lib/components/ui/DatePicker.svelte';
	import TextAreaWLabel from '$lib/components/ui/TextAreaWLabel.svelte';
	import TodoList from '$lib/components/ui/TodoList.svelte';
	import '@capacitor-community/safe-area';
	import { Keyboard } from '@capacitor/keyboard';
	import { Device } from '@capacitor/device';
	import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
	import { onMount, onDestroy, tick } from 'svelte';
	import { themes, updateCSSVariables } from './themes';

	interface Preferences {
		theme: string;
	}

	let preferences: Preferences = {
		theme: 'light'
	};

	function cycleTheme() {
		let index = themes.indexOf(preferences.theme);
		if (index === themes.length) {
			index = 0;
			preferences.theme = themes[index];
		} else {
			preferences.theme = themes[index + 1];
		}

		console.log(preferences.theme);
		savePreferences();
	}

	$: updateCSSVariables(preferences.theme);

	let os = '';
	let isFocused: boolean = false;
	let contentDiv: HTMLElement;
	let todoList: TodoList;
	let todoListParentDiv: HTMLElement;

	const journalDir: string = 'journal/';
	let dateString: string = '';
	let noteString: string = '';

	let keyboardHeight = 0;
	let viewportHeightPx: number = -1;

	let defaultBoxHeightLg: number = 300;
	let defaultBoxHeightSm: number = 220;

	let defaultBoxWidthLg: number = 300;
	let defaultBoxWidthSm: number = 220;

	let defaultHeaderHeightLg: string = `25px`;
	let defaultHeaderHeightSm: string = `15px`;
	let defaultHeaderFontSizeLg: string = `16px`;
	let defaultHeaderFontSizeSm: string = `12px`;

	let boxHeight = defaultBoxHeightLg;
	$: boxHeightStr = `${boxHeight}px`;

	let boxWidth = defaultBoxWidthLg;
	$: boxWidthStr = `${boxWidth}px`;

	let headerHeight: string;
	let headerFontSize: string;

	let fontSize: number = 14;

	let smolPhone: boolean = false;
	let bigPhone: boolean = true;

	$: boxStyle = 'min-height: {boxHeightStr};';

	$: footerStyle =
		os === 'ios'
			? `transition: transform 0.4s ease; transform: translateY(-${keyboardHeight}px)`
			: '';

	$: footerClass =
		"fixed  bottom-0 z-[120] flex h-10 w-full items-center justify-center ${os !== 'ios' ? (bigPhone ? `bottom-2 mb-8` : 'bottom-2 mb-4') : `pb-0`}";

	$: if (viewportHeightPx > 650) {
		boxHeight = defaultBoxHeightLg;
		headerHeight = defaultHeaderHeightLg;
		headerFontSize = defaultHeaderFontSizeLg;

		if (os === 'ios') {
			boxHeight += 20;
		}
		bigPhone = true;
		smolPhone = false;
	} else {
		boxHeight = defaultBoxHeightSm;
		headerHeight = defaultHeaderHeightSm;
		headerFontSize = defaultHeaderFontSizeSm;

		if (os === 'ios') {
			boxHeight += 20;
		}
		bigPhone = false;
		smolPhone = true;
	}

	onMount(async () => {
		try {
			const info = await Device.getInfo();
			os = info.platform;
			viewportHeightPx = window.innerHeight;
		} catch (error) {
			console.error('Error getting device inf:', error);
			os = 'dunno';
		}

		Keyboard.addListener('keyboardWillShow', (info) => {
			keyboardHeight = info.keyboardHeight;
		});

		Keyboard.addListener('keyboardWillHide', () => {
			keyboardHeight = 0;
		});

		tick();
		loadPreferences();
		tick();
		loadContent();
	});

	onDestroy(() => {
		Keyboard.removeAllListeners();
	});

	const writeFile = async (dir: string, name: string, content: string) => {
		await Filesystem.writeFile({
			path: dir + '/' + name,
			data: content,
			recursive: true,
			directory: Directory.Documents,
			encoding: Encoding.UTF8
		});
	};

	const readFile = async (dir: string, name: string) => {
		try {
			const contents = await Filesystem.readFile({
				path: dir + '/' + name,
				directory: Directory.Documents,
				encoding: Encoding.UTF8
			});
			return contents.data as string;
		} catch (error) {
			console.error('WTF: ', error);
		}

		tick();
		return '';
	};

	const saveContent = async () => {
		let contentString = JSON.stringify({
			note: noteString,
			todo: todoList.getTodosAsString()
		});
		await writeFile(journalDir + dateString, 'note.txt', noteString);
		await writeFile(journalDir + dateString, 'todo.txt', todoList.getTodosAsS255ring());
		await writeFile(journalDir + dateString, 'content.json', contentString);
		tick();
	};

	const savePreferences = async () => {
		try {
			await writeFile('', 'preferences.json', JSON.stringify(preferences));
			console.log(await readFile('', 'preferences.json'));
		} catch (error) {
			console.log(error);
		}
		tick();
	};

	const loadPreferences = async () => {
		try {
			let preferencesString = await readFile('', 'preferences.json');
			let preferencesJson = JSON.parse(preferencesString);
			if (preferencesJson.theme) {
				updateCSSVariables(preferencesJson.theme);
			}
			preferences = preferencesJson as Preferences;
		} catch (error) {
			savePreferences();
		}
		tick();
	};

	const loadContent = async () => {
		try {
			let contentString = await readFile(journalDir + dateString, 'content.json');
			let contentJson = JSON.parse(contentString);
			noteString = contentJson.note;
			todoList.loadTodos(contentJson.todo.toString());
		} catch (error) {
			noteString = '';
			todoList.clearTodos();
		}
		tick();
	};

	function handleFocusIn(event: FocusEvent, y: number, scale: number) {
		let el = event.currentTarget as HTMLElement;
		animateFocusIn(el, y, scale, 100);
	}

	function handleFocusOut(event: FocusEvent) {
		let el = event.currentTarget as HTMLElement;
		animateFocusOut(el, 0, 1, 2);
		saveContent();
	}

	function animateFocusIn(el: HTMLElement, y: number, scale: number, z: number) {
		el.style.transform = `translateY(${y}px) scale(${scale})`;
		el.style.zIndex = z.toString();
		el.style.width = '300px';
		el.style.position = 'fixed';
	}

	function animateFocusOut(el: HTMLElement, y: number, scale: number, z: number) {
		el.style.transform = `translateY(${y}px) scale(${scale})`;
		el.style.position = 'relative';
		el.style.zIndex = z.toString();
	}

	let previousDateString = '';

	$: if (dateString && dateString !== previousDateString) {
		loadContent();
		previousDateString = dateString;
	}
</script>

<div class="container fixed w-full">
	<div tabindex="-1" style="width: {boxWidthStr};" bind:this={contentDiv}>
		<div id="logo" on:pointerdown={cycleTheme} class="text-5xl">⠋</div>
		<div style="min-height: {boxHeightStr}; margin-left: 0;">
			<div
				bind:this={todoListParentDiv}
				tabindex="-1"
				class="box todo-wrapper"
				on:pointerup={saveContent}
				on:touchend={saveContent}
				on:touchcancel={saveContent}
				on:focusin={(e) => {
					isFocused = true;
					handleFocusIn(e, 0, 1.2);
					let textbox = document.querySelector('.textarea-wrapper');
					tick();
					if (textbox instanceof HTMLElement) {
						animateFocusIn(textbox, -boxHeight * 1.05, 1.05, 5);
					}
				}}
				on:blur={(e) => {
					isFocused = false;
					handleFocusOut(e);
					let textbox = document.querySelector('.textarea-wrapper');
					tick();
					if (textbox instanceof HTMLElement) {
						animateFocusOut(textbox, 0, 1, 1);
					}
				}}
				style="transition: transform 0.4s ease; transform-origin: top; transform: translateY(0) scale(1);"
			>
				<TodoList
					{fontSize}
					{headerHeight}
					{headerFontSize}
					{isFocused}
					parentDiv={todoListParentDiv}
					boxHeight={boxHeightStr}
					bind:this={todoList}
					label="todo;"
				/>
			</div>
		</div>

		<div style="height: {smolPhone ? `15px` : `20px`}" />

		<div style={boxStyle}>
			<div
				class="box textarea-wrapper"
				on:focusin={(e) => {
					isFocused = true;
					handleFocusIn(e, -boxHeight * 1.1, 1.2);
				}}
				on:focusout={(e) => {
					isFocused = false;
					handleFocusOut(e);
				}}
				style="transition: transform 0.4s ease; transform-origin: top; transform: translateY(0) scale(1);"
			>
				<TextAreaWLabel
					{fontSize}
					{headerHeight}
					{headerFontSize}
					{isFocused}
					boxHeight={boxHeightStr}
					label="note;"
					bind:noteString
				/>
			</div>
		</div>
	</div>

	<Footer style={footerStyle} class={footerClass}>
		<div>
			<DatePicker {isFocused} cssClass={'ui'} bind:dateString />
		</div>
	</Footer>
</div>

<style>
	.container {
		margin: 0;
		padding-top: var(--safe-area-inset-top);
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		text-align: center;
	}

	:global(.ui) {
		background: var(--background);
		color: var(--foreground);
	}

	:root {
		background: var(--background);
		color: var(--foreground);
	}

	* {
		background: var(--background);
		color: var(--foreground);
	}
</style>
