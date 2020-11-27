import template from "./board.hbs";

import BaseView from "../BaseView.js";
import Cardd from "../../components/card/cardd";


export default class BoardPage extends BaseView {
    constructor(context = {}) {
        super('Доска пользователя', context, null);
        this.template = template;
    }

    render() {
        let list = [];
        if (this.context.pins) {
            this.context.pins.forEach((pin) => {
                const card = new Cardd(pin);
                list.push(card.render());
            });
        }

        const data = {
            ...this.context,
            pins: list,
        }

        this.fillWith(data);
        super.render();
    }
}