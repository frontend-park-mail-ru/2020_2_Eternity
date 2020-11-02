import request from "../modules/request/request.js";


class UserModel {
    constructor() {}

    reg(data={}) {
        return request.signup(data.username, data.email, data.password).then((response) => {
            return response.json();
        })
    }

    login(data={}) {
        return request.login(data.username, data.password).then((response) => {
            return response.json();
        })
    }

    logout() {
        return request.logout().then((response) => {
            return response.json();
        })
    }

    getProfile() {
        return request.profile().then((response) => {
            return response.json();
        })
    }

    updateProfile(data={}) {
        return request.updateProfile(data.username, data.email).then((response) => {
            return response.json();
        })
        // TODO: update password
    }

    updateAvatar(data={}) {
        return request.updateAvatar(data.file).then((response) => {
            return response.json();
        })
    }

}

export default new UserModel();