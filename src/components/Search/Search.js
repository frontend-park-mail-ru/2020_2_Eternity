import template from "./Search.hbs"

import BaseComponent from "../BaseComponent.js";
import Button from "../Button/Button";
import {Icons} from "../../modules/consts/icons";

export default class Search extends BaseComponent {
    clear

    constructor(context = {}) {
        super(template, context);
        this.clear = new Button({
            id: 'clearSearchBtn',
            text: Icons.remove,
            customButton: 'btn_transparent btn_round btn_with-icon btn_round_mini search__clean',
            dataAttr: 'data-activates=""'
        })
        this.context.clear = this.clear.render()
    }

    get value() {
        return this.element.querySelector('.search__input').value;
    }

    clearInput() {
        this.element.querySelector('.search__input').value = '';
    }
}