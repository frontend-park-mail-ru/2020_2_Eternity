import template from "./Sidebar.hbs"

import BaseComponent from "../BaseComponent.js";
import List from "../List/List";

export default class Sidebar extends BaseComponent {
    aside
    toggler
    list

    constructor(context = {}) {
        super(template, context);
        this.context.expand = true; // по умолчанию раскрыт
    }

    render() {
        this.list = new List({
            custom: 'sidebar__list',
            id: 'sidebar-content',
        }, {selectable: this.context.listtype})
        this.context.list = this.list.render();
        return super.render();
    }

    expandOnToggler() {
        this.expand();
        this.rotateToggler();

        const parentContainer = this.aside.parentElement;
        if (parentContainer) {
            this.aside.nextElementSibling.classList.toggle('content__expand');
        }
    }

    getAside() {
        if (this.element) {
            this.toggler = document.getElementById('sidebar-toggler');
            this.aside = this.toggler.closest('aside');
        }
    }

    expand() {
        if (this.aside) {
            this.aside.classList.toggle('expand');
        }
    }
    deleteExpand() {
        this.getAside();
        if (this.aside) {
            this.aside.classList.remove('expand');
            this.toggler.querySelector('.sidebar__toggler__icon').classList.add('rotate');
        }
    }
    addExpand() {
        this.getAside();
        if (this.aside) {
            this.aside.classList.add('expand');
            this.toggler.querySelector('.sidebar__toggler__icon').classList.remove('rotate');
        }
    }

    rotateToggler() {
        if (this.toggler) {
            this.toggler.firstElementChild.classList.toggle('rotate');
        }
    }

    addItem(itemObject, order) {
        this.list.addItem(itemObject, order);
    }
    formContent(list) {
        this.list.formContentFromListObjects(list);
    }

    // replaceItem(id, newRendered, newValue) {
    //     const newItem = this.createItem(newRendered, newValue)
    //     if (this.findItemById(id)) {
    //         document.getElementById(id).parentElement.outerHTML = newItem.outerHTML;
    //     }
    // }
}