import template from "./pin.hbs";

import Base from "../base.js";

import Input from "../../components/input/input.js";


export default class PinPage extends Base {
    constructor(context={}) {
        super('Просмотр пина', context, null);
        this.template = template;
    }

    render() {
        const userComment = new Input({
            id: 'comment',
            type: 'text',
            customClasses: 'comment-add-user',
        })

        const data = {
            ...this.context,
            input: userComment.render(),
        }

        this.fillWith(data);
        document.getElementById('app').innerHTML = this.template(this.context);
    }
}