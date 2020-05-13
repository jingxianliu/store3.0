<template>
  <!-- 无网 -->
  <div
    v-if="isNoNetwork || isReqError"
    class="container"
  >
    <err-page
      :is-back="isErrorBack"
      :is-noNetwork="isNoNetwork"
    ></err-page>
  </div>
  <div
    v-else
    class="container"
  >
    <!-- <div class="bd"> -->
    <image
      :src="`${staticImg}/img/bd.png`"
      class="bd"
    ></image>
    <!-- </cell> -->
    <div class="header">
       <image v-if="signedJust"
            :src="`${staticImg}/img/add-30.png`"
            class="sign-in"
       > </image> 
       <div class="addPoint-box"  v-if="signedJust"><text  class="addPoint-txt" >+{{addPoint}}</text></div>
      <image v-else-if="isSigned"
            :src="`${staticImg}/img/sign-in-disable.png`"
            class="sign-in"
       ></image>     
      <image  v-else
            :src="`${staticImg}/img/sign-in-${focusCode === 'S0'? 'active.png':'normal.png'}`"
            class="sign-in"
      ></image>        
      <image
        :src="`${staticImg}/img/shop-${focusCode === 'S1' && this.shopFocus ? 'active.png' : 'normal.png'}`"
        class="shop"
      ></image>  
     
      <div
        class="tags"
        ref="tabs"
      >
        <div
          v-for="(item, i) in buttons"
          :key="item.name"
          :ref="item.pageCode"
          class="panel"
        >
          <image
            :src="`${staticImg}/img/${item.icon}.png`"
            :class="['panel-img', tabFocus == item.pageCode? 'imgFocus': i === pageIndex ? 'imgFocus': '']"
          ></image>
          <text :class="['panel-text', tabFocus == item.pageCode? 'buttonFocus': i === pageIndex ? 'buttonFocus': '']">{{item.name}}</text>
          <image
            :src="`${staticImg}/img/cursor.png`"
            class="cursor"
            v-if="tabFocus == item.pageCode"
          ></image>
        </div>
      </div>
      <div
        class="p-center"
        :ref="Pcenter.pageCode"
      >
        <image
          :src="`${staticImg}/img/${pcenterIcon}.png`"
          class="p-center-img"
        ></image>
        <div
          v-if="updateNum > 0"
          class="point-div"
        >
          <image
            :src="`${staticImg}/img/point.png`"
            class="point-img"
          ></image>
        </div>
      </div>
    </div>
    <div
      :style="{width: (750 * 7) + 'px'}"
      class="vxc-flex-row"
      ref="vxc-main"
    >   
         
      <div class="vxc-container">
        <Recommended
          :seatDatas="seatData0"
          ref="page0"
          :isFirst="First"
          :key="tab0"
          :vodHide="isVodHide"
          :seatCode="focusCode"
        ></Recommended>
      </div>
      <div class="vxc-container">
        <Recommended
          :seatDatas="seatData1"
          ref="page1"
          :key="tab1"
          :seatCode="focusCode"
        ></Recommended>
      </div>
      <div class="vxc-container">
        <Recommended
          :seatDatas="seatData2"
          ref="page2"
          :key="tab2"
          :seatCode="focusCode"
        ></Recommended>
      </div>
      <!-- <div class="vxc-container">
        <Recommended
          :seatDatas="seatData3"
          ref="page3"
          :key="tab3"
          :seatCode="focusCode"
        ></Recommended>
      </div> -->
      <div class="vxc-container">
        <Favorites
          ref="page3"
          :key="tab3"
          :seatCode="focusCode"
          :refresh="tabComponent === 'Favorites'"
          v-on:first="setFirst"
          v-on:upTab="upTab"
          v-on:appNum="appNum"
          v-on:retain="toRetain"
        ></Favorites>
      </div>
      <div class="vxc-container">
        <PersonalCenter
          :seatDatas="seatData"
          ref="page4"
          :key="tab4"
          :seatCode="focusCode"
          v-on:upTab="upTab"
          v-on:updataeNum="changeUpdate"
          v-on:appNum="appNum"
          v-on:retain="toRetain"
        ></PersonalCenter>
      </div>
      <div class="vxc-container">
          <ShopCenter
            ref="shop"
            :seatCode="focusCode"
            :refresh="tabComponent === 'ShopCenter'"
            v-on:upTab="upTab"
            v-on:shopPopup="shopPopup"
            v-on:getNextCode="getNextCode"
            v-on:retain="toRetain"
          ></ShopCenter>
      </div>
    
    </div>
    <!-- 底部指示词 -->
    <div class="foot" v-if="tabComponent === 'Recommended' && !isRetain">
       <image
        src="local:///logo"
        class="logo"
      ></image>
      <image
        :src="`${staticImg}/img/flat-button.png`"
        class="foot-img"
      ></image>
      <text class="foot-text">按遥控上下左右键，选择模块和内容</text>
    </div>
    <!-- 弹窗 -->
    <div class="overlay" v-if="show">
      <div
        v-if="isImg"
        class="img-body"
      >
        <image
          :src="maskImg"
          class="mask-img"
        ></image>
      </div>
      <div
        v-else
        class="vod-body"
      >
        <nativeVideo
          :setPath="maskVideo"
          class="mask-vod"
          :onTop="true"
          ref="simpleVideo"
          :key="123"
        ></nativeVideo>
      </div>
      <!-- <image :src="imgBaseUrl + '/img/play_btn.png'" class="vod-button" v-if="playState === 'pause'"></image> -->
    </div>
   
    <!-- 更新弹窗 -->
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
      content-text="应用安装中"
      font-size="50"
      content-text-color="#d4f2ff"
      :show="isToast"
      @obMaskSetHidden="obMaskSetHidden"
    >
    </ob-mask>
    <!-- 挽留界面 -->
    <re-tain
      :class="[isRetain ? 'retainOpacity': 'retain']"
      ref="retainpage"
      v-on:retain="reTain"
    ></re-tain>
      <!-- 签到页面-->
    <div  class="overlay"  v-if="isSignPageShow" style="z-index:9999">
        <image class="sign-bd"  
          :src="`${staticImg}/img/sign-in.png`">
        </image>
        <image  
            :src="`${staticImg}/img/sign-btn-${signBtn ?'active' : 'normal'}.png`"
           class="sign-in-button">
        </image>
        <image  
          :src="`${staticImg}/img/sign-cancel-${signBtn ?'normal' : 'active'}.png`"
          class="sign-cancel-button">
        </image>
    </div>

  <!-- 公告弹窗 -->
    <div class="overlay" v-if="isAnnouncement">
      <div class="announcement-body">
        <div class="announcement-content">
          <text
            class="announcement-content-text"
            :style="{fontSize: titleSize + 'px'}"
          >{{aTitle}}</text>
        </div>
        <div class="announcement-button">
          
          <image v-if="shopPopTpy === 'unenough'"
            :src="`${staticImg}/img/btn-yes.png`"
            class="announcement-img"
          ></image>
           <image v-else
            :src="`${staticImg}/img/announcemen.png`"
            class="announcement-img"
          ></image>
        </div>
      </div>
    </div>

    <!-- 无体感摄像头提示页面 -->
   <div class="overlay" v-if="noCamera">
     <div class="no-camera-top"> 
          <image  
          :src="`${staticImg}/img/no-camera-bd.png`"
              class="no-camera-img"
          ></image>
      </div>  
      <div class="no-camera-bottom"> 
          <image
            :src="`${staticImg}/img/btn-yes.png`"
            class="no-camera-btn"
          ></image>
       </div> 
    </div>
  
    <!--二维码兑换,兑换历史详情页面 -->

    <div   class="overlay" v-if="isEwmShow" >
      <div class="shop-top-div-ewm">
          <div class="ewm-item">
            <image :src="ewmUrl" class="er-img"></image>
          </div>
          <div class="shoppop-toast">
            <text class="shoppop-toast-text">手机微信扫描屏幕上方二维码</text>
            <div class="shoppop-toast-item">
              <text class="shoppop-toast-text focus-text">填写收货地址</text> 
                <text class="shoppop-toast-text">，兑换礼品哦</text>

            </div>  
          </div>
        </div>
        <div class="shop-bottom-div">
            <image class="shop-bottom-btn"    :src="`${staticImg}/img/btn-yes.png`"></image>
        </div>
    </div>
    <div class="overlay" v-if="isHistoryShow" >  
      <div class="shop-top-div-history">        
        <div class="history-p" >
            <text class="history-label">姓名：</text><text class="history-input">{{customer_name}}</text>          
        </div>
        <div class="history-p">
            <text class="history-label">电话：</text><text class="history-input">{{phone}}</text>          
        </div>
        <div class="history-p">
            <text class="history-label">地址：</text><text class="history-teaxrear">{{address}}</text>          
        </div>
        <div class="shoppop-toast">
            <text class="history-toast-text">温馨提示：奖励将在兑换成功后15个工作日内寄</text>    
            <div class="shoppop-toast-item">
                  <text class="history-toast-text">出，如果疑问请拨打客服电话：</text>
                  <text class="history-toast-text focus-text">400-886-6660</text>   
            </div>
      
        </div>
      </div>   
        <div class="shop-bottom-div">
            <image class="shop-bottom-btn"    :src="`${staticImg}/img/btn-yes.png`"></image>
        </div>   
    </div>   
  </div>
</template>

<script>
import obMask from '../../components/mask'
import obDialog from '../../components/dialog'
import errPage from '../../components/errPage'
import reTain from '../../components/retain'
import Recommended from '../recommended/entry'
import Favorites from '../favorites/entry'
import PersonalCenter from '../personalCenter/entry'
import ShopCenter from '../shopCenter/entry'
import Progress from '../../components/progress'

import {
  API,
  baseImg,
  staticImg,
  createLink,
  hasNetwork,
  setDownload,
  finishedInstall,
  statistics
} from '../../utils/index'
import getNextSeat, { initSeat, tabInit } from '../../utils/getSeat'
const home = new BroadcastChannel('app')
const getapps = new BroadcastChannel('apps')
const globalEvent = weex.requireModule('globalEvent')
const stream = weex.requireModule('stream')
const myModule = weex.requireModule('myModule')
const navigator = weex.requireModule('navigator')
const storage = weex.requireModule('storage')
const animation = weex.requireModule('animation')
export default {
  components: {
    Recommended,
    PersonalCenter,
    Favorites,
    ShopCenter,
    obMask,
    obDialog,
    errPage,
    reTain,
    Progress
  },
  data () {
    return {
      tabComponent: 'Recommended',
      focusCode: 'T0',
      lastFocusCode: null,
      pageIndex: 0,
      seatData: [],
      seatData0: [],
      buttons: [],
      Favorites: {
        name: '收藏',
        type: 'Favorites',
        page: 'Favorites',
        icon: 'icon_favorites'
      },
      Pcenter: {},
      show: false,
      maskImg: '',
      isImg: true,
      maskVideo: '',
      playState: 'play',
      staticImg: staticImg,
      baseImg: baseImg,
      isLialog: false,
      isCancel: true,
      isToast: false,
      downLoadUrl: '',
      isChild: false,
      myAppNum: 0,
      // updateNum: 0,
      isReqError: false,
      isNoNetwork: false,
      isErrorBack: false,
      pageShow: true,
      dialogText: '请更新应用！',
      isAnnouncement: false,
      pageStyle: 'opacity: 1',
      seatData1: [],
      seatData2: [],
      seatData3: [],
      date: String,
      progressCode: false,
      isIndex: true,
      imgBaseUrl: baseImg,
      appsIndex: 0,
      isRetain: false,
      titleSize: '16',
      isSignPageShow:false,
      isSigned:false,
      signedJust:false,
      signBtn:true,
      noCamera:false,
      shopFocus:false,
      shopPopTpy:'',
      customer_name:'',
      phone:'',
      address:'',
      ewmUrl:'',
      isEwmShow: false,
      isHistoryShow:false,
      addPoint:30,
      signFocus:false

    }
  },
  created () {
    let that = this
    that.date = new Date().getTime()
    // if (this.getQueryString('isUnload')) {
    //   this.tabComponent = 'PersonalCenter'
    //   this.focusCode = 'T4'
    // }
    // 监听遥控器键值
    globalEvent.addEventListener('keyDown', e => {
      console.log(`首页监听到键值${e.keyDown}`)
      that.autoFocus(e.keyDown)
    })
    // 下载进度
    globalEvent.addEventListener('loading', e => {
      console.log(`首页监听下载进度`)
      that.progress(e.progress, e.list)
      // let data = e.list
      // storage.setItem('installApps', data, e => {
      //   console.log(e)
      // })
    })
    // 返回界面 获取下载队列
    globalEvent.addEventListener('download', e => {
      console.log(`首页监听下载队列`)
      that[`seatData${that.pageIndex}`].map(n => {
        n.isDownloadShow = false
        n.isDownload = false
      })

      // console.log(JSON.parse(e.downloadList))
      // storage.setItem('installApps', e.downloadList, e => {
      //   console.log(e)
      // })
    })
    // 安装成功回调
    globalEvent.addEventListener('finishedInstall', e => {
      console.log(`首页监听安装`, e)
      // 安装统计
      // statistics('click', 0, JSON.parse(e.packageInfo).packages[0].packageName)
      // 重新拉取本地应用列表
      // if (this.isIndex) {
      //   this.getLocalApps()
      // }
      if (e.packageInfo.includes('packages')) {
        finishedInstall(e.packageInfo)
        if (
          that.tabComponent === 'Favorites' ||
          that.tabComponent === 'PersonalCenter'
        ) {
          that.$refs[`page${that.pageIndex}`].installed(e.packageInfo)
        }
        if (that.isIndex) {
          that.getLocalApps()
        }
      }
    })

    globalEvent.addEventListener('resetVideo', e => {
      if (this.pageIndex === 0) {
        this.$refs[`page0`].restart()
      } 
    })

    // 更新数据
    home.onmessage = event => {
      console.log('首页更新状态：', event.data)
      if (event.data.isIndex) {
        setTimeout(() => {
          that.isIndex = event.data.isIndex
        }, 1000)
      } else if (event.data.progress) {
        // that.progress(event.data.progress)
      } else if (event.data.autoPlay) {
        that.setFirst(false)
      } else if (event.data.downapp) {
        // 加入下载队列
        that.$store.commit('downList', event.data.downapp)
      } else if (event.data.pop) {
        // 剔除下载队列
        that.$store.commit('popList', event.data.pop)
      }
    }
    getapps.onmessage = event => {
      console.log('首页轮播更新状态：', event.data)
      that.appsIndex = event.data.index
    }
    // 初始化加载数据
    that.init()
    let promise = new Promise(function(resolve, reject) {
      // 获取公告
      // that.announcement();
      console.log('dx:announcement-get:', `${API}/package/com.orbbec.gdgamecenter/announcement`, new Date())
      stream.fetch(
        {
          method: 'GET',
          url: `${API}/package/com.orbbec.gdgamecenter/announcement`,
          type: 'json'
        },
        res => {
          if (res.data.objects.length > 0) {
            let data = res.data.objects[0]
            that.isAnnouncement = true
            that.aTitle = data.title
            console.log('-----公告----------', data.title.length,new Date())
            that.titleSize = data.title.length < 30 ? '16' : '13'
          }
          resolve()
        }
      )
    })

    promise.then(function() {
      // 签到查询
      that.checkSign()
    })
    // 获取本地应用
    that.getLocalApps()

    that.First = true
  },
  computed: {
    updateNum: function () {
      // 待更新应用数量
      return this.$store.state.updateNum
    },
    tabFocus: function () {
      if (this.isChild) {
        return null
      } else {
        return this.focusCode
      }
    },
    pcenterIcon: function () {
      // 其他页面
      console.log(this.focusCode, this.isChild)
      if (this.tabComponent === 'PersonalCenter') {
        if (this.isChild) {
          return 'person_btn_2'
        } else {
          return 'person_btn_1'
        }
      } else {
        return 'person_btn_0'
      }
    },
    isVodHide: function () {
      console.log('视频播放开放---', this.pageIndex === 0 && this.isIndex) 
      return this.pageIndex === 0 && this.isIndex
    }       
  },

  methods: {
    getQueryString (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      let url = weex.config.bundleUrl.split('?')[1]
      let r = url.match(reg)
      if (r != null) return unescape(r[2]); return null
    },
    special (dom, styles) {
      animation.transition(dom, {
        styles,
        duration: 300,
        timingFunction: 'ease',
        delay: 100
      })
    },
    // 栏目切换
    tabChange (item) {
      console.log('tab change start', item.page)
      const index = parseInt(item.pageCode.slice(1))
      this.pageIndex = index
      if (item.page === 'Recommended') {
        // this.getSeatData(item)
        initSeat(index, this[`seatData${index}`].length, item)
      }
      if (item.page === 'PersonalCenter') {
        stream.fetch(
          {
            method: 'GET',
            url: `${API}/columns/${item.code}/position?results_per_page=20`,
            type: 'json'
          }, res => {
            if (!res.ok) {
              console.log('个人中心获取出错')
              this.isReqError = true
              this.isNoNetwork = false
              return false
            }
            this.isNoNetwork = false
            this.isReqError = false
            let data = res.data.objects
            this.seatData = data
            console.log("切换到个人中心" + data )       
            this.$refs['page4'].init(data)
          })
      }
      const mainEl = this.$refs['vxc-main']
      this.special(mainEl, {
        transform: `translate(${-750 * index}px,0)`
      })
      this.tabComponent = item.page

    },
    // 子组件回到父组件
    upTab (data) {
      console.log('子组件回到父组件' + data,this.tabComponent);
      if (data.value) {
        if (this.tabComponent  === 'Favorites') {
          if (data.to === 'recommend') {
            this.focusCode = 'T0'
            // this.$refs[`page0`].restart()
            this.tabChange(this.buttons[0])
          } else if (data.to === 'front') {
            // 前一页
            const num = this.buttons.length
            this.focusCode = this.buttons[num - 2].pageCode
            this.tabChange(this.buttons[num - 2])
          } else if (data.to === 'center') {
            // 个人中心页
            this.focusCode = this.Pcenter.pageCode
            this.tabChange(this.Pcenter)
          } else {
            const num = this.buttons.length
            this.focusCode = this.buttons[num - 1].pageCode
          }
        } else if (this.tabComponent === 'PersonalCenter') {
          this.focusCode = this.Pcenter.pageCode
        } else if (this.tabComponent === 'ShopCenter') {
          this.focusCode = 'S1'
          this.shopFocus = true
        }
        this.isChild = false
      }
    },
    // 挽留界面返回值处理
    reTain (data) {
      console.log('retain------------')
      this.isRetain = false
      if (data === 'isIndex') {
        this.isIndex = false
      }
      if (this.pageIndex === 0) {
        this.$refs[`page${this.pageIndex}`].restart()          
      }
    },
    // 拉起挽留界面
    toRetain () {
      this.isRetain = true
      this.$refs.retainpage.retainPage()
    },
    init () {
      let that = this
      console.log('init -----------')
      if (!hasNetwork(that)) {
        return false
      }
      stream.fetch(
        {
          method: 'GET',
          url: `${API}/portal/439c165a-9854-35d1-b31b-ce312602291f/columns`,
          type: 'json'
        },
        res => {
          if (!res.ok) {
            console.log('栏目获取出错')

            that.isReqError = true
            that.isNoNetwork = false
            return false
          }
          that.$set(that.$data, 'isNoNetwork', true)
          that.isNoNetwork = false
          that.isReqError = false
          console.log(res)
          // console.table(res.data.objects)
          let data = res.data.objects
          data.splice(data.length - 1, 0, that.Favorites)
          // data.push(that.Favorites, centerData)
          data.map((n, i) => {
            n['pageCode'] = 'T' + i
            n['icon'] = 'icon_t' + i
            if (n.type === 'personal_center') {
              n['page'] = 'PersonalCenter'
              n['icon'] = 'icon_pcenter'
            } else if (n.type === 'recommend') {
              n['page'] = 'Recommended'
              n['icon'] = 'icon_recommend'
            } else if (n.type === 'column') {
              n['page'] = 'Recommended'
            } else if (n.type === 'Favorites') {
              n['icon'] = 'icon_favorites'
            }
          })
          tabInit(data.length) // 状态栏初始化
          that.Pcenter = data.pop()
          that.buttons = data
          console.log('栏目信息', JSON.stringify(that.buttons))
          that.getSeatData(data, data.length - 1)
        }
      )
    },
    // 获取栏目具体数据
    getSeatData (item, num) {
      console.log('获取栏目具体数据',item, num)
      let that = this
      if (!hasNetwork(that)) {
        return false
      }
      for (let i = 0; i < num; i++) {
        stream.fetch(
          {
            method: 'GET',
            url: `${API}/columns/${item[i].code}/position?results_per_page=20`,
            type: 'json'
          },
          res => {
            if (!res.ok) {
              console.log('获取栏目具体数据出错')
              that.isReqError = true
              that.isNoNetwork = false
              return false
            }
            that.isNoNetwork = false
            that.isReqError = false
            let data = res.data.objects
            if (that.tabComponent === 'PersonalCenter') {
              that.seatData = data
              return false
            }
            data.map((n, i) => {
              n['isDownloadShow'] = false
              n['isDownload'] = false
              n['imgURL'] =
                n.type !== 'vod'
                  ? baseImg + n.banner[0].image_url
                  : baseImg + n.vod[0].vod_url
              n['className'] = 'other'
              if (i === 0) {
                n['className'] = 'first'
              } else if (i === 1) {
                n['className'] = 'second'
              } else {
                if ((i - 1) % 2 === 1) {
                  n['className'] = 'third'
                } else {
                  n['className'] = 'four'
                }
              }
            })
            console.log('tab data created')
            // that.pageStyle = 'opacity: 0'
            if (i > 0) {
              that[`seatData${i}`] = data
            } else {
              that.seatData0 = data
              initSeat(0, data.length, item[i])
            }
          }
        )
      }
    },
    // 获取公告
    announcement () {
      stream.fetch(
        {
          method: 'GET',
          url: `${API}/package/com.orbbec.gdgamecenter/announcement`,
          type: 'json'
        },
        res => {
          if (res.data.objects.length > 0) {
            let data = res.data.objects[0]
            this.isAnnouncement = true
            this.aTitle = data.title
            console.log('-----公告----------', data.title.length,new Date())
            this.titleSize = data.title.length < 30 ? '16' : '13'
          }
        }
      )
    },

    checkSign() {
      var _this2 = this
      // TODO: 判断签到
      // useCamera 0: 有  1： 没有
      console.log('dx:-camera:---', myModule.useCamera())
      // 有摄像头
        var userInfo = JSON.parse(myModule.getUserInfo()) || { account: 'test' }
        var account = userInfo.account.length > 11 ? userInfo.account.slice(0, 11) : userInfo.account
        this.account = account
        //检测是否签到
        stream.fetch({
          method: 'GET',
          url: `${API}/checkin?account=${_this2.account === '' ? 'test' : _this2.account}`,
          type: 'json'
        }, function (res) {
         console.log('dx:checkSign-get:',`${API}/checkin?account=${_this2.account === '' ? 'test' : _this2.account}`, res.data), new Date()

        //  1，未打卡；0，已打卡
         if (res.data.checkin_flag === 1) {
          _this2.isSigned = false
          //有摄像头才弹窗
          if (!myModule.useCamera()) {               
            _this2.focusCode = 'S0'
            _this2.isSignPageShow = true
          }         
        } else {
           _this2.isSigned = true

          }
        });
            
    },
    // 获取本地应用
    getLocalApps () {
      if (!hasNetwork(this)) {
        return false
      }
      // let localApps = myModule.getLocalOrbbecApp() // 本地应用
      // localApps = localApps ? JSON.parse(localApps).packages : []
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
            if (!res.ok) {
              console.log("获取本地应用出错")
              this.isReqError = true
              this.isNoNetwork = false
              return false
            }
            this.isNoNetwork = false
            this.isReqError = false
            let data = res.data.objects
            let newApps = []
            for (let i = 0; i < localApps.length; i++) {
              const element = localApps[i]
              const online = data.find(
                n => n.package_name === element.packageName
              )
              // 应用存在线上
              if (online) {
                element['update'] = false
                // 需要更新
                if (online.version_code - element.versionCode > 0) {
                  num++
                  element['update'] = true
                  element['app_url'] = online.app_url
                }
                newApps.push(element)
              }
            }
            // this.updateNum = num
            this.$store.commit('localApps', newApps)
          }
        )
      }).catch(err => {
        console.log('-------------', err)
      })
    },
    // 我的应用数
    appNum (value) {
      console.log(`--本地应用数量--${value}------`)
      this.myAppNum = value
    },
    // 更新状态
    changeUpdate (value) {
      console.log('更新数量1：', value)
      this.updateNum = value
    },
    setFirst (value) {
      if (value === false) {
        this.$refs.page0.resume()
      }
    },
    // mask 隐藏
    obMaskSetHidden () {
      this.isToast = false
    },
    // 控制焦点
    autoFocus (code) {
      // 19: 上 20: 下 21: 左 22: 右
      const old = this.focusCode
      let nextSeat = String
      console.log(`---首页当前焦点-----${old}-------${this.isChild}---`)
      code = code === 66 ? 23 : code
      console.log(`---是否商城弹窗-----${this.shopPopTpy}---`)

      //商城弹窗
      if (this.shopPopTpy && (code === 23 || code === 4)) {
          
          if(this.shopPopTpy === 'unenough'){        
            this.isAnnouncement = !this.isAnnouncement ;
          }else if(this.shopPopTpy === 'ewm'){
            this.isEwmShow= !this.isEwmShow ;
          }else if(this.shopPopTpy === 'history'){
             this.isHistoryShow = !this.isHistoryShow ;
          }        
          this.shopPopTpy = ''; 
          return false;
      }

      //无摄像头
      if(this.noCamera && (code === 23 || code === 4)){
        this.noCamera = !this.noCamera ;
        return false;
      }


      // 挽留界面
      console.log('是否挽留界面', this.isRetain)
      if (this.isRetain) {
        this.$refs.retainpage.retainFocus(code)
        return false
      }

      if(this.focusCode === 'S0' || this.focusCode === 'S1'){      
        this.S0AndS1AutoFocus(code);
        return false ;
      } 
   
      // 公告
      if (this.isAnnouncement) {
        if (code === 4 || code === 23) {
          this.isAnnouncement = false
        }
        return false
      }
     

    
      // 个人中心 我的收藏 T移动
      if (this.tabComponent !== 'Recommended') {
        if (this.isChild) {
          // 内容层移动
          console.log("是否子页面",this.isChild)
          this.$refs[`page${this.pageIndex}`].autoFocus(code)
          return false
        }
      }
      // 推荐栏目
      if (code === 4) {
        if (this.show) {
          // 弹窗返回
          this.show = false
          this.$refs[`page${this.pageIndex}`].restart()
        } else if (this.isLialog) {
          // 对话框返回
          this.isLialog = false
        } else {
          // 挽留
          this.isRetain = true
          this.$refs.retainpage.retainPage()
          if (this.pageIndex === 0) {
            this.$refs[`page${this.pageIndex}`].stop()
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
            this.tabComponent = 'Recommended'
            this.isChild = false
            this.focusCode = 'T0'
            this.lastFocusCode = null
            this.pageIndex = 0
            this.init()
          }
          return false
        }
        let seatIndex = this.focusCode.slice(1)
        const type = this[`seatData${this.pageIndex}`][seatIndex].type
        if (old.includes('A')) {
          if (type === 'app') {
            this.startApp(seatIndex)
          } else if (type === 'img') {
            console.log(`-------放大图片------`)
            this.show = true
            this.isImg = true
            this.maskImg =
            baseImg + this[`seatData${this.pageIndex}`][seatIndex].banner[1].image_url
          } else if (type === 'vod') {
            console.log(`-------视频操作/是否show/播放状态------`,this.show,this.playState)
            if (this.show) {
              const currState = this.playState
              if (this.playState === 'play') {
                 console.log(`-------视频操作暂停------`,)
                 this.$refs.simpleVideo.pause()
              } else {
                console.log(`-------视频操作恢复------`,)
                this.$refs.simpleVideo.resume()
              }
              this.playState = currState === 'pause' ? 'play' : 'pause'
            } else {
              this.$refs[`page${this.pageIndex}`].stop()
              this.maskVideo = baseImg + this[`seatData${this.pageIndex}`][seatIndex].vod[0].vod_url
              this.show = true
              this.isImg = false
            }
          } else if (type === 'active') {
            console.log(`-------活动页面------`, this[`seatData${this.pageIndex}`][seatIndex].link)
            const url = `active=${encodeURIComponent(
              this[`seatData${this.pageIndex}`][seatIndex].link
            )}`
            this.isIndex = false
            navigator.push({
              url,
              animated: 'true'
            })
          } else if (type === 'apps') {
            console.log(`-------轮播页面------`)
            this.startApp(this.appsIndex, 'banner')
            // storage.getItem('bannerIndex', e => {
            //   if (e.result === 'success') {
            //     this.startApp(e.data, 'banner')
            //   }
            // })
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
          // 弹框切换按钮
          return false
        }
        if (this.isLialog) {
          // 对话框切换
          if (code === 21 || code === 22) {
            this.isCancel = !this.isCancel
          }
          return false
        }
        code = code >= 19 || code <= 23 ? code - 19 : null
       
        nextSeat = getNextSeat(this.pageIndex, this.focusCode, code)
        console.log('-----首页下一个焦点：', nextSeat)
        console.log('-----菜单Index：', this.pageIndex)
        console.log('-----old：', old)

        if (nextSeat) {          
          //判断视频是否播放
          // if(old.includes('A') && this.pageIndex === 0){
          //     let seatIndex = this.focusCode.slice(1)
          //     const type = this[`seatData${this.pageIndex}`][seatIndex].type
          //     let nextIndex = nextSeat.slice(1)
          //     const nextType = this[`seatData${this.pageIndex}`][nextIndex].type
          //     console.log("类型/下个类型/code",type,nextType,code)
          //   if(nextType === 'vod' && code === 2){
          //       console.log("切换A菜单播放视频")
          //       this.$refs[`page${this.pageIndex}`].restart()
          //     }else if(type === 'vod' && code !== 0){
          //       console.log("切换A菜单暂停视频")
          //       this.$refs[`page${this.pageIndex}`].stop()
          //     }              
          // }
        

          if (nextSeat.includes('A')) {
            // => A 位置移动
            if (old.includes('T')) {
              // 特殊：从T => A
              if (this.lastFocusCode) {
                // 从 tab => seat 回去原来有记录的位置
                nextSeat = this.lastFocusCode
              }

              if (this.tabComponent !== 'Recommended') {
                // if (this.myAppNum === 0 && this.tabComponent === 'Favorites') {
                //   return false
                // }
                this.$refs[`page${this.pageIndex}`].autoFocus(code)
              } else {
                this.$refs[`page${this.pageIndex}`].test(null, nextSeat)
              }
              this.isChild = true // 1. 清除tab样式
              this.lastFocusCode = null
            } else {
              this.$refs[`page${this.pageIndex}`].test(old, nextSeat)
            }
            this.focusCode = nextSeat
          } else {
            // => Tab
             if (this.pageIndex === 0 && code !== 0 ) {
                console.log("切换T菜单暂停视频")
                this.$refs[`page${this.pageIndex}`].stop()
              }
            this.lastFocusCode = null
            if (old.includes('A')) {
              // 特殊：从A => T
              this.lastFocusCode = this.pageIndex === parseInt(nextSeat.slice(1)) ? old : null
              this.$refs[`page${this.pageIndex}`].test(old, null) // 清除上一个焦点样式
              if (this.pageIndex !== parseInt(nextSeat.slice(1))) {
                this.$refs[`page${this.pageIndex}`].tabChange()
              }
            
            }
            if(old === 'T0' && code === 2){
              // 特殊：从T0 => S1  推荐到商城  
                this.tabFocus = "";    
                this.pageIndex = "";  
                this.showShopCenterPage(code +  19);    
               return false 
            }
            // 1. tab切换样式
            this.isChild = false
            const arrs = [].concat(this.buttons)
            arrs.push(this.Pcenter)
            const button = arrs.find(e => e.pageCode === nextSeat)
            if (old.includes('T') && button.page === 'Recommended') {
              this.progressCode = false
              this.$refs[`page${old.slice(1)}`].tabChange()
              // if (parseInt(nextSeat.slice(1)) === 0) {
              //    this.$refs['page0'].restart()
              // } else {
              //     this.$refs['page0'].pause()
              // }
              if (!this.progressCode) {
                this[`seatData${parseInt(nextSeat.slice(1))}`].map(n => {
                  n.isDownloadShow = false
                  n.isDownload = false
                })
              }
            }
            this.tabChange(button)
            this.focusCode = nextSeat
          }
        }
      }
    },
  // S焦点
    S0AndS1AutoFocus(code) {
      console.log(`S焦点${this.focusCode},按键${code},是否已签到${this.isSigned},是否展示签到页面${this.isSignPageShow}`)
       if (this.isAnnouncement && !this.isSignPageShow) {
        if (code === 4 || code === 23) {
          this.isAnnouncement = false
        }
        return false
      }
      //  签到按钮
      if (this.focusCode === 'S0') {
          console.log('签到焦点:', code, this.focusCode);  
          if (code === 4) {  //退出
              this.isAnnouncement = false;
              this.noCamera = false;
              this.isSignPageShow = false;
              // 挽留
              this.isRetain = true;
              this.$refs.retainpage.retainPage();
          }else {

             if(this.isSignPageShow){ //签到页面是否显示，显示
                if(code === 21 ){
                  this.signBtn = true ;
                }else if(code === 22){
                    this.signBtn = false ;
                }else if(code === 23 ){
                  if(this.noCamera){
                      this.noCamera = false;
                      this.signBtn = false ;
                  }else{
                    if(this.signBtn ){  //签到按钮
                        if (!myModule.useCamera()) {
                          this.signIn() // 发起签到请求                             
                         } else {
                            // 没摄像头弹窗
                            this.noCamera = true ;  
                         }  
                        
                    }else{ //取消按钮
                      this.isSignPageShow = false ;
                          //跳到推荐页
                      if(this.isAnnouncement){
                          this.focusCode = 'T0';                     
                          this.tabChange(this.buttons[0]);
                      }                                              
                    }
                  }
                  
                }
              }else{  //显示签到页面
                  if(code === 23 && !this.isSigned && !this.signedJust) {                     
                      console.log("显示签到页面")                     
                      this.signBtn = true ;
                      this.isSignPageShow = !this.isSignPageShow ;
                  }else if(code === 22){
                    // 光标到商城页                 
                    this.showShopCenterPage(code);
                  }
              }
          }
                
      } else if (this.focusCode === 'S1') {//  商城
          console.log('是否在子页面',this.isChild)
        if(this.isChild ){
          if(!this.shopPopTpy){
              this.$refs.shop.autoFocus(code, 'child')
              return false;
          }
           
        }else{
            if(code === 4){
                  // 挽留
                this.isRetain = true;
                this.$refs.retainpage.retainPage();
            }else{
                if (code === 22) {
                  this.signFocus = false ;
                  // 去推荐位
                  this.focusCode = 'T0'    
                  this.tabChange(this.buttons[0])
                } else if (code === 20 ) {
                  // 向下
                  this.$refs.shop.autoFocus(code, 'father')
                  this.isChild = true ;
                  this.shopFocus = false;
                } else if (code === 21 && !this.isSigned) {
                  //去签到
                  this.signFocus = true 
                  this.focusCode = 'S0'
                }               
            }
            
        }
      }
    },



    //签到
   signIn() {
      
      var that = this;
      stream.fetch({
        method: 'POST',
        url: `${API}/checkin`,
        type: 'application/json',
        body: {
          account: that.account === '' ? 'test' : that.account
        }
      }, function (res) {
        console.log('dx:checkin-post:---', `${API}/checkin?account=${that.account === '' ? 'test' : that.account}`,res.data);
        var data = JSON.parse(res.data);
        //签到成功
        if (data.errorcode === 1) {
			      that.isSignPageShow = false;
            console.log(`签到成功，积分增加${data.point}`)
            //延时2S，按钮从+30变为已签到
            that.signedJust = true;
            that.addPoint = data.point;
            setTimeout(() => {
                that.signedJust = false;
                that.isSigned = true;
                //不是从商城跳转过来的，就跳转到推荐页面
                if(that.signFocus){
                  that.focusCode = 'S1';                 
                }else{
                  that.focusCode = 'T0';
                  that.tabChange(that.buttons[0]);
                }                                           
            }, 2000);            
        }
      });
    },

    //显示商城
    showShopCenterPage(code){
      this.focusCode = 'S1';
      this.shopFocus = true ;

      var _mainEl = this.$refs['vxc-main'];    
      this.special(_mainEl, {
        transform: 'translate(' + -750 * 5 + 'px,0)'
      });
      this.tabComponent = 'ShopCenter'
      this.$refs.shop.shopInit();     
    },

    


    // 商城弹出层
     shopPopup(data) {
       
      this.shopPopTpy = data.type ;
      console.log('商城弹出层/类型/数据',`shop-top-div-${this.shopPopTpy}`,data)
      this.isEwmShow = false ;
      this.isHistoryShow = false;
      console.log("div类型",`shop-top-div-${this.shopPopTpy}`)
       if(data.type === 'ewm'){ //二维码弹窗
          console.log("二维码弹窗")
          this.isEwmShow = true 
          this.ewmUrl = data.value.url;
       }else if(data.type === 'unenough'){  //积分不足
            this.shopCenterAnnouncement(`您的积分不足，还需+${data.value}积分才可领取哦，快去签到得积分吧~`);
       }else if(data.type === 'history'){  //查看兑换详情
            console.log("查看兑换历史详情")
            this.isHistoryShow = true;        
            this.customer_name = data.value.customer_name
            this.phone = data.value.phone
            this.address = data.value.address

       }
     
    },

    //商城兑换弹窗
    shopCenterAnnouncement(title){
        this.isAnnouncement = true
        this.aTitle = title 
        this.titleSize = 20
        
    },
    
    // 启动应用
    startApp (i, type) {
     
      const pageName = 'appDetails'
      console.log('启动应用',this[`seatData${this.pageIndex}`][i].app[0])
      let packageName = this[`seatData${this.pageIndex}`][i].app[0].package_name
      let versionCode = this[`seatData${this.pageIndex}`][i].app[0].version_code

      // 统计板块点击上报
      let name = this[`seatData${this.pageIndex}`][i].app[0].title + '_clickview'
      statistics(name, this.pageIndex, packageName)
      if (this[`seatData${this.pageIndex}`][i].isDownloadShow) {
        // 状态为下载中
        this.isToast = true
        return false
      }
      if (type === 'banner') {
        packageName = this[`seatData${this.pageIndex}`][0].app[i].package_name
        versionCode = this[`seatData${this.pageIndex}`][i].app[i].version_code
      }
      const params = {
        packageName: packageName,
        versionCode: versionCode

      }
      const isLocal = myModule.getInstalledAppVersion(packageName)
      console.log('---本地存在应用------', packageName, isLocal)
      // 1. 判断应用是否存在
      if (isLocal) {
        stream.fetch(
          {
            method: 'GET',
            url: `${API}/app/${packageName}`,
            type: 'json'
          },
          res => {
            if (!res.ok) {
               console.log('判断应用是否存在出错')
           
              // 异常
              this.isReqError = true
              this.isNoNetwork = false
              return false
            }
            console.log('daixin:', JSON.stringify(res.data.objects[0]))
            let data = res.data.objects[0]
            // 2.是否需要更新
            console.log('更新判断', data.version_code, isLocal)
            if (data.version_code - isLocal > 0) {
              // 3.弹窗确认更新
              this.downLoadUrl = baseImg + data.app_url
              // 更新
              myModule.downLoad(packageName, baseImg + data.app_url)
              // myModule.downLoad(packageName, data.note)
              // 存入下载队列
              setDownload(packageName)
            } else {
              // 启动应用
              if (this.pageIndex !== 0) {
                this.setFirst(false)
              }
              myModule.startApp(packageName)
            }
          }
        )
        return false
      }
      const url = createLink(pageName, params)
      this.isIndex = false
      navigator.push({
        url,
        animated: 'true'
      })
    },
    // 下载进度
    progress (value, list) {
      console.log(`首页下载进度---${value}----${list}`)
      this.progressCode = true
      if (
        this.tabComponent === 'Favorites' ||
        this.tabComponent === 'PersonalCenter'
      ) {
        this.$refs[`page${this.pageIndex}`].progress(value, list)
        return false
      }
      let textName = value.split(':')[0]
      let progressValue = value.split(':')[1]
      let newData = this[`seatData${this.pageIndex}`]
      // 位置状态改变
      for (let i = 0; i < newData.length; i++) {
        if (newData[i].type === 'app') {
          let packageName = newData[i].app[0].package_name
          if (textName === packageName) {
            // 下载动画
            this[`seatData${this.pageIndex}`][i]['isDownloadShow'] = true
            this[`seatData${this.pageIndex}`][i]['isDownload'] = true
            this.loading(progressValue, packageName, i)
          } else {
            // 等待下载中
            let apps = list
            if (apps.includes(packageName)) {
              this[`seatData${this.pageIndex}`][i]['isDownloadShow'] = true
              this[`seatData${this.pageIndex}`][i]['isDownload'] = false
            } else {
              this[`seatData${this.pageIndex}`][i]['isDownloadShow'] = false
              this[`seatData${this.pageIndex}`][i]['isDownload'] = false
            }
            // storage.getItem('installApps', e => {
            //   if (e.result === 'success') {
            //     console.log('等待下载队列', e.data)
            //     let apps = JSON.parse(e.data)
            //     if (apps.includes(packageName)) {
            //       this[`seatData${this.pageIndex}`][i]['isDownloadShow'] = true
            //       this[`seatData${this.pageIndex}`][i]['isDownload'] = false
            //     }
            //   }
            // })
          }
        }
      }
    },
    // 下载动画
    loading (value, packageName, index) {
      console.log('index下载进度：', value)
      this.$refs[`page${this.pageIndex}`].setProgress(value, index)
      // 100 时剔除下载队列
      if (value === '100') {
        this.$store.commit('popList', packageName)
        this[`seatData${this.pageIndex}`][index]['isDownloadShow'] = false
        this[`seatData${this.pageIndex}`][index]['isDownload'] = false
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
.header {
  flex-direction: row;
  width: cha(1920px);
  height: cha(174px);
}

 
.logo {
  width: cha(310px);
  height: cha(51px);
  position: absolute;
  justify-content: center;
  top: cha(88px);
  left: cha(81px);
}
/* 栏目 */
.tags {
  position: absolute;
  top: cha(86px);
  left: cha(550px);
  width: cha(1400px);
  height: cha(81px);
  flex-direction: row;
  justify-content: flex-start;
}
.panel {
  flex-direction: row;
  width: cha(220px);
  height: cha(81px);
  justify-content: center;
}
.cursor {
  width: cha(220px);
  height: cha(37px);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
.panel-img {
  width: cha(57px);
  height: cha(39px);
  margin-right: cha(18px);
  opacity: 0.4;
}
.imgFocus {
  opacity: 1;
}
.panel-text {
  font-size: zi(39px);
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
}
.buttonFocus {
  color: rgba(255, 255, 255, 1);
}
/* 个人中心 */
.p-center {
  position: absolute;
  top: cha(66px);
  right: cha(71px);
  height: cha(76px);
  width: cha(233px);
}
.p-center-img {
  width: cha(233px);
  height: cha(76px);
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
/* 底部 */
.foot {
  position: fixed;
  bottom: cha(40px);
  left: 0;
  right: 0;
  height: cha(64px);
  justify-content: center;
  align-items: center;
  flex-direction: row;
}
.foot-img {
  width: cha(64px);
  height: cha(64px);
  margin-right: cha(22px);
}
.foot-text {
  font-size: zi(28px);
  color: rgba(255, 255, 255, 0.2);
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
.img-body {
  width: cha(1608px);
  height: cha(908px);
  border-style: solid;
  border-radius: cha(20px);
  border-width: cha(4px);
  border-color: rgba($color: #ffffff, $alpha: 0.5);
}
.vod-body {
  width: cha(1608px);
  height: cha(908px);
  border-width: cha(4px);
  border-style: solid;
  border-color: rgba($color: #ffffff, $alpha: 0.5);
  border-radius: cha(20px);
  justify-content: center;
  align-items: center;
}
.mask-img {
  flex: 1;
}
.mask-vod {
  width: cha(1600px);
  height: cha(900px);
}
.vod-button {
  width: cha(118px);
  height: cha(118px);
}
/* 公告弹窗 */
.announcement-body {
  width: cha(856px);
  height: cha(530px);
  border-radius: cha(20px);
  align-items: center;
  background-color: rgba(84, 104, 126, 1);
  position: relative;
}
.announcement-content {
  width: cha(720px);
  max-height: cha(265px);
  margin-top: cha(108px);
  padding-left: cha(40px);
  padding-right: cha(40px);
  text-align: center;
  vertical-align: middle;
  align-items: center;
  
}
.announcement-content-text {
  line-height: cha(60px);
  align-items: center;
  color: #d4f2ff;
  vertical-align: middle;
}
.announcement-button {
  position: absolute;
  bottom: 0;
  left: 0;
  width: cha(856px);
  height: cha(172px);
  background-color: rgba(79, 97, 117, 1);
  justify-content: center;
  align-items: center;
}
.announcement-img {
  width: cha(386px);
  height: cha(128px);
}
/* 挽留 */
.retain {
  opacity: 0;
}
.retainOpacity {
  opacity: 1;
}
/* 测试按钮 */
.vxc-flex-row {
  display: flex;
  flex-direction: row;
}
.vxc-container {
  width: 750px;
}
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
.test {
  position: absolute;
  width: cha(100px);
  height: cha(100px);
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  justify-content: center;
  align-items: center;
  border-radius: cha(46px);
  background-color: rgba($color: #000000, $alpha: 0.8);
}


/*  签到 */
 .sign-in{
    position: absolute;
    top: cha(70px);
    left:cha(81px);
    width: cha(200px);
    height:cha(70px);
  }

  .shop{
      position: absolute;
      top:cha(70px);
      left:cha(330px);
      width: cha(200px);
      height: cha(70px);
  }

  .sign-bd {
    width: cha(1010px);
    height: cha(996px);
    margin-top: cha(50px);
    margin-bottom: cha(0px);
  }
 
 
  .sign-in-button{
    width: cha(243px);
    height: cha(70px);
    position: absolute;
    bottom: cha(192px);
    left:cha(702px);
  }
 
  .sign-cancel-button{
     width: cha(243px);
    height: cha(70px);
    position: absolute;
    bottom: cha(192px);
    left: cha(976px);
  }

/**  无感用户购买提示 */
.no-camera-top{
  width:cha(856px);
  height:cha(737px);
  background-color: rgba(84, 104, 126, 1);
  border-top-left-radius: cha(20px);
  border-top-right-radius: cha(20px);
  justify-content: center;
  align-items: center;
}

.no-camera-img{
   width: cha(542px);
   height: cha(648px);
 }

.no-camera-bottom{
  width:cha(856px);
  height:cha(151px);
  background-color: rgba(79, 97, 117, 1);
  border-bottom-left-radius: cha(20px);
  border-bottom-right-radius: cha(20px);
  justify-content: center;
  align-items: center;
}
.no-camera-btn{
  width: cha(270px);
  height: cha(102px);
 
}


  .mask-img {
    width:cha(856px);
    height: cha(597px);
    background-color: #54687e;
    border-top-left-radius: cha(20px);
    border-top-right-radius:cha( 20px)
  }

  
  .shop-top-div-history{
    width: cha(866px);
    height: cha(632px);
    background-color: rgba(84, 104, 126, 1);
    border-top-left-radius: cha(20px);
    border-top-right-radius: cha(20px);
    padding-top: cha(60px);
    padding-left: cha(30px);
    padding-right: cha(30px);
    flex-direction: column;
    align-items: center;
  }
 
  .history-p {
    flex-direction: row;
    justify-content: flex-start;
    color:rgba(212, 242, 255, 1);
    line-height: 3cha(7px);
    margin-bottom: cha(21px)
  }
  .history-label{
    width: cha(155px);
    color:rgba(212, 242, 255, 1);
    font-size: zi(46px);
  }

  .history-input{
    width: cha(495px);
    height: cha(79px);
    line-height:  cha(79px);
    border-style: solid;
    border-width: 1.5px;
    color:rgba(212, 242, 255, 1);
    border-color: rgba(212, 242, 255, 1);
    border-radius: cha(10px);
  }


  .history-teaxrear{
    width: cha(495px);
    height: cha(180px);
    border-style: solid;
    border-width: 1.5px;
    color:rgba(212, 242, 255, 1);
    border-color: rgba(212, 242, 255, 1);
    border-radius: cha(10px);
  }
  .shoppop-toast {
    line-height: cha(70px);
    margin-top:cha(30px);
    justify-content: center;
    align-items: center;
  }
  .shoppop-toast-text{
    color:rgba(212, 242, 255, 1);
    font-size: zi(46px);
    align-items: left;
  }
  .history-toast-text{
    color:rgba(212, 242, 255, 1);
    font-size: zi(34px);
  }
  .shoppop-toast-item{
      flex-direction: row;
      
  }

  .focus-text{
      color: rgba(0, 255, 234, 1);
    }


 .shop-bottom-div {
    width: cha(866px);
    height: cha(202px);
    background-color: rgba(79, 97, 117, 1);
    border-bottom-left-radius:cha( 20px);
    border-bottom-right-radius: cha(20px);
    justify-content: center;
    align-items: center;
  }
 .shop-bottom-btn{
    width: cha(320px);
    height: cha(120px);
  }


  .shop-top-div-ewm{
      width: cha(866px);
      height: cha(598px);
      background-color: rgba(84, 104, 126, 1);
      border-top-left-radius: cha(20px);
      border-top-right-radius: cha(20px);
     
  }

  .ewm-item{
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top:cha(80px);
    margin-bottom: cha(40px);
  }
 
  .er-img {
    width: cha(320px);
    height:cha(320px);
  }
 
  .text-item{
    flex-direction: row;
    justify-content: center;
  }

 
  .er-text {
    width: cha(700px);
    font-size:zi(46px);
    color: rgba(212, 242, 255, 1);
    line-height: cha(60px);
  }

.addPoint-box{
  position: absolute;
  top: cha(70px);
  left: cha(81px);
  height:cha(70px);
  width:cha(200px);
  align-items: center;
  justify-content:center;
}
.addPoint-txt{
   font-size: zi(57px);
  color: rgba(212, 242, 255, 1);
}
</style>
