import Base from "../base.js";

import Avatar from "../../components/avatar/avatar.js";
import Button from "../../components/button/button.js";

export default class ProfilePage extends Base {
    constructor(context = {}) {
        super('Профиль', context, null);
        this.template = Handlebars.templates['profile.hbs'];
    }

    render() {
        // TODO: JSON-данные из бд
        // person = json.response(...)

        const avatar = new Avatar({
            avatarPath: './././static/img/img15.jpg',
        });

        const btnMessage = new Button({
            btnText: 'Сообщение'
        })
        const btnSub = new Button({
            btnText: 'Подписаться'
        })

        const data = {
            avatar: avatar.render(),
            btnMessage: btnMessage.render(),
            btnSub: btnSub.render(),

            name: 'Ruby',
            surname: 'Rhod',
            username: 'OHMYGOOSH',
            description: `Neque porro quisquam est qui dolorem ipsum 
                          quia dolor sit amet, consectetur, adipisci velit...`,
            subsCount: 124756921,
            subscriptionsCount: 10,

            pins: [
                {
                    id: '1',
                    imgSrc: './././static/img/img11.jpg'
                },
                {
                    id: '2',
                    imgSrc: './././static/img/img7.jpg'
                },
                {
                    id: '3',
                    imgSrc: './././static/img/img5.jpg'
                },
                {
                    id: '4',
                    imgSrc: './././static/img/img10.jpg'
                },
            ]
        }

        this.fillWith(data);

        super.render()
    }
}
