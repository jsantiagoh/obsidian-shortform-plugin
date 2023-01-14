import { addIcon, App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import ShortForm from "./ShortForm";
import { pickBy } from './utils';

// Remember to rename these classes and interfaces!


// Obsidian specific classes
interface ShortFormPluginSettings {
	appKey: string;
	booksFolder: string;
	articlesFolder: string;
}

const DEFAULT_SETTINGS: ShortFormPluginSettings = {
	appKey: '',
	booksFolder: '',
	articlesFolder: ''
}


export default class ShortformPlugin extends Plugin {
	settings: ShortFormPluginSettings;

	private shortForm: ShortForm;


	async onload(): Promise<void> {
		await this.loadSettings();

		this.shortForm = new ShortForm(this.settings.appKey, this.app.vault, this.settings.booksFolder, this.settings.articlesFolder);

		// TODO: Design and properly implement an icon
		addIcon('shortform', `<svg viewBox="168.222 117.06 182.684 171.334" width="96" height="96">
  <path d="M -259.564 -288.394 L -168.222 -117.06 L -350.906 -117.06 L -259.564 -288.394 Z" data-bx-shape="triangle -350.906 -288.394 182.684 171.334 0.5 0 1@1764b2e0" style="stroke: rgb(0, 0, 0); fill: none; stroke-width: 18px;" transform="matrix(-1, 0, 0, -1, 0, 0)"></path>
  <polyline style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-width: 18px;" points="238.514 248.49 281.347 248.124"></polyline>
  <polyline style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-width: 18px;" points="216.182 206.022 304.411 205.29"></polyline>
  <polyline style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-width: 18px;" points="193.483 163.189 327.476 161.724"></polyline>
</svg>`);

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('shortform', 'Shortform: Get Highlights', (evt: MouseEvent) => {
			// Called when the user clicks the icon.

			this.shortForm.writeHighlights().then(() => {
				new Notice('Sync done');
			});
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'shortform-plugin-get',
			name: 'Shortform: Get Highlights',
			callback: () => {
				this.shortForm.writeHighlights().then(() => {
					new Notice('Sync done');
				});
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ShortformSettingTab(this.app, this));


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
		this.shortForm = new ShortForm(this.settings.appKey, this.app.vault, this.settings.booksFolder, this.settings.articlesFolder);
	}
}

class ShortformSettingTab extends PluginSettingTab {
	plugin: ShortformPlugin;

	constructor(app: App, plugin: ShortformPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Shortform plugin settings' });

		this.applicationKey(containerEl);
		this.booksFolder(containerEl);
		this.articlesFolder(containerEl);
	}

	private applicationKey(containerEl: HTMLElement) {
		new Setting(containerEl)
			.setName('Authentication key')
			.setDesc('Get it from your browser logged into shortform (for now)')
			.addText(text => text
				.setPlaceholder('Enter your key')
				.setValue(this.plugin.settings.appKey)
				.onChange(async (value) => {
					this.plugin.settings.appKey = value;
					await this.plugin.saveSettings();
				}));
	}

	private booksFolder(containerEl: HTMLElement): void {
		new Setting(containerEl)
			.setName('Books folder location')
			.setDesc('Vault folder to use for writing book highlight notes')
			.addDropdown((dropdown) => {
				// Dictionary of     { "/": { "type": "folder", "realpath": "/" }, "/something.md"....}
				const files = (this.app.vault.adapter as any).files

				const folders = pickBy(files, (val: { type: string; }) => {
					return val.type === 'folder';
				});

				Object.keys(folders).forEach((val) => {
					dropdown.addOption(val, val);
				});

				return dropdown.setValue(this.plugin.settings.booksFolder).onChange(async (value) => {
					this.plugin.settings.booksFolder = value;
					await this.plugin.saveSettings();
				});
			});
	}

	private articlesFolder(containerEl: HTMLElement): void {
		new Setting(containerEl)
			.setName('Article folder location')
			.setDesc('Vault folder to use for writing article highlight notes')
			.addDropdown((dropdown) => {
				// Dictionary of     { "/": { "type": "folder", "realpath": "/" }, "/something.md"....}
				const files = (this.app.vault.adapter as any).files

				const folders = pickBy(files, (val: { type: string; }) => {
					return val.type === 'folder';
				});

				Object.keys(folders).forEach((val) => {
					dropdown.addOption(val, val);
				});

				return dropdown.setValue(this.plugin.settings.articlesFolder).onChange(async (value) => {
					this.plugin.settings.articlesFolder = value;
					await this.plugin.saveSettings();
				});
			});
	}

}
