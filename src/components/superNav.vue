<template>
  <div class="superNav">
    <div><img src="../assets/item-1.png" alt="" /></div>
    <div><img src="../assets/item-2.png" alt="" /></div>
    <div><img src="../assets/item-3.png" alt="" /></div>
    <div><img src="../assets/item-4.png" alt="" /></div>
    <div><img src="../assets/item-5.png" alt="" /></div>
  </div>
</template>

<script>
export default {
  name: "superNav"
};
</script>

<style lang="stylus" scoped>
.superNav
    width: 332px
    height: 800px
    position absolute
    padding 15px 0
    top 0
    bottom 0
    margin auto
    right 0
    background rgba(24, 57, 94, 0.9) url("../assets/nav-bg.png") no-repeat top 10px right
    div
        width: 237px
        display flex
        margin-left 5px
        flex-direction column-reverse
        height:144px
</style>
