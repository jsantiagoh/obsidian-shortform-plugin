import { ContentDocument, Quote } from "./models";
import { groupBy } from "./utils";

interface ShortformUser {
    email: string;
    id: string;
}

interface ShortformMetadata {
    user: ShortformUser;
}

interface ShortformContent {
    id: string;
    content_type: string;
    title: string;
    order: number;
    doc: ShortformDocument;
}

interface ShortformDocument {
    id: string;
    title: string;
    author: string;
    doc_type: string; // book or article
    cover_image: string;
    url_slug: string;
}

interface ShortformData {
    id: string;
    created: string; //string/datetime/rfc3339
    quote: string;
    text: string;
    content: ShortformContent;
}

// Response JSON from Shortform.com
// Maybe I'll abstract this in the future to another type if needed
export interface ShortformResponse {
    data: ShortformData[];
    metadata: ShortformMetadata;
}

// Retrieves raw data from Shortform
export interface ResponseDownloader {
    getResponse(): Promise<ShortformResponse>;
}

export function buildUrl(url_slug: string, type: string): string {
    switch (type) {
        case 'book':
            return `https://www.shortform.com/app/book/${url_slug}/preview`;
        case 'article':
            return `https://www.shortform.com/app/article/${url_slug}`;
    }
    return '';
}

export class ShortformDownloader {
    private url = "https://www.shortform.com/api/highlights/?sort=date";

    constructor(private auth: string) { }

    public async getResponse(): Promise<ShortformResponse> {
        const options = {
            headers: {
                Authorization: `Basic ${this.auth}`,
                "X-Sf-Client": "11.7.0"
            }
        };
        const resp = await fetch(this.url, options);
        if (!resp.ok) {
            throw new Error(resp.statusText);
        }
        return await resp.json() as ShortformResponse;
    }

}

export default class ShortForm {

    constructor(private downloader: ResponseDownloader) { }


    public async getHighlights(): Promise<ContentDocument[]> {
        const response = this.downloader.getResponse();
        return response.then(data => this.parseResponse(data));
    }

    // Parses a Shortform response to something to be rendered, 
    // most importantly groups highlights by Book or Article.
    parseResponse(response: ShortformResponse): ContentDocument[] {
        const grouped: Record<string, ShortformData[]> =
            groupBy(response.data, d => d.content.doc.id);

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
                url: buildUrl(book.content.doc.url_slug, book.content.doc.doc_type),
            };

            documents.push(doc);
        }

        return documents;
    }
}
