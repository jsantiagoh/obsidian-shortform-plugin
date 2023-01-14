import { addIcon, App, DropdownComponent, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import ShortForm from "./shortform";
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


const shortformIcon = `<svg
   viewBox="0 0 24 24"
   fill="none"
   stroke="currentColor"
   stroke-width="2"
   stroke-linecap="round"
   stroke-linejoin="round"
   class="svg-icon shortform"
   version="1.1"
   id="svg13"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <path
     style="fill:none;stroke-width:2;stroke-dasharray:none;"
     d="M 4.1363194,3.4352483 H 20.003895 L 12.058423,21.499513 Z"
     id="path449" />
  <path
     style="fill:none;stroke-width:2;stroke-dasharray:none;"
     d="m 10.539435,16.101265 3.41188,-0.07011"
     id="path1129" />
  <path
     style="fill:none;stroke-width:2;stroke-dasharray:none;"
     d="m 8.2960078,11.520935 c 9.3476152,0 7.8519972,0.02337 7.8519972,0.02337"
     id="path1131" />
  <path
     style="fill:none;stroke-width:2;stroke-dasharray:none;"
     d="M 6.496592,7.4780916 17.807205,7.4313535"
     id="path1133" />
</svg>`;

export default class ShortformPlugin extends Plugin {
	settings: ShortFormPluginSettings;

	private shortForm: ShortForm;


	async onload(): Promise<void> {
		await this.loadSettings();

		this.shortForm = new ShortForm(this.settings.appKey, this.app.vault, this.settings.booksFolder, this.settings.articlesFolder);

		addIcon('shortform', shortformIcon);

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('shortform', 'Shortform: Sync Highlights', (evt: MouseEvent) => {
			// Called when the user clicks the icon.

			this.shortForm.writeHighlights().then(() => {
				new Notice('Sync done');
			});
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('shortform-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'shortform-plugin-get',
			name: 'Shortform: Sync Highlights',
			callback: () => {
				this.shortForm.writeHighlights().then(() => {
					new Notice('Shortform Sync done');
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

	// Invoked after saving settings
	async saveSettings() {
		await this.saveData(this.settings);
		this.shortForm = new ShortForm(this.settings.appKey, this.app.vault, this.settings.booksFolder, this.settings.articlesFolder);
		// Set the ribbon Icon
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
				this.fillWithFolders(dropdown);

				return dropdown.setValue(this.plugin.settings.booksFolder).onChange(async (value) => {
					this.plugin.settings.booksFolder = value;
					await this.plugin.saveSettings();
				});
			});
	}

	private fillWithFolders(dropdown: DropdownComponent) {
		const files = (this.app.vault.adapter as any).files;

		const folders = pickBy(files, (val: { type: string; }) => {
			return val.type === 'folder';
		});

		Object.keys(folders).forEach((val) => {
			dropdown.addOption(val, val);
		});
	}

	private articlesFolder(containerEl: HTMLElement): void {
		new Setting(containerEl)
			.setName('Article folder location')
			.setDesc('Vault folder to use for writing article highlight notes')
			.addDropdown((dropdown) => {
				// Dictionary of     { "/": { "type": "folder", "realpath": "/" }, "/something.md"....}
				this.fillWithFolders(dropdown);

				return dropdown.setValue(this.plugin.settings.articlesFolder).onChange(async (value) => {
					this.plugin.settings.articlesFolder = value;
					await this.plugin.saveSettings();
				});
			});
	}

}
