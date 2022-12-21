import { ContentDocument, Quote } from "./models";
import Renderer from "./render";
import ShortForm from "./shortform";

test('Test render', () => {
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

    console.log(render.render(content));
});
