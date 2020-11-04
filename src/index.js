'use strict'

import './index.css'

import {routes} from "./modules/consts/routes.js"
import Router from "./modules/route/router.js";

import MainController from "./controllers/MainController.js"
import LoginController from "./controllers/LoginController.js"
import PinController from "./controllers/PinController.js";
import ProfileController from "./controllers/ProfileController.js";

const application = document.getElementById('app');

export let router = new Router(application)
router
    .add(routes.mainPage, new MainController)
    .add(routes.loginPage, new LoginController('auth'))
    .add(routes.regPage, new LoginController('registration'))
    .add(routes.pinPage, new PinController)
    .add(routes.profilePage, new ProfileController('view'))
    .add(routes.settingsPage, new ProfileController('edit'))
router.start();
