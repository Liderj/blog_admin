import request from '@/utils/request'

export function login(mobile, password) {
    return request({
        url: '/api/auth/login',
        method: 'post',
        data: {
            mobile,
            password
        }
    })
}

export function getInfo(token) {
    return request({
        url: '/user/info',
        method: 'get',
        params: { token }
    })
}

export function logout() {
    return request({
        url: '/user/logout',
        method: 'post'
    })
}