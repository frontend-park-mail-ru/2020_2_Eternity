import template from './search-view.hbs'

import BaseView from "../BaseView.js";

import Input from "../../components/input/input.js";
import Cardd from "../../components/card/cardd.js";

import {fakePins} from "../../modules/consts/fake.js";

export default class SearchView extends BaseView {
    constructor(context = {}) {
        super('Поиск', context, null);
        this.template = template;
    }

    render() {
        let list = [];
        fakePins.forEach((pin) => {
            const card = new Cardd(pin);
            list.push(card.render());
        });
        const input = new Input({
            id: 'search',
            type: 'text',
            customClasses: 'form__input',
        })

        const data = {
            pins: list,
            input: input.render(),
        }

        this.fillWith(data);
        super.render()
    }
}
