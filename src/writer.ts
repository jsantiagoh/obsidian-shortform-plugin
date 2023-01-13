import { Vault } from "obsidian";
import { ContentDocument } from "./models";

export class FileWriter {

    constructor(private vault: Vault, private baseDir: string = 'Shortform') { }

    public async writeFile(document: ContentDocument, content: string): Promise<void> {
        const filePath = this.generateFilePath(document);
        try {
            // TODO: don't fail if file already exists
            // Override? ignore?
            await this.vault.create(filePath, content);
        } catch (error) {
            console.error(`Error storying file at path="${filePath}"`);
            throw error;
        }
    }

    private generateFilePath(content: ContentDocument): string {
        return `${this.baseDir}/${content.title}.md`;
    }
}