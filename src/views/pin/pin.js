import template from "./pin.hbs";

import BaseView from "../BaseView.js";

import Input from "../../components/input/input.js";


export default class PinPage extends BaseView {
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
        super.render();
    }
}