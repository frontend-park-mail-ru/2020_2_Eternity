import template from "./Span.hbs"
import BaseComponent from "../BaseComponent.js";

export default class Span extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }
}