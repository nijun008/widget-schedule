<template>
  <div>
    <Canendar />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import Canendar from '../../components/Calendar/index.vue'

export default defineComponent({
  components: {
    Canendar
  }
})
</script>
