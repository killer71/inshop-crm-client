import jwtDecode from 'jwt-decode'
import * as types from './mutation_types'
import router from '../../../router'
import axios from 'axios/index'
import { API_HOST, API_PATH } from '../../../config/_entrypoint'

const actions = {
  login ({ commit }, data) {
    commit(types.AUTH_ERROR_CHANGE, null)

    const url = '/login'
    const link = url.includes(API_PATH) ? API_HOST + url : API_HOST + API_PATH + url

    return axios.post(link, data)
      .catch(() => {
        commit(types.AUTH_ERROR_CHANGE, 'Wprowadzony login lub hasło są nieprawidłowe')
      })
  },
  logout ({ commit }) {
    commit(types.AUTH_RESET)
    router.push({ name: 'SignIn' })
  }
}

function initialState () {
  return {
    token: localStorage.getItem('token'),
    roles: localStorage.getItem('roles') || [],
    language: localStorage.getItem('language') || 'en',
    error: null
  }
}

const state = initialState()

const getters = {
  jwtDecoded: (state) => {
    let token = state.token || null
    if (token !== null) {
      return jwtDecode(state.token)
    }
  },
  roles: state => state.roles,
  language: state => state.language,
  error: state => state.error
}

const mutations = {
  [types.AUTH_UPDATE_TOKEN] (state, data) {
    localStorage.setItem('token', data.token)
    localStorage.setItem('roles', data.roles)
    state.token = data.token
    state.roles = data.roles
  },
  [types.AUTH_UPDATE_LANGUAGE] (state, language) {
    localStorage.setItem('language', language)
    state.language = language
  },
  [types.AUTH_ERROR_CHANGE] (state, error) {
    state.error = error
  },
  [types.AUTH_RESET] (state) {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    localStorage.removeItem('language')
    localStorage.removeItem('error')
    localStorage.removeItem('roles')

    const s = initialState()
    Object.keys(s).forEach(key => {
      state[key] = s[key]
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
