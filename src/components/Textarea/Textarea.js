import template from "./Textarea.hbs"

import Input from "../Input/Input";

export default class Textarea extends Input {
    constructor(context = {}, validator) {
        super(context, validator);
        this.template = template;
    }
}
