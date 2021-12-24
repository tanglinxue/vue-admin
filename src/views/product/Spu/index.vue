<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect :show="scene!==0" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <div v-show="scene===0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 10px 0px"
          :disabled="!category3Id"
          @click="addSpu"
        >添加SPU</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80px" align="center" />
          <el-table-column prop="spuName" label="Spu名称" />
          <el-table-column prop="description" label="Spu描述" />
          <el-table-column prop="prop" label="操作">
            <template slot-scope="{ row }">
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              />
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              />
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
              />
              <el-popconfirm
                :title="`确定删除${row.spuName}?`"
                @onConfirm="deleteSpu(row)"
              >
                <hint-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 20px; text-align: center"
          :current-page="page"
          :total="total"
          :page-size="limit"
          :pager-count="7"
          :page-sizes="[3, 5, 10]"
          layout="prev, pager, next, jumper,->,sizes,total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        />
      </div>
      <SpuForm v-show="scene==1" ref="spu" @changeScene="changeScene" />
      <SkuForm v-show="scene==2" ref="sku" />
    </el-card>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: 'Attr',
  components: {
    SpuForm,
    SkuForm
  },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 代表的分页器第几页
      page: 1,
      // 当前页数展示数据条数
      limit: 3,
      // 总共数据条数
      total: 0,
      records: [],
      scene: 0 // 0代表展示SPU列表数据   1 添加SPU|修改SPU   2 添加SKU
    }
  },
  methods: {
    // 自定义事件的回调
    getCategoryId(cForm) {
      const { category1Id, category2Id, category3Id } = cForm
      this.category1Id = category1Id
      this.category2Id = category2Id
      this.category3Id = category3Id
      if (this.category3Id) {
        this.getSpuList()
      }
    },
    async getSpuList(pages = 1) {
      this.page = pages
      // 获取分类的ID
      const { page, limit, category3Id } = this
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code === 200) {
        // 分别是展示数据总条数与列表展示的数据
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    // 当分页器的某一个展示数据条数发生变化的回调
    handleSizeChange(limit) {
      // 修改参数
      this.limit = limit
      // 再发请求
      this.getSpuList()
    },
    addSpu() {
      this.scene = 1
      this.$refs.spu.addSpuData(this.category3Id)
    },
    updateSpu(row) {
      this.scene = 1
      this.$refs.spu.initSpuData(row)
    },
    changeScene({ scene, flag }) {
      this.scene = scene
      if (flag === '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    async deleteSpu(row) {
      const result = await this.$API.spu.reqDeleteSpu(row.id)
      console.log(result)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '删除成功' })
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      }
    },
    // 添加SKU按钮的回调
    addSku(row) {
      // 切换场景为2
      this.scene = 2
      this.$refs.sku.getData(this.category1Id, this.category2Id, row.id)
    }
  }
}
</script>

<style>

</style>
