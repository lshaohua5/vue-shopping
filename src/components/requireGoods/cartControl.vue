<template>
  <div class="cartcontral">
    <i class="cart-decrease iconfont icon-jian" @click.stop="changeCount(-1)"></i>
    <input class="cart-count" type="number" ref="input"
           @focus="autoText($event)"
           @click="autoText($event)"
           onpaste="return false"
           oncontextmenu="return false"
           oncopy="return false"
           oncut="return false"
           v-model="food.count">
    <i class="cart-add iconfont icon-jia2" @click.stop="changeCount(1)"></i>
  </div>
</template>

<script>
  export default {
    name: 'cartControl',
    props: {
      food: {
        type: Object
      }
    },
    watch: {
      // 只有是数字时才能保存  否则自动制为0
      food: {
        handler(curVal) {
          if (curVal.count === '') {
            curVal.count = 0;
            this.$toast('请输入正确的数字或不能为空');
          }
        },
        deep: true
      }
    },
    methods: {
      // input聚焦  自动选择文本
      autoText(e) {
        e.currentTarget.select();
        // this.$refs.input.select();
      },
      // 物料加减
      changeCount(type) {
        if (type > 0) {
          this.food.count++;
          this.$emit('add', event.target)
        } else {
          if (this.food.count === 0) {
            this.food.count = 0;
          } else {
            this.food.count--
          }
        }
      },
    }
  }
</script>

<style scoped lang="stylus">
  .cartcontral
    font-size 0
    display flex
    flex-flow nowrap
    align-items center
    .iconfont
      font-size 40px
      color #3691e4
    .icon-jia2
      font-size 45px
    .cart-count
      width 80px
      height 35px
      font-size 28px
      margin 0 5Px
      border 1Px solid #3691e4
      border-radius 4Px
      color #000
      text-align center
</style>
