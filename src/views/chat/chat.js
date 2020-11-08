import template from './chat.hbs'

import BaseView from "../BaseView.js";
import Sidebar from "../../components/sidebar/sidebar.js";
import Avatar from "../../components/avatar/avatar.js";
import Message from "../../components/message/message.js";



export default class ChatPage extends BaseView {
    constructor(context = {}) {
        super('Сообщения', context, null);
        this.template = template;
    }


    render() {
        const avatar = new Avatar({
            middle: true,
            imgSrc: '/img/img4.jpg',
        })
        const fakeMessage = {
            username: 'example',
            text: 'Hello! How are you? O you iz Anglii, of course, you have some tea',
            time: '12:58',
        }
        const message = new Message({avatar: avatar.render(), ...fakeMessage});



        const sidebar = new Sidebar({
            id: 'sidebar',
            messages: [message.render()],
        })

        const data = {
            sidebar: sidebar.render(),
        }
        this.fillWith(data);
        super.render()

        sidebar.bindToggler();
    }
}
