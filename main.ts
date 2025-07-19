import { App, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, ItemView, TFile } from 'obsidian';

// Define the view type for our activities panel
export const ACTIVITIES_VIEW_TYPE = "activities-view";

interface ActivitiesPluginSettings {
	showFileExtension: boolean;
	sortOrder: 'alphabetical' | 'modified' | 'created';
}

const DEFAULT_SETTINGS: ActivitiesPluginSettings = {
	showFileExtension: false,
	sortOrder: 'alphabetical'
}

export default class ActivitiesPlugin extends Plugin {
	settings: ActivitiesPluginSettings;

	async onload() {
		await this.loadSettings();

		// Register the view
		this.registerView(
			ACTIVITIES_VIEW_TYPE,
			(leaf) => new ActivitiesView(leaf, this)
		);

		// Add ribbon icon to open activities panel
		const ribbonIconEl = this.addRibbonIcon('list', 'Open Activities Panel', (evt: MouseEvent) => {
			this.activateView();
		});
		ribbonIconEl.addClass('activities-plugin-ribbon-icon');

		// Add command to open activities panel
		this.addCommand({
			id: 'open-activities-panel',
			name: 'Open Activities Panel',
			callback: () => {
				this.activateView();
			}
		});

		// Add settings tab
		this.addSettingTab(new ActivitiesSettingTab(this.app, this));
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(ACTIVITIES_VIEW_TYPE);
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(ACTIVITIES_VIEW_TYPE);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for it
			leaf = workspace.getRightLeaf(false);
			await leaf?.setViewState({ type: ACTIVITIES_VIEW_TYPE, active: true });
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

export class ActivitiesView extends ItemView {
	plugin: ActivitiesPlugin;

	constructor(leaf: WorkspaceLeaf, plugin: ActivitiesPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType() {
		return ACTIVITIES_VIEW_TYPE;
	}

	getDisplayText() {
		return "Activities";
	}

	getIcon() {
		return "list";
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		container.empty();
		container.createEl("h4", { text: "Activities" });

		await this.refreshActivities();
	}

	async refreshActivities() {
		const container = this.containerEl.children[1];
		
		// Remove existing activity list if it exists
		const existingList = container.querySelector('.activities-list');
		if (existingList) {
			existingList.remove();
		}

		const activitiesList = container.createEl("div", { cls: "activities-list" });

		// Get all markdown files in the vault
		const files = this.app.vault.getMarkdownFiles();
		
		// Sort files based on settings
		const sortedFiles = this.sortFiles(files);

		if (sortedFiles.length === 0) {
			activitiesList.createEl("p", { 
				text: "No activities found. Create some markdown files to see them here!",
				cls: "activities-empty-state"
			});
			return;
		}

		// Create list items for each file
		sortedFiles.forEach(file => {
			const activityItem = activitiesList.createEl("div", { cls: "activity-item" });
			
			const activityLink = activityItem.createEl("a", {
				text: this.getDisplayName(file),
				cls: "activity-link"
			});

			activityLink.addEventListener('click', (event) => {
				event.preventDefault();
				this.app.workspace.openLinkText(file.path, '', false);
			});

			// Add file path as tooltip
			activityLink.title = file.path;
		});
	}

	private sortFiles(files: TFile[]): TFile[] {
		switch (this.plugin.settings.sortOrder) {
			case 'modified':
				return files.sort((a, b) => b.stat.mtime - a.stat.mtime);
			case 'created':
				return files.sort((a, b) => b.stat.ctime - a.stat.ctime);
			case 'alphabetical':
			default:
				return files.sort((a, b) => a.basename.localeCompare(b.basename));
		}
	}

	private getDisplayName(file: TFile): string {
		if (this.plugin.settings.showFileExtension) {
			return file.name;
		}
		return file.basename;
	}

	async onClose() {
		// Nothing to clean up.
	}
}

class ActivitiesSettingTab extends PluginSettingTab {
	plugin: ActivitiesPlugin;

	constructor(app: App, plugin: ActivitiesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Activities Plugin Settings' });

		new Setting(containerEl)
			.setName('Show file extension')
			.setDesc('Display .md extension in activity names')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showFileExtension)
				.onChange(async (value) => {
					this.plugin.settings.showFileExtension = value;
					await this.plugin.saveSettings();
					// Refresh the view if it's open
					const leaves = this.app.workspace.getLeavesOfType(ACTIVITIES_VIEW_TYPE);
					leaves.forEach(leaf => {
						if (leaf.view instanceof ActivitiesView) {
							leaf.view.refreshActivities();
						}
					});
				}));

		new Setting(containerEl)
			.setName('Sort order')
			.setDesc('How to sort the activities in the list')
			.addDropdown(dropdown => dropdown
				.addOption('alphabetical', 'Alphabetical')
				.addOption('modified', 'Last modified')
				.addOption('created', 'Date created')
				.setValue(this.plugin.settings.sortOrder)
				.onChange(async (value: 'alphabetical' | 'modified' | 'created') => {
					this.plugin.settings.sortOrder = value;
					await this.plugin.saveSettings();
					// Refresh the view if it's open
					const leaves = this.app.workspace.getLeavesOfType(ACTIVITIES_VIEW_TYPE);
					leaves.forEach(leaf => {
						if (leaf.view instanceof ActivitiesView) {
							leaf.view.refreshActivities();
						}
					});
				}));
	}
}