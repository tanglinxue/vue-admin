<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="Spu名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option
            v-for="tm in tradeMarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" placeholder="描述" type="textarea" rows="4" />
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片：action图片上传的地址  list-type: 文件列表的类型 on-preview:图片预览的时候会出发  on-remove:当删除图片的时候会出发
         file-list：照片墙需要展示的数据【数组：数组里面的元素务必要有name、url属性】
         on-preview：图片预览功能
         on-remove:删除图片的时候会触发
        -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrId" :placeholder="`还有${unSelectSaleAttr.length}未选择`">
          <el-option
            v-for="unselect in unSelectSaleAttr"
            :key="unselect.id"
            :label="unselect.name"
            :value="unselect.id"
          />
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrId"
        >添加销售属性</el-button>
        <el-table style="width:100%" :data="spu.spuSaleAttrList" border>
          <el-table-column type="index" label="序号" width="80px" align="center" />
          <el-table-column prop="saleAttrName" label="属性名" />
          <el-table-column prop="spuSaleAttrValueList" label="属性值名称列表">
            <template slot-scope="{ row }">
              <el-tag
                v-for="tag in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
              >
                {{ tag.saleAttrName }}
              </el-tag>
              <!-- @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"   @click="showInput"-->
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
              />
              <el-button v-else class="button-new-tag" size="small">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作">
            <template slot-scope="{ row }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('changeScene',0)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Spu',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // spu属性初始化的时候是一个空的对象,在修改SPU的时候，会想服务器发请求，返回SPU信息（对象），在修改的时候可以利用服务器返回的这个对象收集最新的数据提交给服务器
      // 添加SPU，如果是添加SPU的时候并没有向服务器发请求，数据收集到哪里呀[SPU]，收集数据的时候有哪些字段呀，看文档
      spu: {
        // 三级分类的id
        category3Id: 0,
        // 描述
        description: '',
        // spu名称
        spuName: '',
        // 平台的id
        tmId: '',
        // 收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        // 平台属性与属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ]
      },
      tradeMarkList: [], // 存储品牌信息
      spuImageList: [], // 存储SPU图片的数据
      saleAttrList: [], // 销售属性的数据（项目全部的销售属性）
      attrId: '' // 收集未选择的销售属性的id-----
    }
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectSaleAttr() {
      // 整个平台的销售属性一共三个：尺寸、颜色、版本 ----saleAttrList
      // 当前SPU拥有的属于自己的销售属性SPU.spuSaleAttrList  ----颜色
      // 数组的过滤方法，可以从已有的数组当中过滤出用户需要的元素，并未返回一个新的数据
      // every数组的方法，会返回一个布尔值【真，假的】
      return this.saleAttrList.filter(item => this.spu.spuSaleAttrList.every(bitem => bitem.baseSaleAttrId !== item.id))
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async initSpuData(spu) {
      // 获取SPU信息的数据
      const spuResult = await this.$API.spu.reqSpu(spu.id)
      if (spuResult.code === 200) {
        this.spu = spuResult.data
      }
      // 获取品牌的信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取spu图片的数据
      const spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
      if (spuImageResult.code === 200) {
        this.spuImageList = spuImageResult.data.map(item => ({ url: item.imgUrl, name: item.imgName }))
      }
      // 获取平台全部的销售属性
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    }
  }
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
