import Base from "../base.js";

import Input from "../../components/input/input.js";
import Image from "../../components/input/_img/img.js";


export default class PinPage extends Base {
    constructor(context = {}) {
        super('Просмотр пина', context, null);
        this.template = Handlebars.templates['pin.hbs'];
    }

    render() {
        const userComment = new Input({
            id: 'comment',
            type: 'text',
            customClasses: 'comment-add-user',
            placeholder: 'Напишите что-нибудь!',
        })
        const pin = new Image({
            src: this.context.imgSrc,
        })

        const data = {
            ...this.context,
            input: userComment.render(),
            pin: pin.render(),
        }
        this.fillWith(data);
        super.render()
    }
}