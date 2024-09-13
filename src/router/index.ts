import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { useStore } from "vuex"
import { post } from '@/ts/request';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/main',
    meta: { isAuth: true },
  },
  {
    path: '/main',
    name: 'main',
    meta: { isAuth: true },
    component: () => import('../views/main.vue'),
    children: [
      {
        path: 'gamemode',
        name: 'gamemode',
        component: () => import('../views/game/GameMode.vue')
      },
      {
        path: 'gamepk',
        name: 'gamepk',
        component: () => import('../views/game/GamePK.vue')
      },
      {
        path: 'gameAI',
        name: 'gameAI',
        component: () => import('../views/game/GameAI.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/player/login.vue')

  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/player/register.vue')
  },
  {
    path: '/gamerinfo',
    name: 'gamerinfo',
    meta: { isAuth: true },
    component: () => import('../views/player/GamerInfo.vue')
  },
  {
    path: '/chesshistory',
    name: 'chesshistory',
    meta: { isAuth: true },
    component: () => import('../views/player/ChessHistory.vue')
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const store = useStore()
  const jwt_token = localStorage.getItem("jwt_token")
  

  //如果路由需要跳转
  if (to.meta.isAuth) {
    if (store.state.token != '') {
      
      next()  //放行
    } else {

      if (jwt_token) {
        store.commit("setToken", jwt_token)
        next()
      } else {
        alert('抱歉，您无权限查看！')
        next('/login')
      }

    }
  } else {
    next()
  }
})


export default router
