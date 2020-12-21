import template from "./Board.hbs";

import BaseView from "../BaseView.js";

import Card from "../../components/Card/Card";
import List from "../../components/List/List";
import Link from "../../components/Link/Link";


export default class BoardPage extends BaseView {
    desk

    constructor(context = {}) {
        super('Доска пользователя', context, null);
        this.template = template;
    }

    render() {
        const data = {
            ...this.context,
            title: this.createLoadingText('h2').outerHTML,
            author: this.createLoadingText('p').outerHTML,
            content: this.createLoadingDescr().outerHTML,
            list: '<div class="chat__window__messages__help">Пользователь еще не прикрепил пины к этой доске</div>',
        }

        this.fillWith(data);
        super.render();
    }

    createLoadingText(tag) {
        const node = document.createElement(tag);
        node.className = 'load-animation load-animation_short';
        return node;
    }
    createLoadingDescr() {
        const node = document.createElement('p');
        node.className = 'load-animation';
        node.style.display = 'block'
        node.style.minHeight = '1.7rem';
        node.style.width = '100%';
        return node;
    }

    load(data={}) {
        const node = document.querySelector('.board__info');
        const [title, author, descr] = node.children;
        console.log(data)
        title.textContent = data.title;
        title.className = 'board__info__title';

        author.innerHTML = new Link({
            href: '/@' + data.username,
            text: '@' + data.username,
        }).render();
        author.className = 'board__info__descr';

        descr.textContent = data.content;
        descr.className = 'board__info__descr';

        if (data.pins) {
            this.desk = new List({
                id: 'desk-content',
                custom: 'desk__grid',
                customItem: 'desk__grid__item',
            })
            document.querySelector('.board__content').innerHTML = this.desk.render();

            let list = [];
            data.pins.forEach((pin) => {
                const nc = new Card(pin);
                list.push(nc);
            });
            this.desk.formContentFromListObjects(list);
        }
    }
}