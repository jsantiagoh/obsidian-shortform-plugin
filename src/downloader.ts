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
    url_slug: string;
}

interface ShortformDocument {
    id: string;
    title: string;
    author: string;
    doc_type: string; // book or article
    cover_image: string;
    url_slug: string;
}

export interface ShortformData {
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

export function buildDocUrl(doc_url_slug: string, type: string, content_url_slug: string = 'highlights'): string {
    switch (type) {
        case 'book':
            return `https://www.shortform.com/app/book/${doc_url_slug}/${content_url_slug}`;
        case 'article':
            return `https://www.shortform.com/app/article/${doc_url_slug}`;
    }
    return '';
}

// Parses a Shortform response to something to be rendered, 
// most importantly groups highlights by Book or Article.
export function shortformResponse2ContentDocument(response: ShortformResponse): ContentDocument[] {
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


