'use strict'

import './index.css'

import {routes} from "./modules/consts/routes.js"
import Router from "./modules/route/Router.js";

import MainController from "./controllers/MainController.js"
import LoginController from "./controllers/LoginController.js"
import PinController from "./controllers/PinController.js";
import BoardController from "./controllers/BoardController.js";
import ProfileController from "./controllers/ProfileController.js";
import CreateController from "./controllers/CreateController.js";
import ChatController from "./controllers/ChatController.js";
import SearchController from "./controllers/SearchController.js";
import SessionController from "./controllers/SessionController.js";

const application = document.getElementById('app');

export let router = new Router(application)
router
    .add(routes.mainPage, new MainController)
    .add(routes.loginPage, new LoginController('auth'))
    .add(routes.regPage, new LoginController('registration'))
    .add(routes.pinPage, new PinController)
    .add(routes.boardPage, new BoardController)
    .add(routes.pinCreatingPage, new CreateController('pin'))
    .add(routes.boardCreatingPage, new CreateController('board'))
    .add(routes.profilePage, new ProfileController('view'))
    .add(routes.settingsPage, new ProfileController('edit'))
    .add(routes.chatPage, new ChatController)
    .add(routes.searchPage, new SearchController)
router.start();

