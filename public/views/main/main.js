import Base from "../base.js";

import Card from "../../components/card/card.js";
import Navbar from "../../components/navbar/navbar.js";

import Request from "../../modules/request/request.js";


export default class MainPage extends Base {
    constructor(context = {}) {
        super('Главная', context, null);
        this.template = Handlebars.templates['main.hbs'];
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
    }
}





// let pins = []
// for (let i = 0; i < responseJSON.length; i++) {
//     pins.push({
//         id: responseJSON[i]['id'],
//         pubData: '07.10.2020',
//         imgSrc: 'http://127.0.0.1:8008' + responseJSON[i]['img_link']
//     })
// }