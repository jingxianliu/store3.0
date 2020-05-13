<template>
  <div
    v-if="type === 'app'"
    :class="[focus === index ? 'seat' : '']"
  >
    <!-- APP -->
    <image
      :src='imgURL'
      class="img"
    ></image>
    <image
      :src='tagImg'
      :class="[tagImg ? 'tag' : 'tag-opacity', tagImg && index < 2 ? 'tag-big': '']"
    ></image>
    <!-- 不同位置icon -->
    <div
      v-if="index === 1"
      class="l-seat"
    >
      <image
        :src='baseImg + data.app[0].icon[0].image_url'
        class="l-seat-icon"
      ></image>
      <div>
        <text class="l-seat-text1">{{data.app[0].title}}</text>
        <text class="l-seat-text">{{data.app[0].short_title}}</text>
      </div>
    </div>
    <div
      v-if="index > 1 && (index - 1) % 2 === 1"
      class="m-seat"
    >
      <image
        :src='baseImg + data.app[0].icon[0].image_url'
        class="m-seat-icon"
      ></image>
      <div>
        <text class="m-seat-text1">{{data.app[0].title}}</text>
        <text class="m-seat-text">{{data.app[0].short_title}}</text>
      </div>
    </div>
    <div
      v-if="index > 1 && (index - 1) % 2 === 0"
      class="s-seat"
    >
      <image
        :src='baseImg + data.app[0].icon[0].image_url'
        class="s-seat-icon"
      ></image>
      <div class="s-seat-div">
        <text class="s-seat-text1">{{data.app[0].title}}</text>
        <text
          class="s-seat-line"
          v-if="data.app[0].title.length < 5"
        >|</text>
        <text
          class="s-seat-text"
          v-if="data.app[0].title.length < 5"
        >{{data.app[0].short_title}}</text>
      </div>
    </div>
    <div
      class="seat-overlay"
      v-if="data.isDownloadShow"
    >
      <div
        v-if="data.isDownloadShow"
        :class="['down-overlay', index > 1 && index % 2 ? 'down-overlay-s' : 'down-overlay-m']"
      >
        <div v-if="!data.isDownload">
          <text class="down-overlay-text">等待安装</text>
        </div>
        <Progress
          ref="progressMethod"
          v-else
          class="progress"
          circleWidth="48"
          circlePadding="8"
          circleRadius="48"
          containerWidth="44"
        ></Progress>
      </div>
    </div>
  </div>
  <div
    v-else-if="type === 'img'"
    :class="[focus === index ? 'seat' : '']"
  >
    <!-- IMAGE -->
    <div style="flex:1;">
      <image
        :src='imgURL'
        class="img"
      ></image>
      <image
        :src='tagImg'
        :class="[tagImg ? 'tag' : 'tag-opacity', tagImg && index < 2 ? 'tag-big': '']"
      ></image>
    </div>
  </div>
  <div
    v-else-if="type === 'active'"
    :class="[focus === index ? 'seat' : '']"
  >
    <!-- 活动 -->
    <div style="flex:1;">
      <image
        :src='imgURL'
        class="img"
      ></image>
      <image
        :src='tagImg'
        :class="[tagImg ? 'tag' : 'tag-opacity', tagImg && index < 2 ? 'tag-big': '']"
      ></image>
    </div>
  </div>
  <div
    v-else-if="type === 'vod'"
    :class="[focus === index ? 'seat' : '']"
  >
    <!-- 视频 -->
    <div
      class="vod-div"
      ref="VideoDiv"
    >
      <simpleVideo
        :setPath="imgURL"
        class="video"
        ref="Video"
        :key="12"
        v-if="isVod"
      ></simpleVideo>
    </div>
    <image
      :src='tagImg'
      :class="[tagImg ? 'tag' : 'tag-opacity', tagImg && index < 2 ? 'tag-big': '']"
    ></image>
  </div>
  <div
    v-else-if="type === 'apps'"
    :class="[focus === index ? 'seat' : '']"
  >
    <!-- 轮播 -->
    <slider
      class="slider"
      interval="3000"
      auto-play="true"
      @change="change"
    >
      <div
        class="slider-img"
        v-for="img in data.banner"
        :key="img.image_url"
      >
        <image
          class="img"
          resize="cover"
          :src="baseImg + img.image_url"
        ></image>
      </div>
    </slider>
  </div>
</template>

<script>
import Progress from './progress.vue'
import { baseImg, staticImg } from '../utils/index'
const animation = weex.requireModule('animation')
const apps = new BroadcastChannel('apps')
export default {
  components: {
    Progress
  },
  name: 'seat',
  props: {
    tagStyle: {},
    imgStyle: {},
    type: String,
    index: Number,
    tagURL: String,
    imgURL: String,
    toolText: String,
    data: Object,
    focus: Number,
    isVod: Boolean
  },
  computed: {
    tagImg () {
      if (this.tagURL === '3' || this.tagURL === '2') {
        return this.index < 2 ? `${staticImg}/img/tag_icon_big_${this.tagURL}.png` : `${staticImg}/img/tag_icon_${this.tagURL}.png`
      }
    }
  },
  data () {
    return {
      baseImg: baseImg
    }
  },
  created () {
    // console.log(this.data)
  },
  methods: {
    onfinish (event) {
      // this.state = 'onfinish'
    },
    change (event) {
      apps.postMessage({ index: event.index })
    },
    restart () {
      this.$refs.Video.restart()
    },
    pause () {
      this.$refs.Video.pause()
    },
    resume () {
      // this.$refs.Video.overrideAutoplay()
    },
    stop () {
      this.$refs.Video.stop()
    },
    onTop () {
      this.$refs.Video.onTop()
    },
    applyChange () {
      this.$refs.Video.applyChange()
    },
    scaleVod (value) {
      let mWidth = Math.round(825 / 1920 * 750 * 100) / 100
      let mHeight = Math.round(660 / 1920 * 750 * 100) / 100
      let borderWidth = Math.round(7 / 1920 * 750 * 100) / 100
      if (value) {
        animation.transition(this.$refs.Video, {
          styles: {
            width: (mWidth * 1.06 - borderWidth) + 'px',
            height: (mHeight * 1.06 - borderWidth) + 'px'
          },
          duration: 0.2
        })
      } else {
        animation.transition(this.$refs.Video, {
          styles: {
            width: mWidth + 'px',
            height: mHeight + 'px'
          },
          duration: 0.2
        })
      }
    },
    setProgress (value) {
      console.log('-----------seat-progress------')
      this.$refs.progressMethod.setProgress(0, value)
    }
  }
}
</script>

<style lang="scss" scoped>
@function cha($val) {
  @return round($val / 1920 * 75000) / 100;
}
@function zi($val) {
  @return floor($number: $val * 4 /10);
}
.seat {
  border-style: solid;
  border-radius: cha(20px);
  border-width: cha(4px);
  border-color: #ffffff;
}
.bd_border {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
}
.tag {
  position: absolute;
  top: cha(-6px);
  right: cha(-7px);
  width: cha(105px);
  height: cha(105px);
  z-index: 888;
}
.tag-big {
  width: cha(124px);
  height: cha(124px);
}
.tag-opacity {
  opacity: 0;
}
.bd0 {
  position: absolute;
  top: 0;
  left: 0;
  width: cha(749px);
  height: cha(660px);
}
.img {
  flex: 1;
  border-radius: cha(20px);
}
.l-seat {
  position: absolute;
  bottom: 0;
  left: 0;
  height: cha(120px);
  width: cha(500px);
  flex-direction: row;
  align-items: center;
  font-size: zi(38px);
  color: #ffffff;
}
.l-seat-icon {
  width: cha(72px);
  height: cha(72px);
  margin-left: cha(23px);
  margin-right: cha(27px);
}
.l-seat-text1 {
  font-size: zi(38px);
  color: #ffffff;
}
.l-seat-text {
  font-size: zi(22px);
  align-items: center;
  width: cha(330px);
  lines: 1; // eslint ignore lines
  color: rgba($color: #ffffff, $alpha: 0.6);
}
.m-seat {
  position: absolute;
  bottom: 0;
  left: 0;
  height: cha(120px);
  width: cha(400px);
  flex-direction: row;
  align-items: center;
  font-size: zi(38px);
  color: #ffffff;
}
.m-seat-icon {
  width: cha(72px);
  height: cha(72px);
  margin-right: cha(20px);
  margin-left: cha(23px);
}
.m-seat-text1 {
  font-size: zi(38px);
  color: #ffffff;
}
.m-seat-text {
  font-size: zi(22px);
  width: cha(300px);
  lines: 1;
  color: rgba(255, 255, 255, 0.6);
}
.s-seat {
  position: absolute;
  top: 0;
  left: 0;
  width: cha(400px);
  height: cha(220px);
}
.s-seat-icon {
  position: absolute;
  top: cha(27px);
  left: cha(23px);
  width: cha(72px);
  height: cha(72px);
}
.s-seat-div {
  position: absolute;
  bottom: 0;
  left: 0;
  height: cha(62px);
  width: cha(400px);
  flex-direction: row;
  align-items: center;
  font-size: zi(38px);
  padding-left: cha(23px);
  color: #ffffff;
}
.s-seat-text1 {
  font-size: zi(38px);
  color: #ffffff;
}
.s-seat-line {
  font-size: zi(24px);
  color: #ffffff;
  margin-left: cha(14px);
  margin-right: cha(14px);
}
.s-seat-text {
  font-size: zi(22px);
  color: rgba(255, 255, 255, 0.6);
}
.tooltip {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 16px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  height: cha(80px);
  text-align: center;
  line-height: cha(80px);
}
.vod-div {
  flex: 1;
  border-radius: cha(20px);
}
.video {
  flex: 1;
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
.slider {
  height: cha(660px);
  width: cha(825px);
  border-radius: cha(20px);
}
.slider-img {
  height: cha(660px);
  width: cha(825px);
}
.slider-img .img {
  flex: 1;
}
/* 下载阴影 */
.seat-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: cha(20px);
  background-color: rgba($color: #000000, $alpha: 0.5);
}
/* 下载图层 */
.down-overlay {
  position: absolute;
  left: cha(23px);
  bottom: cha(18px);
  width: cha(72px);
  height: cha(72px);
  justify-content: center;
  align-items: center;
  border-radius: cha(20px);
  // background-color: rgba($color: #000000, $alpha: 0.8);
}
.down-overlay-m {
  width: cha(72px);
  height: cha(72px);
  left: cha(23px);
  bottom: cha(20px);
}
.down-overlay-s {
  width: cha(72px);
  height: cha(72px);
  top: cha(27px);
  left: cha(23px);
  bottom: 0;
}
.down-overlay-text {
  font-size: zi(18px);
  color: #ffffff;
}
.progress {
  margin: cha(12px);
}
.test {
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
</style>
