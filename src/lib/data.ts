import Papa from "papaparse";

export type YoyRow = {
  pay_yr: number;
  consume_large_area_name: string;
  members: number;
  amt: number;
  arpu: number;
  freq: number;
  qty: number;
  auv: number;
  upt: number;
  members_ly: number | null;
  members_growth_rate: number | null;
  amt_ly: number | null;
  amt_growth_rate: number | null;
  stores: number;
  stores_traffic: number;
  member_cnt_first: number;
  member_cnt_ttl: number;
  effective_new_pct: number;
  total_amt: number;
  new_cust_amt: number;
  new_cust_amt_pct: number;
  old_cust_amt: number;
  old_cust_amt_pct: number;
  last_year_total: number | null;
  retained_cnt: number | null;
  retention_rate: number | null;
};

export type RepurchaseRow = {
  stat_month: string;
  stat_date: string;
  consume_large_area_name: string;
  repurchase_member_cnt_180d: number;
  member_cnt_180d: number;
  repurchase_rate_180d: number;
};

async function loadCsv<T>(path: string): Promise<T[]> {
  const res = await fetch(path);
  const text = await res.text();
  const { data } = Papa.parse<T>(text, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });
  return data;
}

export type MidClassRow = {
  pay_dt_quarter: string;
  consume_large_area_name: string;
  good_mid_class_merged: string;
  order_fst: number;
  order_re: number;
  order_wake: number;
  members: number;
  amt: number;
  qty: number;
  orders: number;
  tag_price_avg: number;
  tag_price_std: number;
  tag_price_min: number;
  tag_price_p10: number;
  tag_price_p25: number;
  tag_price_p50: number;
  tag_price_p75: number;
  tag_price_p90: number;
  tag_price_max: number;
  barg_price_avg: number;
  barg_price_std: number;
};

export const loadYoy = () => loadCsv<YoyRow>("/data/kpis.csv");
export const loadRepurchase = () =>
  loadCsv<RepurchaseRow>("/data/180_repurchase.csv");
export const loadMidClass = () => loadCsv<MidClassRow>("/data/prd_mid_class.csv");

export function fmtAmt(n: number) {
  if (Math.abs(n) >= 1e8) return `${(n / 1e8).toFixed(2)}亿`;
  if (Math.abs(n) >= 1e4) return `${(n / 1e4).toFixed(1)}万`;
  return n.toFixed(0);
}
export function fmtPct(n: number | null | undefined, digits = 1) {
  if (n == null || Number.isNaN(n)) return "—";
  return `${(n * 100).toFixed(digits)}%`;
}
export function fmtNum(n: number) {
  return n.toLocaleString();
}
