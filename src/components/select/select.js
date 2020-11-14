import template from "./select.hbs"

import BaseComponent from "../BaseComponent.js";

import EventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";

export default class Select extends BaseComponent {
    map;

    constructor(context = {}) {
        super(template, context);

        this.map = new Map();
        this.context.options.forEach((value) => {
            this.map.set(value.title, value.id);
        });


    }

    bind(pinId) {
        document.getElementById('dropdown').addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            document.querySelector('.dropdown-el').classList.toggle('expanded');
        })

        document.getElementById('dropdown-list').addEventListener('click', (event) => {
            if (!event.target.closest('li.select__list__item').classList.contains('checked')) {
                event.target.closest('li.select__list__item').classList.add('checked');
                EventBus.emit(Events.pinAttach, {pin_id: pinId, board_id: parseInt(event.target.value, 10)});
            }
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