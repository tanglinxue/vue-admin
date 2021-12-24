// sku模块
import request from '@/utils/request'
// 获取图片的数据
// /admin/product/spuImageList/{spuId}  get
export const reqSpuImageLIst = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取销售属性的数据
// /admin/product/spuSaleAttrList/{spuId}  get
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })

// 获取平台属性的数据
// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

