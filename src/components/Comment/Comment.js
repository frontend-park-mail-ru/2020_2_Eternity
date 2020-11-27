import template from "./Comment.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Comment extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }
}