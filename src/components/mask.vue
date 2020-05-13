<template>
  <div class="mask">
    <overlay :show="show && hasOverlay"
                 v-if="show"
                 v-bind="mergeOverlayCfg"
                 :can-auto-close="overlayCanClose"
                 ></overlay>
    <div ref="wxc-mask"
      class="wxc-mask"
      v-if="show"
      :hack="shouldShow"
      :style="maskStyle">
      <text :style="contentStyle">{{contentText}}</text>
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

.mask {
  position: fixed;
  width: 750px;
  height: 600px;
  /*兼容H5异常*/
  z-index: 99999;
}

.wxc-mask {
  position: fixed;
  top: 300px;
  left: 60px;
  width: 702px;
  height: 800px;
  justify-content: center;
  align-items: center;
}
</style>

<script>
import overlay from './overlay'
const animation = weex.requireModule('animation')

export default {
  components: { overlay },
  props: {
    height: {
      type: [String, Number],
      default: 800
    },
    width: {
      type: [String, Number],
      default: 607.5
    },
    top: {
      type: Number,
      default: 0
    },
    show: {
      type: Boolean,
      default: false
    },
    contentText: {
      type: String,
      default: '应用安装中'
    },
    duration: {
      type: [String, Number],
      default: 300
    },
    hasOverlay: {
      type: Boolean,
      default: true
    },
    hasAnimation: {
      type: Boolean,
      default: true
    },
    timingFunction: {
      type: Array,
      default: () => ['ease-in', 'ease-out']
    },
    overlayCfg: {
      type: Object,
      default: () => ({
        hasAnimation: true,
        timingFunction: ['ease-in', 'ease-out'],
        canAutoClose: true,
        duration: 300,
        opacity: 0.6
      })
    },
    borderRadius: {
      type: [String, Number],
      default: 0
    },
    overlayCanClose: {
      type: Boolean,
      default: true
    },
    maskBgColor: {
      type: String,
      default: '#ffffff'
    },
    contentTextColor: {
      type: String,
      default: '#d4f2ff'
    },
    fontSize: {
      type: [String, Number],
      default: 50
    }
  },
  data: () => ({
    opened: false
  }),
  computed: {
    mergeOverlayCfg () {
      return {
        ...this.overlayCfg,
        hasAnimation: this.hasAnimation
      }
    },
    maskStyle () {
      const { width, height, hasAnimation, opened, top } = this
      const newHeight = this.pxToTV(height)
      const newWidth = this.pxToTV(width)
      const newTop = this.pxToTV(top)
      const pageHeight = 1080 / 1920 * 750
      return {
        width: newWidth + 'px',
        height: newHeight + 'px',
        left: (750 - newWidth) / 2 + 'px',
        top: (newTop || (pageHeight - newHeight) / 2) + 'px',
        backgroundColor: this.maskBgColor,
        borderRadius: this.borderRadius + 'px',
        opacity: hasAnimation && !opened ? 0 : 1
      }
    },
    contentStyle () {
      return {
        fontSize: Math.floor(this.fontSize * 4 / 10),
        color: this.contentTextColor
      }
    },
    shouldShow () {
      const { show, hasAnimation } = this
      hasAnimation &&
        setTimeout(() => {
          this.appearMask(show)
        }, 500)
      return show
    }
  },
  methods: {
    pxToTV (value) {
      return Math.floor(value / 1920 * 750)
    },
    closeIconClicked () {
      setTimeout(() => {
        this.appearMask(false)
      }, 300)
    },
    wxcOverlayBodyClicking () {
      if (this.hasAnimation) {
        this.appearMask(false)
        this.$emit('wxcOverlayBodyClicking', {})
      }
    },
    wxcOverlayBodyClicked () {
      if (!this.hasAnimation) {
        this.appearMask(false)
        this.$emit('wxcOverlayBodyClicked', {})
      }
    },
    needEmit (bool = false) {
      this.opened = bool
      !bool && this.$emit('obMaskSetHidden', {})
    },
    appearMask (bool, duration = this.duration) {
      const { hasAnimation, timingFunction } = this
      const maskEl = this.$refs['wxc-mask']
      if (hasAnimation && maskEl) {
        animation.transition(
          maskEl,
          {
            styles: {
              opacity: bool ? 1 : 0
            },
            duration,
            timingFunction: timingFunction[bool ? 0 : 1],
            delay: 0
          },
          () => {
            bool && this.closeIconClicked()
            !bool && this.$emit('obMaskSetHidden', {})
          }
        )
      } else {
        this.needEmit(bool)
      }
    }
  }
}
</script>
