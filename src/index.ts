import { App, Notice, Plugin, PluginSettingTab, Setting, Vault } from 'obsidian';
import { ContentDocument } from './models';
import Renderer from './render';
import ShortForm, { ShortformDownloader } from './shortform';
import { pickBy } from './utils';
import { FileWriter } from './writer';

// Remember to rename these classes and interfaces!


// Contains all logic for getting and writing hightlights
class Shortform {
	private downloader: ShortformDownloader;
	private shortform: ShortForm;
	private bookWriter: FileWriter;
	private articleWriter: FileWriter;
	private renderer: Renderer;

	constructor(appKey: string, vault: Vault, bookFolder: string, articleFolder: string) {
		this.downloader = new ShortformDownloader(appKey);
		this.shortform = new ShortForm(this.downloader);
		this.bookWriter = new FileWriter(vault, bookFolder);
		this.articleWriter = new FileWriter(vault, articleFolder);
		this.renderer = new Renderer();
	};

	public async writeHighlights(): Promise<ContentDocument[]> {
		const docs = await this.shortform.getHighlights();
		for (const doc of docs) {
			console.log(`rendering: ${doc}`)
			const content = this.renderer.render(doc);
			console.log(`writing: ${doc}`)
			if (doc.type === 'article') {
				this.articleWriter.writeFile(doc, content);
			} else {
				this.bookWriter.writeFile(doc, content);
			}
		}
		return docs;
	}

}


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

	private shortForm: Shortform;


	async onload(): Promise<void> {
		await this.loadSettings();

		this.shortForm = new Shortform(this.settings.appKey, this.app.vault, this.settings.booksFolder, this.settings.articlesFolder);

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
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
		this.shortForm = new Shortform(this.settings.appKey, this.app.vault, this.settings.booksFolder);
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
