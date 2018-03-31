import request from "@/utils/request";

export function getAllPost(params) {
    return request({
        url: "/api/post",
        method: "get",
        params: JSON.parse(JSON.stringify(params))
    })
}
export function getPost(id) {
    return request({
        url: `/api/post/${id}`,
        method: "get",
    })
}

export function deletePost(id) {
    return request({
        url: `/api/post/destroy/{/${id}`,
        method: "delete",
        data: data
    })
}
export function disablePost(id) {
    return request({
        url: `/api/user/${id}/disable`,
        method: "post",
    })
}


export function getCategory(params) {
    return request({
        url: `/api/category`,
        method: "get",
    })
}
export function createCategory(data) {
    return request({
        url: `/api/category`,
        method: "post",
        data: data
    })
}
export function updateCategory(id, data) {
    return request({
        url: `/api/category/${id}/update`,
        method: "post",
        data: data
    })
}
export function deleteCategory(id, data) {
    return request({
        url: `/api/category/${id}/destroy`,
        method: "post",
        data: data
    })
}