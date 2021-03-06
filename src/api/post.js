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
        url: `/api/post/destroy/${id}`,
        method: "post",
    })
}
export function disablePost(id) {
    return request({
        url: `/api/post/${id}/disable`,
        method: "post",
    })
}
export function toggleHot(id) {
    return request({
        url: `/api/post/hot/${id}`,
        method: "post"
    })
}
export function toggleComment(id) {
    return request({
        url: `/api/post/comment/${id}`,
        method: "post"
    })
}
export function getTop() {
    return request({
        url: `/api/post/top`,
        method: 'get'
    })
}

// 分类api
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