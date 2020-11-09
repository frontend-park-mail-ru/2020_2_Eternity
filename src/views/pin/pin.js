import template from "./pin.hbs";

import BaseView from "../BaseView.js";

import Textarea from "../../components/input/textarea/textarea.js";
import Button from "../../components/button/button.js";
import Comment from "../../components/comment/comment.js";

import EventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";
import Select from "../../components/select/select";

export default class PinPage extends BaseView {
    userComment
    btnComment

    constructor(context = {}) {
        super('Просмотр пина', context, null);
        this.template = template;
        this.context.commentList = [];
    }

    render() {
        this.userComment = new Textarea({
            id: 'userComment',
            class: 'form__input',
            maxLength: 250,
            rows: 3,
        })

        this.btnComment = new Button({
            id: 'btnComment',
            btnText: 'Отправить',
            type: 'submit'
        })

        let comments = [];

        this.context.commentList.forEach((comment) => {
            const c = new Comment(comment);
            comments.push(c.render());
        })


        let options = [];
        if (this.context.options) {
            this.context.options.forEach((option) => {
                options.push({title: option.title, id: option.id});
            });
        }

        const select = new Select({
            id: 'select',
            placeholder: 'Доступные доски',
            options: options,
        })

        const attachBtn = new Button({
            id: 'attachPin',
            btnText: '+',
            type: 'submit'
        });

        const data = {
            ...this.context,
            input: this.userComment.render(),
            btnComment: this.btnComment.render(),
            commentListRendered: comments,
            select: select.render(),
            btnAttach: attachBtn.render()
        }

        this.fillWith(data);
        super.render();

        if (this.context.show) {
            select.bind();

            attachBtn.element.addEventListener('click', () => {
                select.getSelectedValues().forEach((value) => {
                    EventBus.emit(Events.pinAttach, {pin_id: this.context.id, board_id: value});
                });
            })
        }

        // TODO: где и как биндить по человечески?

        if (this.context.auth) {
            this.btnComment.element.addEventListener('click', () => {
                const data = {
                    is_root: true,
                    content: this.userComment.value,
                    // TODO: господи уберите id и дайте норм ключи
                    pin_id: this.context.id,
                }
                EventBus.emit(Events.pinComment, data)
            });
        }
    }

    addCommentToList(data = {}) {
        const newComment = new Comment(data);
        this.context.commentListRendered.unshift(newComment.render());

        let result = '';
        this.context.commentListRendered.forEach((elem) => {
            result += elem;
        })
        document.getElementById('commentList').innerHTML = result;

        this.userComment.clear();
    }
}