<template>
  <el-form re="form" label-width="80px">
    <el-form-item label="Spu名称">
      {{ spu.spuName }}
    </el-form-item>
    <el-form-item label="SKU名称">
      <el-input v-model="skuInfo.skuName" placeholder="SKU名称" />
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input v-model="skuInfo.price" placeholder="价格(元)" type="number" />
    </el-form-item>
    <el-form-item label="重量(千克)">
      <el-input v-model="skuInfo.weight" placeholder="重量(千克)" />
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input v-model="skuInfo.skuDesc" placeholder="描述" type="textarea" rows="4" />
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form re="form" label-width="120px" :inline="true">
        <el-form-item v-for="attr in attrInfoList" :key="attr.id" :label="attr.attrName">
          <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
            <el-option
              v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="`${attr.id}:${attrValue.id}`"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form re="form" label-width="120px" :inline="true">
        <el-form-item v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
          <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择">
            <el-option
              v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
              :value="`${saleAttr.id}:${saleAttrValue.id}`"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table style="width:100%" :data="spuImageList" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80px" align="center" />
        <el-table-column prop="imgUrl" label="图片">
          <template slot-scope="{ row }">
            <img :src="row.imgUrl" style="width:100px;height:100px">
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称" />
        <el-table-column prop="prop" label="操作">
          <template slot-scope="{ row }">
            <el-button v-if="!row.isDefault" type="primary" @click="changeDefault(row)">设置默认</el-button>
            <el-button v-else>默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
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
      // 存储图片的信息
      spuImageList: [],
      // 存储销售是属性
      spuSaleAttrList: [],
      // 存储平台属性的数据
      attrInfoList: [],
      imageList: [],
      // 收集sku数据的字段
      skuInfo: {
        // 第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类：需要通过数据双向绑定v-model收集
        skuName: '',
        price: 0,
        weight: '',
        skuDesc: '',
        // 第三类：需要自己书写代码
        // 默认图片
        skuDefaultImg: '',
        // 收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ]

      }
    }
  },
  methods: {

    async getData(category1Id, category2Id, spu) {
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      // 获取图片的数据
      const result = await this.$API.spu.reqSpuImageLIst(spu.id)
      if (result.code === 200) {
        this.spuImageList = result.data.map(item => {
          item.isDefault = 0
          return item
        })
      }
      // 获取销售属性的数据
      const result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
      if (result1.code === 200) {
        this.spuSaleAttrList = result1.data
      }

      // 获取平台全部的销售属性
      const result2 = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
      if (result2.code === 200) {
        this.attrInfoList = result2.data
      }
    },
    handleSelectionChange(val) {
      this.imageList = val
    },
    changeDefault(row) {
      this.imageList.forEach(item => { item.isDefault = 0 })
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 取消按钮
    cancel() {
      // 取消按钮的回调，通知父亲切换场景为0
      this.$emit('changeScene', { scene: 0 })
      // 清理数据
      // Object.assign:es6中新增的方法可以合并对象
      // 组件实例this._data,可以操作data当中响应式数据
      // this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
      Object.assign(this._data, this.$options.data())
    },
    async save() {
      // 整理平台属性
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      // 整理平台属的数据
      attrInfoList.forEach(item => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          skuInfo.skuAttrValueList.push({
            attrId, valueId
          })
        }
      })
      // 整理销售属性
      spuSaleAttrList.forEach(item => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          skuInfo.skuSaleAttrValueList.push({
            saleAttrId, saleAttrValueId
          })
        }
      })

      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })

      // 发请求
      const result = await this.$API.spu.reqAddSku(skuInfo)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '添加SKU成功' })
        this.$emit('changeScene', { scene: 0 })
      }
    }
  }
}
</script>

<style>

</style>
