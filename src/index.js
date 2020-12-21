'use strict'

import './index.scss'

import {routes} from "./modules/consts/routes.js"
import Router from "./modules/route/Router.js";

import MainController from "./controllers/MainController.js"
import LoginController from "./controllers/LoginController.js"
import PinController from "./controllers/PinController.js";
import BoardController from "./controllers/BoardController.js";
import ProfileController from "./controllers/ProfileController.js";
import PinCreateController from "./controllers/PinCreateController";
import BoardCreateController from "./controllers/BoardCreateController";
import ChatController from "./controllers/ChatController.js";
import SettingsController from "./controllers/SettingsController";

import SessionController from "./controllers/SessionController.js";
import NotificationsController from "./controllers/NotificationsController";


const application = document.getElementById('app');

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}

export let router = new Router(application)

let mc = new MainController;

router
    .add(routes.mainPage, mc)
    .add(routes.loginPage, new LoginController('auth'))
    .add(routes.regPage, new LoginController('registration'))
    .add(routes.pinPage, new PinController)
    .add(routes.boardPage, new BoardController)
    .add(routes.pinCreatingPage, new PinCreateController)
    .add(routes.boardCreatingPage, new BoardCreateController)
    .add(routes.profilePage, new ProfileController)
    .add(routes.settingsPage, new SettingsController)
    .add(routes.chatPage, new ChatController)
    .add(routes.followFeed, mc)
router.start();

NotificationsController.on()