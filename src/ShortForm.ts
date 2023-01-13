import { ContentDocument, Quote } from "./models";
import { groupBy } from "./utils";
import { ShortformResponse, ShortformData, buildDocUrl, ShortformDownloader, ResponseDownloader } from "./downloader";
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
        return response.then(data => this.parseResponse(data));
    }

    // Parses a Shortform response to something to be rendered, 
    // most importantly groups highlights by Book or Article.
    parseResponse(response: ShortformResponse): ContentDocument[] {
        const grouped: Record<string, ShortformData[]> = groupBy(response.data, d => d.content.doc.id);

        const documents: ContentDocument[] = [];

        for (const key in grouped) {
            const data = grouped[key];
            const book = data[0];

            const quotes: Quote[] = data.map(d => ({
                id: d.id,
                quote: d.quote,
                text: d.text,
            } as Quote));

            const doc: ContentDocument = {
                id: key,
                title: book.content.doc.title,
                author: book.content.doc.author,
                cover: book.content.doc.cover_image,
                type: book.content.doc.doc_type,
                quotes: quotes,
                url: buildDocUrl(book.content.doc.url_slug, book.content.doc.doc_type),
            };

            documents.push(doc);
        }

        return documents;
    }

    public async writeHighlights(): Promise<ContentDocument[]> {
        const docs = await this.getHighlights();
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
