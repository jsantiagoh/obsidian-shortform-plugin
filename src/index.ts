import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import Renderer from './render';
import ShortForm from './shortform';
import { FileWriter } from './writer';

// Remember to rename these classes and interfaces!

interface ShortFormPluginSettings {
	appKey: string;
}

const DEFAULT_SETTINGS: ShortFormPluginSettings = {
	appKey: ''
}


export default class MyPlugin extends Plugin {
	settings: ShortFormPluginSettings;

	private shortform: ShortForm;
	private fileWriter: FileWriter;
	private renderer: Renderer;


	async onload(): Promise<void> {
		await this.loadSettings();

		this.shortform = new ShortForm();
		this.fileWriter = new FileWriter(this.app.vault);
		this.renderer = new Renderer();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			const books = this.shortform.getHighlights();
			for (const book of books) {
				console.log('rendering...')
				const content = this.renderer.render(book);
				console.log(`writing...`);
				this.fileWriter.writeFile(book, content);
			}

			new Notice('Sync done');
		});
		// Perform additional things with the ribbon
		// ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	}
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));


		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Settings for my awesome plugin.' });

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.appKey)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.appKey = value;
					await this.plugin.saveSettings();
				}));
	}
}
