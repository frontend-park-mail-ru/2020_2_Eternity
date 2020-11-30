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


export default class PinPage extends BaseView {
    userComment
    btnComment
    btnBoard
    dropdown
    comment

    constructor(context = {}) {
        super('Просмотр пина', context, null);
        this.template = template;
        this.context.commentList = [];
        this.commentListRendered = [];
    }

    render() {
        console.log(this.context)

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
            label: 'Добавить комментарий'
        })
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

        this.comment = new Comment();
        let comments = [];
        this.context.commentList.forEach((c) => {
            c.username = c.Username;
            this.comment.context = c;
            comments.push(this.comment.render());
        })

        // let options = [];
        // if (this.context.options) {
        //     this.context.options.forEach((option) => {
        //         options.push({title: option.title, id: option.id});
        //     });
        // }
        // const select = new Select({
        //     id: 'select',
        //     placeholder: 'Доступные доски',
        //     options: options,
        // })

        const data = {
            ...this.context,
            authorAvatar: authorAvatar.render(),
            input: this.userComment.render(),
            btnComment: this.btnComment.render(),
            btnBoard: this.btnBoard.render(),
            dropdown: this.dropdown.render(),
            commentListRendered: comments,
        }

        this.fillWith(data);
        super.render();

        // if (this.context.show) {
        //     select.bind(this.context.id);
        // }

        // TODO: где и как биндить по человечески?
        if (this.context.auth) {
            this.btnComment.element.addEventListener('click', () => {
                const data = {
                    is_root: true,
                    content: this.userComment.value,
                    pin_id: this.context.id,
                }
                EventBus.emit(Events.pinComment, data)
            });
        }
    }

    addCommentToList(data = {}) {
        this.comment.context = data;
        this.comment.context.username = this.comment.context.Username;
        this.context.commentListRendered.push(this.comment.render());
        let li = document.createElement('li');
        let ul = document.getElementById('commentList')
        li.innerHTML = this.comment.render();
        ul.append(li);
        this.userComment.clear();
    }
}