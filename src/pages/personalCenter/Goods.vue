<template>
    <div class="goodDiv">
      <image :src="imgUrl" class="good-img"></image>
    </div>
</template>

<script>
import { baseImg } from '../../utils/index'
export default {
  props: {
    seatData: Array
  },
  data () {
    return {
      imgUrl: String
    }
  },
  created () {
    let img = this.seatData.find(n => n.type === 'img')
    console.log(img)
    this.imgUrl = `${baseImg}${img.banner[0].image_url}`
  }
}
</script>

<style scoped lang='scss'>
@function cha($val) {
  @return round($val / 1920 * 750 * 100) / 100;
}
.goodDiv{
  width: cha(1450px);
  height: cha(726px);
  margin-top: cha(78px);
  background-color: rgba($color: #000000, $alpha: 0.16);
  border-radius: cha(20px);
}
.good-img{
  width: cha(1450px);
  height: cha(726px);
  border-radius: cha(20px);
}
</style>
