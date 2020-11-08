import {urls} from './api.js'


// TODO: разбить на логические блоки (PinRequest, UserRequest, Board и тд)
export default class Request {
    static request(path, method, ext = {}) {
        return fetch(path, {
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
        return this.requestPOST(urls.login, {
            mode: 'no-cors',
            body: JSON.stringify({
                username: username,
                password: password,
            })
        });
    }

    static signup(username, email, password) {
        return this.requestPOST(urls.signup, {
            mode: 'no-cors',
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            })
        });
    }

    static logout() {
        return this.requestPOST(urls.logout, {
            mode: 'no-cors',
        });
    }

    static profile() {
        return this.requestGET(urls.profile);
    }

    static getUserProfile(username) {
        return this.requestGET(urls.userProfile.replace(':username', username), {});
    }

    static updatePassword(oldPassword, newPassword) {
        return this.requestPUT(urls.updatePassword, {
            body: JSON.stringify({
                oldpassword: oldPassword,
                newpassword: newPassword,
            })
        });
    }

    static updateProfile(username, email) {
        return this.requestPUT(urls.updateProfile, {
            body: JSON.stringify({
                username: username,
                email: email,
            })
        });
    }

    static updateAvatar(file) {
        return this.requestPOST(urls.avatar, {
            body: file
        });
    }

    static getAvatar(imgLink) {
        return this.requestGET(urls.avatar);
    }

    static getPin(id) {
        return this.requestGET(urls.pin.replace(':id', id), {
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
        return this.requestPOST(urls.boardPost, {
            body: JSON.stringify({
                title: title,
                content: content
            })
        });
    }

    static board(id) {
        return this.requestGET(urls.board.replace(':id', id), {});
    }

    static getPinComments(id) {
        return this.requestGET(urls.pinComments.replace(':id', id), {});
    }

    static commentPost(data={}) {
        return this.requestPOST(urls.pinCommentPost, {
            body: JSON.stringify({
                ...data
            })
        });
    }
}