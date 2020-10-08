import {urls} from './api.js'

export default class Request {
    static login(username, password) {
        return fetch(urls['login'], {
            method: 'POST',
            credentials: 'include',
            mode: 'no-cors',
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
    }

    static signup(username, email, password) {
        return fetch(urls['signup'], {
            method: 'POST',
            credentials: 'include',
            mode: 'no-cors',
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        })
    }

    static logout() {
        return fetch(urls['logout'], {
            method: 'POST',
            credentials: 'include',
            mode: 'no-cors'
        })
    }

    static profile() {
        return fetch(urls['profile'], {
            method: 'GET',
            credentials: 'include',
        })
    }

    static pinPost(data) {
        return fetch(urls['pinPost'], {
            method: 'POST',
            credentials: 'include',
            /*body: JSON.stringify({
                title: title,
                content: content,
                imgLink: imgLink
            })*/
            body: data
        })
    }

    static updatePassword(oldPassword, newPassword) {
        return fetch(urls['updatePassword'], {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify({
                oldpassword: oldPassword,
                newpassword: newPassword
            })
        })
    }

    static updateProfile(username, email) {
        return fetch(urls['updateProfile'], {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify({
                username: username,
                email: email
            })
        })
    }

    static updateAvatar(file) {
        return fetch(urls['avatar'], {
            method: 'POST',
            credentials: 'include',
            body: file
        })
    }

    static getAvatar(imgLink) {
        return fetch(urls['avatar'], {
            method: 'GET',
            credentials: 'include',
        })
    }

    static getPin() {
        return fetch(urls['pins'], {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        })
    }
}