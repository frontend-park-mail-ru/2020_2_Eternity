import template from "./Sidebar.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Sidebar extends BaseComponent {
    aside
    toggler

    constructor(context = {}) {
        super(template, context);
        this.startListeners();
        this.context.expand = true; // по умолчанию раскрыт
    }

    startListeners() {
        document.addEventListener('click', this.expandOnTogglerClickBind.bind(this));
        document.addEventListener('click', this.stretchContentIfInParentBind.bind(this));
    }

    checkTogglerClick(event) {
        if (event.target instanceof SVGElement && event.target.closest('#sidebar-toggler')) {
            event.preventDefault();
            this.toggler = document.getElementById('sidebar-toggler');
            this.aside = this.toggler.closest('aside');
            return true;
        }
        return false;
    }

    expandOnTogglerClickBind(event) {
        if (this.checkTogglerClick(event)) {
            this.expand();
            this.rotateToggler();
        }
    }
    stretchContentIfInParentBind(event) {
        if (this.checkTogglerClick(event)) {
            const parentContainer = this.aside.parentElement;
            if (parentContainer) {
                this.aside.nextElementSibling.classList.toggle('content__expand');
            }
        }
    }

    expand() {
        if (this.aside) {
            this.aside.classList.toggle('expand');
        }
    }

    getAside() {
        if (this.element) {
            this.toggler = document.getElementById('sidebar-toggler');
            this.aside = this.toggler.closest('aside');
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

    /**
     * Добавляет в список новый элемент
     * @param rendered - component.render()
     */
    addItem(rendered) {
        this.getAside();
        if (this.aside) {
            const list = this.aside.querySelector('.sidebar__list');
            let item = document.createElement('li');
            item.classList.add('sidebar__list__item');
            item.innerHTML = rendered;
            list.append(item);
        }
    }
}