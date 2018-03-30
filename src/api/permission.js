import request from "@/utils/request";

export function getList(params) {
  return request({
    url: "/api/permission",
    method: "get",
    params: JSON.parse(JSON.stringify(params))
  });
}
export function getPermission(id) {
  return request({
    url: "/api/permission/" + id,
    method: "get"
  });
}

export function deletePermission(id, data) {
  return request({
    url: "/api/permission/" + id,
    method: "delete",
    data: data
  });
}
