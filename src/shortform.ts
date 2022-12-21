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



// Get raw data from Shortform
export default class ShortForm {

    callShortForm(): ShortformResponse {
        const response: ShortformResponse = require('../data/response.json');
        return response;
    }

    public getHighlights(): ContentDocument[] {
        const response = this.callShortForm();
        return this.parseResponse(response);
    }

    // Parses a Shortform response to something to be rendered, 
    // most importantly groups highlights by Book or Article.
    parseResponse(response: ShortformResponse): ContentDocument[] {
        const grouped: Record<string, ShortformData[]> =
            groupBy(response.data, d => d.content.doc.id);

        let documents: ContentDocument[] = new Array();

        for (const key in grouped) {
            const data = grouped[key];
            const book = data[0];

            const quotes: Quote[] = data.map(d => ({
                id: d.id,
                quote: d.quote,
                text: d.text,
            } as Quote)
            );

            const doc: ContentDocument = {
                id: key,
                title: book.content.doc.title,
                author: book.content.doc.author,
                cover: book.content.doc.cover_image,
                type: book.content.doc.doc_type,
                quotes: quotes,
                url: `https://www.shortform.com/app/book/${book.content.doc.url_slug}/preview`,
            };

            documents.push(doc);
        }


        return documents;
    }
}


// Parses a Shortform response to something to be rendered, 
// most importantly groups highlights by Book or Article.
// DEPRECATED
export function parseResponseDeprecated(response: ShortformResponse): ContentDocument[] {
    const grouped: Record<string, ShortformData[]> =
        groupBy(response.data, d => d.content.doc.id);

    let documents: ContentDocument[] = new Array();

    for (const key in grouped) {
        const data = grouped[key];
        const book = data[0];

        const quotes: Quote[] = data.map(d => ({
            id: d.id,
            quote: d.quote,
            text: d.text,
        } as Quote)
        );

        const doc: ContentDocument = {
            id: key,
            title: book.content.doc.title,
            author: book.content.doc.author,
            cover: book.content.doc.cover_image,
            type: book.content.doc.doc_type,
            quotes: quotes,
            url: `https://www.shortform.com/app/book/${book.content.doc.url_slug}/preview`,
        };

        documents.push(doc);
    }


    return documents;
}

