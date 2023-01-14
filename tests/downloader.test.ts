import { buildDocUrl, shortformResponse2ContentDocument } from "../src/downloader";
import { ContentDocument } from "../src/models";
import response from '../tests/data/response.json';

describe('Parsing json to ContentDocument', () => {
    test('Parse response returns 4 books', async () => {
        const documents: ContentDocument[] = shortformResponse2ContentDocument(response);
        expect(documents.length).toBe(4);
        expect(documents[0].title).toBe('Deep Work');
        expect(documents[0].url).toBe('https://www.shortform.com/app/book/deep-work/highlights');
    });

    test('Parse response returns the last book with 4 quotes', async () => {
        const documents: ContentDocument[] = shortformResponse2ContentDocument(response);
        const book = documents[3];

        expect(book.quotes.length).toBe(4);
        expect(book.quotes[0].quote).toBe('Ultimately, execution is the thread that ties together strategy, goals, and people in a successful company. In practice, it looks like motivated people collaborating, speaking candidly, and relentlessly seeking solutions to fulfill big goals, all led by their leader');
    });

});

describe('Parsing json to ContentDocument', () => {

    test('Build url correctly builds an article url', () => {
        expect(buildDocUrl('testing_plugins', 'article')).toBe('https://www.shortform.com/app/article/testing_plugins');
    });

});