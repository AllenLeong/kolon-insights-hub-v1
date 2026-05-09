// KPI 配置：数据列名 → 中文指标名 + 格式化
// 修改这里即可同步更新 YOY 页面所有指标

export type KpiSource = "yoy" | "rep";

export type KpiDef = {
  /** 数据列名（CSV 字段） */
  key: string;
  /** 中文显示名 */
  title: string;
  /** 副标题/单位说明 */
  desc?: string;
  /** 数据来源 */
  source: KpiSource;
  /** Y 轴格式化 */
  yFmt: (v: number) => string;
  /** 是否百分比（影响 tooltip 格式） */
  pct?: boolean;
};

const fmtAmtAxis = (v: number) =>
  v >= 1e8 ? `${(v / 1e8).toFixed(1)}亿` : v >= 1e4 ? `${(v / 1e4).toFixed(0)}万` : `${v}`;
const fmtPctAxis = (v: number) => `${(v * 100).toFixed(0)}%`;
const fmtNumAxis = (v: number) => v.toLocaleString();
const fmtMoney = (v: number) => `¥${Math.round(v).toLocaleString()}`;

export const KPIS: KpiDef[] = [
  { key: "amt", title: "销售额", desc: "元", source: "yoy", yFmt: fmtAmtAxis },
  { key: "total_amt", title: "总销售额", desc: "元", source: "yoy", yFmt: fmtAmtAxis },
  { key: "new_cust_amt", title: "新客销售额", desc: "元", source: "yoy", yFmt: fmtAmtAxis },
  { key: "old_cust_amt", title: "老客销售额", desc: "元", source: "yoy", yFmt: fmtAmtAxis },
  { key: "new_cust_amt_pct", title: "新客销售占比", source: "yoy", yFmt: fmtPctAxis, pct: true },
  { key: "old_cust_amt_pct", title: "老客销售占比", source: "yoy", yFmt: fmtPctAxis, pct: true },
  { key: "amt_growth_rate", title: "销售额同比增长率", source: "yoy", yFmt: fmtPctAxis, pct: true },

  { key: "members", title: "购买会员数", source: "yoy", yFmt: fmtNumAxis },
  { key: "member_cnt_ttl", title: "总会员数", source: "yoy", yFmt: fmtNumAxis },
  { key: "member_cnt_first", title: "首购会员数", source: "yoy", yFmt: fmtNumAxis },
  { key: "effective_new_pct", title: "有效新客占比", source: "yoy", yFmt: fmtPctAxis, pct: true },
  { key: "retained_cnt", title: "留存会员数", source: "yoy", yFmt: fmtNumAxis },
  { key: "retention_rate", title: "老客留存率", source: "yoy", yFmt: fmtPctAxis, pct: true },
  { key: "members_growth_rate", title: "会员数同比增长率", source: "yoy", yFmt: fmtPctAxis, pct: true },

  { key: "arpu", title: "客单价 ARPU", desc: "元/人", source: "yoy", yFmt: fmtMoney },
  { key: "auv", title: "件单价 AUV", desc: "元/件", source: "yoy", yFmt: fmtMoney },
  { key: "upt", title: "连带率 UPT", source: "yoy", yFmt: (v) => v.toFixed(2) },
  { key: "freq", title: "购买频次", source: "yoy", yFmt: (v) => v.toFixed(2) },
  { key: "qty", title: "销售件数", source: "yoy", yFmt: fmtNumAxis },

  { key: "stores", title: "门店数", source: "yoy", yFmt: fmtNumAxis },
  { key: "stores_traffic", title: "单店日均流量", source: "yoy", yFmt: fmtNumAxis },

  { key: "repurchase_rate_180d", title: "180天复购率", desc: "按月", source: "rep", yFmt: fmtPctAxis, pct: true },
  { key: "repurchase_member_cnt_180d", title: "180天复购人数", desc: "按月", source: "rep", yFmt: fmtNumAxis },
  { key: "member_cnt_180d", title: "180天消费人数", desc: "按月", source: "rep", yFmt: fmtNumAxis },
];
