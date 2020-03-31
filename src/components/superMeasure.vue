<template>
  <div class="superMeasure">
    <div class="superMeasure-no">
      <div class="superMeasure-title">{{ superMeasureData.title }}</div>
      <div
        class="superMeasure-open"
        :class="{ 'superMeasure-open-active': superMeasureData.active }"
        @click="handleSuperMeasureActive(superMeasureData.active)"
      >
        <i class="iconfont icon-htmal5icon44"></i>
      </div>
    </div>
    <div class="superMeasure-active" v-if="superMeasureData.active">
      <template
        v-for="(superMeasure, index) in superMeasureData.MeasuringConfig"
      >
        <div
          class="superMeasure-active-item"
          :class="{ 'superMeasure-active-item-active': superMeasure.active }"
          :key="superMeasure.name"
          @click="handleSuperMeasureActiveItem(index)"
        >
          <div class="superMeasure-active-item-img">
            <img :src="superMeasure.url" alt="superMeasure.name" />
          </div>
          <span class="superMeasure-active-item-title">
            {{ superMeasure.name }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: "superMeasure",
  props: {
    isSuperMeasure: Boolean,
    superMeasureData: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleSuperMeasureActiveItem(index) {
      this.$emit("handleSuperMeasureActiveItem", index);
    },
    handleSuperMeasureActive(active) {
      this.$emit("handleSuperMeasureActive", active);
    }
  }
};
</script>
<style lang="stylus" scoped>
.superMeasure{
  border 3px solid rgba(51,255,254,0.8)
}
.superMeasure-no
  display grid
  width: 74px
  grid-template-columns 2fr  1fr
  height 30px
  line-height 30px
  color: #ffffff;
  .superMeasure-title
    width 44px
    background-color #031E3C
  .superMeasure-open
    width: 30px;
    height 30px
    background-color #0BB1DD
  .superMeasure-open-active
    transform:  rotate(90deg);
    .icon-htmal5icon44
      font-size 12px
  .superMeasure-end
    display: grid;
    background-color #0BB1DD
    .icon-guanbi
      font-size 8px
      //rgba(51,255,254,0.7);
.superMeasure-active
    display grid
    box-sizing border-box
    grid-template-rows repeat(4 ,54px)
    width:74px
    align-content center
  .superMeasure-active-item
      display flex
      align-items center
      justify-content center
      flex-direction column
      border-top 3px solid rgba(51,255,254,0.8)
      background-color #031E40
.superMeasure-active-item-img
        height:21px
        img
          height: 100%;
    .superMeasure-active-item-title
        font-size 12px
        color #ffffff
.superMeasure-active-item-active
    background-color rgba(51,255,254,0.85)
    border-top none
</style>
