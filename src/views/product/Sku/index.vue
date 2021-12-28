<template>
  <div>
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column label="名称" prop="skuName" />
      <el-table-column label="描述" prop="skuDesc" />
      <el-table-column label="默认图片" width="150" prop="skuDefaultImg">
        <template slot-scope="{ row }">
          <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px;">
        </template>
      </el-table-column>
      <el-table-column label="重量" width="80px" prop="weight" />
      <el-table-column label="价格" width="80px" prop="price" />
      <el-table-column prop="prop" label="操作">
        <template slot-scope="{row, $index }">
          <el-button
            v-if="row.isSale==0"
            type="success"
            icon="el-icon-sort-down"
            size="mini"
            @click="sale(row)"
          />
          <el-button
            v-else
            type="success"
            icon="el-icon-sort-up"
            size="mini"
            @click="cancel(row)"
          />
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit"
          />
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="getSkuInfo(row)"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          />
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
      @current-change="getSkuList"
      @size-change="handleSizeChange"
    />

    <el-drawer
      :visible.sync="show"
      :show-close="false"
      size="50%"
    >
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag v-for="attr in skuInfo.skuAttrValueList" :key="attr.id" type="success" style="margin-right:10px">{{ attr.valueName }}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel trigger="click" height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item">
              <img :src="item.imgUrl" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>

    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 代表的分页器第几页
      page: 1,
      // 当前页数展示数据条数
      limit: 3,
      // 总共数据条数
      total: 0,
      records: [],
      skuInfo: {},
      show: false
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    async getSkuList(pages = 1) {
      this.page = pages
      // 获取分类的ID
      const { page, limit } = this
      const result = await this.$API.sku.reqSkuList(page, limit)
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
      this.getSkuList()
    },
    // 上架
    async sale(row) {
      const result = await this.$API.sku.reqSale(row.id)
      if (result.code === 200) {
        // eslint-disable-next-line require-atomic-updates
        row.isSale = 1
        this.$message({ type: 'success', message: '上架成功' })
      }
    },
    // 下架
    async cancel(row) {
      const result = await this.$API.sku.reqCancel(row.id)
      if (result.code === 200) {
        // eslint-disable-next-line require-atomic-updates
        row.isSale = 0
        this.$message({ type: 'success', message: '下架成功' })
      }
    },
    edit() {
      this.$message('正在开发中')
    },
    async getSkuInfo(sku) {
      const result = await this.$API.sku.reqSkuById(sku.id)
      console.log(result)
      if (result.code === 200) {
        this.skuInfo = result.data
        this.show = true
      }
    }
  }
}
</script>

<style scoped>
   .el-row .el-col-5{
      font-size:18px;
      text-align:right;
      font-weight: bold;
   }
   .el-col{
     margin:10px 10px;
   }
   >>>.el-carousel__button{
    width:10px;
    height:10px;
    background:red;
    border-radius:50%;
  }
   .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
</style>
