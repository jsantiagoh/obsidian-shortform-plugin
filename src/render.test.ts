import { ContentDocument, Quote } from "./models";
import Renderer from "./render";

test('Test render simple case', () => {
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

    const expected = `---
title: testing title
author: santiago
document_type: book
source: shortform
url: https://www.shortform.com/app/book/deep-work/preview
---

# testing title 

> [!ABSTRACT] Metadata
> - Author: santiago
> - Content: [testing title](https://www.shortform.com/app/book/deep-work/preview)

## Highlights

> first quote from the book


this quote changed my life

---

> second quote from the book


this should be forever

---

`;


    expect(render.render(content)).toBe(expected);
});

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

    const expected = `---
title: testing title
author: santiago
document_type: book
source: shortform
url: https://www.shortform.com/app/book/deep-work/preview
---

# testing title 

> [!ABSTRACT] Metadata
> - Author: santiago
> - Content: [testing title](https://www.shortform.com/app/book/deep-work/preview)

## Highlights

> this
> is
> a
> multiline
> quote

---

`;
    expect(render.render(content)).toBe(expected);
});
