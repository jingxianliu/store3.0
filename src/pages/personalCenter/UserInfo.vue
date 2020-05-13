<template>
  <div class="main">
    <text class="user-text">个人ID：{{userInfo.account ? userInfo.account : '暂无'}}</text>
    <text class="user-text">个人IP： {{userInfo.IP ? userInfo.IP : '192.168.1.2'}}</text>
    <!-- <text>您还不是VIP会员， 不能使用付费应用</text>
    <text>个人账号：{{userInfo.account ? userInfo.account : '暂无'}}</text>
    <text>订购状态：未订购</text>
    <text>订购信息：9.9元包月</text>
    <text>订购日期：2019-03-03</text>
    <button>订购</button> -->
  </div>
</template>

<script>
const myModule = weex.requireModule('myModule')
export default {
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    console.log('userinfo:created------------', typeof (myModule.getUserInfo()))
    let userInfo = JSON.parse(myModule.getUserInfo())
    this.userInfo = userInfo
  },
  methods: {
    init (item) {
      console.log('userinfo:init', item)
    }
  }
}
</script>

<style scoped lang='scss'>
@function cha($val) {
  @return round($val / 1920 * 750 * 100) / 100;
}
.main {
  width: cha(1450px);
  height: cha(726px);
  margin-top: cha(78px);
  background-color: rgba($color: #000000, $alpha: 0.16);
  border-radius: cha(20px);
  padding-top: cha(75px);
  padding-left: cha(60px);
}
.user-text {
  color: #ffffff;
  font-size: 18px;
  line-height: 30px;
}
</style>
