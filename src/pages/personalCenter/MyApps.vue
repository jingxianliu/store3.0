<template>
  <div class="appDiv">
    <div
      class="update"
      v-if="updataeNum !== 0"
      ref="A0"
    >
      <image
        :src="`${staticImg}/img/update_bd.png`"
        v-if="focus === 'A0'"
        class="update-img"
      ></image>
      <text class="update-text">一键更新全部应用</text>
      <div class="point-div">
        <image
          :src="`${staticImg}/img/point.png`"
          class="point-img"
        ></image>
      </div>
    </div>
    <scroller>
      <div
        class="apps"
        ref="apps"
      >
        <div
          v-for="(item, i) in localApps"
          :key="item.packageName"
          :class="['app', focus === `A${updataeNum ? i + 1 : i}` ? 'bd-border' : '']"
          :ref="`A${updataeNum ? i + 1 : i}`"
        >
          <image
            :src="staticImg + '/img/app_bd.png'"
            :class="['app-bd', focus === `A${updataeNum ? i + 1 : i}` ? 'app-opacity': '']"
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
          <div :class="['app-button',  focus === `A${updataeNum ? i + 1 : i}` ? 'app-opacity': '']">
            <image
              :src="`${staticImg}/img/updated.png`"
              class="app-button-text"
              v-if="item.isDownloadShow"
            ></image>
            <image
              :src="`${staticImg}/img/update_${updateCheck ? 'active' : 'normal'}.png`"
              class="app-button-text"
              v-if="!item.isDownloadShow && item.update"
            ></image>
            <image
              :src="`${staticImg}/img/uninstall_${!item.update || !updateCheck ? 'active' : 'normal'}.png`"
              class="app-button-text"
              v-if="!item.isDownloadShow"
            ></image>
          </div>
          <div
            class="point-div"
            v-if="item.update"
          >
            <image
              :src="`${staticImg}/img/point.png`"
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
          <text class="vacancy-text">精彩内容等您下载</text>
        </div>
      </div>
    </scroller>
    <!-- 弹窗 -->
    <!-- 弹窗 -->
    <ob-dialog
      :content="dialogText"
      :show="isLialog"
      :single="false"
      :update="update"
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
  </div>
</template>

<script>
import { appInit, getCenterSeat } from '../../utils/getSeat'
import { API, baseImg, staticImg, setDownload, statistics } from '../../utils/index'
import Progress from '../../components/progress'
import obMask from '../../components/mask'
import obDialog from '../../components/dialog'
const myModule = weex.requireModule('myModule')
const globalEvent = weex.requireModule('globalEvent')
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
    seatData: Array,
    focus: String
  },
  data () {
    return {
      staticImg: staticImg,
      baseImg: baseImg,
      localApps: [],
      // updataeNum: 0,
      vacancy: 0,
      appNum: 0,
      updateCheck: true,
      isLialog: false,
      isToast: false,
      isCancel: true,
      isDownloadShow: false,
      isDownload: false,
      transY: 0,
      dialogText: '请更新应用!',
      update: true
    }
  },
  computed: {
    updataeNum: function () {
      return this.$store.state.updateNum
    }
  },
  created () {
    console.log(`------我的应用-created----`)
    // this.$emit('appNum', 7)
    // this.updataeNum = 1
    // appInit(1, 7)
    // let localApps = []
    // storage.getItem('localApps', e => {
    //   if (e.result === 'success') {
    //     localApps = JSON.parse(e.data).apps
    //   } else {
    //     localApps = myModule.getLocalOrbbecApp() // 本地应用
    //     localApps = localApps ? JSON.parse(localApps).packages : []
    //   }
    //   this.init(localApps)
    // })
    // console.log('DAIXIN:', localApps)
    this.init()
  },
  methods: {
    init () {
      console.log('app init -----------')
      let getLocalApps = new Promise((resolve, reject) => {
        let apps = myModule.getLocalOrbbecApp()
        if (apps) {
          resolve(JSON.parse(apps).packages)
        } else {
          reject(new Error('err'))
        }
      })
      getLocalApps.then(localApps => {
        stream.fetch(
          {
            method: 'GET',
            url: `${API}/portal/439c165a-9854-35d1-b31b-ce312602291f/app?results_per_page=0`,
            type: 'json'
          },
          res => {
            let data = res.data.objects
            let newApps = []
            let updataeNum = 0
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
                  updataeNum++
                }
                newApps.push(element)
              }
            }
            console.log(`---我的应用初始化---${updataeNum}-${newApps.length}--`)
            this.$emit('appNum', newApps.length) // 上报本地应用数
            // this.$emit('updataeNum', updataeNum)
            appInit(updataeNum, newApps.length)
            this.appNum = newApps.length
            // this.updataeNum = updataeNum
            this.localApps = newApps
            if (newApps.length <= 8) {
              this.vacancy = 8 - newApps.length
            } else if (newApps.length % 2) {
              this.vacancy = 2 - newApps.length % 2
            }
            this.$store.commit('localApps', newApps)
            // console.log(JSON.stringify(newApps))
          }
        )
      }).catch()
    },
    autoFocus (old, code) {
      console.log`${old}----${code}`
      // statistics('click', 3, 1)
      let seatIndex = old.slice(1)
      let oldApp = old.includes('A') ? this.localApps[seatIndex] : { update: false }
      if (this.updataeNum && old.includes('A')) {
        oldApp = seatIndex === '0' ? { update: false } : this.localApps[seatIndex - 1]
      }
      if (code === 4) {
        // back
        if (this.isLialog) {
          // 对话框返回
          this.isLialog = false
        } else {
          // 挽留页面
          this.$emit('retain', true)
          // this.backApp()
        }
      } else if (code === 23) {
        if (old.includes('C')) return false
        if (oldApp.isDownloadShow) {
          // 状态为下载中
          this.isToast = true
          setTimeout(() => {
            this.isToast = false
          }, 1000)
          return false
        }
        if (!this.isLialog) {
          // 弹出对话框
          if (this.updataeNum && old === 'A0') {
            // 所有更新
            this.localApps.forEach(element => {
              if (element.update) {
                myModule.downLoad(element.packageName, element.app_url)
                // myModule.downLoad(element.packageName, element.note)
                // 存入下载队列
                this.$store.commit('downList', element.packageName)
                // setDownload(element.packageName)
              }
            })
            this.update = true
          } else if (oldApp.update) {
            // 有更新时 updateCheck: true 更新
            let packageName = oldApp.packageName
            this.dialogText = this.updateCheck ? `请更新${oldApp.ApplicationName}!` : `是否要卸载${oldApp.ApplicationName}?`
            this.update = this.updateCheck
            if (this.updateCheck) {
              myModule.downLoad(packageName, oldApp.app_url)
              // myModule.downLoad(packageName, oldApp.note)
              // 存入下载队列
              this.$store.commit('downList', packageName)
              // setDownload(packageName)
            } else {
              this.isLialog = true
            }
          } else {
            this.dialogText = `是否要卸载${oldApp.ApplicationName}?`
            this.update = false
            this.isLialog = true
          }
        } else {
          // 对话框的OK
          if (!this.isCancel) {
            // 更新 / 卸载
            let packageName = oldApp.packageName
            if (oldApp.update) {
              // 有更新时 updateCheck: true 更新
              // if (this.updateCheck) {
              //   myModule.downLoad(packageName, oldApp.app_url)
              //   // 存入下载队列
              //   setDownload(packageName)
              // } else {
              myModule.uninstall(packageName)
              globalEvent.addEventListener('uninstall', e => {
                this.uninstall(e.packageAction, seatIndex)
              })
              // }
            } else {
              // if (old === 'A0' && this.updataeNum) {
              //   // 所有更新
              //   this.localApps.forEach(element => {
              //     if (element.update) {
              //       myModule.downLoad(element.packageName, element.app_url)
              //       // 存入下载队列
              //       setDownload(element.packageName)
              //     }
              //   })
              // } else {
              myModule.uninstall(packageName)
              globalEvent.addEventListener('uninstall', e => {
                this.uninstall(e.packageAction, seatIndex)
              })
              // }
            }
          }
          this.isLialog = false
          this.isCancel = true
        }
      } else {
        if (this.isLialog) {
          this.isCancel = code === 22 || code === 21 ? !this.isCancel : this.isCancel
          return false
        } else if (oldApp.update) {
          if (this.updateCheck && code === 20) {
            this.updateCheck = false
            return false
          } else if (!this.updateCheck && code === 19) {
            this.updateCheck = true
            return false
          }
          this.updateCheck = true
        }
        code = code >= 19 || code <= 23 ? code - 19 : null
        let nextCode = getCenterSeat(old, code, 'App', this.localApps.length)
        console.log(`----我的应用下一焦点---${nextCode}--`)
        if (nextCode) {
          this.t2d(old, nextCode) // 动画
          this.$emit('nextFocus', nextCode) // 传递给父级
        }
      }
    },
    t2d (old, now) {
      // bottom  height + b
      // 1. 最后一排 Y += height + b - (maxHeight - top)
      // up Y -= minHeight -top
      const maxHeight = Math.round(1080 / 1920 * 750 * 100) / 100
      const minHeight = Math.round(300 / 1920 * 750 * 100) / 100
      const b = Math.round(31 / 1920 * 750 * 100) / 100
      if (old.includes('A') && now.includes('A')) {
        const element = this.updataeNum && now === 'A0' ? this.$refs[now] : this.$refs[now][0]
        let num = this.localApps.length
        let index = this.updataeNum ? now.slice(1) - 1 : now.slice(1)
        let isLast = false
        let isFirst = false
        dom.getComponentRect(element, options => {
          if (options.size.bottom - maxHeight > 0) {
            if (num % 2) {
              isLast = parseInt(index) === num - 1
            } else {
              isLast = parseInt(index) >= num - 2
            }
            if (isLast) {
              this.transY += options.size.height + b
            } else {
              // 最后一排
              this.transY += options.size.height + b - (maxHeight - options.size.top)
            }
            animation.transition(this.$refs.apps, {
              styles: {
                transform: `translateY(-${this.transY}px)`
              },
              duration: 1
            })
          } else if (options.size.top < minHeight) {
            if (num % 2) {
              isFirst = parseInt(index) === 0
            } else {
              isFirst = parseInt(index) <= 1
            }
            if (isFirst) {
              this.transY = 0
            } else {
              this.transY -= minHeight - options.size.top
            }
            animation.transition(this.$refs.apps, {
              styles: {
                transform: `translateY(-${this.transY}px)`
              },
              duration: 1
            })
          }
        })
      }
      if (old.includes('C') && now.includes('A')) {
        this.transY = 0
        animation.transition(this.$refs.apps, {
          styles: {
            transform: `translateY(0px)`
          },
          duration: 1
        })
      }
    },
    // mask 隐藏
    obMaskSetHidden () {
      this.isToast = false
    },
    // 卸载重刷
    uninstall (value, index) {
      console.log('daixin uninstall', value, index)
      if (value) {
        index = this.updataeNum === 0 ? index : index - 1
        let newArr = this.localApps
        let packageName = newArr[index].packageName
        newArr.splice(index, 1)
        // 卸载统计
        // statistics('click', 1, packageName)
        // storage.getItem('localApps', e => {
        //   if (e.result === 'success') {
        //     console.log('卸载应用包名：', packageName)
        //     let data = JSON.parse(e.data)
        //     data.apps.splice(data.apps.findIndex(item => item.packageName === packageName), 1)
        //     storage.setItem('localApps', data, e => {
        //       console.log('卸载成功写入本地缓存:', data, e)
        //     })
        //   }
        // })
        globalEvent.removeEventListener('uninstall')
        this.init()
        if (newArr.length) {
          this.$emit('nextFocus', 'A0')
        } else {
          this.$emit('nextFocus', 'C2')
        }
      }
    },
    // 下载进度
    progress (value, list) {
      console.log('我的应用页下载进度：', value)
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
        this.$store.commit('popList', packageName)
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
      console.log('我的应用安装更新', value, this.localApps)
      this.init()
      // value = JSON.parse(value)
      // // let index = this.localApps.findIndex(item => item.packageName === value.packages[0].packageName)
      // let index = null
      // let updataeNum = this.updataeNum
      // for (let i = 0; i < this.localApps.length; i++) {
      //   const element = this.localApps[i]
      //   if (element.packageName === value.packages[0].packageName) {
      //     index = i
      //   }
      // }
      // if (updataeNum - 1 <= 0) {
      //   this.updataeNum = 0
      //   appInit(0, this.localApps.length)
      // }
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
    }
  }
}
</script>

<style scoped lang='scss'>
@function cha($val) {
  @return round($val / 1920 * 750 * 100) / 100;
}
@function zi($val) {
  @return floor($number: $val * 4 /10);
}
.appDiv {
  margin-top: cha(50px);
}
.update {
  width: cha(1419px);
  height: cha(66px);
  margin-bottom: cha(26px);
  background-color: rgba($color: #247dc7, $alpha: 0.3);
  align-items: center;
  justify-content: center;
}
.update-img {
  position: absolute;
  top: 0;
  left: 0;
  width: cha(1419px);
  height: cha(66px);
}
.update-text {
  color: #ffffff;
  font-size: zi(30px);
}
.apps {
  flex-direction: row;
  flex-wrap: wrap;
  width: cha(1419px);
  justify-content: space-between;
}
.app {
  width: cha(702px);
  height: cha(225px);
  background-color: rgba($color: #247dc7, $alpha: 0.2);
  flex-direction: row;
  align-items: center;
  margin-bottom: cha(31px);
  border-radius: cha(20px);
}
.app-icon-img {
  width: cha(140px);
  height: cha(140px);
  margin-left: cha(42px);
  margin-right: cha(38px);
  border-radius: cha(20px);
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
.bd-border {
  border-style: solid;
  border-width: cha(4px);
  border-color: #ffffff;
  border-radius: cha(20px);
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
  width: cha(30px);
  height: cha(30px);
  position: absolute;
  right: 0;
  top: 0;
}
.point-img {
  width: cha(30px);
  height: cha(30px);
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
/* 弹窗 */
.overlay {
  width: cha(1920px);
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
}
.dialog-body {
  position: absolute;
  left: cha(532px);
  top: cha(275px);
  width: cha(856px);
  height: cha(530px);
  border-radius: cha(20px);
  align-items: center;
  background-color: #54687e;
}
.dialog-title {
  height: cha(328px);
  background-color: #54687e;
}
.dialog-title-text {
  font-size: zi(46px);
  color: #d4f2ff;
  margin-top: cha(171px);
}
.dialog-button {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: cha(202px);
  background-color: #4f6175;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.dialog-img {
  width: cha(378px);
  height: cha(144px);
}
/* toast */
.toast-div {
  background-color: #4f6175;
  height: cha(260px);
  width: cha(520px);
  justify-content: center;
  align-items: center;
  border-radius: cha(20px);
}
.toast-text {
  font-size: zi(50px);
  color: #d4f2ff;
}
</style>
