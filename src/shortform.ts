import { ContentDocument } from "./models";
import { ShortformDownloader, ResponseDownloader, shortformResponse2ContentDocument } from "./downloader";
import { Vault } from "obsidian";
import Renderer from "./render";
import { FileWriter } from "./writer";



export default class ShortForm {
    private downloader: ResponseDownloader;
    private bookWriter: FileWriter;
    private articleWriter: FileWriter;
    private renderer: Renderer;

    constructor(appKey: string, vault: Vault, bookFolder: string, articleFolder: string) {
        this.downloader = new ShortformDownloader(appKey);
        this.bookWriter = new FileWriter(vault, bookFolder);
        this.articleWriter = new FileWriter(vault, articleFolder);
        this.renderer = new Renderer();
    };


    // TODO: Cleanup this at some point, passing an optional downloader parameter just to be able to test this is dirty
    async getHighlights(downloader: ResponseDownloader = this.downloader): Promise<ContentDocument[]> {
        const response = downloader.getResponse();
        return response.then(data => shortformResponse2ContentDocument(data));
    }

    public async writeHighlights(): Promise<ContentDocument[]> {
        const docs = await this.getHighlights();
        for (const doc of docs) {
            try {
                const content = this.renderer.render(doc);
                if (doc.type === 'article') {
                    this.articleWriter.writeFile(doc, content);
                } else {
                    this.bookWriter.writeFile(doc, content);
                }
            } catch (e: any) {
                console.error(e);
            }
        }
        return docs;
    }
}
