import template from "./select.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Select extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }

    bind() {
        document.getElementById('show').addEventListener('click', (event) => {
            document.getElementById('list').classList.toggle('no-display');
        })

        document.getElementById(this.context.id).addEventListener('click', (event) => {
            event.target.classList.toggle('checked');
        })
    }

    getSelectedValues() {
        const selected = document.querySelectorAll('li.checked');
        return Array.from(selected).map((element) => element.textContent);
    }

}