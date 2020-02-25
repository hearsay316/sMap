<template>
  <div class="home">
    <HelloWorld msg="Welcomeg to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  components: {
    // HelloWorld
    HelloWorld: () =>
      import(/* webpackChunkName: "HelloWorld" */ "@/components/HelloWorld.vue")
  }
};
</script>
