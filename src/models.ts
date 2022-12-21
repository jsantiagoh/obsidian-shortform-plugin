// Represents a book or an article read in shortform
export type ContentDocument = {
  id: string;
  title: string;
  author: string;
  type: string; // book or article
  cover: string;
  url: string;
  quotes: Quote[];
}

export type Quote = {
  id: string;
  quote: string; // Original quote from the Document
  text: string; // Text added to the quote
}