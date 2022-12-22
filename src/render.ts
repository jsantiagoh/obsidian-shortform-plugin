// import 'nunjucks';
import * as nunjucks from 'nunjucks';
import { ContentDocument } from './models';
import { bookTemplate } from './templates';


export default class Renderer {

    constructor() {
        nunjucks.configure('src/templates');
    }

    render(content: ContentDocument): string {
        return nunjucks.renderString(bookTemplate, content);
    }
}