<template>
  <div class="superSearch">
    <div class="superSearch-main">
      <transition name="fade">
        <div
          class="superSearch-form"
          @mouseleave="mouseSuperSearchForm"
          v-show="showSuperSearchInput"
        >
          <input
            class="superSearch-input"
            placeholder="请输入查询的仓库名称"
            type="text"
            v-model="superSearchInput"
          />
          <ul class="ul" style="background-color: #ffffff ;padding-top: 10px">
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
            <li>6</li>
            <li>7</li>
          </ul>
        </div>
      </transition>
      <span @mouseenter="mouseSuperSearchSearch" class="superSearch-search">
        <svg
          t="1585276050237"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2293"
          width="32"
          height="32"
          fill="#d4237a"
        >
          <path
            d="M932.140361 933.699368c-32.619932 32.832779-85.518722 32.832779-118.160143 0L666.508491 785.285177c-60.631916 39.089273-132.315538 62.448284-209.680557 62.448284-215.337393 0-389.92571-175.666882-389.92571-392.398018C66.902224 238.617609 241.490541 62.936401 456.827935 62.936401c215.362976 0 389.926734 175.681208 389.926734 392.399041 0 77.862345-23.203468 149.993153-62.08194 211.024158l147.46661 148.413168C964.785875 847.630107 964.785875 900.845099 932.140361 933.699368zM456.827935 175.049828c-153.809061 0-278.522458 125.491109-278.522458 280.285614 0 154.805762 124.713396 280.284591 278.522458 280.284591 153.834644 0 278.521434-125.478829 278.521434-280.284591C735.350392 300.540937 610.662579 175.049828 456.827935 175.049828z"
            p-id="2294"
          ></path>
        </svg>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "superSearch",
  data() {
    return {
      superSearchInput: "",
      showSuperSearchInput: false
    };
  },
  methods: {
    mouseSuperSearchForm() {
      console.log("xsswdwdwdw");
      !this.superSearchInput ? (this.showSuperSearchInput = false) : void 0;
    },
    mouseSuperSearchSearch() {
      console.log("XXXXX");
      this.showSuperSearchInput = true;
    }
  }
};
</script>

<style lang="stylus" scoped>
.superSearch.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}
.superSearch.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    width:0;
    overflow hidden
}
.superSearch
    position absolute
    top 12px;
    right 12px
    .superSearch-main
        position relative
    .superSearch-form
        width:260px
    .superSearch-input
        width:100%
        box-sizing border-box
        height: 32px
        outline none
        border 1px solid #aef
        background-color transparent
        color #ffffff
        border-radius 3px
        padding 0  33px 0 8px
        box-shadow:2px 2px 5px #ffffff;
        margin-bottom 8px
    .superSearch-input:focus
        border 1px solid #ea4
        box-shadow:none;
    .superSearch-search
        position absolute
        top 1px
        right 1px
</style>
