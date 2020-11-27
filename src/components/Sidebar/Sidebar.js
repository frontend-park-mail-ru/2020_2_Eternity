import template from "./Sidebar.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Sidebar extends BaseComponent {
    aside
    toggler

    constructor(context = {}) {
        super(template, context);
        this.startListeners();
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
    rotateToggler() {
        if (this.toggler) {
            this.toggler.firstElementChild.classList.toggle('rotate');
        }
    }
}