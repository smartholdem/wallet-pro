<script>
export default {
  props: ["target"],
  methods: {
    scrollTo(event) {
      event.preventDefault();

      const elm = this.$refs.elm;
      const targetAttr = this.$props.target;
      const targetElm = document.querySelectorAll(targetAttr)[0];
      const targetHeader = document.querySelectorAll(".app-header")[0];
      const targetHeight = targetHeader.offsetHeight;
      if (targetElm) {
        const targetTop = targetElm.offsetTop - targetHeight - 24;
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      }
    },
  },
};
</script>
<template>
  <a
    class="nav-link"
    ref="elm"
    :href="target"
    @click="(event) => scrollTo(event)"
  >
    <slot />
  </a>
</template>
