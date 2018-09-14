<template>
  <div class="list">
    <Header :childTitle="title"></Header>
    <div class="listBox">
      <van-row>
        <div @click="gotoDepotList">
          <van-col span="8">
            <img src="../assets/summary.png" alt="">
            <div class="f1">要货</div>
          </van-col>
        </div>
        <div @click="gotoCollect">
          <van-col span="8">
            <img src="../assets/request.png" alt="">
            <div class="f1">收货</div>
          </van-col>
        </div>
        <div @click="gotoHistory">
          <van-col span="8">
            <img src="../assets/history.png" alt="">
            <div class="f1">历史订单</div>
          </van-col>
        </div>
      </van-row>
    </div>
  </div>
</template>

<script>
  import Header from './common/Header'
  export default {
    name: 'list',
    data() {
      return {
         title: '供应商'
      }
    },
    components:{Header},
    mounted() {

    },
    methods: {
      //要货的供应商列表
      gotoDepotList(){
        this.$router.push({path: '/depotList'});
      },
      //收货
      gotoCollect(){
        this.$toast('收货暂无')
        //this.$router.push({path: '/depotList'});
      },
      //历史订单
      gotoHistory(){
        this.$toast('历史订单暂无')
        //this.$router.push({path: '/depotList'});
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  .listBox
    margin-top 60px
    text-align center
  .listBox img
    width 109px
  .f1
    font-size 24px
    margin-top 10px
</style>
