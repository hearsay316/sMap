<template>
  <div class="index">
    <template v-for="(item, index) of router">
      <div class="index-item" v-if="item.path !== $route.path" :key="index">
        <router-link class="index-item-title" :to="{ path: item.path }">{{
          item.meta.title
        }}</router-link>
        <img :src="item.meta.icon" :alt="item.meta.title" />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "index",
  mounted() {
    // eslint-disable-next-line no-console
    console.log(this.$route);
  },
  computed: {
    router() {
      // eslint-disable-next-line no-console
      return this.$router.options.routes;
    }
  }
};
</script>

<style lang="stylus" scoped>
.index
  display flex
  justify-content space-evenly
  flex-wrap:wrap
  .index-item
    display flex
    width 260px
    height: 251px
    flex-direction column
    margin  5px 15px 5px 15px
    background #ffffff
    box-shadow: 0 0 3px rgba(150, 150, 150, 0.5)
    .index-item-title
      text-decoration none
      color: #2c3b41;
      text-align: center;
      padding: 2px;
      overflow: hidden;
      height: 36px;
      line-height: 36px;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0;
      font-weight: normal;
    img
      width 100%
</style>
