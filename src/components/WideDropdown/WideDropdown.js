import template from "./WideDropdown.hbs"

import BaseComponent from "../BaseComponent.js";
import List from "../List/List";
import {Icons} from "../../modules/consts/icons";
import Dropdown from "../Dropdown/Dropdown";

export default class WideDropdown extends BaseComponent {
    isSaved
    isOpened
    list

    constructor(context = {}) {
        super(template, context);

        this.list = new List({
            customItem: context.customItem,
            custom: 'dropdown__drop__list ' + context.custom,
            id: 'list' + context.id,
        })

        this.isOpened = false;
    }

    render() {
        this.context = {
            ...this.context,
            arrowIcon: Icons.arrowBottom,
            iconAdd: Icons.add,
            list: this.list.render(),
        }
        return super.render();
    }

    showSaved() {
        this.isSaved = true;
        this.element.querySelector('.dropdown__label__saved').setAttribute('display', 'block');
    }
    clearSaved() {
        this.isSaved = false;
        this.element.querySelector('.dropdown__label__saved').setAttribute('display', 'none');
    }

    showDrop() {
        this.isOpened = true;
        this.element.querySelector('.dropdown__drop').classList.add('dropdown__drop__active');
    }
    hideDrop() {
        this.isOpened = false;
        this.element.querySelector('.dropdown__drop').classList.remove('dropdown__drop__active');
    }

    setText(text) {
        this.element.querySelector('.dropdown__label__text').textContent = text;
    }
}