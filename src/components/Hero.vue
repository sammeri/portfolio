<script setup>
import ShapeBlur from './vue-bits/ShapeBlur.vue'
import Noise from './vue-bits/Noise.vue'
import FuzzyText from './vue-bits/FuzzyText.vue'
import DecryptedText from './vue-bits/DecryptedText.vue'
import FuzzyDecryptedText from './vue-bits/FuzzyDecryptedText.vue'
</script>

<template>
  <section class="o-hero z-10">
    <div class="o-avatar relative invert-element" aria-hidden="true">
      <ShapeBlur
        :variation="0"
        :pixel-ratio-prop="1"
        :shape-size="1.4"
        :roundness="1.4"
        :border-size="0.01"
        :circle-size="0.5"
        :circle-edge="1"
        :mainColor="'#00ff47'"
        class="shape-blur-effect z-10 flex"
      />
      <img class="relative z-0" src="../../public/vue-man-avatar.webp" alt="Avatar" />
    </div>

    <div class="o-title" role="heading" aria-level="1">
      <div class="name flex justify-center overflow-hidden">
        <FuzzyDecryptedText
          text="Илья"
          :font-size="48"
          font-family="DaysOne"
          color="#00ff47"
          :enable-hover="true"
          :base-intensity="0.01"
          :hover-intensity="0.1"
        />
      </div>
      <div class="role flex justify-center">
        <FuzzyDecryptedText
          text="Front-End Developer"
          :font-size="18"
          font-family="DaysOne"
          color="rgba(0, 255, 71, 0.6)"
          :speed="10"
          :enable-hover="true"
          :base-intensity="0.01"
          :hover-intensity="0.1"
        />
        <!-- <FuzzyText
          text="Front-End Developer"
          :font-size="18"
          font-family="DaysOne"
          font-weight="400"
          color="rgba(0, 255, 71, 0.6)"
          :enable-hover="true"
          :base-intensity="0.01"
          :hover-intensity="0.1"
        /> -->
      </div>
      <div class="role flex justify-center">
        <!-- <DecryptedText
          text="Hello World!"
          :speed="100"
          :max-iterations="20"
          :sequential="false"
          reveal-direction="start"
          :use-original-chars-only="false"
          animate-on="view"
          class-name=""
          encrypted-class-name=""
        /> -->
      </div>
    </div>

    <div class="u-center gap-4 flex-col">
      <div class="small flex">
        <span class="flex justify-center items-center">
          <FuzzyText
            text="Создаю интерфейсы"
            :font-size="13"
            font-family="Rubik-Regular"
            font-weight="400"
            color="rgba(160, 255, 150, 0.6)"
            :enable-hover="true"
            :base-intensity="0.01"
            :hover-intensity="0.1"
            class="h-3 flex -mx-12"
          />
        </span>
      </div>
      <div class="small flex">
        <div class="dot-indicator" title="status"></div>

        <span class="flex justify-center items-center">
          <FuzzyText
            text="Онлайн"
            :font-size="13"
            font-family="Rubik-Regular"
            font-weight="400"
            color="rgba(160, 255, 150, 0.6)"
            :enable-hover="true"
            :base-intensity="0.01"
            :hover-intensity="0.1"
            class="h-3 flex -mr-15 -ml-12 -mt-0.5"
          />
        </span>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.shape-blur-effect {
  position: absolute;
  height: calc(100% + 50px);
  width: calc(100% + 50px);
  opacity: 0.5;
  transition: all 0.3s ease;
  color: #f10a0a;

  &:hover {
    opacity: 1;
  }
}

.crt-wrapper {
  font-family: 'DaysOne', sans-serif;
  position: relative;
  display: inline-block;
}
.crt-text {
  font-size: 3rem;
  font-weight: 400;
  color: #03df41;
  text-shadow:
    0 0 1px #00ff47,
    0 0 1px #00ff47;
}
.fuzz {
  position: absolute;
  left: 0;
  top: 0;
  color: #00ff47;
  opacity: 0.7;
  animation: fuzzmove 140ms infinite alternate;
}
@keyframes fuzzmove {
  from {
    clip-path: inset(0 0 48% 0);
    transform: translateX(-1px);
  }
  to {
    clip-path: inset(52% 0 0 0);
    transform: translateX(1px);
  }
}
</style>
