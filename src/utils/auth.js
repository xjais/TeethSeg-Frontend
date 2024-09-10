
// assessToken
const accToken = 'accToken'
export const getAssToken = () => {
  return window.sessionStorage.getItem(accToken)
}
export const setAssToken = (value) => {
  return window.sessionStorage.setItem(accToken, value)
}
export const removeAssToken = () => {
  return window.sessionStorage.removeItem(accToken)
}

// userInfo
const userInfo = 'userInfo'
export const getUserInfo = () => {
  return window.sessionStorage.getItem(userInfo, JSON.parse(value))
}
export const setUserInfo = (value) => {
  return window.sessionStorage.setItem(userInfo, JSON.stringify(value))
}
export const removeUserInfo = () => {
  return window.sessionStorage.removeItem(userInfo)
}