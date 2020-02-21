import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const SchoolId = "Admin-school"

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}
export function setSchoolId(School) {
    return Cookies.set(SchoolId, School)
}
export function getSchoolId() {
    return Cookies.get(SchoolId)
}