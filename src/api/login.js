import request from "@/utils/request";

export function login(mobile, password) {
  return request({
    url: "/api/auth/login",
    method: "post",
    data: {
      mobile,
      password
    }
  });
}

export function getInfo() {
  return request({ url: "/api/user/info", method: "get" });
}

export function logout() {
  return request({ url: "/api/auth/logout", method: "post" });
}
