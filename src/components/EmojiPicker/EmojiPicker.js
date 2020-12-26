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
        this.context.smileIcon = Icons.smile;
        this.context.list = this.list.render();
        return super.render();
    }

    getPositionByOrigin() {
        const position = this.origin.getBoundingClientRect();
        this.dropdown.style.top = position.y - 355 + 'px';
        this.dropdown.style.left = position.x - 270 + 'px';
    }

    show() {
        this.getPositionByOrigin()
        if (this.dropdown && !this.isOpened) {
            this.dropdown.classList.add('dropdown__active');
            this.isOpened = true;
        }
    }

    hide() {
        if (this.dropdown && this.isOpened) {
            this.dropdown.scrollTo(0,0)
            this.flushSelectedItems();
            this.dropdown.classList.remove('dropdown__active');
            this.isOpened = false;
        }
    }

    flushSelectedItems() {
        this.list.flushSelectedItems();
    }
}
