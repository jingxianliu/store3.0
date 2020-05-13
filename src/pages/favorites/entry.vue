<template>
  <!-- 无应用 -->
  <div
    v-if="appNum === 0"
    class="no-box"
  >
    <image
      :src="`${staticImg}/img/app_box.png`"
      class="no-img"
    ></image>
    <div>
      <text class="no-text">收藏还是空的，快去下载吧！</text>
    </div>
    <image
      :src="`${staticImg}/img/no_button_${isNoCheck ? 'active' : 'normal'}.png`"
      class="no-button"
    ></image>
  </div>
  <scroller
    scroll-direction="horizontal"
    class="main"
    v-else
  >
    <div
      class="apps"
      ref="apps"
    >
      <div
        v-for="(item, i) in localApps"
        :key="item.packageName"
        :class="['app', focusCode === `A${i}` ? 'bd-border' : '']"
        :ref="`A${i}`"
      >
        <image
          :src="`${staticImg}/img/app_${item.update ? 'bd' : 'bd_no'}.png`"
          :class="['app-bd', focusCode === `A${i}` ? 'app-opacity' : '']"
        ></image>
        <image
          :src="item.ApplicationIcon"
          class="app-icon-img"
        ></image>
        <div class="app-about">
          <text class="app-name">{{item.ApplicationName}}</text>
          <text class="app-text">版本：{{item.versionName}}</text>
          <text class="app-text">大小：{{item.packageSize}}</text>
        </div>
        <div :class="['app-button', focusCode === `A${i}` ? 'app-opacity' : '']">
          <image
            :src="`${staticImg}/img/${item.isDownloadShow ? 'updated' : 'update_active'}.png`"
            class="app-button-text"
            v-if="item.update"
          ></image>
        </div>
        <div
          v-if="item.update"
          class="point-div"
        >
          <image
            :src="`${staticImg}/img/point_zi.png`"
            class="point-img"
          ></image>
        </div>
        <!-- 下载动画 -->
        <div
          v-if="item.isDownloadShow"
          class="down-overlay"
        >
          <div v-if="!item.isDownload">
            <text class="down-overlay-text">等待安装</text>
          </div>
          <Progress
            :ref="`progressMethod${i}`"
            v-else
            class="progress"
            circleWidth="92"
            circlePadding="6"
            circleRadius="84"
            containerWidth="86"
          ></Progress>
        </div>
      </div>
      <!-- 空位 -->
      <div
        class="vacancy"
        v-for="item in vacancy"
        :key="item"
      >
        <text class="vacancy-text">精彩内容等你下载</text>
      </div>
    </div>
    <!-- 弹窗 -->
    <ob-dialog
      :content="dialogText"
      :show="isLialog"
      :single="false"
      :is-cancel="isCancel"
    >
    </ob-dialog>
    <!-- 安装中弹窗 -->
    <ob-mask
      height="260"
      width="520"
      border-radius="20"
      duration="300"
      mask-bg-color="#4F6175"
      content-text="应用更新中"
      font-size="50"
      content-text-color="#d4f2ff"
      :show="isToast"
      @obMaskSetHidden="obMaskSetHidden"
    >
    </ob-mask>
  </scroller>
</template>

<script>
import { favoritesInit, getFavoriteSeat } from '../../utils/getSeat'
import { API, baseImg, staticImg, setDownload } from '../../utils/index'
import Progress from '../../components/progress'
import obMask from '../../components/mask'
import obDialog from '../../components/dialog'
const myModule = weex.requireModule('myModule')
const stream = weex.requireModule('stream')
const dom = weex.requireModule('dom')
const animation = weex.requireModule('animation')
const storage = weex.requireModule('storage')
export default {
  components: {
    Progress,
    obMask,
    obDialog
  },
  props: {
    refresh: Boolean
  },
  data () {
    return {
      staticImg: staticImg,
      baseImg: baseImg,
      localApps: [],
      isLialog: false,
      isCancel: true,
      transX: 0,
      focusCode: 'T',
      appNum: 0,
      isNoCheck: false,
      vacancy: 0,
      isDownloadShow: false,
      isDownload: false,
      isToast: false,
      dialogText: '请更新应用！',
      imgBaseUrl: baseImg
    }
  },
  created () {
    console.log(`------我的收藏-created----`)
    // this.appNum = 0
    // this.$emit('appNum', 0)
    // favoritesInit(0)
    // let localApps = []
    // storage.getItem('localApps', e => {
    //   if (e.result === 'success') {
    //     console.log(e.data)
    //     localApps = JSON.parse(e.data).apps
    //   } else {
    //     localApps = myModule.getLocalOrbbecApp() // 本地应用
    //     localApps = localApps ? JSON.parse(localApps).packages : []
    //   }
    //   this.init(localApps)
    // })
    // console.log('DAIXIN:', localApps)
    this.localApps = []
    this.init()
  },
  methods: {
    init () {
      this.transX = 0
      animation.transition(this.$refs.apps, {
        styles: {
          transform: `translateX(0px)`
        },
        duration: 1
      })
      let getLocalApps = new Promise((resolve, reject) => {
        let apps = myModule.getLocalOrbbecApp()
        if (apps) {
          resolve(JSON.parse(apps).packages)
        } else {
          reject(new Error('err'))
        }
      })
      getLocalApps.then(localApps => {
        stream.fetch({
          method: 'GET',
          url: `${API}/portal/439c165a-9854-35d1-b31b-ce312602291f/app?results_per_page=0`,
          type: 'json'
        }, res => {
          console.log(`-------全部应用----${res.data.objects}-`)
          let data = res.data.objects
          let newApps = []
          for (let i = 0; i < localApps.length; i++) {
            const element = localApps[i]
            const online = data.find(n => n.package_name === element.packageName)
            // 应用存在线上
            if (online) {
              element['update'] = false
              element['isDownloadShow'] = false
              element['isDownload'] = false
              element['note'] = online.note
              element['ApplicationIcon'] = this.baseImg + online.icon[0].image_url
              // 需要更新
              if (online.version_code - element.versionCode > 0) {
                element['update'] = true
                element['app_url'] = this.baseImg + online.app_url
              }
              newApps.push(element)
            }
          }
          this.$emit('appNum', newApps.length) // 上报本地应用数
          this.appNum = newApps.length
          favoritesInit(newApps.length)
          this.localApps = newApps
          if (newApps.length > 0) {
            if (newApps.length <= 9) {
              this.vacancy = 9 - newApps.length
            } else if (newApps.length % 3) {
              this.vacancy = 3 - newApps.length % 3
            }
          }
          this.$store.commit('localApps', newApps)
          console.log(newApps)
        })
      }).catch(err => {
        console.log('我的收藏应用err=-----', err)
      })
    },
    autoFocus (code) {
      console.log('---我的收藏聚焦--', code)
      if (code === 1) {
        this.focusCode = 'A0'
        if (this.appNum === 0) {
          this.isNoCheck = true
          return false
        }
      }
      let old = this.focusCode
      let focusIndex = parseInt(old.slice(1))
      let currentApp = this.localApps[focusIndex]
      if (code === 4) {
        // 退出
        if (this.isLialog) {
          // 对话框返回
          this.isLialog = false
          this.isCancel = true
        } else {
          // 挽留
          this.$emit('retain', true)
        }
      } else if (code === 23) {
        if (this.isNoCheck) {
          // 跳推荐页
          this.$emit('upTab', { to: 'recommend', value: true })
          this.isNoCheck = false
          return false
        }
        if (currentApp && currentApp.isDownloadShow) {
          // 状态为下载中
          this.isToast = true
          return false
        }
        if (this.isLialog) {
          // 对话框层
          if (!this.isCancel) {
            // 更新
            console.log('我的收藏更新：', currentApp.packageName, currentApp.app_url)
            myModule.downLoad(currentApp.packageName, currentApp.app_url)
            // myModule.downLoad(currentApp.packageName, currentApp.note)
            // 存入下载队列
            this.$store.commit('downList', currentApp.packageName)
            // setDownload(currentApp.packageName)
          }
          this.isLialog = false
          this.isCancel = true
        } else {
          // 应用层
          if (currentApp.update) {
            // 弹窗更新
            // this.dialogText = `请更新${currentApp.ApplicationName}应用！`
            // this.isLialog = true
            myModule.downLoad(currentApp.packageName, currentApp.app_url)
            // myModule.downLoad(currentApp.packageName, currentApp.note)
            // 存入下载队列
            this.$store.commit('downList', currentApp.packageName)
            // setDownload(currentApp.packageName)
          } else {
            // 启动应用
            this.$emit('first', false)
            myModule.startApp(currentApp.packageName)
          }
        }
      } else {
        // 上下选择
        if (this.isNoCheck) {
          if (code === 19) {
            this.isNoCheck = false
            this.$emit('upTab', { to: 'favorites', value: true })
          }
        }
        if (this.isLialog) {
          this.isCancel = code === 22 || code === 21 ? !this.isCancel : this.isCancel
          return false
        }
        code = code >= 19 || code <= 23 ? code - 19 : null
        let nextCode = getFavoriteSeat(old, code)
        console.log(`----我的收藏下一焦点---${nextCode}--`)
        if (nextCode) {
          this.focusCode = nextCode
          if (nextCode === 'T') {
            this.$emit('upTab', { to: 'favorites', value: true })
          } else if (nextCode === 'TQ') {
            // 前一页
            this.$emit('upTab', { to: 'front', value: true })
          } else if (nextCode === 'TN') {
            // 个人中心页
            this.$emit('upTab', { to: 'center', value: true })
          }
          this.t2d(old, nextCode)
        }
      }
    },
    // 动画
    t2d (old, now) {
      const maxWidth = 750
      const minWidth = Math.round(80 / 1920 * 750 * 100) / 100
      const b = Math.round(31 / 1920 * 750 * 100) / 100
      const element = this.$refs[now] ? this.$refs[now][0] : null
      const num = this.localApps.length
      const index = now.slice(1)
      if (now.includes('A')) {
        dom.getComponentRect(element, options => {
          if (options.size.right > maxWidth) {
            let isLast = index >= num - (3 - num % 3)
            if (isLast) {
              this.transX += options.size.right - maxWidth
            } else {
              this.transX += options.size.right - maxWidth + b
            }
            animation.transition(this.$refs.apps, {
              styles: {
                transform: `translateX(-${this.transX}px)`
              },
              duration: 1
            })
          } else if (options.size.left < minWidth) {
            let isFirst = index <= 2
            if (isFirst) {
              this.transX = 0
            } else {
              this.transX -= minWidth - options.size.left
            }
            animation.transition(this.$refs.apps, {
              styles: {
                transform: `translateX(-${this.transX}px)`
              },
              duration: 1
            })
          }
        })
      }
    },
    // mask 隐藏
    obMaskSetHidden () {
      this.isToast = false
    },
    // 下载进度
    progress (value, list) {
      console.log('我的收藏页下载进度：', value)
      let textName = value.split(':')[0]
      let progressValue = value.split(':')[1]
      let newData = this.localApps
      // 位置状态改变
      for (let i = 0; i < newData.length; i++) {
        let packageName = newData[i].packageName
        if (textName === packageName) {
          // 下载动画
          this.localApps[i]['isDownloadShow'] = true
          this.localApps[i]['isDownload'] = true
          this.loading(progressValue, packageName, i)
        } else {
          // 等待下载中
          if (list.includes(packageName)) {
            this.localApps[i]['isDownloadShow'] = true
            this.localApps[i]['isDownload'] = false
          }
          // storage.getItem('installApps', e => {
          //   if (e.result === 'success') {
          //     console.log('等待下载队列', e.data)
          //     let apps = JSON.parse(e.data)
          //     if (apps.includes(packageName)) {
          //       this.localApps[i]['isDownloadShow'] = true
          //       this.localApps[i]['isDownload'] = false
          //     }
          //   }
          // })
        }
      }
    },
    // 下载动画
    loading (value, packageName, index) {
      console.log('index下载进度：', value)
      this.$nextTick(() => {
        this.$refs[`progressMethod${index}`][0].setProgress(0, value)
      })
      // 100 时剔除下载队列
      if (value === '100') {
        this.localApps[index]['isDownloadShow'] = false
        this.localApps[index]['isDownload'] = false
        // storage.getItem('installApps', e => {
        //   if (e.result === 'success') {
        //     let data = JSON.parse(e.data)
        //     data.splice(data.findIndex(item => item === packageName), 1)
        //     storage.setItem('installApps', data, e => {
        //       console.log(e)
        //     })
        //   }
        // })
      }
    },
    // 安装状态更新
    installed (value) {
      console.log('我的收藏安装成功更新', value, this.localApps)
      this.init()
      // value = JSON.parse(value)
      // // let index = this.localApps.findIndex(item => {
      // //   console.log(item.packageName === value.packages[0].packageName)
      // //   item.packageName === value.packages[0].packageName
      // // })
      // let index = null
      // for (let i = 0; i < this.localApps.length; i++) {
      //   const element = this.localApps[i]
      //   if (element.packageName === value.packages[0].packageName) {
      //     index = i
      //   }
      // }
      // console.log(index)
      // if (index !== null) {
      //   this.localApps[index]['update'] = false
      //   this.localApps[index]['isDownloadShow'] = false
      //   this.localApps[index]['isDownload'] = false
      //   this.localApps[index]['versionName'] = value.packages[0].versionName
      // }
    },
    // 退出应用
    backApp () {
      storage.removeItem('installApps')
      storage.removeItem('localApps')
      myModule.finish()
    },
    tabChange () {
      // add more method
    }
  },
  watch: {
    refresh (value) {
      if (value) {
        let localApps = []
        storage.getItem('localApps', e => {
          if (e.result === 'success') {
            console.log(e.data)
            localApps = JSON.parse(e.data).apps
          } else {
            localApps = myModule.getLocalOrbbecApp() // 本地应用
            localApps = localApps ? JSON.parse(localApps).packages : []
          }
          this.init(localApps)
        })
      }
    }
  }
}
</script>

<style scoped lang='scss'>
@function cha($val) {
  @return round($val / 1920 * 75000) / 100;
}
@function zi($val) {
  @return floor($number: $val * 4 /10);
}
.main {
  width: cha(1920px);
  flex-direction: row;
}
.bd {
  width: cha(1920px);
  height: cha(1080px);
  position: absolute;
  top: 0;
  left: 0;
}
.apps {
  padding-left: cha(80px);
  padding-top: cha(69px);
  height: cha(950px);
  flex-wrap: wrap;
}
.app {
  width: cha(702px);
  height: cha(225px);
  background-color: rgba($color: #247dc7, $alpha: 0.2);
  flex-direction: row;
  align-items: center;
  margin-bottom: cha(31px);
  margin-right: cha(30px);
  border-radius: cha(20px);
}
.bd-border {
  border-style: solid;
  border-width: cha(4px);
  border-color: #ffffff;
  border-radius: cha(20px);
}
.app-icon-img {
  width: cha(140px);
  height: cha(140px);
  margin-left: cha(42px);
  margin-right: cha(38px);
}
.app-name {
  margin-bottom: cha(18px);
  font-size: zi(36px);
  color: #ffffff;
}
.app-text {
  font-size: zi(26px);
  color: #ffffff;
}
.app-button {
  position: absolute;
  right: 0;
  top: 0;
  justify-content: space-around;
  align-items: center;
  width: cha(220px);
  height: cha(225px);
  margin-left: cha(40px);
  padding: cha(15px);
  opacity: 0;
}
.app-button-text {
  font-size: zi(30px);
  width: cha(157px);
  height: cha(59px);
}
.app-bd {
  position: absolute;
  top: 0;
  left: 0;
  width: cha(694px);
  height: cha(217px);
  border-radius: cha(20px);
  opacity: 0;
}
.app-opacity {
  opacity: 1;
}
/* 更新红点 */
.point-div {
  width: cha(80px);
  height: cha(36px);
  position: absolute;
  right: 0;
  top: 0;
}
.point-img {
  width: cha(80px);
  height: cha(36px);
}
/* 空位 */
.vacancy {
  width: cha(694px);
  height: cha(217px);
  background-color: rgba($color: #247dc7, $alpha: 0.05);
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: cha(31px);
  margin-right: cha(30px);
  border-radius: cha(20px);
}
.vacancy-text {
  font-size: zi(40px);
  color: rgba($color: #ffffff, $alpha: 0.05);
}
/* 下载图层 */
.down-overlay {
  position: absolute;
  top: cha(38px);
  left: cha(42px);
  width: cha(140px);
  height: cha(140px);
  justify-content: center;
  align-items: center;
  border-radius: cha(20px);
  background-color: rgba($color: #000000, $alpha: 0.8);
}
.down-overlay-text {
  font-size: zi(18px);
  color: #ffffff;
}
.progress {
  margin: cha(24px);
}

/* 没有应用 */
.no-box {
  justify-content: center;
  align-items: center;
}
.no-img {
  width: cha(613px);
  height: cha(572px);
}
.no-text {
  font-size: zi(32px);
  color: #ffffff;
  margin-bottom: cha(30px);
}
.no-button {
  width: cha(381px);
  height: cha(145px);
}
</style>
