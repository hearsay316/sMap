<template>
  <div class="about">
    <terrainAndImagery></terrainAndImagery>
  </div>
</template>
<script>
export default {
  name: "about",
  components: {
    terrainAndImagery: () => import("../components/terrainAndImagery")
  }
};
</script>
