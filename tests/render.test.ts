import { ContentDocument, Quote } from "../src/models";
import Renderer from "../src/render";
import { readFileSync } from "fs";


test('Test render multiline quote', () => {
    const render = new Renderer();

    const quotes: Quote[] = [
        {
            id: '1',
            quote: 'this\nis\na\nmultiline\nquote',
            text: '',
        },
    ];

    const content: ContentDocument = {
        id: "",
        title: "testing title",
        author: "santiago",
        type: "book",
        cover: "//media.shortform.com/covers/png/deep-work-cover.png",
        url: 'https://www.shortform.com/app/book/deep-work/preview',
        quotes: quotes,
    };

    expect(render.render(content)).toBe(readFileSync('./tests/data/rendered/multiline-quote.md', 'utf-8'));
});

test('Test render simple case with file', () => {
    const render = new Renderer();

    const quotes: Quote[] = [
        {
            id: '1',
            quote: 'first quote from the book',
            text: 'this quote changed my life',
        },
        {
            id: '2',
            quote: 'second quote from the book',
            text: 'this should be forever',
        },
    ];

    const content: ContentDocument = {
        id: "",
        title: "testing title",
        author: "santiago",
        type: "book",
        cover: "//media.shortform.com/covers/png/deep-work-cover.png",
        url: 'https://www.shortform.com/app/book/deep-work/preview',
        quotes: quotes,
    };

    expect(render.render(content)).toBe(readFileSync('./tests/data/rendered/book.md', 'utf-8'));
});