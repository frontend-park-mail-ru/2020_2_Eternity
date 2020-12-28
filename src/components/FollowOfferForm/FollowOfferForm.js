import template from "./FollowOfferForm.hbs"

import BaseComponent from "../BaseComponent.js";
import List from "../List/List";
import Followbar from "../Followbar/Followbar";


export default class FollowOfferForm extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }

    render() {
        this.list = new List({
            id: 'followOfferList',
        })
        if (this.context.users) {
            let res = []
            this.context.users.forEach((u => {
                const bar = new Followbar(u);
                res.push(bar);
            }))
            this.list.formContentFromListObjects(res);
        }
        this.context.list = this.list.render();
        return super.render();
    }

}