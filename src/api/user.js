import request from "@/utils/request";

export function getAllUser(params) {
    return request({
        url: "/api/user",
        method: "get",
        params: JSON.parse(JSON.stringify(params))
    })
}
export function getUser(id) {
    return request({
        url: `/api/user/${id}`,
        method: "get",
    })
}
export function updateUserDetail(id, data) {
    return request({
        url: `/api/user/${id}/update `,
        method: "post",
        data: data
    })
}
export function deleteUser(id, data) {
    return request({
        url: `/api/user/${id}`,
        method: "delete",
        data: data
    })
}
export function disableUser(id) {
    return request({
        url: `/api/user/${id}/frozen`,
        method: "post",
    })
}
export function createAdmin(data) {
    return request({
        url: `/api/user`,
        method: "post",
        data: data
    })
}