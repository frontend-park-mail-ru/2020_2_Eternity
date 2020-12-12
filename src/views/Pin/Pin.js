import template from "./Pin.hbs";

import BaseView from "../BaseView.js";

import Textarea from "../../components/Textarea/Textarea";
import Button from "../../components/Button/Button";
import Comment from "../../components/Comment/Comment";
import Avatar from "../../components/Avatar/Avatar";
import Dropdown from "../../components/Dropdown/Dropdown";

import EventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";
import {Icons} from "../../modules/consts/icons";
import List from "../../components/List/List";
import Validator from "../../modules/tools/Validator";


export default class PinPage extends BaseView {
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
        const authorAvatar = new Avatar({
            img_link: '/img/img5.jpg',
            id: 'authorAvatar',
            mini: true,
        })
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
        this.btnBoard = new Button({
            id: 'btnBoard',
            text: Icons.add,
            customButton: 'btn_with-icon btn_round',
            activates: true,
            idToActivate: this.dropdown.context.id,
        })
        this.comments = new List({
            id: 'commentList',
            custom: 'pin__comments',
            placeholder: '<div class="pin__comments__empty"><p> Еще никто не прокомментировал этот пин </p></div>'
        })

        let comments = [];
        if (this.context.commentList) {
            this.context.commentList.forEach((c) => {
                c.username = c.Username;
                const nc = new Comment(c);
                comments.push(nc);
            })
        }
        this.comments.formContentFromListObjects(comments);

        const data = {
            ...this.context,
            authorAvatar: authorAvatar.render(),
            input: this.userComment.render(),
            btnComment: this.btnComment.render(),
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
            this.btnComment.element.addEventListener('click', this.onAddComment);
        }
    }

    change() {

    }

    addCommentToList(data = {}) {
        const nc = new Comment(data);
        nc.context.username = nc.context.Username;
        this.comments.addItem(nc);
        this.userComment.clear();
    }
}