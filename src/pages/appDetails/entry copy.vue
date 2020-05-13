<template>
  <div>
    <!-- 无网 -->
    <err-page
      :is-back="isErrorBack"
      :is-noNetwork="isNoNetwork"
      v-if="isNoNetwork || isReqError"
    ></err-page>
    <div
      v-if="!isNoNetwork || !isReqError"
      class="container"
    >
      <image
        :src="`${staticImg}/img/bd.png`"
        class="bd"
      ></image>
      <div class="top">
        <div class="icon">
          <image
            :src="imgBaseUrl + appData.iconURL"
            class="icon-img"
          ></image>
          <div
            v-if="isDownloadShow"
            class="down-overlay"
          >
            <div
              v-if="!isDownload"
              class="down-overlay-div"
            >
              <text class="down-overlay-text">等待安装</text>
            </div>
            <Progress
              ref="progressMethod"
              v-else
              class="progress"
              circleWidth="168"
              circlePadding="12"
              circleRadius="84"
              containerWidth="156"
            ></Progress>
          </div>
        </div>
        <div class="top-right">
          <div>
            <text class="top-right-title">{{appData.title}}</text>
          </div>
          <div class="top-right-about">
            <text class="top-right-text1">大小：{{appData.size}}MB</text>
            <text class="top-right-text">类别: {{appData.tagName}}</text>
          </div>
          <div ref="B0">
            <image
              :class="[focusCode === 'B0' ? 'button-focus' : 'btn-opacity' ]"
              :src="`${staticImg}/img/button_active.png`"
              v-if="!isDownloadShow"
            ></image>
            <image
              :class="[focusCode !== 'B0' ? 'button-focused' : 'btn-opacity']"
              :src="`${staticImg}/img/button_normal.png`"
              v-if="!isDownloadShow"
            ></image>
            <image
              class="button-focused"
              :src="`${staticImg}/img/button.png`"
              v-else
            ></image>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <scroller>
        <div
          class="main-content"
          ref="content"
        >
          <scroller
            class="bannerDiv"
            scroll-direction="horizontal"
          >
            <div
              class="banner"
              ref="banner"
            >
              <div
                :class="['banner-div', focusCode === `P0` ? 'banner-border' : '']"
                v-if="isVod"
                ref="P0"
              >
                <div class="banner-vod">
                  <!-- <simpleVideo
                    :setAutoplay="false"
                    :setPath="imgBaseUrl + video + '.png'"
                    class="banner-img"
                    ref="videoFirst"
                  ></simpleVideo> -->
                  <image
                    :src="imgBaseUrl + video + '.jpg'"
                    class="banner-img"
                  ></image>
                </div>
                <image
                  :src="`${staticImg}/img/play_btn.png`"
                  class="play-button"
                ></image>
              </div>
              <div
                v-for="(item, index) in poster"
                :key="item.image_url"
                :ref="`P${isVod ? index + 1 : index}`"
                :class="['banner-div', focusCode === `P${isVod ? index + 1 : index}` ? 'banner-border' : '']"
              >
                <image
                  :src="imgBaseUrl + item.image_url"
                  class="banner-img"
                ></image>
              </div>
            </div>
          </scroller>
          <div class="about">
            <text class="about-text">游戏简介：{{appData.description}}</text>
          </div>
          <div class="other">
            <text class="other-h2">其他精彩内容...</text>
            <div class="other-app">
              <div
                v-for="(item, index) in otherApps"
                :key="item.url"
                class="other-app-div"
                :ref="`A${index}`"
              >
                <image
                  :src="`${staticImg}/img/icon_bd.png`"
                  class="bd-focus-img"
                  v-if="focusCode === `A${index}`"
                ></image>
                <image
                  :src="imgBaseUrl + item.icon[0].image_url"
                  class="other-app-img"
                ></image>
                <text class="other-app-text">{{item.title}}</text>
                  <!-- 下载动画 -->
                 <div
                  v-if="item.isDownloadShow"
                  class="down-overlay">
                      <div v-if="!item.isDownload">
                        <text class="down-overlay-text">等待安装</text>
                      </div>
                      <Progress
                        :ref="`progressMethod${index}`"
                        v-else
                        class="progress"
                        circleWidth="92"
                        circlePadding="6"
                        circleRadius="84"
                        containerWidth="86"
                      ></Progress>
                  </div>
              </div>
              
            </div>
          </div>
        </div>
      </scroller>
      <!-- 视频全屏 -->
      <div
        class="overlay"
        v-if="show"
      >
        <div class="vod-body">
          <nativeVideo
            :setPath="imgBaseUrl + video"
            class="mask-vod"
            ref="simpleVideo"
          ></nativeVideo>
        </div>
        <!-- <image :src="imgBaseUrl + '/img/play_btn.png'" class="vod-button" v-if="playState === 'pause'"></image> -->
      </div>
      <!-- 控制器 -->
      <!-- <div class="addbutton">
        <text @click="autoFocus(19)" class="button">上</text>
        <text @click="autoFocus(20)"  class="button">下</text>
        <text @click="autoFocus(21)"  class="button">左</text>
        <text @click="autoFocus(22)"  class="button">右</text>
        <text @click="autoFocus(23)"  class="button">OK</text>
        <text @click="autoFocus(4)"  class="button">BACK</text>
      </div> -->
    </div>
  </div>
</template>

<script>
import { API, baseImg, staticImg, createLink, hasNetwork, statistics } from '../../utils/index'
import Progress from '../../components/progress'
import errPage from '../../components/errPage'
const detail = new BroadcastChannel('app')
const stream = weex.requireModule('stream')
const globalEvent = weex.requireModule('globalEvent')
const navigator = weex.requireModule('navigator')
const myModule = weex.requireModule('myModule')
const dom = weex.requireModule('dom')
const animation = weex.requireModule('animation')
export default {
  components: {
    Progress,
    errPage
  },
  data () {
    return {
      appData: Object,
      poster: Array,
      packageName: '',
      staticImg: staticImg,
      imgBaseUrl: baseImg,
      otherApps: Array,
      focusCode: 'B0',
      bData: [null, 'P0', null, null],
      pData: Array,
      aData: Array,
      isVod: false,
      show: false,
      playState: 'play',
      isDownloadShow: false,
      isDownload: false,
      isReqError: false,
      isNoNetwork: false,
      isErrorBack: false,
      isEPG: Boolean,
      other_packageName:''
    }
  },
  created () {
    console.log('daixin:', weex.config.bundleUrl)
    const packageName = this.getQueryString('packageName')
    if (this.getQueryString('isEPG')) {
      this.isEPG = true
    }
    console.log('daixin:', packageName)
    this.packageName = packageName
    // 监听遥控器键值
    globalEvent.addEventListener('keyDown', e => {
      this.autoFocus(e.keyDown)
    })
    // 下载进度
    globalEvent.addEventListener('loading', e => {
      console.log(`详情页监听下载进度---`, e.progress, '======', e.list)
      this.progress(e.progress, e.list)
    })
    // 安装成功回调
    // globalEvent.addEventListener('finishedInstall', e => {
    //   console.log(`详情页监听安装`)
    //   finishedInstall(e.packageInfo)
    // })
    this.init(packageName)
  },
  methods: {
    init (packageName) {
      // packageName = 'com.orbbec.braintrain' // 测试
      if (!hasNetwork(this)) {
        return false
      }
      stream.fetch(
        {
          method: 'GET',
          url: `${API}/app/${packageName}`,
          type: 'json'
        },
        res => {
          let data = res.data.objects[0]
          console.log(data)
          if (data) {
            data['iconURL'] = data.icon[0].image_url
            this.poster = data.poster
            let num = data.poster.length
            if (data.vod && data.vod.length > 0) {
              this.isVod = true
              this.video = data.vod[0].relative_file_location
              num++
            }
            data['size'] = Math.round(parseInt(data.original_file_size) / 1024 / 1024 * 100) / 100
            if (data.tag && data.tag.length > 0) {
              let tagName = ''
              for (let i = 0; i < data.tag.length; i++) {
                tagName += data.tag[i].name + '/'
              }
              data['tagName'] = tagName.substring(0, tagName.length - 1)
            }
            this.initData(num)
            this.appData = data
            this.$refs.videoFirst.pause()
          }
        }
      )
      stream.fetch(
        {
          method: 'GET',
          url: `${API}/portal/439c165a-9854-35d1-b31b-ce312602291f/apk?num_display=5`,
          type: 'json'
        },
        res => {
          let data = res.data.objects
          if (data.length > 1) {
            for (let i = 0; i < data.length; i++) {
              data[i]['isDownloadShow'] = false
              data[i]['isDownload'] = false
            }    
             this.otherApps = data
             console.log('初始化其他应用',JSON.stringify(this.otherApps))

          }
        }
      )
    },
    initData (num) {
      let pArr = []
      let aArr = []
      for (let i = 0; i < num; i++) {
        pArr.push([
          'B0',
          'A0',
          i === 0 ? null : `P${i - 1}`,
          i === num - 1 ? null : `P${i + 1}`
        ])
      }
      for (let i = 0; i < 5; i++) {
        aArr.push([
          'P0',
          null,
          i === 0 ? null : `A${i - 1}`,
          i === 4 ? null : `A${i + 1}`
        ])
      }
      this.pData = pArr
      this.aData = aArr
    },
    // 控制焦点
    autoFocus (code) {
      const old = this.focusCode
      code = code === 66 ? 23 : code
      if (code === 4) {
        if (this.show) {
          // 弹窗返回
          this.show = false
        } else {
          // 返回
          globalEvent.removeEventListener('keyDown')
          globalEvent.removeEventListener('loading')
          globalEvent.removeEventListener('finishedInstall')
          detail.postMessage({ isIndex: true })
          if (this.isEPG === true) {
            let url = 'pages/index/entry.js'
            navigator.push({
              url,
              animated: 'true'
            })
          } else {
            navigator.pop({
              animated: 'true'
            })
          }
        }
      } else if (code === 23) {
        if (this.isNoNetwork || this.isReqError) {
          // 错误处理
          if (this.isErrorBack) {
            // 退出大厅
            this.backApp()
          } else {
            // 重新加载
            this.init(this.packageName)
          }
          return false
        }
        // 1.按钮 2.视频 3.其他页面
        if (this.show === true) {
          const currState = this.playState
          if (this.playState === 'play') {
            this.$refs.simpleVideo.pause()
          } else {
            this.$refs.simpleVideo.resume()
          }
          this.playState = currState === 'pause' ? 'play' : 'pause'
        } else {
          if (old === 'B0') {
            this.other_packageName = "" 
            this.startApp()
          } else if (this.isVod && old === 'P0') {
            this.show = true
          } else if (old.includes('A')) {
            this.jump(old.slice(1))
          }
        }
      } else {
        if (this.isNoNetwork || this.isReqError) {
          // 错误处理
          if (code === 21 || code === 22) {
            this.isErrorBack = !this.isErrorBack
          }
          return false
        }
        if (this.show) {
          // 视频层
          return false
        }
        code = code >= 19 || code <= 23 ? code - 19 : null
        let nextCode = null
        if (old.includes('B')) {
          nextCode = this.bData[code]
        } else {
          let index = old.slice(1)
          let firstName = old.slice(0, 1).toLowerCase()
          nextCode = this[`${firstName}Data`][index][code]
        }
        if (nextCode) {
          console.log(`----下一code---${nextCode}--`)
          // 动画
          this.t2d(old, nextCode)
          this.focusCode = nextCode
        }
      }
    },
    // 动画
    t2d (old, now) {
      const Height = Math.round(1080 / 1920 * 750 * 100) / 100
      const Width = 750
      if (old.includes('B') || now.includes('B')) {
        if (old.includes('B') && now.includes('P')) {
          animation.transition(this.$refs.P0, {
            styles: {
              transform: 'scale(1.06)'
            }
          })
        } else if (old.includes('P') && now.includes('B')) {
          let pElement = this.$refs[old] === 'P0' ? this.$refs[old] : this.$refs[old][0]
          animation.transition(pElement, {
            styles: {
              transform: 'scale(1)'
            }
          })
        }
        return false
      }
      let oldElement = this.$refs[old][0]
      let nowElement = this.$refs[now][0]
      if (this.isVod) {
        oldElement = old === 'P0' ? this.$refs[old] : this.$refs[old][0]
        nowElement = now === 'P0' ? this.$refs[now] : this.$refs[now][0]
      }
      // 放大
      if (old.includes('P')) {
        animation.transition(oldElement, {
          styles: {
            transform: 'scale(1)'
          }
        })
      }
      if (now.includes('P')) {
        animation.transition(nowElement, {
          styles: {
            transform: 'scale(1.06)'
          }
        })
      }
      if (old.includes('P') && now.includes('A')) {
        // P => A
        dom.getComponentRect(this.$refs.A0[0], options => {
          console.log(options.size.bottom)
          const transY = options.size.bottom - Height
          animation.transition(this.$refs.content, {
            styles: {
              transform: `translateY(-${transY}px)`
            }
          })
          animation.transition(this.$refs.banner, {
            styles: {
              transform: `translateX(0px)`
            }
          })
        })
      } else if (old.includes('A') && now.includes('P')) {
        // A => P
        animation.transition(this.$refs.content, {
          styles: {
            transform: `translateY(0px)`
          }
        })
      }
      if (old.includes('P2') && now.includes('P3')) {
        // P => P
        dom.getComponentRect(this.$refs.P3[0], options => {
          const transX = options.size.right - Width + 10
          animation.transition(this.$refs.banner, {
            styles: {
              transform: `translateX(-${transX}px)`
            }
          })
        })
      } else if (old.includes('P3') && now.includes('P2')) {
        animation.transition(this.$refs.banner, {
          styles: {
            transform: `translateX(0px)`
          }
        })
      }
    },
    // 启动应用
    startApp () {
      if (this.isDownloadShow) {
        // 状态为下载中
        return false
      }
      const packageName = this.packageName
      const isLocal = myModule.getInstalledAppVersion(packageName)
      console.log('---本地存在应用------', packageName, isLocal)
      if (isLocal) {
        // 1. 判断应用是否存在
        detail.postMessage({ autoPlay: false })
        myModule.startApp(packageName)
      } else {
        // 下载
        if (!hasNetwork(this)) {
          return false
        }
        stream.fetch(
          {
            method: 'GET',
            url: `${API}/app/${packageName}`,
            type: 'json'
          },
          res => {
            console.log('daixin:', JSON.stringify(res))
            let data = res.data.objects[0]
            let name = data.title + '_download'
            statistics(name, 0, packageName)
            myModule.downLoad(packageName, baseImg + data.app_url)
            // myModule.downLoad(packageName, data.note)
            // 存入下载队列
            detail.postMessage({ downapp: packageName })
          }
        )
      }
    },
    // 其他应用
    jump (i) {
      const pageName = 'appDetails'
      const packageName = this.otherApps[i].package_name
      const versionCode = this.otherApps[i].version_code
      const params = {
        packageName: packageName
      }
      const isLocal = myModule.getInstalledAppVersion(packageName)
      console.log('---本地存在应用------', packageName, isLocal)
      // 1. 判断应用是否存在
     if (isLocal) {     
        //判断应用是否需要更新
         if(versionCode - isLocal> 0){
             // 更新
             console.log(`选择了第${i}个应用，该应用需要更新`)           
             this.other_packageName = packageName 
             // 存入下载队列
             myModule.downLoad(packageName, baseImg + this.otherApps[i].app_url)        
             detail.postMessage({ downapp: packageName })
         }else{
              detail.postMessage({ autoPlay: false })
              myModule.startApp(packageName)
         }

      } else {
        // 跳转页面
        const url = createLink(pageName, params)
        if ('Web' === WXEnvironment.platform) {  // eslint-disable-line
          location.href = url
        } else {
          navigator.push({
            url,
            animated: 'true'
          })
        }
      }
    },
    // 下载进度
    progress (value, list) {
      console.log("下载进度")
      let textName = value.split(':')[0]
      let progressValue = value.split(':')[1]
      let packageName = this.other_packageName.length > 0 ? this.other_packageName:this.packageName 
      let appIndex  = this.otherApps.findIndex((item) => item.package_name === packageName)
      if (progressValue === '100') {
        // 剔出下载队列
        detail.postMessage({ pop: packageName })
      }
      if (textName === packageName) {
        // 下载动画
        if(appIndex > -1){
            console.log('下载其他应用')          
            this.otherApps[appIndex]['isDownloadShow']  = true
            this.otherApps[appIndex]['isDownload'] = true
            this.loading(progressValue, packageName,appIndex)
        }else{
          console.log('下载本应用')
          this.isDownloadShow = true
          this.isDownload = true
          this.loading(progressValue, packageName)
        }
        
      } else {
        // 等待下载中
        // 队列中
        if (list.includes(packageName)) {
          if(appIndex > -1){
             this.otherApps[index]['isDownloadShow'] = true
            this.otherApps[index]['isDownload']= false
          }else{
            this.isDownloadShow = true
            this.isDownload = false
          }
         
        }
        // storage.getItem('installApps', e => {
        //   if (e.result === 'success') {
        //     console.log('等待下载队列', e.data)
        //     let apps = JSON.parse(e.data)
        //     if (apps.includes(packageName)) {
        //       this.isDownloadShow = true
        //       this.isDownload = false
        //     }
        //   }
        // })
        // 传递进度
        // detail.postMessage({ progress: value })
      }
    },
    // 下载动画
    loading (value, packageName,index) {
      console.log('detail下载进度：', value,index)
      if(this.other_packageName.length > 0){
         this.$nextTick(() => {
            this.$refs[`progressMethod${index}`][0].setProgress(0, value)
         })
      }else{
        this.$refs.progressMethod.setProgress(0, value)

      }
      // 100 时剔除下载队列
      if (value === '100') {
        this.$store.commit('popList', packageName)
        if(this.other_packageName.length > 0){
            this.otherApps[index]['isDownloadShow'] = false
            this.otherApps[index]['isDownload']= false
        }else{
          this.isDownloadShow = false
          this.isDownload = false
        }
        
        // storage.getItem('installApps', e => {
        //   if (e.result === 'success') {
        //     console.log('下载队列：', typeof (e.data), e.data)
        //     let data = JSON.parse(e.data)
        //     data.splice(data.findIndex(item => item === packageName), 1)
        //     storage.setItem('installApps', data, e => {
        //       console.log(e)
        //     })
        //   }
        // })       
      }
    },
    getQueryString (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      let url = weex.config.bundleUrl.split('?')[1]
      let r = url.match(reg)
      if (r != null) return unescape(r[2]); return null
    },
    backApp () {
      myModule.finish()
    }
  }
}
</script>

<style lang="scss" scoped>
@function cha($val) {
  @return round($val / 1920 * 750 * 100) / 100;
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
.top {
  flex-direction: row;
  height: cha(390px);
}
.icon {
  width: cha(258px);
  height: cha(258px);
  margin-right: cha(60px);
  margin-left: cha(73px);
  margin-top: cha(83px);
  text-align: center;
}
.icon-img {
  width: cha(258px);
  height: cha(258px);
  border-radius: cha(46px);
  border-style: solid;
  border-width: cha(4px);
  border-color: rgba($color: #ffffff, $alpha: 0.5);
}
.top-right {
  justify-content: flex-start;
}
.top-right-title {
  font-size: zi(68px);
  margin-top: cha(85px);
  color: #ffffff;
}
.top-right-about {
  flex-direction: row;
  margin-top: cha(20px);
}
.top-right-text1 {
  font-size: zi(36px);
  color: rgba($color: #ffffff, $alpha: 0.5);
  margin-right: cha(40px);
}
.top-right-text {
  font-size: zi(36px);
  color: rgba($color: #ffffff, $alpha: 0.5);
}
.button-focus {
  width: cha(382px);
  height: cha(195px);
  margin-left: -20px;
  margin-top: -10px;
  padding-left: 5px;
  opacity: 1;
}
/*  normal */
.button-focused {
  width: cha(240px);
  height: cha(80px);
  margin-top: cha(20px);
  opacity: 1;
}
.btn-opacity {
  opacity: 0;
}
.line {
  width: cha(1847px);
  margin-left: cha(73px);
  height: cha(2px);
  background-color: rgba($color: #ffffff, $alpha: 0.05);
}
/* banner */
.bannerDiv {
  width: cha(1920px);
  flex-direction: row;
}
.banner {
  flex-direction: row;
  height: cha(383px);
  padding-top: cha(40px);
  padding-bottom: cha(40px);
  padding-left: cha(73px);
  justify-content: flex-start;
  align-items: center;
}
.banner-div {
  height: cha(328px);
  width: cha(580px);
  border-radius: cha(20px);
  margin-right: cha(28px);
}
.banner-border {
  border-style: solid;
  border-radius: cha(20px);
  border-width: cha(4px);
  border-color: #ffffff;
}
.banner-vod {
  flex: 1;
  border-radius: cha(20px);
}
.bd-img {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  flex: 1;
  opacity: 1;
  border-radius: cha(20px);
}
.banner-img {
  flex: 1;
  border-radius: cha(20px);
}
.play-button {
  width: cha(118px);
  height: cha(118px);
  position: absolute;
  top: cha(103px);
  left: cha(229px);
}
/* 介绍文字 */
.about {
  background-color: transparent;
  margin-left: cha(73px);
  margin-bottom: cha(75px);
  width: cha(1812px);
}
.about-text {
  lines: 2;
  font-size: zi(30px);
  line-height: zi(48px);
  color: rgba($color: #ffffff, $alpha: 0.5);
}
/* 其他app */
.other-app {
  flex-direction: row;
  margin-left: cha(73px);
}
.other-h2 {
  font-size: zi(46px);
  color: rgba($color: #ffffff, $alpha: 0.8);
  margin-bottom: cha(36px);
  margin-left: cha(73px);
}
.other-app-div {
  margin-right: cha(20px);
  width: cha(330px);
  height: cha(299px);
  border-radius: cha(20px);
  background-color: rgba($color: #247dc7, $alpha: 0.2);
  align-items: center;
  justify-content: center;
}
.other-app-img {
  width: cha(200px);
  height: cha(200px);
  border-radius: cha(20px);
}
.bd-focus-img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.other-app-text {
  margin-top: cha(20px);
  font-size: zi(36px);
  color: #ffffff;
}
/* 弹窗mask */
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
.vod-body {
  width: cha(1600px);
  height: cha(900px);
  border-style: solid;
  border-width: cha(4px);
  border-color: rgba($color: #ffffff, $alpha: 0.5);
  border-radius: cha(20px);
}
.vod-button {
  width: cha(118px);
  height: cha(118px);
}
.mask-vod {
  flex: 1;
}
/* 下载图层 */
.down-overlay {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  justify-content: center;
  align-items: center;
  border-radius: cha(46px);
  background-color: rgba($color: #000000, $alpha: 0.8);
}
.down-overlay-div {
  justify-content: center;
  align-items: center;
  margin: cha(40px);
  text-align: center;
}
.down-overlay-text {
  font-size: zi(36px);
  color: #ffffff;
  text-align: center;
}
.progress {
  margin: cha(30px);
}
/* 错误页面 */
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
/* 测试按钮 */
.addbutton {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.button {
  margin-right: cha(40px);
  background-color: #ffe4ff;
  text-align: center;
}
</style>
