<template>
  <div>
    <el-row :gutter="30">
      <el-col :span="12">
        <el-card><Search /></el-card>
      </el-col>
      <el-col :span="12">
        <el-card><Category /></el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import Search from './Search'
import Category from './Category'
export default {
  name: '',
  components: {
    Search,
    Category
  }
}
</script>

<style>

</style>
