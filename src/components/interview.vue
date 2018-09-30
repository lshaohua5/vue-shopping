<template>
  <section class="interview">
    <Header :childTitle="title"></Header>
    <section class="vertical">
      <section class="right">
      </section>
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
        title: '面试',
        arr: [1, 7, 34, 123, 2,34,12, 32, 212, 3],
        //str: 'http://www.runoob.com/jquery/misc-trim.html?channelid=12333&name=xiaoming&age=23',
        endTime: '2018-9-21 00:00:00',
        str: 'rwrfsdfdfgrthdzfvfff',
        array: [1,4,-8,-3,6,12,9,8]
      }
    },
    mounted() {
      console.log(this.quickSort4(this.array))
    },

    methods: {

      // 排序
      quickSort3(arr) {
        for (var i = 0; i < arr.length - 1; i++) {
          for (var j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] < arr[j + 1]) {
              var temp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = temp
            }
          }
        }
        console.log(arr)
      },

      quickSort4(arr) {
        var index = Math.floor(arr.length / 2);
        var value = arr.splice(index, 1);
        var left = [], right = [];
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] > value) {
            left.push(arr[i])
          } else {
            right.push(arr[i])
          }
        }
        return this.quickSort4(left).concat(value,this.quickSort4(right))
      },
      //
      reverse(arr) {
        var result = [];
        for (var i = arr.length - 1; i >= 0; i--) {
          result.push(arr[i])
        }
        console.log(result)
      },
      count(str) {
        var obj = {};
        for (var i = 0; i < str.length; i++) {
          if (!obj[str[i]]) {
            obj[str[i]] = 1
          } else {
            obj[str[i]] += 1
          }
        }
        console.log(obj)
        var num = 0, temp = '';
        for (var key in obj) {
          if (obj[key] > num) {
            num = obj[key];
            temp = key
          }
        }
        console.log(temp + '出现' + num + '最多')
      },
      /*b(x,y,a){
        arguments[2]=10;
        alert(a)
      },*/
      b() {
        for (let i = 0; i < 10; i++) {
          (function (i) {
            setTimeout(function () {
              console.log(i)
            }, 0)
          })(i)


        }
      },
      //
      sort1(arr) {
        arr.sort((a, b) => {
          return a - b
        });
        console.log(arr)
      },
      // bibao
      close() {
        for (var i = 0; i < 5; i++) {
          (function (i) {
            setTimeout(function () {
              console.log(i)
            }, 1000)
          })(i)
        }
        console.log(i)
      },
      // 倒计时
      // 动态生成li
      createLi() {
        let Right = document.getElementsByClassName('right')[0]
        let htmlDom = '';
        for (let i = 0; i < 3; i++) {
          htmlDom += '<li>' + i + '</li>'
        }
        Right.innerHTML = htmlDom;
        // console.log(document.querySelectorAll('li'))
        this.closeLi(document.querySelectorAll('li'))
      },
      // 闭包
      closeLi(li) {
        for (var i = 0; i < li.length; i++) {
          li[i].onclick = (function (i) {
            return function () {
              console.log(i)
            }
          })(i)
        }
      },
      // 生成li
      create() {
        let lis = document.querySelectorAll('li');
        for (var i = 0; i < lis.length; i++) {
          lis[i].onclick = (function (a) {
            return function () {
              console.log(a)
            }
          })(i)
        }
      },
      // 获取key值
      getKey(str) {
        let str1 = str.split('?')[1];
        console.log(str1.split('&'));
        let obj = {};
        for (let i = 0; i < str1.split('&').length; i++) {
          let objK = str1.split('&')[i].split('=');
          obj[objK[0]] = objK[1]
        }
        console.log(obj)
      },
      // 排序
      // 数组去重
      unique(arr) {
        arr.sort();
        let temp = [arr[0]];
        for (let i = 1; i < arr.length; i++) {
          if (arr[i] !== temp[temp.length - 1]) {
            temp.push(arr[i])
          }
        }
        console.log(temp)
      },
      // 对象方法

      unique1(arr) {
        let obj = {}, result = [], type;
        for (let i = 0; i < arr.length; i++) {
          type = typeof arr[i];
          if (!obj[arr[i]]) {
            obj[arr[i]] = [type];
            result.push(arr[i]);
          } else if (obj[arr[i]].indexOf(type) === -1) {
            obj[arr[i]].push(type);
            result.push(arr[i]);
          }
        }
        console.log(obj)

      },
      // 冒泡排序
      sort2(arr) {
        for (let i = 0; i < arr.length - 1; i++) {
          for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
              let temp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = temp;
            }
          }
        }
        console.log(arr)
      },
      quickSort1(arr) {
        let index = Math.floor(arr.length / 2);
        let value = arr.splice(index, 1);
        console.log(value)
        var left = [], right = [];
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] < value) {
            left.push(arr[i])
          } else {
            right.push(arr[i])
          }
        }
        return this.quickSort1(left).concat(value, this.quickSort1(right));
      },
      quickSort(arr) {
        //如果数组长度小于等于1，则返回数组本身
        if (arr.length <= 1) {
          return arr;
        }
        //定义中间值的索引
        var index = Math.floor(arr.length / 2);
        console.log(index)
        //取到中间值
        var temp = arr.splice(index, 1);
        console.log(temp)

        //定义左右部分数组
        var left = [];
        var right = [];
        for (var i = 0; i < arr.length; i++) {
          //如果元素比中间值小，那么放在左边，否则放右边
          if (arr[i] < temp) {
            left.push(arr[i]);
          } else {
            right.push(arr[i]);
          }
        }
        return this.quickSort(left).concat(temp, this.quickSort(right));
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
      height 500Px
      background #333
      position relative
      .right
        width 300Px
        height 300Px
        background #fff
        position absolute
        top 50%
        left 50%
        transform translate(-50%, -50%)

      @keyframes move
        from
          left 50%
          transform rotate(0deg)
          background #FFFFFF
        to
          left 40%
          transform rotate(360deg)
          background red

</style>
