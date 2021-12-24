<template>
  <el-form re="form" label-width="80px">
    <el-form-item label="Spu名称">
      海绵宝宝
    </el-form-item>
    <el-form-item label="SKU名称">
      <el-input v-model="spu.spuName" placeholder="SKU名称" />
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input v-model="spu.spuName" placeholder="价格(元)" />
    </el-form-item>
    <el-form-item label="重量(千克)">
      <el-input v-model="spu.spuName" placeholder="重量(千克)" />
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input v-model="spu.description" placeholder="描述" type="textarea" rows="4" />
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form re="form" label-width="80px" :inline="true">
        <el-form-item label="规格描述">
          <el-select v-model="spu.tmId" placeholder="请选择品牌">
            <el-option
              v-for="tm in tradeMarkList"
              :key="tm.id"
              :label="tm.tmName"
              :value="tm.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规格描述">
          <el-select v-model="spu.tmId" placeholder="请选择品牌">
            <el-option
              v-for="tm in tradeMarkList"
              :key="tm.id"
              :label="tm.tmName"
              :value="tm.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form re="form" label-width="80px" :inline="true">
        <el-form-item label="屏幕尺寸">
          <el-select v-model="spu.tmId" placeholder="请选择品牌">
            <el-option
              v-for="tm in tradeMarkList"
              :key="tm.id"
              :label="tm.tmName"
              :value="tm.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table style="width:100%" :data="spu.spuSaleAttrList" border>
        <el-table-column type="selection" width="80px" align="center" />
        <el-table-column prop="saleAttrName" label="属性名" />
        <el-table-column prop="spuSaleAttrValueList" label="属性值名称列表">
          <template slot-scope="{ row }">
            <el-tag
              v-for="(tag,index) in row.spuSaleAttrValueList"
              :key="tag.id"
              closable
              :disable-transitions="false"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ tag.saleAttrValueName }}
            </el-tag>
            <!-- @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"   @click="showInput"-->
            <el-input
              v-if="row.inputVisible"
              ref="saveTagInput"
              v-model="row.inputValue"
              class="input-new-tag"
              size="small"
              @blur="handleInputConfirm(row)"
            />
            <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">+ New Tag</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作">
          <template slot-scope="{ $index }">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="spu.spuSaleAttrList.splice($index,1)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      spu: {},
      tradeMarkList: [],
      spuImageList: []
    }
  },
  method: {
    cancel() {

    },
    async getData(category1Id, category2Id, spuId) {
      // 获取图片的数据
      const result = await this.$API.sku.reqTradeMarkList(spuId)
      if (result.code === 200) {
        this.spuImageList = result.data
      }
      // 获取销售属性的数据
      const result1 = await this.$API.spu.reqSpuSaleAttrList(spuId)
      if (result1.code === 200) {
        this.spuAttrValueList = result1.data
      }

      // 获取平台全部的销售属性
      const saleResult = await this.$API.spu.reqAttrInfoList()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    }
  }
}
</script>

<style>

</style>
