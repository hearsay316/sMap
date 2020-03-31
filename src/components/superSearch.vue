<template>
  <div class="superSearch">
    <div class="superSearch-main" ref="superSearchMain">
      <transition name="slide-fade">
        <div
          class="superSearch-form"
          @mouseleave="mouseSuperSearchForm"
          @mouseenter="mouseSuperSearchSearch"
          v-show="showSuperSearchInput"
        >
          <input
            autocomplete="off"
            ref="superSearchInput"
            :id="['superSearch-form-input']"
            class="superSearch-form-input"
            placeholder="请输入查询的仓库名称"
            type="text"
            @input="searchValue"
            v-model="superSearchInput"
          />
          <ul class="superSearch-form-list">
            <li
              class="superSearch-form-item"
              v-for="item in searchData"
              :key="item.name"
              @click="superSearchFormListItem(item)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
      </transition>
      <span @mouseenter="mouseSuperSearchSearch" class="superSearch-search">
        <svg
          :class="{ 'superSearch-search-icon-bg': showSuperSearchInput }"
          t="1585276050237"
          class="icon superSearch-search-icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2293"
          width="32"
          height="32"
          fill="#FFFFFF"
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
  props: {
    searchData: Array,
    showSuperSearchInput: Boolean
  },
  data() {
    return {
      superSearchInput: "",
      superSearchInputTime: undefined,
      mouseSuperSearchFormTime: undefined,
      "superSearch-form-input": "superSearch-form-input"
    };
  },
  deactivated() {
    this.superSearchInputTime && clearTimeout(this.superSearchInputTime);
  },
  methods: {
    superSearchFormListItem(item) {
      this.$emit("searchItem", item);
    },
    searchValue() {
      this.$emit("searchValue", this.superSearchInput);
    },
    mouseSuperSearchForm() {
      //延迟操作
      this.mouseSuperSearchFormTime &&
        clearTimeout(this.mouseSuperSearchFormTime);
      this.mouseSuperSearchFormTime = setTimeout(() => {
        document.activeElement.id === this["superSearch-form-input"]
          ? void 0
          : this.$emit("modShowSuperSearchInput", false);
      }, 100);
      this.mouseSuperSearchFormTime = undefined;
    },
    mouseSuperSearchSearch() {
      if (
        document.activeElement.id === this["superSearch-form-input"] ||
        this.mouseSuperSearchFormTime
      ) {
        clearTimeout(this.mouseSuperSearchFormTime);
      } else {
        this.$emit("modShowSuperSearchInput", true);
      }
    },
    documentAddEventListener() {
      document.addEventListener("click", event => {
        this.$nextTick(() => {
          let isFalse =
            (this.$refs?.superSearchMain?.contains &&
              this.$refs.superSearchMain.contains(event.target)) ||
            event.target === this.$refs.superSearchMain;
          if (!isFalse && this.superSearchInput === "") {
            this.$nextTick(() => {
              this.$refs.superSearchInput?.blur();
              this.mouseSuperSearchForm();
            });
          }
        });
      });
    }
  },
  mounted() {
    this.documentAddEventListener();
  }
};
</script>

<style lang="stylus" scoped>
  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(200px);
    opacity: 0;
  }
.superSearch
    position absolute
    top 48px;
    right 24px
    font-size 14px
    .superSearch-main
        position relative
    .superSearch-form
        width:260px
    .superSearch-form-input
        width: 100%
        box-sizing border-box
        height: 34px
        outline none
        border 1px solid #34eff9
        background-color #042351
        color #ffffff
        border-radius 3px
        padding 0  33px 0 15px
        box-shadow:2px 2px 5px #ffffff;
        margin-bottom 8px
    .superSearch-form-input:focus
        border 1px solid #aef
        box-shadow:none;
    .superSearch-search
        display inline-block
        position absolute
        height 32px
        overflow hidden
        top 1px
        right 1px
.superSearch-search-icon-bg{
  background-color #1bc5a3
}
.superSearch-form-list
  box-sizing border-box
  text-align left
  background-color #042351
  color #ffffff
  .superSearch-form-item
    padding 8px 15px
  .superSearch-form-item:hover{
    background-color #1bc5a3
  }
</style>
