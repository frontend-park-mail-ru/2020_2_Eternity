'use strict'

import {routes} from "./modules/consts/routes.js"
import Router from "./modules/route/router.js";

import MainController from "./controllers/MainController.js"
import LoginController from "./controllers/LoginController.js"
import PinController from "./controllers/PinController.js";

const application = document.getElementById('app');

export let router = new Router(application)
router
    .add(routes.mainPage, new MainController)
    .add(routes.loginPage, new LoginController)
    .add(routes.pinPage, new PinController)
router.start();
