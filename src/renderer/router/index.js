import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const Home = () => import('@/view/Home')
const ImgResize = () => import('@/tool/imgResize/g-imgResize')
export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      name: 'Application',
    },
    {
      path: '/imgresize',
      component: ImgResize,
      name: '图片处理工具',
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
})
