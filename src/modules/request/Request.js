import {urls} from './api.js'


// TODO: разбить на логические блоки (PinRequest, UserRequest, Board и тд)
export default class Request {
    static request(path, method, ext = {}) {
        return fetch(urls[path], {
            method: method,
            credentials: 'include',
            ...ext
        })
    }

    static requestGET(path, ext = {}) {
        return Request.request(path, 'GET', ext);
    }

    static requestPOST(path, ext = {}) {
        return Request.request(path, 'POST', ext);
    }

    static requestPUT(path, ext = {}) {
        return Request.request(path, 'PUT', ext);
    }

    static login(username, password) {
        return this.requestPOST('login', {
            mode: 'no-cors',
            body: JSON.stringify({
                username: username,
                password: password,
            })
        });
    }

    static signup(username, email, password) {
        return this.requestPOST('signup', {
            mode: 'no-cors',
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            })
        });
    }

    static logout() {
        return this.requestPOST('logout', {
            mode: 'no-cors',
        });
    }

    static profile() {
        return this.requestGET('profile');
    }

    static getUserProfile(username) {
        return fetch(urls.userProfile.replace(':username', username), {
            method: 'GET',
            credentials: 'include',
        })
    }

    static updatePassword(oldPassword, newPassword) {
        return this.requestPUT('updatePassword', {
            body: JSON.stringify({
                oldpassword: oldPassword,
                newpassword: newPassword,
            })
        });
    }

    static updateProfile(username, email, name, surname, description) {
        return this.requestPUT('updateProfile', {
            body: JSON.stringify({
                username: username,
                email: email,
                name: name,
                surname: surname,
                description: description
            })
        });
    }

    static updateAvatar(file) {
        return this.requestPOST('avatar', {
            body: file
        });
    }

    static getAvatar(imgLink) {
        return this.requestGET('avatar');
    }

    static getPin() {
        return this.requestGET('pins', {
            mode: 'cors',
        });
    }

    static pinPost(data) {
        return this.requestPOST('pinPost', {
            body: data,
            /*body: JSON.stringify({
                title: title,
                content: content,
                imgLink: imgLink
            })*/
        });
    }

    static boardPost(title, content) {
        return this.requestPOST('boardPost', {
            body: JSON.stringify({
                title: title,
                content: content
            })
        })
    }

    static board(id) {
        return fetch(urls['board'].replace(':id', id), {
            method: 'GET',
            credentials: 'include'
        });
    }

    static getAllPins() {
        return this.requestGET('feed');
    }
}