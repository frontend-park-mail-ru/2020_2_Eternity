export const routes = {
    mainPage: /^\/$/,
    profilePage: /@\w+$/,
    settingsPage: /^\/profile\/edit$/,
    pinCreatingPage: /^\/create-pin$/,
    pinPage: /pin\/\d+$/,

    // TODO:
    boardPage: /board\/\d+$/,
    boardCreatingPage: /^\/create-board$/,

    loginPage: /^\/login$/,
    regPage: /^\/signup$/,
};