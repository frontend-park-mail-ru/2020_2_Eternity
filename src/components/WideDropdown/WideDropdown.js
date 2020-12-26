import template from "./WideDropdown.hbs"

import BaseComponent from "../BaseComponent.js";
import List from "../List/List";
import {Icons} from "../../modules/consts/icons";
import Dropdown from "../Dropdown/Dropdown";

export default class WideDropdown extends BaseComponent {
    countSaved
    isSaved
    isOpened
    list

    constructor(context = {}) {
        super(template, context);
        this.countSaved = 0;
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
        this.countSaved++;
        this.element.querySelector('.dropdown__label__saved').classList.add('dropdown__label__saved_active')
    }
    decSaved() {
        this.countSaved--;

        if (this.countSaved > 1) {
            this.element.querySelector('.dropdown__label__saved').textContent = `Сохранено на еще ${this.countSaved - 1}`
        }
        if (this.countSaved === 0) {
            this.element.querySelector('.dropdown__label__saved').classList.remove('dropdown__label__saved_active')
        }
        if (this.countSaved === 1) {
            this.element.querySelector('.dropdown__label__saved').textContent = 'Сохранено на доске'
        }
    }
    clearSaved() {
        this.isSaved = false;
        this.element.querySelector('.dropdown__label__saved').classList.remove('dropdown__label__saved_active')
    }
    setCountSaved(count) {
        this.isSaved = true;
        this.countSaved = count;
        this.element.querySelector('.dropdown__label__saved').textContent = `Сохранено на еще ${--count}`
        this.element.querySelector('.dropdown__label__saved').classList.add('dropdown__label__saved_active')
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