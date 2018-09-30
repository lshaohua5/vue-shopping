<template>
  <section id="shopCart">
    <!--购物车-->
    <section class="shop_cart">
      <section class="shop" @click="toggleCartList">
        <section class="shop_cart_wrapper">
          <section class="shop_cart_icon"></section>
          <section class="num" v-show="totalNum>0">{{totalNum|number}}</section>
        </section>
        <section class="total_price">{{totalPrice|number}}</section>
      </section>
      <section class="buy" @click="order">下单</section>
    </section>
    <!--飞入小球-->
    <div class="ball-container">
      <div v-for="ball in balls" :key="ball.id">
        <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
    <!--购物车详情-->
    <transition name="shade">
      <section class="shop_cart_info" v-show="shopCartShow">
        <h2 class="title">
          <section class="title_">要货清单</section>
          <section class="del" @click="emptyShopCart(selectFoods)">
            <i class="iconfont icon-shanchu"></i>
            <span>清空全部</span>
          </section>
        </h2>
        <section class="shop_cart_list" ref="shop_cart_list">
          <ul>
            <li class="food_list van-hairline--bottom" v-for="food in selectFoods" :key="food.materiel_id">
              <van-swipe-cell :right-width="65">
                <!--<van-cell-group>-->
                <p class="name">{{food.name}}</p>
                <div class="extra">
                  <span class="count">规格：{{food.specification}}</span>
                  <span>单位：{{food.unit_name}}</span>
                </div>
                <div class="cart_control_wrapper">
                  <cartControl :food="food"></cartControl>
                </div>
                <!--</van-cell-group>-->
                <span slot="right" class="delete" @click="deleteFood(food)">删除</span>
              </van-swipe-cell>
            </li>
          </ul>
        </section>
      </section>
    </transition>
    <!--遮罩层-->
    <transition name="shade">
      <section class="shade_shop_cart" v-show="shopCartShow" @click="hideList"></section>
    </transition>
  </section>
</template>

<script>
  import cartControl from './cartControl'
  import BScroll from 'better-scroll'

  export default {
    name: 'shopCart',
    components: {cartControl},
    data() {
      return {
        balls: [{show: false}, {show: false}, {show: false}, {show: false}, {show: false}],
        dropBalls: [],
        shopCartShow: false,
        scroll: null
      }
    },
    props: {
      selectFoods: {
        type: Array,
        default() {
          return []
        }
      },
      curDepotId: {
        type: String,
        default: ''
      },
      curDepotName: {
        type: String,
        default: ''
      }
    },
    computed: {
      // 计算总价
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((item) => {
          let singleTotal = this.accuracy.multiply(item.count, item.price)
          total = this.accuracy.add(total, singleTotal)
        });
        return total
      },
      // 总数量
      totalNum() {
        let num = 0;
        this.selectFoods.forEach((item) => {
          num = this.accuracy.add(num, item.count)
        });
        return num
      }
    },
    watch: {
      totalNum() {
        if (this.totalNum === 0) {
          this.shopCartShow = false
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initScroll()
      })
    },
    methods: {
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeDrop(el) {
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 32
            let y = -(window.innerHeight - rect.top - 22)
            el.style.display = ''
            el.style.webkitTransform = `translate3d(0,${y}px,0)`
            el.style.transform = `translate3d(0,${y}px,0)`
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`
            inner.style.transform = `translate3d(${x}px,0,0)`
          }
        }
      },
      dropping(el, done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)'
          el.style.transform = 'translate3d(0,0,0)'
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translate3d(0,0,0)'
          inner.style.transform = 'translate3d(0,0,0)'
          el.addEventListener('transitionend', done)
        })
      },
      afterDrop(el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      },
      // 删除当前行的已点菜品
      deleteFood(food) {
        food.count = 0
      },
      // 切换购物列表
      toggleCartList() {
        if (this.totalNum === 0) {
          return false
        }
        this.shopCartShow = !this.shopCartShow
      },
      // 隐藏购物车列表
      hideList() {
        if (this.totalNum === 0) {
          return false
        }
        this.shopCartShow = false
      },
      // 初始化scroll
      initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.shop_cart_list, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      },
      // 清空购物车
      emptyShopCart(selectFoods) {
        this.$dialog.confirm({
          message: '是否清空购物车？'
        }).then(() => {
          // 删除 localStorage 中的当前供应商 当前仓库的数据
          this.deleteCurFoodsInfo();
          // 清空购物车
          selectFoods.forEach((food) => {
            food.count = 0
          })
        }).catch(() => {

        });
      },
      // 删除 localStorage 中的当前供应商 当前仓库的数据 重新储存
      deleteCurFoodsInfo() {
        let selectFoodInfo = JSON.parse(localStorage.getItem('selectFoodInfo'));
        let curAreaId = localStorage.getItem('nowAreaId');
        for (let key in selectFoodInfo) {
          if (key === this.curDepotId) {
            for (let areaId in selectFoodInfo[key]) {
              if (areaId === curAreaId) {
                selectFoodInfo[key][areaId] = [];
              }
            }
          }
        }
        localStorage.setItem('selectFoodInfo', JSON.stringify(selectFoodInfo))
      },
      // 点击下单
      order() {
        if (this.totalNum === 0) {
          this.$toast('商品为空，不能下单')
        } else {
          this.$router.push({
            name: 'GoodsDetails',
            path: '/GoodsDetails',
            query: {depot_id: this.curDepotId, depot_name: this.curDepotName}
          })
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  #shopCart
    width 100%
    height 100px
    position fixed
    z-index 50
    bottom 0
    left 0
    .shop_cart
      width 100%
      height 100px
      display flex
      flex-flow nowrap
      background #000000
      position relative
      z-index 35
      .shop
        flex 1
        position relative
        display flex
        flex-flow nowrap
        z-index 100
        .shop_cart_wrapper
          width 114px
          height 114px
          box-sizing border-box
          border-radius 50%
          padding 8px
          background #000
          position relative
          z-index 46
          top -32px
          left 36px
          .shop_cart_icon
            width 97px
            height 97px
            border-radius: 50%;
            background url("../../assets/shopcart.png") #3691e4 20px 20px no-repeat
            background-size 56px 56px
          .num
            min-width 50px
            height 34px
            background #3691e4
            border-radius 8px
            box-sizing border-box
            padding 7px
            text-align center
            position absolute
            z-index 100
            top -15px
            left 80px
            color #fff
            font-size 14px
        .total_price
          font-size 48px
          color #fff
          font-weight bold
          margin 30px 0 30px 40px
      .buy
        width 228px
        height 100px
        background #3691e4
        color #fff
        font-size 32px
        text-align center
        line-height 100px

    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        transition all 1s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width 35px
          height: 35px
          border-radius 50%
          background-color #3691e4
          transition all 1s linear

    .shop_cart_info
      width 100%
      min-height 1000px
      max-height 1100px
      box-sizing border-box
      padding-bottom 100px
      display flex
      flex-flow column
      overflow hidden
      position fixed
      background #fff
      transition all 0.5s
      transform translate3d(0, -100%, 0)
      .title
        width 100%
        height 70px
        background #F1F1F1
        position relative
        .title_
          width 100%
          height 70px
          text-align center
          box-sizing border-box
          padding 18px
          font-size 32px
          font-weight bold
          color #333
        .del
          height 70px
          box-sizing border-box
          position absolute
          top -2px
          right 30px
          color #666666
          display flex
          align-items center
          .iconfont
            display inline-block
            vertical-align top
            font-size 40px
          span
            font-size 22px
            display inline-block
            vertical-align top

      .shop_cart_list
        flex 1
        overflow hidden
        .food_list
          width 100%
          height 126px
          box-sizing border-box
          display flex
          flex-flow column
          justify-content space-around
          position relative
          .name
            font-size 32px
            color #333
            margin-bottom 12px
          .extra
            font-size 22px
            color #666
            .count
              margin-right 20px
          .cart_control_wrapper
            position absolute
            top 10px
            right 0
    .shop_cart_info.shade-enter
      transform translate3d(0, 0, 0)
    .shop_cart_info.shade-leave-to
      transform translate3d(0, 0, 0)
    .shade_shop_cart
      width 100%
      height 100%
      background-color: rgba(7, 17, 27, 0.6)
      opacity 0.3
      position fixed
      z-index -1
      top 0
      left 0
      transition all 0.5s
    .shade_shop_cart.shade-enter
      opacity: 0;
      background-color: rgba(7, 17, 27, 0)
    .shade_shop_cart.shade-leave-to
      opacity: 0;
      background-color: rgba(7, 17, 27, 0)

</style>
