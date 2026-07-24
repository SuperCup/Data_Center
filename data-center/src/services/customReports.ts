/** 专属定制报表（数据看板「专属定制」模块挂载的链接），供定制页与 AI @ 引用共用 */

export interface CustomReportItem {
  id: string;
  name: string;
  description: string;
  url: string;
  createTime: string;
  validTime: string;
  category: string;
}

const reportUrls = [
  'https://quickbi.ismartgo.cn/token3rd/dashboard/view/pc.htm?pageId=2b2a4ccf-582e-4072-a98e-f6411df63f68&accessTicket=76ff1515-8996-4659-b057-460e87cdf378&dd_orientation=auto',
  'https://quickbi.ismartgo.cn/token3rd/dashboard/view/pc.htm?pageId=03189d09-d197-443f-8294-7408abeffff5&accessTicket=c0eb7673-cc3e-4187-a374-2bc7a2894e75&dd_orientation=auto',
  'https://quickbi.ismartgo.cn/token3rd/dashboard/view/pc.htm?pageId=e26f92d1-2c6d-4f97-920a-a2027bb79b8e&accessTicket=75df7a5b-1bdb-409e-ab26-b06d606c2d8f&dd_orientation=auto',
  'https://quickbi.ismartgo.cn/token3rd/dashboard/view/pc.htm?pageId=f16ff422-d0c6-4578-a698-7e7cf431128c&accessTicket=58eb5fd8-7a51-4882-af2c-1c32b8795410&dd_orientation=auto',
  'https://quickbi.ismartgo.cn/token3rd/dashboard/view/pc.htm?pageId=246be602-44ff-46b1-9857-afde762b264d&accessTicket=1d7a294f-386d-4ecc-b98a-c69019f3b91b&dd_orientation=auto',
];

const pickUrl = (index: number) => reportUrls[index % reportUrls.length];

/** 已挂载的定制报表链接（与专属定制页同源） */
export const MOUNTED_CUSTOM_REPORTS: CustomReportItem[] = [
  {
    id: '1',
    name: '到店营销销售数据分析看板',
    description: '全面展示到店营销活动的销售数据、核销情况、渠道分布等关键指标',
    url: pickUrl(0),
    createTime: '2025-12-01',
    validTime: '2025-12-01 至 2026-12-01',
    category: '到店营销',
  },
  {
    id: '2',
    name: '即时零售平台运营报表',
    description: '美团闪购、饿了么等即时零售平台的订单分析、GMV趋势、ROI分析',
    url: pickUrl(1),
    createTime: '2025-11-28',
    validTime: '2025-11-28 至 2026-11-28',
    category: '即时零售',
  },
  {
    id: '3',
    name: '物码营销用户行为分析',
    description: '扫码用户行为轨迹、转化漏斗、地域分布等深度分析',
    url: pickUrl(2),
    createTime: '2025-11-25',
    validTime: '2025-11-25 至 2026-11-25',
    category: '物码营销',
  },
  {
    id: '4',
    name: '全渠道营销效果对比看板',
    description: '对比分析不同渠道的营销效果，包括微信、支付宝、抖音等平台数据',
    url: pickUrl(3),
    createTime: '2025-11-20',
    validTime: '2025-11-20 至 2026-11-20',
    category: '到店营销',
  },
  {
    id: '5',
    name: '门店核销明细报表',
    description: '详细展示各门店的核销数据、排名、趋势分析',
    url: pickUrl(4),
    createTime: '2025-11-15',
    validTime: '2025-11-15 至 2026-11-15',
    category: '到店营销',
  },
  {
    id: '6',
    name: '即时零售商品销售排行',
    description: '实时展示即时零售平台商品销售排行、库存预警、价格监控',
    url: pickUrl(0),
    createTime: '2025-11-10',
    validTime: '2025-11-10 至 2026-11-10',
    category: '即时零售',
  },
];
