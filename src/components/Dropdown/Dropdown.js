import template from "./Dropdown.hbs"

import BaseComponent from "../BaseComponent.js";
import List from "../List/List";

export default class Dropdown extends BaseComponent {
    isOpened
    origin
    dropdown
    list

    constructor(context = {}) {
        super(template, context);

        const defaultConfig = {
            linkAttributeName: 'data-activates',
        }
        this.settings = Object.assign(defaultConfig, context);
        if (this.settings.linkAttributeName) {
            this.init();
        }
        this.list = new List({
            custom: 'dropdown ' + this.context.custom,
            id: this.context.id,
            placeholder: this.context.placeholder ? this.context.placeholder : 'Пусто',
        }, {selectable: this.context.listtype})

        this.closeOnClickOutside = this.closeOnClickOutsideBind.bind(this);
    }

    init() {
        this.isOpened = false;
        this.origin = null;
        this.dropdown = null;
    }

    render() {
        this.context = {
            ...this.context,
            list: this.list.render(),
        }
        return super.render();
    }

    startListeners() {
        // document.addEventListener('click', this.closeOnClickOutside);
        // this.selectItemOnClickBind();
    }
    removeListeners() {
        document.removeEventListener('click', this.closeOnClickOutside);
    }

    closeOnClickOutsideBind(event) {
        if (this.isOpened && (!event.target.closest('.dropdown') || !(event.target instanceof HTMLElement))) {
            this.hide();
        }
    }

    getPositionByOrigin() {
        const position = this.origin.getBoundingClientRect();
        if (document.documentElement.clientWidth - position.x < 210) {
            position.x = position.x - 210 + this.origin.offsetWidth;
        }
        if (document.documentElement.clientHeight - position.y < 150) {
            position.y = position.y - 140 ;
        }
        getComputedStyle(this.origin, null).position !== 'fixed' ?
            this.dropdown.style.top = position.y + window.scrollY + 'px' : this.dropdown.style.top = position.y + 'px';
        this.dropdown.style.left = position.x + 'px';
    }

    show() {
        this.getPositionByOrigin()
        if (this.dropdown && !this.isOpened) {
            this.dropdown.classList.add('dropdown__active');
            this.isOpened = true;
        }
        this.startListeners();
    }

    hide() {
        if (this.dropdown && this.isOpened) {
            this.dropdown.scrollTo(0,0)
            this.flushSelectedItems();
            this.dropdown.classList.remove('dropdown__active');
            this.isOpened = false;
        }
        this.removeListeners();
    }

    flushSelectedItems() {
        this.list.flushSelectedItems();
    }
    getSelectedItems() {
        return this.list.getSelectedItems();
    }

    /**
     * Устанавливает выделение итемов списка (Input.checked = true) по массиву значений
     * (эти значения содержат в себе Input)
     * @param itemsForSelect - [:id(num)]
     */
    setSelectedItems(itemsForSelect) {
        this.list.setSelectedItems(itemsForSelect);
    }

    addToContent(itemObject, order) {
        this.list.addItem(itemObject, order);
    }

    formContent(list) {
        this.list.formContentFromListObjects(list);
    }
}