import BaseComponent from "../base_component.js";

export default class Error extends BaseComponent {
    constructor(context = {}) {
        super('error.hbs', context);
    }
}