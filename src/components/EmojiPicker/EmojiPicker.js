import template from "./EmojiPicker.hbs"

import BaseComponent from "../BaseComponent.js";
import List from "../List/List";
import Span from "../Span/Span";
import Image from "../Image/Image";

import {Icons} from "../../modules/consts/icons";
import {emoji, sticker} from "../../modules/consts/emoji";

export default class EmojiPicker extends BaseComponent {
    isOpened
    origin
    dropdown
    list

    emojis
    pack

    constructor(context = {}) {
        super(template, context)

        this.listenerOnClose = this.closeOnClickOutsideBind.bind(this);

        this.emojis = []
        emoji.forEach((el) => {
            this.emojis.push(new Span({custom: 'emoji', text: el}));
        })
        this.pack = []
        Object.entries(sticker).forEach(([key, value]) => {
            this.pack.push(new Image({src: value, alt: key, class: 'sticker'}))
        })

        this.list = new List({
            id: context.id + 'Window',
            customItem: 'emoji-picker__window__emoji',
            custom: 'emoji-picker__window'
        }, {selectable: 'radio'})
        this.list.formContentFromListObjects(this.emojis);
    }

    render() {
        const node = document.createElement('span')
        this.context.smileIcon = Icons.smile;
        this.context.list = this.list.render();
        return super.render();
    }

    getPositionByOrigin() {
        if (document.documentElement.clientWidth > 430) {
            const position = this.origin.getBoundingClientRect();
            if (document.documentElement.clientWidth - position.x < 210) {
                position.x = position.x - 270;
            }
            if (document.documentElement.clientHeight - position.y < 160) {
                position.y = position.y - 355;
            }
            getComputedStyle(this.origin, null).position !== 'fixed' ? position.y = (position.y + window.scrollY + 10) : position.y;
            this.dropdown.style.top = position.y + 'px';
            this.dropdown.style.left = position.x + 'px';
        } else {
            const dropSize = getComputedStyle(this.dropdown).height;
            this.dropdown.style.top = `calc(100vh - ${dropSize})`;
            this.dropdown.style.left = '';
        }
    }

    show() {
        this.getPositionByOrigin()
        if (this.dropdown && !this.isOpened) {
            this.dropdown.classList.add('dropdown__active');

            document.addEventListener('click', this.listenerOnClose);
            setTimeout(() => {
                this.isOpened = true;
            }, 300);
        }
    }

    hide() {
        if (this.dropdown && this.isOpened) {
            this.dropdown.scrollTo(0,0)
            this.flushSelectedItems();
            this.dropdown.classList.remove('dropdown__active');
            this.dropdown.style.top = '';
            document.removeEventListener('click', this.listenerOnClose);
            this.isOpened = false;
        }
    }

    flushSelectedItems() {
        this.list.flushSelectedItems();
    }

    closeOnClickOutsideBind(event) {
        if (this.isOpened && (!event.target.closest('.dropdown') || !(event.target instanceof HTMLElement))) {
            this.hide();
        }
    }
}
