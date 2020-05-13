<template>
  <div
    class="circle"
    :style="circleStyle"
  >
    <div
      class="progressbar"
      :style="barStyle"
    >
      <div
        class="left-container"
        :style="leftContainerStyle"
      >
        <div
          class="left-circle"
          ref="leftCircle"
          :style="leftCircleStyle"
        >
          <div
            class="left-color"
            :style="leftColorStyle"
          ></div>
        </div>
      </div>
      <!-- 右边 -->
      <div
        class="right-container"
        :style="rightContainerStyle"
      >
        <div
          class="right-circle"
          ref="rightCircle"
          :style="rightCircleStyle"
        >
          <div
            class="right-color"
            :style="rightColorStyle"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const animation = weex.requireModule('animation')
export default {
  props: {
    circleWidth: '',
    circlePadding: '',
    circleRadius: '',
    containerWidth: ''
  },
  data () {
    return {}
  },
  computed: {
    circleStyle () {
      const circleWidth = this.pxToTV(this.circleWidth)
      const circlePadding = this.pxToTV(this.circlePadding)
      const circleRadius = this.pxToTV(this.circleRadius)
      return {
        width: circleWidth,
        height: circleWidth,
        padding: circlePadding,
        borderRadius: circleRadius
      }
    },
    barStyle () {
      const barWidth = this.pxToTV(this.containerWidth)
      return {
        width: barWidth,
        height: barWidth,
        borderRadius: barWidth / 2
      }
    },
    leftContainerStyle () {
      const containerWidth = this.pxToTV(this.containerWidth)
      return {
        width: containerWidth / 2,
        height: containerWidth
      }
    },
    rightContainerStyle () {
      const containerWidth = this.pxToTV(this.containerWidth)
      return {
        width: containerWidth / 2,
        height: containerWidth,
        left: containerWidth / 2
      }
    },
    leftCircleStyle () {
      const containerWidth = this.pxToTV(this.containerWidth)
      return {
        width: containerWidth,
        height: containerWidth,
        borderRadius: containerWidth / 2
      }
    },
    rightCircleStyle () {
      const containerWidth = this.pxToTV(this.containerWidth)
      return {
        width: containerWidth,
        height: containerWidth,
        borderRadius: containerWidth / 2,
        left: -containerWidth / 2
      }
    },
    leftColorStyle () {
      const containerWidth = this.pxToTV(this.containerWidth)
      return {
        width: containerWidth / 2,
        height: containerWidth,
        borderBottomLeftRadius: containerWidth / 2,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: containerWidth / 2,
        borderTopRightRadius: 0
      }
    },
    rightColorStyle () {
      const containerWidth = this.pxToTV(this.containerWidth)
      return {
        width: containerWidth / 2,
        height: containerWidth,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: containerWidth / 2,
        borderTopLeftRadius: 0,
        borderTopRightRadius: containerWidth / 2,
        left: containerWidth / 2
      }
    }
  },
  methods: {
    pxToTV (value) {
      return Math.floor(value / 1920 * 750)
    },
    /**
     *设置进度条的变化
     *@param {number} oldPercent    进度条改变之前的半分比
     *@param {number} curPercent    进度条当前要设置的值
     *@return {boolean} 设置成功返回 true，否则，返回fasle
     */
    setProgress (oldPercent, curPercent) {
      console.log('-----------:', oldPercent, '++++++++++', curPercent)
      let leftBar = this.$refs.leftCircle
      let rightBar = this.$refs.rightCircle
      // 将传入的参数转换，允许字符串表示的数字
      oldPercent = +oldPercent
      curPercent = +curPercent
      // 检测参数，如果不是number类型或不在0-100，则不执行
      if (
        typeof oldPercent === 'number' &&
        typeof curPercent === 'number' &&
        oldPercent >= 0 &&
        oldPercent <= 100 &&
        curPercent <= 100 &&
        curPercent >= 0
      ) {
        let baseTime = 1000 // 默认改变半圆进度的时间，单位豪秒
        let time = 0 // 进度条改变的时间
        let deg = 0 // 进度条改变的角度
        if (oldPercent > 50) {
          console.log('原来进度大于50', oldPercent)
          // 原来进度大于50
          if (curPercent > 50) {
            // 设置左边的进度
            time = (curPercent - oldPercent) / 50 * baseTime
            // 确定时间值为正
            // curPercent - oldPercent > 0 ? '' : (time = -time)
            deg = (curPercent - 50) / 50 * 180
            animation.transition(leftBar, {
              styles: {
                transform: 'rotate(' + deg + 'deg)'
              }
            })
          }
        } else {
          console.log('原来进度小于50时', oldPercent)
          // 原来进度小于50时
          if (curPercent > 50) {
            console.log('设置右边的进度>50', curPercent)
            // 设置右边的进度
            time = 50 / 50 * baseTime
            deg = 50 * 3.6
            animation.transition(rightBar, {
              styles: {
                transform: 'rotate(' + deg + 'deg)',
                opacity: curPercent > 50 ? 0 : 1
              }
            })
            // 延时设置左边进度条的改变
            setTimeout(function () {
              time = (curPercent - 50) / 50
              deg = (curPercent - 50) * 3.6
              console.log(deg)
              animation.transition(leftBar, {
                styles: {
                  transform: 'rotate(' + deg + 'deg)'
                }
              })
            }, Math.floor(time / 2))
          } else {
            console.log('设置右边的进度', curPercent)
            // 设置右边的进度
            time = (curPercent - oldPercent) / 50 * baseTime
            // 确定时间值为正
            time = curPercent - oldPercent > 0 ? '' : (time = -time)
            deg = curPercent / 50 * 180
            animation.transition(rightBar, {
              styles: {
                transform: 'rotate(' + deg + 'deg)'
              }
            })
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@function cha($val) {
  @return round($val / 1920 * 750);
}
.circle {
  width: cha(168px);
  height: cha(168px);
  justify-content: center;
  align-items: center;
  background-color: rgba($color: #ffffff, $alpha: 0.4);
  padding: cha(12px);
  border-radius: cha(84px);
}
.progressbar {
  width: cha(156px);
  height: cha(156px);
  border-radius: cha(78px);
  background-color: transparent;
}
.left-container {
  position: absolute;
  top: 0;
  overflow: hidden;
  left: 0;
}
.right-container {
  position: absolute;
  top: 0;
  overflow: hidden;
}
.left-circle {
  position: absolute;
  background-color: transparent;
  left: 0;
}
.right-circle {
  position: absolute;
  background-color: transparent;
}
.left-color {
  position: absolute;
  background-color: rgba($color: #000000, $alpha: 0.5);
  top: 0;
}
.right-color {
  position: absolute;
  background-color: rgba($color: #000000, $alpha: 0.5);
  top: 0;
}
</style>
