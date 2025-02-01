<template>
  <span>{{
    isMobile
      ? this.address.slice(0, 5) + ".." + this.address.slice(-5)
      : this.address
  }}</span>
</template>

<script>
export default {
  name: "componentAddress",
  props: {
    address: String,
  },
  computed: {
    isMobile() {
      return window.innerWidth < 768;
    },
  }

};
</script>

<style scoped>

</style>
