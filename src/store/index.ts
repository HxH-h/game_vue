import { createStore } from 'vuex'
import  WsSocket from './WsSocket'
export default createStore({
  state: {
    username: '',
    email: '',
    level: '',
    rank: '',
    photo: '',
    token: '',
  },
  getters: {
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem("jwt_token",token)
    },
    setUserInfo(state, userInfo) {
      state.username = userInfo.username
      state.email = userInfo.email
      state.level = userInfo.level
      state.rank = userInfo.rank
      state.photo = userInfo.photo
    },
    setPhoto(state, photo) {
      state.photo = photo
    },
    logout(state){
      state.username = ''
      state.email = ''
      state.level = ''
      state.rank = ''
      state.photo = ''
      state.token = ''
    }
  },
  actions: {
  },
  modules: {
    wssocket: WsSocket
  }
})
