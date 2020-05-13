<template>
  <div class="page">
    <image
      :src="`${staticImg}/bd.png`"
      class="bd"
    ></image>
    <image
      :src="`${staticImg}/win-${status[0]}.png`"
      :class="[`win-${status[0]}`]"
    ></image>
    <image
      :src="`${staticImg}/rule-${status[1]}.png`"
      :class="[`rule-${status[1]}`]"
    ></image>
    <image
      :src="`${staticImg}/park-${status[2]}.png`"
      :class="[`park-${status[2]}`]"
    ></image>
    <!-- 奖品介绍 -->
    <div
      v-if="popShow"
      class="overlay"
    >
      <image
        :src="`${staticImg}/${this.lastCode === 'B1' ? 'rule' : 'win'}.png`"
        :class="[`${this.lastCode === 'B1' ? 'rule' : 'win'}`]"
      ></image>
      <image
        :src="`${staticImg}/close-${status[3]}.png`"
        :class="[`close-${status[3]}`]"
      ></image>
    </div>
  </div>
</template>

<script>
const globalEvent = weex.requireModule('globalEvent')
const navigator = weex.requireModule('navigator')
const myModule = weex.requireModule('myModule')
const stream = weex.requireModule('stream')
const staticImg = 'http://112.50.251.23:11091/img/picture'
export default {
  data: () => ({
    staticImg: staticImg,
    isEPG: Boolean,
    lastCode: null,
    focusCode: 'B0',
    popShow: false
  }),
  computed: {
    status: function () {
      let arr = ['normal', 'normal', 'normal', 'normal']
      let index = this.focusCode.slice(1)
      arr[index] = 'active'
      return arr
    }
  },
  created () {
    // 监听遥控器键值
    let userInfo = JSON.parse(myModule.getUserInfo())
    globalEvent.addEventListener('keyDown', e => {
      this.autoFocus(e.keyDown)
    })
    if (this.getQueryString('isEPG')) {
      // EPG拉起
      this.isEPG = true
      stream.fetch(
        {
          method: 'GET',
          url: `http://112.50.251.23:11093/active/click?type=epg&user=${userInfo.account}`,
          type: 'json'
        }, res => {
          console.log('上报--', res)
        })
    } else {
      // 大厅活动页拉起
      this.isEPG = false
      stream.fetch(
        {
          method: 'GET',
          url: `http://112.50.251.23:11093/active/click?type=home&user=${userInfo.account}`,
          type: 'json'
        }, res => {
          console.log('上报--', res)
        })
    }
  },
  methods: {
    autoFocus (code) {
      let now = this.focusCode
      code = code === 66 ? 23 : code
      if (code === 4) {
        if (this.popShow) {
          this.popShow = false
          this.focusCode = this.lastCode
        } else {
          this.backAPP()
        }
      } else if (code === 23) {
        if (now === 'B2') {
          // 立即参与
          this.packIN()
        } else if (now === 'B3' || now === 'B4') {
          this.popShow = false
          this.focusCode = this.lastCode
        } else {
          this.popShow = true
          this.lastCode = now
          this.focusCode = 'B3'
        }
      } else {
        code = code >= 19 || code <= 23 ? code - 19 : null
        if (now === 'B3') {
          this.focusCode = 'B4'
          return false
        } else if (now === 'B4') {
          this.focusCode = 'B3'
          return false
        }
        let nextCode = this.getnextCode(now, code)
        if (nextCode) {
          this.lastCode = now
          this.focusCode = nextCode
        }
      }
    },
    // 立即参与
    packIN () {
      let packageName = 'com.Orbbec.MagicSalad2'
      const isLocal = myModule.getInstalledAppVersion(packageName)
      console.log('---本地存在应用------', packageName, isLocal)
      let userInfo = JSON.parse(myModule.getUserInfo())
      stream.fetch(
        {
          method: 'GET',
          url: `http://112.50.251.23:11093/active/click?type=pack&user=${userInfo.account}`,
          type: 'json'
        }, res => {
          console.log('上报--', res)
        })
      // 1. 判断应用是否存在
      if (isLocal) {
        myModule.startApp(packageName)
        return false
      }
      const pageName = 'appDetails'
      const params = {
        packageName: packageName
      }
      const url = this.createLink(pageName, params)
      this.isIndex = false
      navigator.push({
        url,
        animated: 'true'
      })
    },
    // 退出
    backAPP () {
      globalEvent.removeEventListener('keyDown')
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
    },
    getnextCode (now, code) {
      const seat = [
        [null, 'B1', 'B2', null],
        ['B0', 'B2', 'B2', null],
        ['B1', null, null, 'B1']
      ]
      let index = now.slice(1)
      return seat[index][code]
    },
    getQueryString (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      let url = weex.config.bundleUrl.split('?')[1]
      let r = url ? url.match(reg) : null
      if (r != null) return unescape(r[2]); return null
    },
    createLink (page, params = {}) {
      const args = []
      Object.keys(params).forEach((key) => {
        if (typeof params[key] === 'string') {
          args.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        }
      })
      if (WXEnvironment.platform === 'Web') { // eslint-disable-line
        const tplPathList = (this.getUrlParam('_wx_tpl', location.href) || '').split('/')
        tplPathList[tplPathList.length - 2] = page
        args.unshift(`_wx_tpl=${tplPathList.join('/')}`) // eslint-disable-line
        return `${location.origin}${location.pathname}?${args.join('&')}`
      }
      console.log('daixin:', weex.config.bundleUrl)
      const baseURL = 'pages/'
      const bundlePathList = `${baseURL}${page}/entry.js`
      return `${bundlePathList}?${args.join('&')}`
    },
    getUrlParam (key, url) {
      const reg = new RegExp(`[?|&]${key}=([^&]+)`)
      const match = url.match(reg)
      return match && match[1]
    }
  }
}
</script>

<style lang="scss" scoped>
@function cha($val) {
  @return round($val / 1920 * 75000) / 100;
}
.page {
  width: 750px;
  flex: 1;
  justify-content: center;
  align-items: center;
}
.bd {
  width: cha(1920px);
  height: cha(1080px);
  position: absolute;
  top: 0;
  left: 0;
}
.win-normal {
  width: cha(303px);
  height: cha(117px);
  position: absolute;
  top: cha(184px);
  right: 0;
}
.win-active {
  width: cha(336px);
  height: cha(143px);
  position: absolute;
  top: cha(170px);
  right: 0;
}
.rule-normal {
  width: cha(303px);
  height: cha(117px);
  position: absolute;
  top: cha(384px);
  right: 0;
}
.rule-active {
  width: cha(336px);
  height: cha(143px);
  position: absolute;
  top: cha(371px);
  right: 0;
}
.park-normal {
  width: cha(416px);
  height: cha(133px);
  position: absolute;
  bottom: cha(44px);
  left: cha(752px);
}
.park-active {
  width: cha(476px);
  height: cha(157px);
  position: absolute;
  bottom: cha(32px);
  left: cha(722px);
}
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
.rule {
  width: cha(1111px);
  height: cha(878px);
  position: absolute;
  top: cha(74px);
  left: cha(404px);
}
.win {
  width: cha(1111px);
  height: cha(878px);
  position: absolute;
  top: cha(74px);
  left: cha(404px);
}
.close-normal {
  width: cha(284px);
  height: cha(117px);
  position: absolute;
  top: cha(903px);
  left: cha(820px);
}
.close-active {
  width: cha(311px);
  height: cha(130px);
  position: absolute;
  top: cha(901px);
  left: cha(806px);
}
</style>
