<template>
  <!-- 挽留界面 -->
  <div class="retain">
    <image
      :src="`${staticImg}/img/bd-img.png`"
      class="bd"
    ></image>
    <text class="other-app-top">小主~还有更多精彩内容等你体验~</text>
    <div class="other-app-divs">
      <div
        v-for="(item, index) in otherApps"
        :key="item.url"
        class="other-app-div"
        :ref="`R${index}`"
      >
        <image
          :src="imgBaseUrl + item.thumbnail[0].image_url"
          class="other-app-img"
        ></image>
        <div class="other-app-title">
          <text class="other-app-title-text">{{item.title}}</text>
        </div>
      </div>
    </div>
    <div class="other-app-buttons">
      <image
        :src="`local:///${retainCode.includes('C') && retainCode === 'C0' ? 'retain_active' : 'retain_normal'}`"
        :class="[retainCode.includes('C') && retainCode === 'C0' ? 'other-button-active' : 'other-button']"
      ></image>
      <image
        :src="`local:///${retainCode.includes('C') && retainCode === 'C1' ? 'retain_back_active' : 'retain_back_normal'}`"
        :class="[retainCode.includes('C') && retainCode === 'C1' ? 'other-button-active' : 'other-button']"
      ></image>
    </div>
  </div>
</template>

<script>
import { API, baseImg, createLink, staticImg } from '../utils/index'
import { getRetainSeat } from '../utils/getSeat'
const animation = weex.requireModule('animation')
const stream = weex.requireModule('stream')
const myModule = weex.requireModule('myModule')
const storage = weex.requireModule('storage')
const navigator = weex.requireModule('navigator')
export default {
  data () {
    return {
      staticImg: staticImg,
      baseImg: baseImg,
      retainCode: 'C1',
      otherApps: [],
      imgBaseUrl: baseImg
    }
  },
  methods: {
    // 挽留界面展示
    retainPage () {
      stream.fetch(
        {
          method: 'GET',
          url: `${API}/portal/439c165a-9854-35d1-b31b-ce312602291f/apk?num_display=4`,
          type: 'json'
        },
        res => {
          console.log(res)
          let data = res.data.objects
          if (data.length > 1) {
            this.otherApps = data
          }
        }
      )
    },
    // 挽留焦点
    retainFocus (code) {
      let now = this.retainCode
      let index = parseInt(now.slice(1))
      if (code === 4) {
        this.backApp()
      } else if (code === 23) {
        // 跳详情页
        if (now.includes('B')) {
          console.log('选择应用',this.otherApps[index])
          let packageName = this.otherApps[index].package_name
          const versionCode = this.otherApps[index].version_code
          let params = {
            packageName: packageName,
            versionCode: versionCode
          }
          // 页面取消
          this.$emit('retain', false)
          // this.isRetain = false
          const isLocal = myModule.getInstalledAppVersion(packageName)
          console.log(`---本地存在应用'${packageName}----, ---版本号${isLocal}---,线上版本号${versionCode}-----`)
          if (isLocal && !(versionCode - isLocal> 0)) {
            // 1. 判断应用是否存在
            myModule.startApp(packageName)
          } else {
            // 跳转页面
            const url = createLink('appDetails', params)
            this.$emit('retain', 'isIndex')
            // this.isIndex = false
            navigator.push({
              url,
              animated: 'true'
            })
          }
        } else {
          if (index === 0) {
            this.backApp()
          } else {
            // 页面取消 第一页视频重播
            this.$emit('retain', false)
            this.retainCode = 'C1'
            // if (this.pageIndex === 0) {
            //   this.$refs[`page${this.pageIndex}`].restart()
            // }
          }
        }
      } else {
        // 左右选择 上下选择
        code = code >= 19 || code <= 23 ? code - 19 : null
        let nextCode = getRetainSeat(now, code)
        console.log('下一步', nextCode)
        if (nextCode) {
          this.retainCode = nextCode
          this.retain2d(now, nextCode)
        }
      }
    },
    // 挽留动画
    retain2d (old, now) {
      // 从B => C
      console.log('挽留动画', old, now)
      if (old.includes('B')) {
        if (now.includes('C')) {
          // B => C
          let index = old.slice(1)
          animation.transition(this.$refs['R' + index][0], {
            styles: {
              transform: 'scale(1)'
            }
          })
        } else {
          // B => B
          let oldIndex = old.slice(1)
          let index = now.slice(1)
          animation.transition(this.$refs['R' + oldIndex][0], {
            styles: {
              transform: 'scale(1)'
            }
          })
          animation.transition(this.$refs['R' + index][0], {
            styles: {
              transform: 'scale(1.06)'
            }
          })
        }
      } else {
        // C => B
        if (now.includes('B')) {
          let index = now.slice(1)
          animation.transition(this.$refs['R' + index][0], {
            styles: {
              transform: 'scale(1.06)'
            }
          })
        }
      }
    },
    // 退出
    backApp () {
      storage.removeItem('installApps')
      storage.removeItem('localApps')
      myModule.finish()
    }
  }
}
</script>

<style lang="scss" scoped>
@function cha($val) {
  @return round($val / 1920 * 750);
}
@function zi($val) {
  @return floor($number: $val * 4 /10);
}
.bd {
  width: cha(1920px);
  height: cha(1080px);
  position: absolute;
  top: 0;
  left: 0;
}
.retain {
  position: absolute;
  top: 0;
  left: 0;
  width: cha(1920px);
  height: cha(1080px);
  opacity: 1;
  text-align: center;
}
.other-app-top {
  position: absolute;
  top: cha(138px);
  color: rgba($color: #ffffff, $alpha: 0.6);
  font-size: zi(40px);
  text-align: center;
}
.other-app-divs {
  width: cha(1498px);
  height: cha(530px);
  position: absolute;
  top: cha(274px);
  left: cha(210px);
  flex-direction: row;
  justify-content: center;
  text-align: center;
  background-color: rgba($color: #000000, $alpha: 0.13);
  border-radius: cha(20px);
}
.other-app-div {
  position: relative;
  margin-top: cha(37px);
  margin-left: cha(27px);
  text-align: center;
}
.other-app-img {
  width: cha(340px);
  height: cha(456px);
}
.other-app-title {
  position: absolute;
  bottom: cha(61px);
  left: cha(50px);
  width: cha(456px);
  text-align: center;
}
.other-app-title-text {
  color: #ffffff;
  font-size: zi(34px);
}
.other-app-buttons {
  position: absolute;
  top: cha(824px);
  left: cha(600px);
  margin-top: cha(71px);
  text-align: center;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.other-button-active {
  width: cha(378px);
  height: cha(143px);
  margin-left: cha(34px);
}
.other-button {
  width: cha(297px);
  height: cha(101px);
  margin-left: cha(34px);
}
</style>
