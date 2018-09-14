<template>
  <div class="depotList">
    <Header :childTitle="title"></Header>
    <section class="depotList_wrapper" ref="depotList_wrapper">
      <section class="depotList_scroll">
        <div class="depotListBox van-hairline--bottom"
             v-for="(item,index) in depotList"
             :key="item.depot_id"
             :class="index%2===0?'depotList_even':''"
             @click="tabDepot(item)">
          <van-row>
            <van-col span="20">
              <div class="depotName">{{item.depot_name}}</div>
              <van-row>
                <van-col span="12">
                  <div class="f1">电话：</div>
                  <div class="f1 m1">地址：</div>
                </van-col>
                <van-col span="12">
                  <div class="f1">联系人：</div>
                  <div class="f1 m1"></div>
                </van-col>
              </van-row>
            </van-col>
            <van-col span="4" style="text-align: right;margin-top: 20px">
              <van-icon name="arrow"/>
            </van-col>
          </van-row>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
  import Header from '../common/Header'
  import BScroll from 'better-scroll'
  import depotList from '@/../static/data.js'

  export default {
    name: 'DepotList',
    data() {
      return {
        title: '供应商列表',
        scroll: null,
        depotList: [], //供应商列表
      }
    },
    components: {Header},
    mounted() {
      this.$nextTick(() => {
        this.getDepotList(); //获取供应商列表
        this.initScroll();
      });
    },
    methods: {
      getDepotList() {
        let data = depotList.depot_list.data;
        console.log(data)
        for (let i in data.depot_info) {
          for (let j in data.depot_info[i]) {
            let deoptObj = {
              depot_name: data.depot_info[i][j].depot_name,
              depot_id: data.depot_info[i][j].depot_id,
            };
            this.depotList.push(deoptObj);
          }
        }
      },
      // 切换供应商
      tabDepot(item) {
        this.$router.push({
          path: '/goods',
          name: 'Goods',
          query: {depot_id: item.depot_id, depot_name: item.depot_name}
        })
      },
      // 初始化iscroll
      initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.depotList_wrapper, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .depotList
    width 100%
    height 100%
    display flex
    flex-flow column
    overflow hidden
    .depotList_wrapper
      flex 1
      overflow hidden
      .depotList_scroll
        .depotListBox
          padding 20px
          font-size 16px
          .depotName
            color #333333
            font-size 32px
            font-weight bold
            margin-bottom 20px
          .f1
            color #666
          .m1
            margin-top 15px
        .depotList_even
          background #fafafa
</style>
