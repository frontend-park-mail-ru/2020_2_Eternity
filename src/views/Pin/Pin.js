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
import Link from "../../components/Link/Link";
import Popup from "../../components/Popup/Popup";
import ReportForm from "../../components/ReportForm/ReportForm";


export default class PinPage extends BaseView {
    pinImg
    userComment
    btnComment

    dropdown
    reportForm

    btnAction
    dropAction
    linkReport
    reportFormComponent
    linkDownload

    btnShare
    dropShare

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

        /**
         * ACTION DROPDOWN
         * REPORT FORM
         */
        this.btnAction = new Button({
            id: 'btnAction',
            text: Icons.dots,
            customButton: 'btn_with-icon btn_round btn_round_middle',
            dataAttr: 'data-activates="dropAction"'
        })
        this.dropAction = new Dropdown({
            id: 'dropAction',
            customItem: 'create__link'
        })
        this.linkReport = new Link({
            id: 'linkReport',
            text: 'Пожаловаться',
            dataAttr: 'data-popup="#reportForm"'
        })
        this.linkDownload = new Link({
            id: 'linkDownload',
            text: 'Скачать',
        })
        this.dropAction.formContent([this.linkReport, this.linkDownload])
        this.reportForm = new Popup({
            id: 'reportForm',
        })
        this.reportFormComponent = new ReportForm();
        this.reportForm.formContent(this.reportFormComponent.render());

        /**
         * SHARE DROPDOWN
         */
        this.btnShare = new Button({
            id: 'btnShare',
            text: Icons.share,
            customButton: 'btn_with-icon btn_round btn_round_middle',
            dataAttr: 'data-activates="dropShare"'
        })
        this.dropShare = new Dropdown({
            id: 'dropShare',
            custom: 'share',
            customItem: 'share__social'
        })
        const socialLinks = {
            vk: 'https://vk.com/share.php?url={url}&title={title}',
            facebook: 'https://www.facebook.com/sharer.php?u={url}',
            twitter: 'https://twitter.com/intent/tweet?url={url}&text={title}',
            telegram: 'https://t.me/share/url?url={url}&text={title}',
        }
        let social = [];
        Object.entries(socialLinks).forEach(([key, value]) => {
            const l = new Link({
                target: '_blank',
                dataAttr: 'data-activates=""',
                href:  value.replace('{url}', encodeURIComponent(window.location.origin + window.location.pathname))
                            .replace('{title}', encodeURIComponent(this.title)),
                text: Icons[key]
            })
            social.push(l);
        })
        const h = document.createElement('h3');
        h.textContent = 'Поделиться пином';
        h.className = 'share__title';
        this.dropShare.formContent(social);

        const data = {
            ...this.context,
            pinImg: this.pinImg.render(),

            pinTitle: this.createPinTitle().outerHTML,
            pinAuthor: this.createPinAuthor(authorAvatar).outerHTML,
            pinDescr: this.createPinDescr().outerHTML,

            dropdown: this.dropdown.render(),
            list: this.comments.render(),

            btnAction: this.btnAction.render(),
            dropAction: this.dropAction.render(),
            reportForm: this.reportForm.render(),

            btnShare: this.btnShare.render(),
            dropShare: this.dropShare.render(),
        }

        this.fillWith(data);
        super.render();
        this.dropShare.list.element.insertAdjacentElement('afterbegin', h);

        // if (this.context.show) {
        //     select.bind(this.context.id);
        // }

        this.btnAction.element.addEventListener('click', this.onShowActionsDropdown);
        this.btnShare.element.addEventListener('click', this.onShowShareDropdown);
        this.linkReport.element.addEventListener('click', this.onShowReportForm);
        this.reportFormComponent.btnReport.element.addEventListener('click', this.onSendReport);

        this.socials = this.dropShare.element.querySelectorAll('a')
        this.socials.forEach((sl) => sl.addEventListener('click', this.onShare));
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

    changePinAuthor(avatar, username) {
        const curr = document.querySelector('.pin__info__author');
        curr.setAttribute('href', '/@' + username);
        curr.innerHTML = avatar.render();
        curr.insertAdjacentText('beforeend', username);
    }
    changePinDescription(content) {
        const curr = document.querySelector('.pin__info__description');
        curr.className = 'pin__info__description';
        curr.innerText = content;
    }

    load(data={}) {
        this.context.info = data;

        this.pinImg.show(data.img_link);
        this.pinImg.element.parentElement.classList.remove('load-animation');
        this.linkDownload.element.setAttribute('href', data.img_link);
        const filename = data.img_link.trim().split('/').pop();
        this.linkDownload.element.setAttribute('download', filename);

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
                const nc = new Comment(c);
                comments.push(nc);
            })
        }
        this.comments.formContentFromListObjects(comments);
    }

    addCommentToList(data = {}) {
        const nc = new Comment(data);
        this.comments.addItem(nc);
        this.userComment.clear();
    }
}