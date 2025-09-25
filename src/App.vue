<script setup>
import Layout from './components/Layout.vue'
import Squares from './components/vue-bits/Squares.vue'
</script>

<template>
  <section class="flex w-full justify-center items-center">
    <div class="fixed z-0 top-0 left-0 w-full h-full">
      <Squares
        direction="down"
        :speed="0.1"
        :squareSize="40"
        borderColor="#22442731"
        hoverFillColor="#9bdc92"
      />
    </div>
    <Layout />
  </section>
</template>
<style scoped></style>
