<template>
  <div class="helpDiv">
    <div class="help-l">
      <div
        v-for="(item, index) in helps.description"
        :key="item.title"
        class="help-l-div"
      >
        <image
          :src="`${staticImg}/img/title_check.png`"
          class="help-l-img"
          v-if="`A${index}` === focus"
        ></image>
        <text :class="['help-l-text', `A${index}` === focus ? 'help-l-focus' : null]">{{item.title}}</text>
      </div>
    </div>
    <div class="line"></div>
    <div class="help-r">
      <text class="help-r-text">{{content}}</text>
    </div>
  </div>
</template>

<script>
import { helpInit } from '../../utils/getSeat'
import { staticImg } from '../../utils/index'
export default {
  props: {
    seatData: Array,
    focus: String
  },
  data () {
    return {
      helps: [],
      feedbacks: [],
      staticImg: staticImg,
      contents: []
    }
  },
  computed: {
    content: function () {
      console.log('help content')
      const contents = this.helps.description
      if (this.focus.includes('A')) {
        const index = this.focus.slice(1)
        return contents[index].content
      } else {
        return contents[0].content
      }
    }
  },
  created () {
    console.log('help created', this.seatData)
    this.init(this.seatData)
  },
  methods: {
    init (seatData) {
      this.seatData = seatData
      const helps = seatData.find(n => n.type === 'help')
      // const feedbacks = seatData.find(n => n.type === 'feedback')
      this.helps = helps
      console.log('help created 2', seatData, helps)
      if (this.helps) {
        this.contents = helps.description
        helpInit(this.helps.description.length)
      } else {
        helpInit(0)
      }
      // this.feedbacks = feedbacks
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
.helpDiv {
  flex-direction: row;
  width: cha(1450px);
  height: cha(726px);
  margin-top: cha(78px);
  background-color: rgba($color: #000000, $alpha: 0.16);
  border-radius: cha(20px);
}
.help-l {
  padding-top: cha(75px);
}
.help-l-div {
  height: cha(100px);
  width: cha(490px);
  line-height: cha(100px);
  justify-content: center;
}
.help-l-img {
  width: cha(490px);
  height: cha(100px);
  position: absolute;
  top: 0;
  left: 0;
}
.help-l-text {
  color: #ffffff;
  font-size: zi(32px);
  margin-left: cha(60px);
}
.help-l-focus {
  font-size: zi(32px);
}
.line {
  width: cha(2px);
  height: cha(726px);
  background-color: rgba($color: #ffffff, $alpha: 0.05);
}
.help-r {
  padding-top: cha(75px);
  margin-left: cha(60px);
  width: cha(780px);
}
.help-r-text {
  color: #ffffff;
  font-size: zi(32px);
  line-height: zi(54px);
}
</style>
