<template>
  <div class="super-title">
    <div class="super-title-desc">{{ superTitleDesc }}</div>
    <div class="super-title-ico" @click="handlePopupTitleIco(value)">
      <el-switch
        v-model="value"
        :width="superPopupTitleIcoW"
        active-color="#3B7FD5"
        inactive-color="#ffffff"
      >
      </el-switch>
    </div>
  </div>
</template>

<script>
export default {
  name: "superTitle",
  props: {
    superTitleDesc: String
  },
  data() {
    return {
      superPopupTitleIcoW: 43,
      value: true
    };
  },
  methods: {
    handlePopupTitleIco(value) {
      this.$emit("handlePopupTitleIco", value);
      this.value = true;
    }
  }
};
</script>

<style lang="stylus" scoped>
.super-title
    height 56px
    font-size 23px
    font-weight 600
    color #ffffff
    display flex
    justify-content space-between
    padding 15.8px 37px 17.2px 37px
    background-color RGBA(55, 99, 150, 0.98)
    box-sizing border-box
    .super-title-ico
        margin-top: -3.2px;
</style>
