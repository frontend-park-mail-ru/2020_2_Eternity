import template from "./navbar.hbs"

import BaseComponent from "../base_component.js";

export default class Navbar extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }

    get logoutLink() {
        return document.getElementById('logout');
    }
}