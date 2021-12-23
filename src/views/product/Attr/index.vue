<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect :show="!isShowTable" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 10px 0px"
          :disabled="!category3Id"
          @click="addAttr"
        >添加属性</el-button>
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80px" align="center" />
          <el-table-column prop="attrName" label="属性名称" width="150" />
          <el-table-column prop="logoUrl" label="属性值列表">
            <template slot-scope="{ row }">
              <el-tag v-for="item in row.attrValueList" :key="item.id" :value="item.id" type="success" style="margin:0 20px">{{ item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              />
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form ref="form" :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table style="width:100%;margin:20px 0" border :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80px" align="center" />
          <el-table-column label="属性值名称">
            <template slot-scope="{row,$index}">
              <el-input v-if="row.flag" :ref="$index" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" @blur="toLook(row)" @keyup.native.enter="toLook(row)" />
              <span v-else @click="toEdit(row,$index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row,$index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                />
                <el-popconfirm
                  title="这是一段内容确定删除吗？"
                >
                  <el-button slot="reference">删除</el-button>
                </el-popconfirm>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrInfo.attrValueList.length<1" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],
      isShowTable: true,
      // 收集新增属性|修改属性使用的
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [
          // 属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName

        ],
        categoryId: 0, // 三级分类的id
        categoryLevel: 3 // 因为服务器也需要区分几级id
      }
    }
  },
  methods: {
    // 自定义事件的回调
    getCategoryId(cForm) {
      console.log(cForm)
      const { category1Id, category2Id, category3Id } = cForm
      this.category1Id = category1Id
      this.category2Id = category2Id
      this.category3Id = category3Id
      if (this.category3Id) {
        this.getAttrList()
      }
    },
    // 获取平台属性的数据
    // 当用户确定三级分类的数据时候，可以向服务器发请求获取平台属性进行展示
    async getAttrList() {
      // 获取分类的ID
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      if (result.code === 200) {
        // 分别是展示数据总条数与列表展示的数据
        this.attrList = result.data
      }
    },
    addAttrValue() {
      // 向属性值的数组里面添加元素
      // attrId：是你相应的属性的id，目前而言我们是添加属性的操作，还没有相应的属性的id，目前而言带给服务器的id为undefined
      // valueName:相应的属性值的名称
      this.attrInfo.attrValueList.push(
        {
          valueName: '',
          attrId: this.attrInfo.id, // 对于修改某一个属性的时候，可以在已有的属性值基础之上新增新的属性值（新增属性值的时候，需要把已有的属性的id带上）
          flag: true
        }
      )
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    updateAttr(row) {
      // isShowTable变为false
      this.isShowTable = false
      // 将选中的属性赋值给attrInfo
      // 由于数据结构当中存在对象里面套数组，数组里面有套对象，因此需要使用深拷贝解决这类问题
      // 深拷贝，浅拷贝在面试的时候出现频率很高，切记达到手写深拷贝与浅拷贝
      this.attrInfo = cloneDeep(row)
      this.attrInfo.attrValueList.forEach(item => {
        // 这样书写也可以给属性值添加flag自动，但是会发现视图不会跟着变化（因为flag不是响应式数据）
        // 因为Vue无法探测普通的新增 property,这样书写的属性并非响应式属性（数据变化视图跟这边）
        // 第一个参数:对象  第二个参数:添加新的响应式属性  第三参数：新的属性的属性值
        this.$set(item, 'flag', false)
      })
    },
    // 添加属性按钮的回调
    addAttr() {
      // 切换table显示与隐藏
      this.isShowTable = false
      // 清除数据
      // 收集三级分类的id
      this.attrInfo = {
        attrName: '', // 属性名
        attrValueList: [
          // 属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        ],
        categoryId: this.category3Id, // 三级分类的id
        categoryLevel: 3 // 因为服务器也需要区分几级id
      }
    },
    // 失却焦点的事件---切换为查看模式，展示span
    toLook(row) {
      if (!row.valueName.trim()) {
        return this.$message('请你输入一个正常的属性值')
      }
      const isRepeat = this.attrInfo.attrValueList.some(item => {
        // 需要将row从数组里面判断的时候去除
        // row最新新增的属性值【数组的最后一项元素】
        // 判断的时候，需要把已有的数组当中新增的这个属性值去除
        if (row !== item) {
          return row.valueName === item.valueName
        }
      })
      if (isRepeat) return
      // 新增的属性值不能与已有的属性值重复
      row.flag = false
    },
    toEdit(row, index) {
      row.flag = true
      // 获取input节点，实现自动聚焦
      // 需要注意：点击span的时候，切换为input变为编辑模式，但是需要注意，对于浏览器而言，页面重绘与重拍耗时间的
      // 点击span的时候，重绘重拍一个input它是需要耗费事件，因此我们不可能一点击span立马获取到input
      // $nextTick,当节点渲染完毕了，会执行一次
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    async addOrUpdateAttr() {
      // 整理参数:1,如果用户添加很多属性值，且属性值为空的不应该提交给服务器
      // 提交给服务器数据当中不应该出现flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        if (item.valueName !== '') {
          delete item.flag
          return true
        }
      })
      const res = new Map()
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item) => !res.has(item.valueName) && res.set(item.valueName, 1))
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        this.isShowTable = true
        this.$message({ type: 'success', message: '保存成功' })
        this.getAttrList()
      } catch (err) {
        this.$message('保存失败')
      }
    }
  }
}
</script>

<style>

</style>
