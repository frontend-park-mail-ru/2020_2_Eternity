export const apiPath = 'api'

export const urls = {
    signup: `/${apiPath}/user/signup`,
    login: `/${apiPath}/user/login`,
    logout: `/${apiPath}/user/logout`,

    avatar: `/${apiPath}/user/profile/avatar`,
    updatePassword: `/${apiPath}/user/profile/password`,
    updateProfile: `/${apiPath}/user/profile`,

    profile: `/${apiPath}/user/profile`,
    userProfile: `/${apiPath}/userpage/:username`,

    pins: `/${apiPath}/user/pin`,

    boardPost: `/${apiPath}/board`,
    board: `/${apiPath}/board/:id`,

    pin: `/${apiPath}/user/pin/:id`,
    pinPost: `/${apiPath}/user/pin`,
    pinComments: `/${apiPath}/pin/:id/comments`,

    pinCommentPost: `/${apiPath}/pin/comments`,

}

