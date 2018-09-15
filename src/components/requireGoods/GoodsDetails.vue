<template>
  <div class="goodsDetails">
    <Header :childTitle="title"></Header>

    <section class="goods_details_wrapper" ref="goods_details_wrapper">
      <section class="details_wrapper_scroll">
        <!--订单信息-->
        <ul class="good_list">
          <h3 class="depot_name">{{$route.query.depot_name}}</h3>
          <section class="order_status" v-show="orderInfoShow" :class="orderStatusShow?'order_status_active':''">
            <p class="status_text">{{statusText}}</p>
          </section>
          <!--物料详情-->
          <li class="good_item van-hairline--bottom" v-for="item in selectFoodList" v-if="selectFoodInfo">
            <p class="name">{{item.name}}</p>
            <section class="food_info">
              <span class="count">规格：{{item.specification}}</span>
              <span class="unit">单位：{{item.unit_name}}</span>
              <span class="foods_num">{{item.count | number}}</span>
            </section>
          </li>
          <!--订单详情-->
          <li class="good_item van-hairline--bottom" v-for="item in returnFoodList" v-if="!selectFoodInfo">
            <p class="name">{{item.materiel_name}}</p>
            <section class="food_info">
              <span class="count">规格：{{item.specification_name}}</span>
              <span class="unit">单位：{{item.unit_name}}</span>
              <span class="foods_num">{{item.request_quantity | number}}</span>
            </section>
          </li>
          <!--物料总计-->
          <section class="total_info">
            <section class="total_auto"></section>
            <section class="total">
              <p class="total_num">
                数量合计:
                <span>{{allCount | number}}</span>
              </p>
              <p class="total_price">
                价格合计:
                <span>{{totalPrice | mouney}}</span>
              </p>
            </section>
          </section>
        </ul>
        <!--要货日期-->
        <section class="enquiry_date" v-show="!orderInfoShow">
          <p class="date_title">要货日期</p>
          <input class="date" v-model="enquiryDate" @focus="selectDate" type="text" placeholder="请选择要货日期">
        </section>
        <!--备注-->
        <section class="text" v-show="!orderInfoShow">
          <van-field
            class="autoText"
            v-model="message"
            label="备注"
            type="textarea"
            maxlength="200"
            placeholder="请输入备注信息(请输入200字以内)"
            rows="2"
            autosize/>
        </section>

        <!--要货订单信息-->
        <section class="order_wrapper" v-show="orderInfoShow">
          <p class="order_title">要货订单信息:</p>
          <p>订 单 号:<span class="order_num">{{orderNumber}}</span></p>
          <p>创建日期:<span class="create_date">{{enquiryDate}}</span></p>
          <p>要货日期:<span class="enquiry_order_date">{{orderAddTime}}</span></p>
          <p>备注信息:<span class="order_message">{{message===''?'无':message}}</span></p>
        </section>

        <!--保存 提交-->
        <section class="commit" v-show="orderFinish">
          <span class="save" @click="save" v-if="!orderInfoShow">保存</span>
          <span class="order_delete" @click="deleteOrder" v-else>删除</span>
          <span class="submit van-hairline--surround" @click="submit">提交</span>
        </section>
      </section>
    </section>
    <!--日期弹出框-->
    <van-actionsheet v-model="showCheckDate">
      <van-datetime-picker
        title="请选择要货日期"
        v-model="currentDate"
        :min-date="minDate"
        type="datetime"
        @confirm="confirm"
        @cancel="cancel"/>
    </van-actionsheet>
  </div>
</template>

<script>
  import Header from '../common/Header'
  import BScroll from 'better-scroll'

  export default {
    name: 'GoodsDetails',
    data() {
      return {
        title: '要货订单明细',
        statusText: '未确认',
        scroll: null,
        message: '',
        showCheckDate: false,
        minDate: new Date(),
        currentDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        enquiryDate: null,
        selectFoodList: [], //选择物料的列表
        allCount: 0,   //总数量
        totalPrice: 0,  //总价格
        orderInfoShow: false,
        orderStatusShow: false,
        orderNumber: '',
        orderAddTime: '',
        requestId: '', //request_id
        orderFinish: true,
        selectFoodInfo: localStorage.getItem('selectFoodInfo'),
        returnFoodList: [],//提交后显示的订单列表
      }
    },
    components: {Header},
    mounted() {
      this.$nextTick(() => {
        this.initScroll();
        this.initFoodList();

      })
    },
    methods: {
      // 初始化选择物料的列表
      initFoodList() {
        let _this = this;
        let selectFoodInfo = JSON.parse(localStorage.getItem('selectFoodInfo'));
        let depotId = _this.$route.query.depot_id; //供应商id
        let nowAreaId = localStorage.getItem('nowAreaId'); //仓库id
        _this.selectFoodList = selectFoodInfo[depotId][nowAreaId];

        for (let i in _this.selectFoodList) {
          let countA = _this.selectFoodList[i].count;
          let priceA = this.accuracy.multiply(_this.selectFoodList[i].price, _this.selectFoodList[i].count)
          _this.allCount = this.accuracy.add(_this.allCount, countA);
          _this.totalPrice = this.accuracy.add(_this.totalPrice, priceA)
        }
      },
      // 备注文字不能超过200个字
      limit() {
        if (this.message.length > 200) {
          this.$toast('备注（请输入200字以内）');
          return false
        } else {
          return true
        }
      },
      // 选择日期
      selectDate() {
        this.showCheckDate = true
      },
      // 选择日期 确定
      confirm(value) {
        this.enquiryDate = this.filters.fromDateAll(value);
        this.showCheckDate = false
      },
      // 选择日期  取消
      cancel() {
        this.showCheckDate = false
      },
      // 保存订单
      save() {
        if (!this.enquiryDate) {
          this.showCheckDate = true
        } else {
          this.saveRequest()
        }
      },

      // 提交订单
      submit() {
        if (!this.enquiryDate) {
          this.showCheckDate = true
        } else {
          this.orderStatusShow = true;
          this.statusText = '已完成';
          this.orderInfoShow = true;
          this.orderFinish = false;
          this.orderNumber = 'KM20180911';
          this.enquiryDate = this.filters.fromDateAll(new Date);
          this.orderAddTime = this.filters.fromDateAll(new Date);
          this.$toast('订单提交成功');
          this.deleteCurFoodsInfo(); //删除当前localstorage列表
        }
      },

      // 删除 订单
      deleteOrder() {
        this.$dialog.confirm({
          message: '确定删除订单？'
        }).then(() => {
          // 删除 localStorage 中的当前供应商 当前仓库的数据
          this.deleteCurFoodsInfo();
          this.removeRuest();
        }).catch(() => {

        });
      },
      // 删除订单api
      removeRuest() {
        let _this=this;
        this.$toast('订单删除成功');
        setTimeout(function () {
          _this.$router.push({
            path: '/goods',
            name: 'Goods',
            query: {
              depot_id: _this.$route.query.depot_id,
              depot_name: _this.$route.query.depot_name
            }
          })
        }, 1000)
      },
      // 保存订单api
      saveRequest() {
        this.orderInfoShow = true;
        this.orderNumber = 'KM20180911';
        this.enquiryDate = this.filters.fromDateAll(new Date);
        this.orderAddTime = this.filters.fromDateAll(new Date);
      },

      // 初始化iscroll
      initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.goods_details_wrapper, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      },
      //  删除 localStorage 中的当前供应商 当前仓库的数据 重新储存
      //  当订单提交 或者 删除 时  要删除相对应的localStorage
      deleteCurFoodsInfo() {
        let selectFoodInfo = JSON.parse(localStorage.getItem('selectFoodInfo'));
        let curAreaId = localStorage.getItem('nowAreaId');
        let curDepotId = this.$route.query.depot_id;
        for (let key in selectFoodInfo) {
          if (key === curDepotId) {
            for (let areaId in selectFoodInfo[key]) {
              if (areaId === curAreaId) {
                selectFoodInfo[key][areaId] = [];
              }
            }
          }
        }
        localStorage.setItem('selectFoodInfo', JSON.stringify(selectFoodInfo))
      },
    },
    filters: {}
  }
</script>

<style scoped lang="stylus">
  bg = #f2f2f2
  white = #fff

  .goodsDetails
    width 100%
    height 100%
    display flex
    flex-flow column
    overflow hidden
    .goods_details_wrapper
      flex 1
      background bg
      overflow hidden
      box-sizing border-box
      padding 30px 0
      .details_wrapper_scroll
        box-sizing border-box
        padding 0 30px
        .good_list
          background white
          position relative
          .depot_name
            color #333333
            font-size 32px
            width 100%
            padding 30px 0
            font-weight bold
            text-align center
          .order_status
            width 0
            height 0
            border-top 120px solid #3691e4
            border-left 120px solid rgba(0, 0, 0, 0)
            position absolute
            top 0
            right 0
            .status_text
              width 100px
              color white
              font-size 24px
              position absolute
              top -80px
              right -20px
              transform rotate(45deg)
          .order_status_active
            display block !important
            border-top 120px solid #14a724
          .good_item
            width 100%
            height 121px
            box-sizing border-box
            padding 15px
            .name
              font-weight 400
              font-size 32px
            .food_info
              font-weight 400
              margin-top 24px
              color #666666
              font-size 0
              display flex
              flex-flow nowrap
              justify-content space-between
              span
                font-size 22px
              .unit
                margin-left
              .foods_num
                color #3691e4
          .total_info
            width 100%
            height 121px
            box-sizing border-box
            padding 20px
            display flex
            flex-flow nowrap
            .total_auto
              flex 1
            .total
              min-width 300px
              font-size 24px
              p
                font-size 24px
                color #333333
                span
                  color #3691e4
              .total_num
                margin-bottom 20px

        .enquiry_date
          margin 30px 0
          width 100%
          height 80px
          background white
          display flex
          flex-flow nowrap
          align-items center
          box-sizing border-box
          padding 12px
          .date_title
            font-size 22px
            color #333
            width 100px
          .date
            flex 1
            width 900px
            outline none
            border 0
            margin-left 20px
            font-size 26px
            color #333333
            &::placeholder
              font-size 26px
        .text
          min-height 40px
          .autoText
            display flex
            flex-flow nowrap
            align-items center
            min-height 40px
            .van-field__body
              padding-top 10px !important
              display flex
              align-items center
        .order_wrapper
          margin 30px 0
          color #333333
          box-sizing border-box
          padding 20px
          background #ffffff
          .order_title
            font-size 32px
            font-weight bold
          p
            font-size 24px
            font-weight 400
            margin-bottom 20px
            .order_message
              line-height 30px

        .commit
          display flex
          flex-flow nowrap
          align-items center
          justify-content space-between
          margin-top 30px
          font-size 0
          span
            display inline-block
            width 315px
            height 60px
            border-radius 6px
            font-size 30px
            box-sizing border-box
            padding 16px 0
            text-align center
          .save
            background #3691e4
            color white
          .order_delete
            background #3691e4
            color white
          .submit
            color #3691e4
            background white
            margin-right 1Px
          .van-hairline--surround
            &::after
              border-color #3691e4 !important
</style>
