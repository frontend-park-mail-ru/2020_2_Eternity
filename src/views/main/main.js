import template from './main.hbs'

import Base from "../base.js";

import Card from "../../components/card/card.js";
import Navbar from "../../components/navbar/navbar.js";

import eventBus from "../../modules/tools/eventBus.js";
import {Events} from "../../modules/consts/events.js";


export default class MainPage extends Base {
    constructor(context = {}) {
        super('Главная', context, null);
        this.template = template;
    }


    render() {
        const nav = new Navbar();

        let list = [];
        this.context.pins.forEach((pin) => {
            const card = new Card(pin);
            list.push(card.render());
        });

        const data = {
            navbar: nav.render(),
            pins: list,
        }

        this.fillWith(data);
        super.render()

        nav.logoutLink.addEventListener('click', () => {
            eventBus.emit(Events.userLogout, {});
        });
    }
}
