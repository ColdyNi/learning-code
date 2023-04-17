<template>
  <div>
    <EditorMarkdown v-model="markdownContent"></EditorMarkdown>

    {{ markdownContent }}
  </div>
</template>

<script setup>
import {ref} from "vue"
const markdownContent=ref("# test")
</script>

<style lang="scss">

</style>