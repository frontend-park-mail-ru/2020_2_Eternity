import template from "./pin.hbs";

import BaseView from "../BaseView.js";

import Textarea from "../../components/input/textarea/textarea.js";
import Comment from "../../components/Comment/Comment.js";

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
        this.commentListRendered = [];
    }

    render() {
        this.userComment = new Textarea({
            id: 'userComment',
            class: 'form__input',
            maxLength: 250,
            rows: 2,
            placeholder: 'Добавить комментарий'
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

        const data = {
            ...this.context,
            input: this.userComment.render(),
            btnComment: this.btnComment.render(),
            commentListRendered: comments,
            select: select.render(),
        }

        this.fillWith(data);
        super.render();

        if (this.context.show) {
            select.bind(this.context.id);
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
        this.context.commentListRendered.push(newComment.render());

        let result = '';
        this.context.commentListRendered.forEach((elem) => {
            result += elem;
        })
        document.getElementById('commentList').innerHTML = result;

        this.userComment.clear();
    }
}