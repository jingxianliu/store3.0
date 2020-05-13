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
            :src="`${staticImg}/img/${item.img}-${focusCode === item.icon ? 'active' :  tabComponent === item.page ? 'normal':''}.png`"
            class="tab-img"
          ></image>
          
          <text :class="['tab-text', focusCode === item.icon ? 'tab-focus' : '']">{{item.name}}</text>
        </div>
     </div>

      <div v-if="tabComponent === 'PointsShop'"  class="component"  >
          <div  class="current-point-box">
            <div class="current-point-item">
                <text class='current-point-text'>当前积分：</text>
            </div>
            <div class="current-point-item">
                <text class='current-point-val'>{{currentPoint}}</text>
            </div>
          </div>
          <div
              v-if="goodData.length === 0"
              class="no-box">
              <image
                :src="`${staticImg}/img/app_box.png`"
                class="no-img"
              ></image>
              <div>
                <text class="no-text">当前暂无可兑换商品</text>
              </div>
              <image
                :src="`${staticImg}/img/no_button_${isNoCheck ? 'active' : 'normal'}.png`"
                class="no-button"
              ></image>
          </div>
           <scroller  v-else scroll-direction="horizontal">

              <div class="shop-box"   ref="shop">
                    <div
                        v-for="(good,i) in goodData"
                        :key="good.sequence"
                          :ref="`A${i}`"
                        class="good-item"
                      >
                      <image
                        :src="`${staticImg}${good.img && good.img[0] ? good.img[0].image_url : ''}`"
                        class="good-img"
                      ></image>
                      <text class="good-text good-title">{{good.title}} </text>    
                      <div class="good-point">
                          <image
                          :src="`${staticImg}/img/ii.png`" class="good-point-icon"></image>
                          <text class="good-text good-point-value">{{good.point}}</text>
                          <text class="good-text good-point-desc">积分</text>
                      </div>   

                      <image  v-if="good.state === '1' && `A${i}` ===  focusCode" :src="`${staticImg}/img/exchange-active.png`"
                        class="good-btn"></image>  
                      <image  v-else-if="good.state === '1' && `A${i}` !==  focusCode" :src="`${staticImg}/img/exchange-normal.png`"
                        class="good-btn"></image>  
                      <image v-else-if="good.state !== '1' && `A${i}` ==  focusCode"  :src="`${staticImg}/img/no-shop-active.png`"
                        class="good-btn"></image>  
                      <image v-else-if="good.state !== '1' && `A${i}` !==  focusCode"  :src="`${staticImg}/img/no-shop-normal.png`"
                        class="good-btn"></image>  
                      
                  </div>                                
              </div>        
           </scroller>            
      </div>
      <div v-else-if="tabComponent === 'PointsHistory'"  class="component"   >
            <div class="history-list">
                <text class="list-title date">兑换日期</text>
                <text class="list-title name">商品名称</text>
                <text class="list-title point">消耗积分</text>
                <text class="list-title operate operate-txt">查    看</text>
            </div>
            <scroller scroll-direction="horizontal">
                <div ref="history" class="history-box">
                  <div
                      v-for="(item, i) in historyData"
                      :key="i"
                      :ref="`A${i}`"
                      class="history-list"
                   >    
                      <text class="list-body list-body-text date">{{item.created_timestamp.substr(0,10)}}</text>
                      <text class="list-body list-body-text name">{{item.goods_title}}</text>
                      <text class="list-body list-body-text point">{{item.point }}</text>
                  
                    <image  v-if="`A${i}` ===  focusCode" :src="`${staticImg}/img/history-more-active.png`"
                      class="list-body operate operate-img"></image>  
                    <image v-else :src="`${staticImg}/img/history-more-normal.png`"
                      class="list-body operate operate-img"></image>  
                  </div>
                </div>
            </scroller>
      </div>
      <div v-else class="component">
            <image  :src="`${staticImg}/img/point-rule.png`"  class="rules-img"></image>
      </div>  

 
    </div>
  </div>
</template>

<script>

import {API, staticImg, baseImg } from '../../utils/index'

var stream = weex.requireModule('stream');
var dom = weex.requireModule('dom');
var animation = weex.requireModule('animation');
const myModule = weex.requireModule('myModule')

var tabData = [['S1', 'C1', null, 'A0'], ['C0', 'C2', null, 'A0'], ['C1', null, null, null]];
var shopSeats = [];
var historySeats = [];
export default {
 
 data() {
    return {
      tabComponent: 'PointsShop',
      focusCode : 'S1',
      buttons: [{
        name: '积分商铺',
        page: 'PointsShop',
        icon: 'C0',
        img:'shop-store'
      }, {
        name: '兑换历史',
        page: 'PointsHistory',
        icon: 'C1',
        img:'score-rule'
      }, {
        name: '积分规则',
        page: 'PointsRule',
        icon: 'C2',
        img:'history'
      }],
      staticImg: staticImg,
      API: API,
      goodData: [],
      account: '',
      currentPoint: 0,
      historyData: [],
      transY:0
    }
  },



  created() {
    console.log('--------积分商城--------',focusCode);
   // this.getSelf();
  },

  methods: {
   

     tabChange(item) {
       if(this.type !== 'father'){
          this.tabComponent = item.page ;
          this.focusCode = item.icon;
       }
       
      if (this.tabComponent === 'PointsShop') {
        // 商铺初始化
        this.shopInit();
      } else if (this.tabComponent === 'PointsHistory') {
          console.log('历史初始化')
        // 历史初始化
        this.historyInit();
      } else{

      }
    },

    // shop
     shopInit() {
      var _this = this;
       shopSeats = [];
      stream.fetch({
        method: 'GET',
        url: `${API}/com.orbbec.gdgamecenter/goods?results_per_page=0`,
        type: 'json'
      }, function (res) {
        console.log('dx:shop-goods:', `${API}/com.orbbec.gdgamecenter/goods`,res.data);
        _this.goodData = res.data.objects;
        if (res.data && res.data.objects) {
          var num = res.data.objects.length;
          if (num === 0) {
            tabData[0][3] = null;
          }else if (num <= 4) {
              for (var i = 0; i < num; i++) {
                shopSeats.push([null, null, i > 0 ? 'A' + (i - 1) : 'C0', i === num - 1 ? null : 'A' + (i + 1)]);
              }
          } else {
              for (var _i = 0; _i < num; _i++) {
                shopSeats.push([parseInt(_i / 4) === 0 ? null : 'A' + (_i - 4), _i >= num - 4 ? null : 'A' + (_i + 4), _i % 4 ? 'A' + (_i - 1) : 'C0', _i % 4 === 3 ? null : 'A' + (_i + 1)]);
              }
         
            // 最后一个右NULL
            shopSeats[num - 1][3] = null;
          }
        }
      });
       this.getSelf();
    },

    // history
     historyInit() {
      var _this2 = this;
       historySeats = [];
      stream.fetch({
        method: 'GET',
        url: `${API}/com.orbbec.gdgamecenter/order/${_this2.account === '' ? 'test' : _this2.account}?results_per_page=0&direction=desc`,
        type: 'json'
      }, function (res) {
        console.log('dx:order-history:', `${API}/com.orbbec.gdgamecenter/order/${_this2.account === '' ? 'test' : _this2.account}`,res.data);
        if (res.data && res.data.objects) {
          _this2.historyData = res.data.objects;
          var num = _this2.historyData.length;
          if (num === 0) {
            tabData[1][3] = null;
          }
          if (num > 0) {
            for (var i = 0; i < num; i++) {
              historySeats.push([i === 0 ? null : 'A' + (i - 1), i === num - 1 ? null : 'A' + (i + 1), 'C1', null]);
            }
          }
        }
      });
    },
     getSelf() {
      var _this3 = this;

      var userInfo = JSON.parse(myModule.getUserInfo()) || { account: 'test' };
      var account = userInfo.account.length > 11 ? userInfo.account.slice(0, 11) : userInfo.account;
      this.account = account;
      // 查询积分
      stream.fetch({
        method: 'GET',
        url: `${API}/checkin?account=${_this3.account === '' ? 'test' : _this3.account}`,
        type: 'json'
      }, function (res) {
        console.log('dx:total_point_query:',`${API}/checkin?account=${_this3.account === '' ? 'test' : _this3.account}`, res.data);
        _this3.currentPoint = res.data.total_point;
      });
    },

    // 焦点
     autoFocus(code, type) {
      console.log('---积分code/类型/focus--', code, type,this.focusCode);
      // tab => child
      if (type  === 'father') {
          this.tabChange(this.buttons[0]);
          return  ;
      }

      var old = this.focusCode;
      var isTab = this.focusCode.includes('C');
      var oldIndex = parseInt(this.focusCode.slice(1));
      if (this.tabComponent === 'PointsShop') {
        // 商铺焦点控制
        console.log('dx,-商铺', code, isTab);
        // 第一层
        if (isTab) {

          if (code === 19) {
            // 上 回头部
            this.focusCode = 'S1';
            this.$emit('upTab', {value:true});
          } else if (code === 20) {
            // 下
            this.tabChange(this.buttons[1]);
          } else if (code === 4) {
            // back
            this.$emit('retain', true);
          } else if (code === 22) {
            // 右
            this.focusCode = 'A0';
          }
        } else {
          // 第二层
          if (code === 23) {
            // 弹窗展示
            console.log('dx-兑换按钮');
            var seatData = this.goodData[oldIndex];
            if (parseInt(seatData.state) === 1) {
              console.log('dx:exchange:',this.currentPoint,seatData.point,parseInt(this.currentPoint) >= parseInt(seatData.point))
              // 判断是否足够积分
              
              if (parseInt(this.currentPoint) >= parseInt(seatData.point)) {
                // 弹出二维码
                this.exchange(seatData.code);
              } else {
                // 积分不足
                this.goHome('unenough', parseInt(seatData.point) - parseInt(this.currentPoint) );
              }
            }
          } else if (code === 4) {
            // back
            this.$emit('retain', true);
          } else {
            code = code >= 19 && code <= 22 ? code - 19 : null;
           // if (code) {
              console.log(code, '-----', oldIndex);
              console.log(shopSeats[0], '====', shopSeats[1]);
              var nextCode = shopSeats[oldIndex][code];
              console.log('dx:shop 下一个焦点', nextCode);
              if (nextCode) {
                this.focusCode = nextCode;
                this.t2d(old, nextCode,code);
              }
           // }
          }
        }
        return false;
      } else if (this.tabComponent === 'PointsHistory') {
        // 历史记录
         console.log('dx,-历史记录', code, isTab); 

        // 第一层
        if (isTab) {
          if (code === 19) {
            // 上
            this.tabChange(this.buttons[0]);
          } else if (code === 20) {
            // 下
            this.tabChange(this.buttons[2]);
          } else if (code === 4) {
            // back
            this.$emit('retain', true);
          } else if (code === 22) {
            // 右
            this.focusCode = 'A0';

          }
        } else {
          console.log('历史纪录第二层')
          // 第二层
          if (code === 23) {
            // 弹窗展示
            console.log('展示详情info',this.historyData[oldIndex] )
            this.goHome('history', this.historyData[oldIndex] );
          } else if (code === 4) {
            // back
            this.$emit('retain', true);
          } else {

            code = code >= 19 && code <= 22 ? code - 19 : null;
            console.log('按键code',code)
           // if (code) {
              var _nextCode = historySeats[oldIndex][code];
              console.log('dx:history 下一个焦点', _nextCode);
              if (_nextCode) {
                this.focusCode = _nextCode;
                this.t2d(old, _nextCode,code);
              }
            //}
          }
        }
      }else if (this.tabComponent === 'PointsRule') {
         console.log('dx,-积分规则', code, isTab); // 19 false
        if (code === 19) {
          // 上
          this.tabChange(this.buttons[1]);
        }if (code === 4) {
          // back
          this.$emit('retain', true);
        }
        return false;
      }
    },

    // 变换
     t2d(old, now,code) {
      var _this4 = this;
      console.log('-------变换/原焦点/下一焦点-------',old,now) // -------变换/原焦点/下一焦点-------A0A1__LOG
      var maxHeight = Math.round(550 / 1920 * 750 * 100) / 100; //214
      var minHeight = Math.round(0 / 1920 * 750 * 100) / 100; //84011
      var b = Math.round(30 / 1920 * 750 * 100) / 100;  //72
      if (old.includes('A') && now.includes('A')) {
        console.log("A焦点移动/最大高度/最小高度/？",maxHeight,minHeight,b) //214 .84011 .72__LOG
        var element = this.$refs[now][0];  
        var index = parseInt(now.slice(1));
        dom.getComponentRect(element, function (options) {     
            console.log("----index/code----",index,code ) //301

               if(_this4.tabComponent === 'PointsShop') {
                    if(index > 3   ){ //大于3，
                        if(code === 1){ //往下按
                            _this4.transY +=  options.size.height;                      
                        }else if(code === 0){//往上按
                             _this4.transY -=  options.size.height;  
                        }
                         console.log('商铺滚动',_this4.transY,`'translateY(-${_this4.transY }px)'`)
                    
                    }else if(index < 3 ){
                       _this4.transY =  0  
                    }

                     animation.transition(_this4.$refs.shop, {
                          styles: {
                             transform: `translateY(-${_this4.transY}px)`
                          },
                          duration: 1
                        });


               }else if(_this4.tabComponent === 'PointsHistory'){
          
                  if( index > 4){//滚屏 第6个开始滚动
                          if(code === 1){
                              _this4.transY +=  options.size.height
                          }else if(code === 0){
                              _this4.transY -=  options.size.height
                          }                        
                        console.log( `兑换历史第${index}行滚动`, _this4.transY,`'translateY(-${_this4.transY }px)'`)
                  }else{
                         _this4.transY =  0
                  }
                  
                             
                     animation.transition(_this4.$refs.history, {
                        styles: {
                             transform: `translateY(-${_this4.transY}px)`
                        },
                        duration: 1
                      });
               }

          
        });
      }else if(old.includes('A') && now.includes('C')) {
        console.log('回到右边菜单,滚动回去')
        this.transY = 0;
        if(_this4.tabComponent === 'PointsShop'){
            animation.transition(this.$refs.shop, {
              styles: {
               transform: `translateY(-${_this4.transY}px)`
              },
              duration: 1
            });

        }else if(_this4.tabComponent === 'PointsHistory'){
            animation.transition(this.$refs.history, {
                styles: {
                 transform: `translateY(-${_this4.transY}px)`
                },
                duration: 1
              });
        }
       
        
      }
    },

    // 二维码
    exchange(code) {
      var _this5 = this;

      stream.fetch({
        method: 'GET',
        url: `${API}/qr?account=${_this5.account === '' ? 'test' : _this5.account}&goods_code=${code}`,
        type: 'json'
      }, function (res) {
        console.log('dx:exchange-er:', res.data);
        var erUrl = `${baseImg}${res.data.qr_url}?account=${_this5.account === '' ? 'test' : _this5.account}&goods_code=${code}`;
        _this5.goHome('ewm', { url:erUrl });
      });
    },

    // 商铺弹出层
    goHome(type, data) {
      // erm: 二维码 unenough: 积分不足  enough  兑换成功 history : 兑换详情
      this.$emit('shopPopup', { type: type, value: data });
    },

    // 返回挽留
    retain() {
      this.$emit('retain', true);
    },

    // 退出应用
     backApp() {
      myModule.finish();
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


.component {
  width: cha(1450px);
  height: cha(726px);
  margin-top: cha(78px);
  background-color: rgba($color: #000000, $alpha: 0.16);
  border-radius: cha(20px);
  padding-top: cha(47px);
  padding-left: cha(60px);
  padding-right: cha(30px);
}

/*积分商铺*/

.current-point-box{
   flex-direction: row;
   justify-content: left;
   margin-bottom: cha(50px);
   margin-left: cha(20px);

}
.current-point-item{
  width: auto;
}
.current-point-text{
  font-size: zi(44px);
  color: rgba(255, 255, 255, 1)
}

.current-point-val{
   font-size: zi(44px);
   color: rgba(0, 204, 255, 1)
}
.shop-box{
  flex-direction:row;
  justify-content: flex-start;
  flex-wrap:wrap;
  text-align:center;
}
.good-item{
  width:cha(330px);
  flex-direction: column;
  align-items:center;
  justify-content: center;
  color: rgba(255, 255, 255, 1);
  
}
.good-img{
  width:cha(283px);
  height:cha(167px);
  border-radius:cha(20px);
  margin-bottom:cha(30px);
}

.good-text{
  color: rgba(255, 255, 255, 1);
  margin-bottom:cha(10px);
  font-size: zi(21px);
  
}
.good-title{
  width:cha(283px);
  font-size: zi(30px);
  text-align:center;
}
.good-point{
   flex-direction: row;
   justify-content: center;
   align-items:center;
}
.good-point-icon{
   width:cha(19px);
   height:cha(19px);
}
.good-point-value{
  color: rgba(0, 204, 255, 1);
  font-size: zi(24px);
  text-align:center;

}
.good-point-desc{
  font-size: zi(24px);
}

.good-btn{
     margin-bottom: cha(40px);
     width:cha(140px);
     height: cha(50px);
}


/*  兑换历史 */

.history-box{
  flex-direction:row;
  justify-content: flex-start;
  flex-wrap:wrap;
  text-align:center;
}

.history-list{
  flex-direction: row;
  margin-left: cha(75px);
  margin-right: cha(100px);
  border-bottom-style:solid;
  border-bottom-width: 1px ;
  border-bottom-color: rgba(255, 255, 255,0.1);
}

.list-title{
    font-size: zi(36px);
    color: rgba(255, 255, 255, 1);
    height: cha(90px);
}
.list-body{
    font-size: zi(30px);
    color: rgba(255, 255, 255, 1); 
    margin-top: cha(8px);
    margin-bottom: cha(8px);
}
.list-body-text{
  margin-top:cha(30px);
}
.date{
    width: cha(300px);
  }
.name{
    width: cha(400px);
  }
.point{
  width: cha(260px);
}
.operate-img{
  height:cha(77px);
}

.operate{
 width: cha(212px);
}

.operate-txt{
  margin-left: cha(50px)
}
/*积分规则*/ 
.rules-img{
  width: cha(1240px);
  height: cha(513px);
  margin-top: cha(30px);
  margin-left: cha(35px);
  border-radius: cha(20px);
}

</style>