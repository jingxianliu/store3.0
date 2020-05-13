<template>
  <div class="dialog">
    <wxc-overlay v-if="show" :show="true" :hasAnimation="false"></wxc-overlay>
    <div class="dialog-body" v-if="show">
      <div class="dialog-title">
        <text class="dialog-title-text">{{content}}</text>
      </div>
      <div class="dialog-button">
        <image v-for="item in buttonImg" :key="item" :src="`${staticImg}/img/${item}.png`" class="dialog-img"></image>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@function cha($val) {
  @return round($val / 1920 * 75000) / 100;
}
@function zi($val) {
  @return floor($number: $val * 4 /10);
}
.dislog {
  position: fixed;
  width: 750px;
  /*兼容H5异常*/
  z-index: 99999;
  background-color: #4f6175;
}

.dialog-body {
  position: fixed;
  left: cha(532px);
  top: cha(275px);
  width: cha(856px);
  height: cha(530px);
  background-color: #4f6175;
  border-radius: cha(20px);
  align-items: center;
}
.dialog-title {
  height: cha(328px);
  width: cha(856px);
  background-color: #54687e;
}
.dialog-title-text {
  font-size: zi(46px);
  text-align: center;
  color: #d4f2ff;
  margin-top: cha(171px);
}
.dialog-button {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: center;
}
.dialog-img {
  width: cha(378px);
  height: cha(144px);
}
</style>

<script>
import WxcOverlay from './overlay'
import { staticImg } from '../utils/index'
export default {
  components: { WxcOverlay },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    single: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: '请更新应用！'
    },
    update: {
      type: Boolean,
      default: true
    },
    isCancel: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    staticImg: staticImg
  }),
  computed: {
    buttonImg: function () {
      if (this.update) {
        // 更新弹框
        if (this.isCancel) {
          // 取消
          return ['install_btn_normal', 'cancel_active']
        } else {
          // 下载
          return ['install_btn_active', 'cancel_normal']
        }
      } else {
        // 卸载弹框
        if (this.isCancel) {
          // 取消
          return ['uninstall_btn_normal', 'cancel_active']
        } else {
          // 卸载
          return ['uninstall_btn_active', 'cancel_normal']
        }
      }
    }
  }
}
</script>
