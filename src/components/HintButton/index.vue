<template>
  <a :title="title" style="margin:10px">
    <el-button
      v-bind="$attrs"
      v-on="$listeners"
    />
  </a>
</template>

<script>
export default {
  name: 'HintButton',
  props: ['title'],
  mounted() {
    // console.log(this.$attrs)
    // console.log(this.$listeners)
  }
}
</script>

<style>

</style>
