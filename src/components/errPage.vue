<template>
    <div class="container">
      <image src="local:///bd" class="bd"></image>
      <div class="err-box">
        <image src="local:///no_network" class="err-img" v-if="isNoNetwork"></image>
        <image src="local:///req_error" class="err-img" v-else></image>
        <div>
          <text class="err-text" v-if="isNoNetwork">网络链接失败，请查验</text>
          <text class="err-text" v-else>噢...系统出现异常，请稍等</text>
        </div>
        <div class="err-buttons">
          <image v-for="item in buttonImg" :key="item" :src="`local:///${item}`" class="err-button"></image>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    isNoNetwork: {
      type: Boolean,
      default: false
    },
    isBack: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({}),
  computed: {
    buttonImg: function () {
      if (this.isBack) {
        // 退出大厅
        return ['err_load_normal', 'err_back_active']
      } else {
        return ['err_load_active', 'err_back_normal']
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
