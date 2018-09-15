import Vue from 'vue'
import Router from 'vue-router'

import List from '../components/List'
import DepotList from '../components/requireGoods/DepotList'
import Goods from '../components/requireGoods/Goods'
import GoodsDetails from '../components/requireGoods/GoodsDetails'

import InterView from '../components/interview'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'List',
      component: List
    },
    {
      path: '/interview',
      name: 'interview',
      component: InterView
    },
    {
      path: '/depotList',
      name: 'DepotList',
      component: DepotList
    },
    {
      path: '/goods',
      name: 'Goods',
      component: Goods
    },
    {
      path: '/goodsDetails',
      name: 'GoodsDetails',
      component: GoodsDetails
    },
  ]
})
