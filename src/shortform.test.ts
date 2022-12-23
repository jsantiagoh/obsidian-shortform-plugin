import ShortForm, { ResponseDownloader, ShortformResponse } from "../src/shortform";
import { ContentDocument } from "./models";

const downloader: ResponseDownloader = {
    getResponse(): Promise<ShortformResponse> {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const response: ShortformResponse = require('../tests/response.json');
        return new Promise((resolve, reject) => {
            resolve(response);
        });
    }
};


describe('Shortform module', () => {
    const sf: ShortForm = new ShortForm(downloader);

    test('Parse response returns 4 books', async () => {
        const documents: ContentDocument[] = await sf.getHighlights();
        expect(documents.length).toBe(4);
        expect(documents[0].title).toBe('Deep Work');
        expect(documents[0].url).toBe('https://www.shortform.com/app/book/deep-work/preview');
    });

    test('Parse response returns the last book with 4 quotes', async () => {
        const documents: ContentDocument[] = await sf.getHighlights();
        const book = documents[3];

        expect(book.quotes.length).toBe(4);
        expect(book.quotes[0].quote).toBe('Ultimately, execution is the thread that ties together strategy, goals, and people in a successful company. In practice, it looks like motivated people collaborating, speaking candidly, and relentlessly seeking solutions to fulfill big goals, all led by their leader');
    });

});