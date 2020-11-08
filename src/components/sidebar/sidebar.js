import template from "./sidebar.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Sidebar extends BaseComponent {
    aside
    toggler

    constructor(context = {}) {
        super(template, context);
    }

    expand() {
        this.aside.classList.toggle('expand');
    }
    rotateToggler() {
        this.toggler.firstChild.classList.toggle('rotate');
    }

    bindToggler() {
        this.toggler = document.getElementById('sidebar-toggler');
        this.aside = document.querySelector('aside');
        this.toggler.addEventListener('click', (event) => {
            event.preventDefault();
            this.expand();
            this.rotateToggler();
        });
    }
}