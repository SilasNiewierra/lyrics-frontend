import Vue from 'vue'
import Router from 'vue-router'
import Start from '@/components/Start'
import About from '@/components/About'
import Analyze from '@/components/Analyze'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Start',
      component: Start,
      meta: {title: 'Lyrics-Home'}
    },
    {
      path: '/analyze',
      name: 'Analyze',
      component: Analyze,
      meta: {title: 'Lyrics-Analyze'}
    },
    {
      path: '/about',
      name: 'About',
      component: About,
      meta: {title: 'Lyrics-About'}
    }
  ]
})

const DEFAULT_TITLE = 'Lyrics'
router.afterEach((to, from) => {
  document.title = to.meta.title || DEFAULT_TITLE
})

export default router
