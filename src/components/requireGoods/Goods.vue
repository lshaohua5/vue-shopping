<template>
  <div id="goods" class="goods">
    <Header :childTitle="title"></Header>
    <!--搜索-->
    <section class="search">
      <van-button class="tab_depot" type="danger" @click="showDepot" plain>{{depotName}}</van-button>
      <input class="search_frame"
             v-model="searchValue"
             @focus="focusSearch"
             @blur="blurSearch"
             @keyup.13="searchEnter($event)"
             type="text"
             placeholder="请输入物料名称">
      <i class="iconfont icon-shanchu1" v-show="deleteIco" @click="deleteSearchValue"></i>
      <section class="search_btn" @click="search()">搜索</section>
      <van-icon class="icon_search" name="search"/>
    </section>
    <!--物料-->
    <section id="goods_wrapper">
      <!--物料分类menu-->
      <div class="menu-wrapper" ref="menuWrapper" v-show="!searchBtnShow">
        <ul id="menu-wrapper">
          <li v-for="(item,index) in goods" :key="item.id" class="menu-item"
              :class="index===currentIndex?'menu-item_active':''"
              @click="selectMenu(index, $event)">
            <span class="text">
              {{item.name}}
            </span>
            <span class="bar"></span>
            <span class="menuTotalCount"
                  v-show="menuTotalCount(item.foods)">{{menuTotalCount(item.foods) | number}}</span>
          </li>
        </ul>
      </div>
      <!--物料详情-->
      <div class="foods-wrapper" ref="foodWrapper">
        <div class="foodsCon">
          <ul v-for="(item,index) in goods" class="foods-list" :key="item.id" ref="foodsListHook">
            <section class="menu_title" v-show="!searchBtnShow"><span class="bar"></span>{{item.name}}</section>
            <li v-for="food in item.foods" :key="food.id"
                class="food-item van-hairline--bottom food-item-hook"
                :class="searchMaterielIdStr.indexOf(food.materiel_id)!==-1?'food-item_search':''"
                v-show="!searchBtnShow">
              <h2 class="name">{{food.name}}</h2>
              <div class="extra">
                <span class="count">规格：{{food.specification}}</span>
                <span>单位：{{food.unit_name}}</span>
              </div>
              <div class="extra">
                <span class="count">价格：{{food.price}}</span>
                <span>金额：{{accuracy.multiply(food.count,food.price) | mouney}}元</span>
              </div>
              <div class="cart_control_wrapper">
                <cartControl :food="food" @add="addFood"></cartControl>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <!--购物车-->
    <shop-cart ref="shopCart"
               :select-foods="selectFoods"
               :curDepotName="$route.query.depot_name"
               :curDepotId="$route.query.depot_id"></shop-cart>
    <!-- 仓库 -->
    <van-popup v-model="isShowDepot" position="bottom">
      <van-picker
        show-toolbar
        title="选择仓库"
        :columns="areaList"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
  import Header from '../common/Header'
  import cartControl from './cartControl'
  import shopCart from './shopCart'
  import BScroll from 'better-scroll'
  import depotList from '@/../static/data.js'

  export default {
    name: 'Goods',
    data() {
      return {
        title: '物料列表',
        depotName: '默认仓库',
        isShowDepot: false, //默认不显示选择仓库
        areaList: [], //仓库列表
        areaIdList: [], //仓库id
        goods: [],
        menuScroll: null,
        foodsScroll: null,
        currentIndex: 0,
        foodListHeight: [],
        scrollY: 0,
        curDepotId: '',
        searchValue: '',
        searchBtnShow: false,
        deleteIco: false,
        searchMaterielIdStr: '',
      }
    },
    components: {
      shopCart,
      Header,
      cartControl
    },
    computed: {
      selectFoods() {
        let _this = this;
        let curAreaId = localStorage.getItem('nowAreaId');
        let curDepotId = this.$route.query.depot_id;
        let selectFoodInfo = {}, foodInfo = {}; // 选择的物料信息 物料详情

        let foods = [];
        _this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count > 0) {
              foods.push(food);
            }
          });
        });
        // 如果已经有其他供应商 添加了物料
        let changeAreaFlag = false;
        if (JSON.parse(localStorage.getItem('selectFoodInfo'))) {
          selectFoodInfo = JSON.parse(localStorage.getItem('selectFoodInfo'))
          for (let key in selectFoodInfo) {
            if (key === curDepotId) {
              for (let areaId in selectFoodInfo[key]) {
                if (areaId === curAreaId) {
                  foodInfo = selectFoodInfo[key]
                } else {
                  changeAreaFlag = true;
                  console.log('仓库变了')
                }
              }
            }
          }
        }
        // 对物料 加减操作
        if (foods.length) {
          // 把对应的供应商  仓库 存储到localStorage里 selectFoodInfo
          foodInfo[curAreaId] = foods;
          selectFoodInfo[curDepotId] = foodInfo;
          let selectFood_Info = JSON.stringify(selectFoodInfo);
          localStorage.setItem('selectFoodInfo', selectFood_Info);
        }
        return foods
      }
    },
    watch: {
      searchValue(curVal) {
        if (curVal !== '') {
          this.deleteIco = true;
          this.searchBtnShow = true
        } else {
          this.searchBtnShow = false;
          this.deleteIco = false
        }
      }
    },
    created() {
      this.$toast.loading({
        mask: true,
        duration: 2000,
        message: '物料加载中...'
      });
    },
    mounted() {
      this.$nextTick(() => {
        this.title = this.$route.query.depot_name;
        this.curDepotId = this.$route.query.depot_id;
        this.getAreaList();
        this.getCategory();
        this.getMaterielList();
      })
    },
    methods: {
      showDepot() {
        this.isShowDepot = true;
      },
      //选择仓库
      onConfirm(value, index) {
        this.isShowDepot = false;
        this.depotName = value;
        localStorage.setItem('nowAreaId', this.areaIdList[index]);
        this.changeGoods(this.goods)
      },
      onCancel() {
        this.isShowDepot = false;
      },
      // 搜索框 聚焦
      focusSearch() {
        this.searchBtnShow = true;
        this.searchMaterielIdStr = '';
        if (this.searchValue !== '') {
          this.deleteIco = true
        }
      },
      // 搜索框 失去焦点
      blurSearch() {
        if (this.searchValue) {
          this.searchBtnShow = true
        } else {
          this.searchBtnShow = false
        }
      },
      // 点击 搜索按钮
      search() {
        if (!this.searchValue) {
          this.$toast('请输入搜索内容')
        } else {
          this.getSearchFoods(this.searchValue)
        }
      },
      // 点击软键盘 enter键 搜索
      searchEnter($event) {
        if (!this.searchValue) {
          this.$toast('请输入搜索内容')
        } else {
          if ($event.keyCode === 13) {
            this.getSearchFoods(this.searchValue)
          }
        }
      },
      // 点击deleteIcon
      deleteSearchValue() {
        this.searchValue = '';
        this.deleteIco = false
      },
      // 获取 搜索物料 信息
      getSearchFoods(searchValue) {
        this.searchMaterielIdStr = '';
        this.searchMaterielIdStr = 'dm8zgkzdk07zdm5xklkkwc9ldmg8zgrcyh64'
      },
      //获取仓库列表
      getAreaList() {
        let data = depotList.area_list.data;
        for (let item in data) {
          this.areaList.push(data[item].area_name);
          this.areaIdList.push(data[item].area_id);
        }
        this.depotName = this.areaList[0];
        localStorage.setItem('nowAreaId', this.areaIdList[0]);  //初始化给默认的仓库id

      },
      // 获取物料分类
      getCategory() {

        let data = depotList.category_list.data;
        for (let key in data) {
          this.goods.push({
            name: data[key].category_name,
            category_id: data[key].category_id,
            foods: []
          })
        }
      },
      // 请求物料接口
      getMaterielList() {

        let data = depotList.materiel_list.data.list;
        this.initGoods(data);
        this.$nextTick(() => {
          this.initScroll();
          this.getFoodListHeight();
        })
      },
      // 初始化goods物料数据
      initGoods(data) {
        for (let key in data) {
          let materiel_list = data[key];
          let category_id = materiel_list.materiel_info.top_category;
          let materiel_name = materiel_list.materiel_info.materiel_name;
          let materiel_id = materiel_list.materiel_id;
          let price = Number(materiel_list.price);
          let specification = materiel_list.materiel_info.specifications;
          let unit_id = materiel_list.materiel_info.unit_id;//显示单位id
          let unit_name = materiel_list.materiel_info.unit_list[unit_id].unit_name;
          for (let item in this.goods) {
            if (this.goods[item].category_id === category_id) {
              this.goods[item].foods.push({
                name: materiel_name,
                specification: specification,
                price: price,
                unit_name: unit_name,
                materiel_id: materiel_id,
                unit_id: unit_id,
                count: 0,
                amount: '0.00',
              });
            }
          }
        }
        this.changeGoods(this.goods)
      },
      // 根据当前供应商 仓库 判断是否操作过物料
      changeGoods(goods) {
        let selectFoodInfo = JSON.parse(localStorage.getItem('selectFoodInfo'));
        if (selectFoodInfo) {
          for (let key in selectFoodInfo) {
            if (key === this.curDepotId) {
              for (let areaId in selectFoodInfo[key]) {
                if (areaId === localStorage.getItem('nowAreaId')) {
                  selectFoodInfo[key][areaId].forEach((item) => {
                    this.goods.forEach((good) => {
                      good.foods.forEach((food) => {
                        if (food.materiel_id === item.materiel_id) {
                          food.count = item.count
                        }
                      })
                    })
                  })
                }
              }
            }
          }
        }
      },
      // 初始化iscroll
      initScroll() {
        if (!this.menuScroll) {
          this.menuScroll = new BScroll(this.$refs.menuWrapper, {
            click: true,
            probeType: 3
          })
        } else {
          this.menuScroll.refresh()
        }

        if (!this.foodsScroll) {
          this.foodsScroll = new BScroll(this.$refs.foodWrapper, {
            click: true,
            probeType: 3
          })
        } else {
          this.foodsScroll.refresh()
        }
        // 监听foodsScroll的滚动 纵轴Y的距离
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
          this.getScrollIndex()
        })
      },
      // 获取 foodList 高度值
      getFoodListHeight() {
        let _this = this;
        let height = 0;
        _this.foodListHeight.push(height);
        _this.$nextTick(() => {
          let foodList = _this.$refs.foodsListHook;
          for (let i = 0; i < foodList.length; i++) {
            height += foodList[i].clientHeight;
            _this.foodListHeight.push(height)
          }
        })
      },
      // 当 物料区foodListHeight滚动的时候  计算出滚动区间的index值
      getScrollIndex() {
        for (let i = 0; i < this.foodListHeight.length; i++) {
          let curHeight = this.foodListHeight[i];
          let nextHeight = this.foodListHeight[i + 1];
          if (this.scrollY >= curHeight && this.scrollY < nextHeight) {
            this.currentIndex = i
          }
        }
      },
      // 点击物料菜单 menu
      selectMenu(index, event) {
        if (!event._constructed) {
          return
        }
        this.currentIndex = index;
        // 点击物料菜单 跳转相应的物料详情
        this.$nextTick(() => {
          let foodList = document.getElementsByClassName('foods-list');
          this.foodsScroll.scrollToElement(foodList[index], 0, false, false);
        })
      },
      // 计算menu分类下的数量总和
      menuTotalCount(foods) {
        let count = 0;
        foods.forEach((food) => {
          if (food.count > 0) {
            count = this.accuracy.add(count, food.count)
          }
        });
        return count;
      },

      // 子组件派发来的事件
      addFood(target) {
        this._drop(target)
      },
      _drop(target) {
        this.$nextTick(() => {
          // 调用 shopcart 组件中的 drop 方法，向 shopcart 组件中传入当前点击 dom 对象
          this.$refs.shopCart.drop(target)
        })
      },
    }
  }

</script>

<style scoped lang="stylus">
  #goods
    width 100%
    height 100%
    display flex
    flex-flow column
    overflow hidden
    .search
      width 100%
      height 92px
      box-sizing border-box
      padding 12px
      display flex
      flex-flow nowrap
      background-color #f2f2f2
      position relative
      .tab_depot
        width 140px
        height 68px
        border 1Px solid #3691e4
        border-radius 4Px
        line-height 68px
      .search_frame
        flex 1
        width 100%
        border: 1Px solid #3691e4
        margin-left 10px
        box-sizing border-box
        padding 10px 0 12px 55px
        border-radius 4Px
        font-size 15Px
        &::placeholder
          color #999
          font-size 15Px
      .icon-shanchu1
        position absolute
        font-size 40px
        color #999
        top 20px
        left 550px
        padding 10px
      .search_btn
        width 120px
        height 68px
        box-sizing border-box
        padding 20px
        text-align center
        background #3691e4
        color #fff
        font-size 16Px
        border-radius 4Px
        margin-left 10px
      .icon_search
        position absolute
        top 30px
        left 180px
        font-size 30px
    #goods_wrapper
      flex 1
      display flex
      flex-flow nowrap
      box-sizing border-box
      margin-bottom 100px
      overflow hidden
      .menu-wrapper
        width 156px
        position relative
        z-index 10
        overflow hidden
        #menu-wrapper
          width 100%
          .menu-item
            width 100%
            min-height 108px
            background #F1F1F1
            box-sizing border-box
            padding 42px 25px
            position relative
            border-top 1Px solid #DFDFDF
            border-right 1Px solid #DFDFDF
            font-size 0
            position relative
            font-size 0
            .text
              font-size 24px
              font-family MicrosoftYaHei
              font-weight 400
              color rgba(51, 51, 51, 1)
              line-height 30px
              display inline-block
            .bar
              width 4Px
              height 100%
              background #F1F1F1
              position absolute
              top 0
              left 0
            .menuTotalCount
              display inline-block
              min-width 40px
              height 30px
              text-align center
              box-sizing border-box
              padding 4px
              vertical-align top
              border-radius 4Px
              background #3691e4
              position absolute
              z-index 25
              top 10px
              right 5Px
              color #fff
              font-size 20px
          .menu-item:first-child
            border-top 0
          .menu-item_active
            background #FFFFFF
            border-right 0
            .text
              color #3691e4
            .bar
              background #3691e4
      .foods-wrapper
        flex 1
        background-color: #fff;
        .foodsCon
          width 100%
          display flex
          flex-flow column
          overflow hidden
          .foods-list
            .menu_title
              box-sizing border-box
              padding 20px 30px 20px
              font-size 30px
              font-weight 700
              background #f1f1f1
              color #333
              position relative
              .bar
                position absolute
                width 4Px
                height 100%
                background #3691e4
                top 0
                left 0
            .food-item
              box-sizing border-box
              padding 30px
              display flex
              flex-flow column
              position relative
              .name
                font-size 32px
                color #333
                width 60%
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
              .extra
                font-size 22px
                color #666
                margin-top 22px
                display flex
                flex-flow nowrap
                span
                  flex 1
                  text-align left
              .cart_control_wrapper
                position absolute
                top 25px
                right 20px
            .food-item_search
              display block !important
</style>
