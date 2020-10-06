'use strict'

import Navbar from "./components/navbar/navbar.js";

import ProfilePage from "./views/profile/profile.js";
import MainPage from "./views/main/main.js";
import SettingsPage from "./views/settings/settings.js";
import AuthRegPage from "./views/auth/auth.js";
import PinCreating from "./views/pin-creating/pin-creating.js";

// TODO: ЭТО НАДО ПЕРЕДЕЛАТЬ (РОУТИНГ)
import Router from "./modules/route/router.js";

// const {ajaxGet, ajaxPost} = globalThis.AjaxModule;

const application = document.getElementById('app');
const nav = new Navbar();

function menuPage() {
    const main = new MainPage({navbar: nav.render()});
    main.render()
}

function profilePage() {
    // TODO: здесь должно быть наполнение profile.data из response в ajax
    const profile = new ProfilePage({navbar: nav.render()})
    profile.render()
}

function settingsPage() {
    const set = new SettingsPage({navbar: nav.render()});
    set.render()
}

function regPage() {
    const reg = new AuthRegPage('registration');
    reg.render();
}

function loginPage() {
    const loginP = new AuthRegPage('auth')
    loginP.render()
}

function pinCreatingPage() {
    const create = new PinCreating({navbar: nav.render()});
    create.render();
}


// TODO: Господи, помоги с роутингом нормального человека
const routes = {
    '/2020_2_Eternity/public/index.html': menuPage,
    '/': menuPage,
    '/profile': profilePage,
    '/profile/edit': settingsPage,
    '/create-pin': pinCreatingPage,
    '/login': loginPage,
    '/signup': regPage
};


let router = new Router(application)
Object.entries(routes).forEach(([href, controller]) => {
    router.bind(href, controller);
})
router.start();
