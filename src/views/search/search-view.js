import template from './search-view.hbs'

import BaseView from "../BaseView.js";

import Input from "../../components/input/input.js";
import Card from "../../components/card/card.js";

import {fakePins} from "../../modules/consts/fake.js";
import Button from "../../components/button/button";

export default class SearchView extends BaseView {
    constructor(context = {}) {
        super('Поиск', context, null);
        this.template = template;
    }

    render() {
        let list = [];
        fakePins.forEach((pin) => {
            const card = new Card(pin);
            list.push(card.render());
        });
        const input = new Input({
            id: 'search',
            type: 'text',
            customClasses: 'form__input',
        })
        const btn = new Button({
            btnText: 'Искать',
        })

        const data = {
            pins: list,
            input: input.render(),
            btn: btn.render(),
        }

        this.fillWith(data);
        super.render()
    }
}
