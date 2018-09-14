import Vue from 'vue'
import Router from 'vue-router'

const List = r => require.ensure([], () => r(require('@/components/List')), 'List'); //要货 收货 历史订单
const DepotList = r => require.ensure([], () => r(require('@/components/requireGoods/DepotList')), 'DepotList'); //供应商列表
const Goods = r => require.ensure([], () => r(require('@/components/requireGoods/Goods')), 'Goods'); //物料列表
const GoodsDetails = r => require.ensure([], () => r(require('@/components/requireGoods/GoodsDetails')), 'GoodsDetails'); //订单详情

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'List',
      component: List
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
