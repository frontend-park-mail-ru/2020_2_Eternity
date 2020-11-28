import template from "./Board.hbs";

import BaseView from "../BaseView.js";
import Card from "../../components/Card-NEEDRENAME/Card";


export default class BoardPage extends BaseView {
    renderedPins

    constructor(context = {}) {
        super('Доска пользователя', context, null);
        this.template = template;
    }

    render() {
        let list = [];
        this.pinCard = new Card();

        if (this.context.pins) {
            this.context.pins.forEach((pin) => {
                this.pinCard.context = pin;
                list.push(this.pinCard.render());
                this.renderedPins = list;
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