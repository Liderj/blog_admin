import request from "@/utils/request";

export function allRoles() {
    return request({
        url: "/api/roles/index",
        method: "get",
    });
}

export function getRole(id) {
    return request({
        url: "/api/roles/" + id,
        method: "get"
    });
}

export function deleteRole(id) {
    return request({
        url: `/api/roles/${id}/destroy`,
        method: "post"
    });
}

export function updatePermission(id, data) {

    return request({
        url: `/api/roles/${id}/update_permission`,
        method: "post",
        data: data
    });
}