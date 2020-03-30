<template>
  <div class="superList">
    <ul>
      <li v-for="list in superLists" :key="list.name"></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "superLists",
  superListData: Array
};
</script>

<style lang="stylus" scoped>
ul,li{
    list-style none
}
</style>
