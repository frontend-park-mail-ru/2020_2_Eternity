import template from "./Notebar.hbs"

import BaseComponent from "../BaseComponent.js";
import Button from "../Button/Button";
import {Icons} from "../../modules/consts/icons";

export default class Notebar extends BaseComponent {
    btn

    constructor(context = {}) {
        super(template, context);
    }

    render() {
        this.btn = new Button({
            id: 'removeNoteBtn',
            customButton: 'btn_transparent btn_round btn_with-icon btn_round_mini',
            text: Icons.remove,
        })
        this.context.btn = this.btn.render();
        return super.render();
    }
}