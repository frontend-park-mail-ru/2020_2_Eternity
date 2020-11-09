export const apiPath = 'api'

export const urls = {
    signup: `/${apiPath}/user/signup`,
    login: `/${apiPath}/user/login`,
    logout: `/${apiPath}/user/logout`,
    profile: `/${apiPath}/user/profile`,
    userProfile: `/${apiPath}/userpage/:username`,
    updatePassword: `/${apiPath}/user/profile/password`,
    updateProfile: `/${apiPath}/user/profile`,
    avatar: `/${apiPath}/user/profile/avatar`,
    pinPost: `/${apiPath}/user/pin`,
    boardPost: `/${apiPath}/board`,
    board: `/${apiPath}/board/:id`,
    feed: `/${apiPath}/feed`,
    pins: `/${apiPath}/user/pins/:username`
}

