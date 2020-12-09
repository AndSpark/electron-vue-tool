import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const Home = () => import('@/view/Home')
const ImgResize = () => import('@/tool/imgResize/g-imgResize')
const ProductUpload = () => import('@/tool/productUpload/g-productUpload')
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
      path: '/productupload',
      component: ProductUpload,
      name: '产品上传工具',
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
})
