<template>
  <div id="header">
    <van-nav-bar class="header" :title="childTitle" left-text="返回" left-arrow fixed @click-left="onClickLeft"/>
  </div>
</template>

<script>
  export default {
    name: 'Header',
    data() {
      return {}
    },
    props: ['childTitle'],
    mounted() {

    },
    methods: {
      onClickLeft() {
        if (this.$route.path === '/goodsDetails') {
          this.$router.push({
            path: '/goods',
            name: 'Goods',
            query: {
              depot_id: this.$route.query.depot_id,
              depot_name: this.$route.query.depot_name
            }
          })
        } else if (this.$route.path === '/goods') {
          this.$router.push({
            path: '/depotList',
            name: 'DepotList'
          })
        } else {
          this.$router.push({
            path: '/',
            name: 'List'
          })
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  whiteColor = #FFF
  #header
    width 100%
    height 89px
    .header
      width 100%
      height 89px
    .van-nav-bar
      background url("../../assets/hearder.jpg") no-repeat
      -webkit-background-size: cover
      background-size: cover
      color whiteColor
      height 89px
      line-height 89px
</style>
