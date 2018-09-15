<template>
  <section class="interview">
    <Header :childTitle="title"></Header>
    <section class="vertical" id="vertical">
      <section class="inner"></section>
    </section>
  </section>

</template>

<script>
  import Header from './common/Header'

  export default {
    name: "interview",
    components: {Header},
    data() {
      return {
        title: '面试'
      }
    },
    mounted(){
      this.changeColor()
    },
    methods:{
      changeColor(){
        let parent = document.getElementById('vertical');
        let child = document.getElementsByClassName('inner')[0];
        let p = document.createElement('p');
        p.innerHTML = 'nihao'
        parent.appendChild(p)
        parent.removeChild(child)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .interview
    width 100%
    height 100%
    .vertical
      width 100%
      height 10rem
      background #3691e4
      position relative
      .inner
        position absolute
        top 50%
        left 50%
        transform translate(-50%,-50%)
        width 5rem
        height 5rem
        background red

</style>
