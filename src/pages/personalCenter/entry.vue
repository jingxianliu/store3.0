<template>
  <div class="pcenter">
    <div class="line"></div>
    <div class="content">
      <div class="tabs">
        <div
          v-for="item in buttons"
          :key="item.name"
          @click="tabChange(item)"
          class="tab"
        >
          <image
            :src="tabImg"
            class="tab-img"
            v-if="tabComponent === item.page"
          ></image>
          <text :class="['tab-text', focusCode === item.icon ? 'tab-focus' : '']">{{item.name}}</text>
        </div>
      </div>
      <component
        v-bind:is="tabComponent"
        :seatData="seatDatas"
        :focus="focusCode"
        v-on:appNum="appNum"
        v-on:updataeNum="toUpdate"
        v-on:nextFocus="nextFocus"
        v-on:retain="retain"
        ref="myApp"
      ></component>
    </div>
  </div>
</template>

<script>
 import Userinfo from './UserInfo'
import Help from './HelpFeedback'
import App from './MyApps'
import Order from './Goods'
import { getCenterSeat } from '../../utils/getSeat'
import { staticImg, baseImg } from '../../utils/index'
const myModule = weex.requireModule('myModule')
const storage = weex.requireModule('storage')
export default {
  components: {
    Userinfo,
    Help,
    App,
    Order
  },
  props: {
    seatDatas: Array
  },
  data () {
    return {
      tabComponent: 'Userinfo',
      focusCode: 'T',
      myAppNum: 0,
      buttons: [
        {
          name: '会员信息',
          page: 'Userinfo',
          icon: 'C0'
        },
        {
          name: '帮助详情',
          page: 'Help',
          icon: 'C1'
        },
        {
          name: '我的应用',
          page: 'App',
          icon: 'C2'
        },
        {
          name: '产品信息',
          page: 'Order',
          icon: 'C3'
        }
      ],
      staticImg: staticImg,
      imgBaseUrl: baseImg,
      helpData: []
    }
  },
  computed: {
    tabImg: function () {
      // 1. page 2. active
      if (this.focusCode.includes('C')) {
        return `${staticImg}/img/App_active.png`
      } else {
        return `${staticImg}/img/App_hover.png`
      }
    }
  },
  created () {
    console.log('--------个人中心--------')
  },
  methods: {
    init (item) {
      // 帮助页面初始化
      this.$refs['myApp'].init(item)
      this.helpData = item
    },
    tabChange (item) {
      this.tabComponent = item.page
      if (item.page === 'Help') {
        console.log('to helo :-----', this.helpData)
        this.seatDatas = this.helpData
      }
    },
    // 我的应用数
    appNum (value) {
      console.log(`--本地应用数量--${value}------`)
      this.myAppNum = value
    },
    // 返回挽留
    retain () {
      this.$emit('retain', true)
    },
    // 更新状态
    toUpdate (value) {
      console.log('卸载更新数量', value)
      this.$emit('updataeNum', value)
    },
    autoFocus (code) {
      console.log('---个人中心--', code,this.focusCode,this.tabComponent)
      let old = this.focusCode
      if (this.tabComponent === 'App') {
        // 我的应用焦点控制
        this.$refs.myApp.autoFocus(old, code)
        return false
      }
      if (code === 4) {
        // back
        this.$emit('retain', true)
      } else if (code === 23) {
        // 确认
      } else {
        code = code >= 19 || code <= 23 ? code - 19 : null
        let nextCode = getCenterSeat(old, code, this.tabComponent, this.myAppNum)
        console.log(`----个人中心下一焦点---${nextCode}--`)
        if (nextCode) {
          this.nextFocus(nextCode)
        }
      }
    },
    // 聚焦切换
    nextFocus (nextCode) {
      if (nextCode.includes('C')) {
        // tab切换
        // 1. A => C
        // 2. C => C
        let button = this.buttons.find(e => e.icon === nextCode)
        this.tabChange(button)
        this.focusCode = nextCode
      } else {
        // 帮助反馈
        this.focusCode = nextCode
        // 帮助统计
        // statistics('click', 2, 1)
        if (nextCode === 'T') {
          this.$emit('upTab', { to: 'personalcenter', value: true })
        }
      }
    },
    // 下载进度
    progress (value, list) {
      this.$refs.myApp.progress(value, list)
    },
    // 下载动画
    loading (value, packageName, index) {
      this.$refs.myApp.loading(value, packageName, index)
    },
    // 安装状态更新
    installed (value) {
      this.$refs.myApp.installed(value)
    },
    // 退出应用
    backApp () {
      myModule.finish()
      storage.removeItem('installApps')
      storage.removeItem('localApps')
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
.line {
  width: cha(1920px);
  height: cha(2px);
  background-color: rgba($color: #ffffff, $alpha: 0.05);
}
.content {
  flex-direction: row;
}
.tabs {
  height: cha(904px);
  align-items: center;
  padding-top: cha(78px);
  margin-right: cha(57px);
  background-color: rgba($color: #00ffde, $alpha: 0.04);
}
.tab {
  width: cha(348px);
  height: cha(164px);
  justify-content: center;
}
.tab-img {
  position: absolute;
  top: 0;
  left: 0;
  width: cha(348px);
  height: cha(164px);
}
.tab-text {
  font-size: zi(42px);
  text-align: center;
  color: rgba($color: #ffffff, $alpha: 0.4);
}
.tab-focus {
  color: #ffffff;
}
.bd {
  width: cha(1920px);
  height: cha(1080px);
  position: absolute;
  top: 0;
  left: 0;
}
</style>
