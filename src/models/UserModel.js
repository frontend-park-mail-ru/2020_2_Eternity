import request from "../modules/request/Request.js";

class UserModel {
    constructor() {}

    // TODO: а точно норм?
    checkSession() {
        return request.profile().then((response) => {
            return response.json().then((rjson) => {
                return rjson;
            });
        })
    }

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
            //return fakeUser;
        })
    }

    getUserProfile(data={}) {
        return request.getUserProfile(data.username).then((response) => {
            return response.json();
        });
    }

    updateProfile(data={}) {
        return request.updateProfile(data.username, data.email, data.name, data.surname, data.description).then((response) => {
            return response.json();
        })
        // TODO: update password
    }

    updateAvatar(data={}) {
        return request.updateAvatar(data).then((response) => {
            return response.json();
        })
    }

    updatePassword(data={}) {
        return request.updatePassword(data.oldpassword, data.newpassword).then((response) => {
            return response.json();
        })
    }

    followUser(data = {}) {
        return request.followUser(data.username).then((response) => {
            return response;
        });
    }

    unfollowUser(data={}) {
        return request.unfollowUser(data.username).then((response) => {
            return response;
        })
    }

    isFollowing(data={}) {
        return request.isFollowing(data.username).then((response) => {
            return response.json();
        })
    }

    getFollowers(data={}) {
        return request.getFollowers(data.username).then((response) => {
            return response.json();
        })
    }
    getFollowings(data={}) {
        return request.getFollowings(data.username).then((response) => {
            return response.json();
        })
    }

    getNotifications() {
        return request.getNotifications().then((response) => {
            return response.json();
        })
    }
}

export default new UserModel();