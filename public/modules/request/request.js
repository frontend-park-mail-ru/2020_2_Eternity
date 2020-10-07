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

    static pinPost(title, content, imgLink) {
        return fetch(urls['pinPost'], {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                title: title,
                content: content,
                imgLink: imgLink
            })
        })
    }

    static updatePassword(oldPassword, newPassword) {
        return fetch(urls['updatePassword'], {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify({
                oldPassword: oldPassword,
                newPassword: newPassword
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
            body: JSON.stringify({
                image: file
            })
        })
    }

    static getAvatar(imgLink) {
        return fetch(urls['avatar'], {
            method: 'GET',
            credentials: 'include',
        })
    }
}