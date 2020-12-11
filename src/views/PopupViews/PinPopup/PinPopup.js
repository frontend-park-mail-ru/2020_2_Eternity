import template from './PinPopup.hbs'
import BasePopupView from "../BasePopupView";
import Avatar from "../../../components/Avatar/Avatar";
import Button from "../../../components/Button/Button";

export default class PinPopup extends BasePopupView {
    constructor(context = {}) {
        super(context, null);
        this.template = template;
    }

    render() {
        const avatar = new Avatar({
            img_link: this.context.img_link,
            mini: true,
        })
        const btnFollow = new Button({
            id: 'follow',
            text: 'Подписаться',
            customButton: 'btn_green'
        })
        this.context = {
            ...this.context,
            avatar: avatar.render(),
            username: 'example',
            btnFollow: btnFollow.render(),
        }
        return super.render();
    }
}