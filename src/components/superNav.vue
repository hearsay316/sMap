<template>
  <div
    class="superNav"
    :style="{
      backgroundImage: picUrlNavBg
    }"
  >
    <div
      @click="handleItem(index)"
      v-for="(item, index) in baseUrl"
      :key="item.name"
    >
      <!--suppress HtmlUnknownTarget -->
      <img :src="!item.Active ? item.url : item.urlActive" :alt="item.name" />
    </div>
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
  },
  computed: {
    picUrlNavBg() {
      return `url(${this.picUrl["nav-bg"]})`;
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
