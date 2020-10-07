import Base from "../base.js";

import Avatar from "../../components/avatar/avatar.js";
import Button from "../../components/button/button.js";

import Request from "../../modules/request/request.js";

import {router} from "../../index.js"

export default class ProfilePage extends Base {
    constructor(context = {}) {
        super('Профиль', context, null);
        this.template = Handlebars.templates['profile.hbs'];
    }

    render() {
        Request.profile().then((response) => {
            console.log(response)
            return response.json()
        }).then((responseJSON) => {
                Request.getAvatar().then((res) => {
                    console.log(res)
                    const img = btoa(res.bodyContent)
                    console.log(img)

                    let avatarPath = './././static/img/img15.jpg'

                    if (res.bodyUsed) {
                        avatarPath =  'data:image/png;base64,' + img
                    }

                    const avatar = new Avatar({
                        avatarPath: avatarPath
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
                        username: responseJSON['username'],//'OHMYGOOSH',
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
                })
            }, () => {
                router.open('/')
            }
        )

        // TODO: JSON-данные из бд
        // person = json.response(...)


    }
}
