import {
    login,
    logout,
    getInfo
} from '@/api/user'
import {
    getToken,
    setToken,
    setSchoolId,
    removeToken
} from '@/utils/auth'
import router, {
    resetRouter
} from '@/router'

const state = {
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    schoolId: '' //学校ID
}

const mutations = {
    // 设置学校ID
    SET_SCHOOL_ID: (state, schoolId) => {
        state.schoolId = schoolId
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    }
}

const actions = {
    // user login
    async login({
        commit
    }, userInfo) {
        const res = await login(userInfo);
        //跳过登录
        // const res = {
        //         success: true,
        //         data: {
        //             token: "123"
        //         }
        //     }                              
        //跳过登录
        // console.log("登录接口请求 返回")
        // console.log(res)
        // console.log("登录接口请求 返回")
        // const { username, password } = userInfo
        const token = "Bearer " + res.data.token;
        const role = res.data.grade;
        const school = res.data.schoolId;
        commit('SET_ROLES', role) //设置角色   ->存在vuex  -> 出了一个问题  刷新页面 角色就会消失  --> 存到sessionStore里面去的
        commit('SET_TOKEN', token) //  -> 写在 Cookie里面的
        commit('SET_SCHOOL_ID', school) //设置学校ID   -> 写在Cookie里面的
        setSchoolId(school)
        setToken(token)
        return res
    },

    // get user info
    getInfo({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const {
                    data
                } = response

                if (!data) {
                    reject('Verification failed, please Login again.')
                }
                const {
                    roles,
                    name,
                    avatar,
                    introduction,
                    schoolId
                } = data
                // roles must be a non-empty array
                if (!roles || roles.length <= 0) {
                    reject('getInfo: roles must be a non-null array!')
                }

                commit('SET_ROLES', roles)
                commit('SET_NAME', name)
                commit('SET_AVATAR', avatar)
                commit('SET_INTRODUCTION', introduction)
                commit('SET_SCHOOL_ID', schoolId)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({
        commit,
        state,
        dispatch
    }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                commit('SET_TOKEN', '')
                commit('SET_ROLES', [])
                removeToken()
                resetRouter()
                dispatch('tagsView/delAllViews', null, {
                    root: true
                })

                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({
        commit
    }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
        })
    },

    // dynamically modify permissions
    changeRoles({
        commit,
        dispatch
    }, role) {
        return new Promise(async resolve => {
            const token = role + '-token'

            commit('SET_TOKEN', token)
            setToken(token)

            const {
                roles
            } = await dispatch('getInfo')

            resetRouter()

            // generate accessible routes map based on roles
            const accessRoutes = await dispatch('permission/generateRoutes', roles, {
                root: true
            })

            // dynamically add accessible routes
            router.addRoutes(accessRoutes)

            // reset visited views and cached views
            dispatch('tagsView/delAllViews', null, {
                root: true
            })

            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}