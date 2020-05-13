<template>
    <div class="container">
      <image src="local:///bd" class="bd"></image>
      <div class="err-box">
        <image src="local:///no_network" class="err-img"></image>
        <div>
          <text class="err-text">网络链接失败，请查验</text>
        </div>
        <div class="err-buttons">
          <image v-for="item in buttonImg" :key="item" :src="`local:///${item}`" class="err-button"></image>
        </div>
      </div>
    </div>
</template>

<script>
const globalEvent = weex.requireModule('globalEvent')
const myModule = weex.requireModule('myModule')
const navigator = weex.requireModule('navigator')
const storage = weex.requireModule('storage')
export default {
  data: () => ({
    isBack: false
  }),
  computed: {
    buttonImg: function () {
      if (this.isBack) {
        // 退出大厅
        return ['err_load_normal', 'err_back_active']
      } else {
        return ['err_load_active', 'err_back_normal']
      }
    }
  },
  created () {
    // 监听遥控器键值
    globalEvent.addEventListener('keyDown', e => {
      console.log(`错误页监听键值`)
      this.autoFocus(e.keyDown)
    })
  },
  methods: {
    autoFocus (code) {
      if (code === 4) {
        myModule.finish()
        storage.removeItem('installApps')
        storage.removeItem('localApps')
      } else if (code === 23 || code === 66) {
        if (this.isBack) {
          myModule.finish()
          storage.removeItem('installApps')
          storage.removeItem('localApps')
        } else {
          if (myModule.getInternetStatus()) {
            const url = 'pages/index/entry.js'
            navigator.push({
              url,
              animated: 'true'
            })
          }
        }
      } else if (code === 21 || code === 22) {
        this.isBack = !this.isBack
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@function cha($val) {
  @return round($val / 1920 * 75000) / 100;
}
@function zi($val) {
  @return floor($number: $val * 4 /10);
}
.container {
  width: cha(1920px);
  height: cha(1080px);
}
.bd {
  width: cha(1920px);
  height: cha(1080px);
  position: absolute;
  top: 0;
  left: 0;
}
.err-box {
  justify-content: center;
  align-items: center;
  margin-top: cha(300px);
}
.err-img {
  width: cha(348px);
  height: cha(240px);
  margin-bottom: cha(60px);
}
.err-req-img {
  width: cha(251px);
  height: cha(243px);
  margin-bottom: cha(60px);
}
.err-text {
  font-size: zi(32px);
  color: #4da5bd;
  margin-bottom: cha(60px);
}
.err-buttons {
  flex-direction: row;
  justify-content: center;
}
.err-button {
  width: cha(368px);
  height: cha(127px);
}
</style>
