import Base from "../base.js";

import Card from "../../components/card/card.js";

export default class MainPage extends Base {
    constructor(context = {}) {
        super('Главная', context, null);
        this.template = Handlebars.templates['main.hbs'];
    }

    render() {
        const response = [
            {
                id: '1',
                imgSrc: './././static/img/img5.jpg',
                pubDate: '13.09.2020'
            },
            {
                id: '2',
                imgSrc: './././static/img/img6.jpg',
                pubDate: '01.09.2020'
            },
            {
                id: '3',
                imgSrc: './././static/img/img7.jpg',
                pubDate: '02.10.2020'
            },
            {
                id: '4',
                imgSrc: './././static/img/img8.jpg',
                pubDate: '29.09.2020'
            },
            {
                id: '5',
                imgSrc: './././static/img/img9.jpg',
                pubDate: '30.09.2020'
            },
            {
                id: '6',
                imgSrc: './././static/img/img10.jpg',
                pubDate: '30.09.2020'
            },
            {
                id: '7',
                imgSrc: './././static/img/img11.jpg',
                pubDate: '30.09.2020'
            },
            {
                id: '8',
                imgSrc: './././static/img/img12.jpg',
                pubDate: '30.09.2020'
            },
            {
                id: '9',
                imgSrc: './././static/img/img13.jpg',
                pubDate: '30.09.2020'
            },
            {
                id: '10',
                imgSrc: './././static/img/img14.jpg',
                pubDate: '30.09.2020'
            },
            {
                id: '11',
                imgSrc: './././static/img/img15.jpg',
                pubDate: '30.09.2020'
            },
            {
                id: '12',
                imgSrc: './././static/img/img3.jpg',
                pubDate: '30.09.2020'
            },
        ]

        let list = [];

        for (let i = 0; i < response.length; i++) {
            const card = new Card(response[i]);
            list.push(card.render());
        }

        const data = {
            pins: list,
        }

        this.fillWith(data);

        super.render()
    }
}
