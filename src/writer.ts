import { TFile, TFolder, Vault } from "obsidian";
import { ContentDocument } from "./models";

export class FileWriter {

    constructor(private vault: Vault, private baseDir: string = 'Shortform') { }

    public async writeFile(document: ContentDocument, content: string): Promise<void> {
        const filePath = this.generateFilePath(document);
        // File exists, update it's content
        // if it does not, then create it

        const fileOrFolder = this.vault.getAbstractFileByPath(filePath);
        if (fileOrFolder === null || fileOrFolder === undefined) {
            // Does not exist, create it
            await this.vault.create(filePath, content);
            return;
        }

        // File (or folder) already exists
        if (fileOrFolder instanceof TFolder) {
            throw new Error(`${filePath} is a folder, this was unexpected, skipping it`);
        }

        // It's an already existing file, update it
        await this.vault.modify(fileOrFolder as TFile, content);
    }

    private generateFilePath(content: ContentDocument): string {
        return `${this.baseDir}/${content.title}.md`;
    }
}