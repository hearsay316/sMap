<template>
  <div
    class="superNav"
    :style="{
      backgroundImage: `url(${picUrl['nav-bg']})`
    }"
  >
    <div
      @click="handleItem(index)"
      v-for="(item, index) in baseUrl"
      :key="item.name"
    >
      <img :src="!item.Active ? item.url : item.urlActive" :alt="item.name" />
      <!--      <img v-if="!item.Active" :src="item.url" :alt="item.name" />-->
      <!--      <img v-if="item.Active" :src="item.urlActive" :alt="item.name" />-->
    </div>
    <!--    <div><img src="../assets/item-3.png" alt="" /></div>-->
    <!--    <div><img src="../assets/item-4.png" alt="" /></div>-->
    <!--    <div><img src="../assets/item-5.png" alt="" /></div>-->
  </div>
</template>

<script>
export default {
  name: "superNav",
  props: {
    picUrl: Object,
    baseUrl: Array
  },
  data() {
    return {
      baseUrls: [...this.baseUrl]
    };
  },
  methods: {
    handleItem(index) {
      this.$emit("handleClick", index);
    }
  }
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
    background rgba(24, 57, 94, 0.9)  no-repeat top 10px right
    div
        width: 237px
        display flex
        margin-left 5px
        flex-direction column-reverse
        height:144px
</style>
