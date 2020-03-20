<template>
  <div class="popupActive">
    <div class="popupActive-title">
      <img src="../assets/popupActive-g-2.png" />
      <div class="popupActive-title-desc">
        <div class="popupActive-title-gb">{{ popupActiveTitleDesc }}</div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "popupActiveTitle",
  props: {
    popupActiveTitleDesc: String
  }
};
</script>

<style lang="stylus" scoped>
.popupActive
    position absolute
    width 400px
    height: 225px
    top 0
    left 0
    right 0
    bottom 0
    margin auto
    background-color #0e2d5f
    background url("http://cdn.j6375x.cn/cdn/pic/p-bg.gif")  no-repeat 50% 50%
.popupActive-title
    position absolute
    height: 100%
    top 0
    left 0
    right 0
    bottom 0
    margin auto
    img
        height:100%
        transform scale(1.08)
        opacity 0.55
    .popupActive-title-desc
        position absolute
        top 0
        left 0
        right 0
        bottom 0
        display flex
        flex-direction column
        .popupActive-title-gb
            font-size 48px
            height calc(100% - 120px)
            display flex
            flex-direction column-reverse
            color #D7EFF9
        .popupActive-title-left
            width:87px;
            height:36px;
            line-height 36px
            font-size 24px
            color #FBFBFB
            background:#0C8BC8;
            border-radius:10px;
            position absolute
            left 100px
            bottom 31px
        .popupActive-title-right
            position absolute
            width:87px;
            height:36px;
            line-height 36px
            font-size 24px
            color #91C1DA
            background:#76ADC8;
            border-radius:10px;
            right 100px
            bottom 31px
</style>
