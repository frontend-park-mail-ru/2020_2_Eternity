import template from "./main.hbs"

import Base from "../base.js";

import Card from "../../components/card/card.js";

import Request from "../../modules/request/request.js";

export default class MainPage extends Base {
    constructor(context = {}) {
        super('Главная', context, null);
        this.template = template;
    }

    render() {
        const fakePins = [
            {
                id: '1',
                imgSrc: '/img/img5.jpg',
                pubDate: '13.09.2020'
            },
            {
                id: '2',
                imgSrc: '/img/img6.jpg',
                pubDate: '01.09.2020'
            },
            {
                id: '3',
                imgSrc: '/img/img7.jpg',
                pubDate: '02.10.2020'
            },
            {
                id: '4',
                imgSrc: '/img/img8.jpg',
                pubDate: '29.09.2020'
            },
            {
                id: '5',
                imgSrc: '/img/img9.jpg',
                pubDate: '30.09.2020'
            },
            {
                id: '6',
                imgSrc: '/img/img10.jpg',
                pubDate: '30.09.2020'
            },
            {
                id: '7',
                imgSrc: '/img/img11.jpg',
                pubDate: '30.09.2020'
            },
            {
                id: '8',
                imgSrc: '/img/img12.jpg',
                pubDate: '30.09.2020'
            },
            {
                id: '9',
                imgSrc: '/img/img13.jpg',
                pubDate: '30.09.2020'
            },
            {
                id: '10',
                imgSrc: '/img/img14.jpg',
                pubDate: '30.09.2020'
            },
            {
                id: '11',
                imgSrc: '/img/img15.jpg',
                pubDate: '30.09.2020'
            },
            {
                id: '12',
                imgSrc: '/img/img1.jpg',
                pubDate: '30.09.2020'
            },
            {
                id: '13',
                imgSrc: '/img/img2.jpg',
                pubDate: '30.09.2020'
            },
            {
                id: '14',
                imgSrc: '/img/img3.jpg',
                pubDate: '30.09.2020'
            },
            {
                id: '15',
                imgSrc: '/img/img4.jpg',
                pubDate: '30.09.2020'
            },
        ]

        let list = [];

        for (let i = 0; i < fakePins.length; i++) {
            const card = new Card(fakePins[i]);
            list.push(card.render());
        }

        const data = {
            pins: list,
        }

        this.fillWith(data);

        super.render()
    }
}


/*
Request.getPin().then((response) => {
            return response.json()
        }).then((responseJSON) => {
            let pins = []
            console.log(responseJSON)

            for (let i = 0; i < responseJSON.length; i++) {
                pins.push({
                    id: responseJSON[i]['id'],
                    pubData: '07.10.2020',
                    imgSrc: 'http://127.0.0.1:8008' + responseJSON[i]['img_link']
                })
            }

            const fakePins = [
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
                    imgSrc: './././static/img/img1.jpg',
                    pubDate: '30.09.2020'
                },
                {
                    id: '13',
                    imgSrc: './././static/img/img2.jpg',
                    pubDate: '30.09.2020'
                },
                {
                    id: '14',
                    imgSrc: './././static/img/img3.jpg',
                    pubDate: '30.09.2020'
                },
                {
                    id: '15',
                    imgSrc: './././static/img/img4.jpg',
                    pubDate: '30.09.2020'
                },
            ]

            let list = [];

            for (let i = 0; i < pins.length; i++) {
                const card = new Card(pins[i]);
                list.push(card.render());
            }


            for (let i = 0; i < fakePins.length; i++) {
                const card = new Card(fakePins[i]);
                list.push(card.render());
            }

            const data = {
                pins: list,
            }

            this.fillWith(data);

            super.render()
        })
 */