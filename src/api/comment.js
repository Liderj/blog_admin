import request from "@/utils/request";

export function getAllComment(params) {
  return request({
    url: "/api/comment",
    method: "get",
    params: JSON.parse(JSON.stringify(params))
  });
}
export function deleteComment(id) {
  return request({
    url: "/api/comment/" + id,
    method: "post"
  });
}

export function getAllReply(params) {
  return request({
    url: "/api/reply",
    method: "get",
    params: JSON.parse(JSON.stringify(params))
  });
}
export function deleteReply(id) {
  return request({ url: "/api/reply/" + id, method: "post" });
}

export function getKeywords() {
  return request({ url: "/api/keyword", method: "get" });
}

export function addKeywords(data) {
  return request({
    url: "/api/keyword",
    method: "post",
    params: JSON.parse(JSON.stringify(data))
  });
}

export function deleteKeywords(id) {
  return request({
    url: "/api/keyword/" + id,
    method: "delete"
  });
}
