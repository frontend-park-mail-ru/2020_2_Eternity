import template from "./select.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Select extends BaseComponent {
    map;

    constructor(context = {}) {
        super(template, context);

        this.map = new Map();
        this.context.options.forEach((value) => {
            this.map.set(value.title, value.id);
        });
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
        let values = Array.from(selected).map((element) => element.textContent);

        let result = [];
        values.forEach((value) => {
            result.push(this.map.get(value));
        });
        return result;
    }

}