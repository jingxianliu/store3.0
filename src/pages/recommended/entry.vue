<template>
  <scroller
    scroll-direction="horizontal"
    class="main"
  >
    <div
      ref="mainDiv"
      class="main-b"
    >
      <Seat
        v-for="(item, index) in seatDatas"
        :key="item.imgURL"
        :class="[item.className]"
        :toolText="item.title"
        :type="item.type"
        :imgURL="item.imgURL"
        :tagURL="item.superscript"
        :index="index"
        :data='item'
        :focus="code"
        :isVod="vodHide"
        :ref="'A' + index"
      ></Seat>
    </div>
  </scroller>
</template>

<script>
import Seat from '../../components/seat'
const dom = weex.requireModule('dom')
const animation = weex.requireModule('animation')
export default {
  components: {
    Seat
  },
  props: {
    seatDatas: Array,
    seatCode: String,
    pageShow: Boolean,
    vodHide: Boolean
  },
  data () {
    return {
      translatex: 0
    }
  },
  computed: {
    code: function () {
      if (this.seatCode.includes('A')) {
        return parseInt(this.seatCode.slice(1))
      } else {
        return null
      }
    },
    shouldShow () {
      console.log(`--------${this.pageShow}----------`)
      return {
        opacity: this.pageShow ? 1 : 0
      }
    }
  },
  methods: {
    test (old, now) {
      console.log(`---------原焦点/现焦点------${old}----${now}------`)
      const oldElement = old ? this.$refs[`${old}`][0] : null
      const element = now ? this.$refs[`${now}`][0] : null
      const mainElement = this.$refs.mainDiv
      const maxWidth = 750
      const minWidth = Math.round(80 / 1920 * 750 * 100) / 100
      // const interspace = Math.round(23 / 1920 * 750 * 100) / 100
      console.log(minWidth, maxWidth)
      // 第一个位置
      if (oldElement) {
        animation.transition(oldElement, {
          styles: {
            transform: 'scale(1.0)'
          },
          duration: 1
        })
        if (old === 'A0') {
          this.$refs.A0[0].scaleVod(false)
        }
      }
      if (element) {
        dom.getComponentRect(element, option => {
          console.log(`----下一屏焦点位置${option.size.left}-${option.size.width}---`)
          let size = option.size
          if (size.left + size.width > maxWidth) {
            // 超出一屏 右
            const isDouble = this.seatDatas.length % 2 === 0
            let isLast = this.seatDatas.length - now.slice(1)
            if (isDouble) {
              // 1 2 true
              isLast = isLast === 1 || isLast === 2
            } else {
              // 1 true
              isLast = isLast === 1
            }
            if (isLast) {
              // this.translatex += size.left + size.width - maxWidth + interspace
              this.translatex += 166
            } else {
              this.translatex += 148
              // this.translatex += size.left + size.width - maxWidth + interspace
            }
            console.log(`------动画右X距离-${this.translatex}px------`)
            animation.transition(mainElement, {
              styles: {
                transform: `translateX(-${this.translatex}px)`
              },
              duration: 1
            })
          } else if (size.left < minWidth) {
            // 左
            if (parseInt(now.slice(1)) === 0) {
              this.translatex = 0
            } else {
              this.translatex = this.translatex - (minWidth - size.left)
            }
            console.log(`------动画左X距离${this.translatex}px------`)
            animation.transition(mainElement, {
              styles: {
                transform: `translateX(-${this.translatex}px)`
              },
              duration: 1
            })
          }
        })
        animation.transition(element, {
          styles: {
            transform: 'scale(1.06)'
          },
          duration: 1
        }, res => {
          if (now === 'A0') {
            this.$refs.A0[0].scaleVod(true)
          }
        })
      }
    },
    // 回到初始状态
    tabChange () {
      this.translatex = 0
      animation.transition(this.$refs.mainDiv, {
        styles: {
          transform: `translateX(0px)`
        },
        duration: 300,
        timingFunction: 'ease',
        delay: 100
      })
    },
    restart () {
      this.$refs.A0[0].restart()
    },
    resume () {
      this.$refs.A0[0].resume()
    },
    stop () {
      this.$refs.A0[0].stop()
    },
    pause () {
      this.$refs.A0[0].pause()
    },
    setProgress (value, index) {
      console.log('-------------progress-------', value)
      this.$refs[`A${index}`][0].setProgress(value)
    },
    appearOverlay (bool) {
      console.log(bool)
      // const duration = 5000
      // if (this.$refs['mainDiv']) {
      // animation.transition(
      //   this.$refs['mainDiv'],
      //   {
      //     styles: {
      //       opacity: bool ? 1 : 0
      //     },
      //     duration,
      //     timingFunction: 'ease-out',
      //     delay: 0
      //   },
      //   () => {
      //     console.log('apper dddddd')
      //   })
      // }
    }
  }
}
</script>

<style scoped lang='scss'>
@function cha($val) {
  @return round($val / 1920 * 750 * 100) / 100;
}
.main {
  width: cha(1920px);
  flex-direction: row;
}
.main-b {
  padding-left: cha(80px);
  padding-top: cha(62px);
  padding-bottom: cha(100px);
  height: cha(860px);
  flex-wrap: wrap;
}

.first {
  width: cha(825px);
  height: cha(660px);
  margin-right: cha(24px);
  text-align: center;
}
.second {
  width: cha(500px);
  height: cha(660px);
  margin-right: cha(24px);
}
.third {
  width: cha(400px);
  height: cha(416px);
  margin-right: cha(24px);
  margin-bottom: cha(24px);
}
.four {
  width: cha(400px);
  height: cha(220px);
  margin-right: cha(24px);
}
</style>
