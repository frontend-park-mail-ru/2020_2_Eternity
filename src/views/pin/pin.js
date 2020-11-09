import template from "./pin.hbs";

import BaseView from "../BaseView.js";

import Textarea from "../../components/input/textarea/textarea.js";
import Button from "../../components/button/button.js";
import Comment from "../../components/comment/comment.js";

import EventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";

export default class PinPage extends BaseView {
    userComment
    btnComment

    constructor(context={}) {
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

        const data = {
            ...this.context,
            input: this.userComment.render(),
            btnComment: this.btnComment.render(),
            commentList: comments,
        }

        this.fillWith(data);
        super.render();

        // TODO: где и как биндить по человечески?
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

    addCommentToList(data={}) {
        const newComment = new Comment(data);
        this.context.commentList.unshift(newComment.render());

        let result = '';
        this.context.commentList.forEach((elem) => {
            result += elem;
        })
        document.getElementById('commentList').innerHTML = result;

        this.userComment.clear();
    }
}