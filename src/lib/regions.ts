// 渠道 / 大区 公共配置 — 渠道分组顺序：自营 → 经销商 → 线上

export type ChannelKey = "自营" | "经销商" | "线上";

export const CHANNEL_REGIONS: Record<ChannelKey, string[]> = {
  自营: ["东北", "华北", "华东", "华西", "华南"],
  经销商: ["西北", "安徽", "山西", "新疆", "青海"],
  线上: ["电商"],
};

export const CHANNEL_PALETTE: Record<ChannelKey, string[]> = {
  自营: ["#15803d", "#16a34a", "#22c55e", "#65a30d", "#84cc16"],
  经销商: ["#c2410c", "#ea580c", "#f97316", "#d97706", "#f59e0b"],
  线上: ["#2563eb"],
};

export const CHANNEL_ORDER: ChannelKey[] = ["自营", "经销商", "线上"];

export const ALL_REGIONS: string[] = CHANNEL_ORDER.flatMap((ch) => CHANNEL_REGIONS[ch]);

export const REGION_COLOR: Record<string, string> = {};
CHANNEL_ORDER.forEach((ch) => {
  CHANNEL_REGIONS[ch].forEach((r, i) => {
    REGION_COLOR[r] = CHANNEL_PALETTE[ch][i % CHANNEL_PALETTE[ch].length];
  });
});

export const REGION_CHANNEL: Record<string, ChannelKey> = {};
CHANNEL_ORDER.forEach((ch) => {
  CHANNEL_REGIONS[ch].forEach((r) => {
    REGION_CHANNEL[r] = ch;
  });
});

export const fullName = (s: string) => `可隆-${s}`;
export const shortName = (s: string) => s.replace(/^可隆-/, "");

/** 按渠道顺序排序的大区列表 */
export const sortRegions = (rs: string[]): string[] =>
  [...rs].sort((a, b) => ALL_REGIONS.indexOf(a) - ALL_REGIONS.indexOf(b));
