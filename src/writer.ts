import { Vault } from "obsidian";
import { ContentDocument } from "./models";

export class FileWriter {

    constructor(private vault: Vault) { }

    public async writeFile(document: ContentDocument, content: string): Promise<void> {
        const filePath = this.generateFilePath(document);
        try {
            await this.vault.create(filePath, content);
        } catch (error) {
            console.error(`Error storying file at path="${filePath}"`);
            throw error;
        }
    }

    generateFilePath(content: ContentDocument): string {
        return `Shortform/${content.title}.md`;
    }
}