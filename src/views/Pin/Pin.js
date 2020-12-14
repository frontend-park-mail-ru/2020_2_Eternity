import template from "./Pin.hbs";

import BaseView from "../BaseView.js";

import Textarea from "../../components/Textarea/Textarea";
import Button from "../../components/Button/Button";
import Comment from "../../components/Comment/Comment";
import Avatar from "../../components/Avatar/Avatar";
import Dropdown from "../../components/Dropdown/Dropdown";
import Image from "../../components/Image/Image";
import List from "../../components/List/List";

import {Icons} from "../../modules/consts/icons";
import Validator from "../../modules/tools/Validator";


export default class PinPage extends BaseView {
    pinImg
    userComment
    btnComment

    btnBoard
    dropdown

    comments

    constructor(context = {}) {
        super('Просмотр пина', context, null);
        this.template = template;
    }

    render() {
        this.dropdown = new Dropdown({
            id: 'boardList',
            title: 'Доступные доски',
        });
        this.btnBoard = new Button({
            id: 'btnBoard',
            text: Icons.add,
            customButton: 'btn_with-icon btn_round',
            activates: true,
            idToActivate: this.dropdown.context.id,
        })

        this.pinImg = new Image({
            id: 'pinImg',
            src: this.context.img_link,
        })
        const authorAvatar = new Avatar({
            img_link: '',
            mini: true,
            custom: 'load-animation',
        })

        this.comments = new List({
            id: 'commentList',
            custom: 'pin__comments',
            placeholder: '<div class="pin__comments__empty"><p> Еще никто не прокомментировал этот пин </p></div>'
        })

        const data = {
            ...this.context,
            pinImg: this.pinImg.render(),

            pinTitle: this.createPinTitle().outerHTML,
            pinAuthor: this.createPinAuthor(authorAvatar).outerHTML,
            pinDescr: this.createPinDescr().outerHTML,

            btnBoard: this.btnBoard.render(),
            dropdown: this.dropdown.render(),
            list: this.comments.render(),
        }

        this.fillWith(data);
        super.render();

        // if (this.context.show) {
        //     select.bind(this.context.id);
        // }

        if (this.context.auth) {

        }
    }

    createPinTitle() {
        const node = document.createElement('h2');
        node.className = 'pin__info__title load-animation load-animation_short';
        return node;
    }
    createPinAuthor(authorAvatar) {
        const node = document.createElement('a');
        node.className = 'pin__info__author';
        node.href = '';

        const innerSpan = document.createElement('span');
        innerSpan.className = 'load-animation load-animation_short';

        node.insertAdjacentHTML('afterbegin', authorAvatar.render());
        node.insertAdjacentElement('beforeend', innerSpan);

        return node;
    }
    createPinDescr() {
        const node = document.createElement('p');
        node.className = 'pin__info__description load-animation';
        return node;
    }

    changePinTitle(title) {
        const curr = document.querySelector('.pin__info__title');
        curr.className = 'pin__info__title';
        curr.innerText = title;
    }
    // TODO: когда бэк будет отдавать автора с пином, поменять username
    changePinAuthor(avatar, username='example') {
        const curr = document.querySelector('.pin__info__author');
        curr.innerHTML = avatar.render();
        curr.insertAdjacentText('beforeend', username);
    }
    changePinDescription(content) {
        const curr = document.querySelector('.pin__info__description');
        curr.className = 'pin__info__description';
        curr.innerText = content;
    }

    load(data={}) {
        this.pinImg.show(data.img_link);
        this.pinImg.element.parentElement.classList.remove('load-animation');

        const authorAvatar = new Avatar({
            img_link: '/img/img11.jpg',
            // img_link: data.img_link,
            mini: true,
        })
        this.changePinTitle(data.title);
        this.changePinAuthor(authorAvatar, data.username);
        this.changePinDescription(data.content);

        // TODO: наверное такое надо чекать через роутер из localstorage и рендерить уже с ними, с auth
        if (this.context.auth) {
            this.userComment = new Textarea({
                id: 'userComment',
                customInput: 'input-group__field_noresize',
                maxLength: 250,
                rows: 2,
                label: 'Добавить комментарий',
                noMessageForError: true,
            }, Validator.validateAlphaField)
            this.btnComment = new Button({
                id: 'btnComment',
                text: Icons.send,
                customButton: 'btn_with-icon btn_round',
                type: 'submit'
            })

            const commentArea = document.querySelector('.pin__form');
            commentArea.innerHTML = this.userComment.render();
            commentArea.insertAdjacentHTML('beforeend', this.btnComment.render());
            this.btnComment.element.addEventListener('click', this.onAddComment);
        }
    }

    loadComments(data) {
        let comments = [];
        if (data) {
            data.forEach((c) => {
                c.username = c.Username;
                const nc = new Comment(c);
                comments.push(nc);
            })
        }
        this.comments.formContentFromListObjects(comments);
    }

    addCommentToList(data = {}) {
        const nc = new Comment(data);
        nc.context.username = nc.context.Username;
        this.comments.addItem(nc);
        this.userComment.clear();
    }
}