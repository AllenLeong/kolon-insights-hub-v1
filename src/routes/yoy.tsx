import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { loadYoy, loadRepurchase, type YoyRow, type RepurchaseRow } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, GripVertical } from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

type ChartType = "line" | "area" | "bar" | "barStack";
const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: "line", label: "线图" },
  { value: "area", label: "面积堆叠" },
  { value: "bar", label: "柱状" },
  { value: "barStack", label: "柱状堆叠" },
];

export const Route = createFileRoute("/yoy")({
  head: () => ({ meta: [{ title: "YOY 与复购 · Kolon" }] }),
  component: YoyPage,
});

import {
  CHANNEL_REGIONS, ALL_REGIONS, REGION_COLOR, fullName,
  type ChannelKey,
} from "@/lib/regions";

const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--foreground)",
};

import { KPIS, type KpiDef } from "@/lib/kpi-config";

function YoyPage() {
  const yoyQ = useQuery({ queryKey: ["yoy"], queryFn: loadYoy });
  const repQ = useQuery({ queryKey: ["repurchase"], queryFn: loadRepurchase });
  const [order, setOrder] = useState<string[]>(KPIS.map((k) => k.key));
  const [visible, setVisible] = useState<string[]>(KPIS.map((k) => k.key));
  const [selectedRegions, setSelectedRegions] = useState<string[]>(ALL_REGIONS);
  const [merged, setMerged] = useState(false);
  const toggleVisible = (k: string) =>
    setVisible((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  const toggleRegion = (r: string) =>
    setSelectedRegions((s) => (s.includes(r) ? s.filter((x) => x !== r) : [...s, r]));
  const dragKey = useRef<string | null>(null);

  if (yoyQ.isLoading || repQ.isLoading) return <div className="text-muted-foreground">数据加载中...</div>;
  if (yoyQ.error || repQ.error || !yoyQ.data || !repQ.data) return <div className="text-destructive">数据加载失败</div>;

  const onDragStart = (k: string) => { dragKey.current = k; };
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDrop = (target: string) => {
    const src = dragKey.current;
    if (!src || src === target) return;
    setOrder((cur) => {
      const next = cur.filter((k) => k !== src);
      const idx = next.indexOf(target);
      next.splice(idx, 0, src);
      return next;
    });
    dragKey.current = null;
  };

  const kpiMap = Object.fromEntries(KPIS.map((k) => [k.key, k]));

  return (
    <div className="mx-auto max-w-[1700px] space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Stage 01</div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">YOY 与复购</h1>
          <p className="mt-1 text-xs text-muted-foreground">拖拽卡片左侧手柄可调整顺序</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border p-0.5">
            <button
              onClick={() => setMerged(true)}
              className={`px-2.5 py-1 text-xs rounded ${merged ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >合并大区</button>
            <button
              onClick={() => setMerged(false)}
              className={`px-2.5 py-1 text-xs rounded ${!merged ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >分大区</button>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 h-8">
                <Filter className="h-3.5 w-3.5" />
                大区 ({selectedRegions.length}/{ALL_REGIONS.length})
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64">
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <button className="text-primary hover:underline" onClick={() => setSelectedRegions(ALL_REGIONS)}>全选</button>
                  <button className="text-muted-foreground hover:underline" onClick={() => setSelectedRegions([])}>清空</button>
                </div>
                {(Object.keys(CHANNEL_REGIONS) as ChannelKey[]).map((ch) => (
                  <div key={ch}>
                    <div className="mb-1 text-xs font-medium text-muted-foreground">{ch}</div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {CHANNEL_REGIONS[ch].map((r) => (
                        <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
                          <Checkbox checked={selectedRegions.includes(r)} onCheckedChange={() => toggleRegion(r)} />
                          {r}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 h-8">
                <Filter className="h-3.5 w-3.5" />
                指标 ({visible.length}/{KPIS.length})
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <button className="text-primary hover:underline" onClick={() => setVisible(KPIS.map((k) => k.key))}>全选</button>
                  <button className="text-muted-foreground hover:underline" onClick={() => setVisible([])}>清空</button>
                </div>
                {KPIS.map((k) => (
                  <label key={k.key} className="flex items-center gap-2 text-sm cursor-pointer py-0.5">
                    <Checkbox checked={visible.includes(k.key)} onCheckedChange={() => toggleVisible(k.key)} />
                    {k.title}
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-6">
        {order.filter((k) => visible.includes(k)).map((key) => (
          <div
            key={key}
            draggable
            onDragStart={() => onDragStart(key)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(key)}
          >
            <KpiCard kpi={kpiMap[key]} yoy={yoyQ.data} rep={repQ.data} selected={selectedRegions} merged={merged} />
          </div>
        ))}
      </div>
    </div>
  );
}

function KpiCard({
  kpi, yoy, rep, selected, merged,
}: {
  kpi: KpiDef;
  yoy: YoyRow[];
  rep: RepurchaseRow[];
  selected: string[];
  merged: boolean;
}) {
  const [chartType, setChartType] = useState<ChartType>("line");
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
          <CardTitle className="text-base">{kpi.title}</CardTitle>
          {kpi.desc && <span className="text-xs text-muted-foreground">{kpi.desc}</span>}
        </div>
        <div className="flex rounded-md border p-0.5">
          {CHART_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setChartType(t.value)}
              className={`px-2 py-0.5 text-[11px] rounded ${chartType === t.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >{t.label}</button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-3">
          {(["自营", "经销商", "线上"] as ChannelKey[]).map((ch) => {
            const regions = CHANNEL_REGIONS[ch].filter((r) => selected.includes(r));
            return (
              <div key={ch}>
                <div className="mb-1 text-xs font-medium text-muted-foreground">{ch}</div>
                {regions.length === 0 ? (
                  <div className="flex h-[260px] items-center justify-center text-xs text-muted-foreground border rounded-md">
                    未选择该渠道下的大区
                  </div>
                ) : merged ? (
                  <ChartView kpi={kpi} yoy={yoy} rep={rep} regions={regions} height={260} chartType={chartType} />
                ) : (
                  <div className="grid gap-2 grid-cols-2">
                    {regions.map((r) => (
                      <div key={r}>
                        <div className="mb-0.5 text-[11px] text-muted-foreground">{r}</div>
                        <ChartView kpi={kpi} yoy={yoy} rep={rep} regions={[r]} height={160} chartType={chartType} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ChartView({
  kpi, yoy, rep, regions, height, chartType,
}: {
  kpi: KpiDef;
  yoy: YoyRow[];
  rep: RepurchaseRow[];
  regions: string[];
  height: number;
  chartType: ChartType;
}) {
  let data: Array<Record<string, number | string | null>> = [];
  let xKey = "年份";

  if (kpi.source === "yoy") {
    const years = [...new Set(yoy.map((r) => r.pay_yr))].sort();
    data = years.map((y) => {
      const row: Record<string, number | string | null> = { 年份: String(y) };
      for (const r of regions) {
        const found = yoy.find((d) => d.pay_yr === y && d.consume_large_area_name === fullName(r));
        row[r] = found ? ((found as Record<string, unknown>)[kpi.key] as number) : null;
      }
      return row;
    });
  } else {
    xKey = "月份";
    const months = [...new Set(rep.map((r) => r.stat_month))].sort();
    data = months.map((m) => {
      const row: Record<string, number | string | null> = { 月份: m };
      for (const r of regions) {
        const found = rep.find((d) => d.stat_month === m && d.consume_large_area_name === fullName(r));
        row[r] = found ? ((found as Record<string, unknown>)[kpi.key] as number) : null;
      }
      return row;
    });
  }

  const tooltipFormatter = (v: unknown) =>
    v == null ? "—" : kpi.pct ? `${(Number(v) * 100).toFixed(2)}%` : (typeof v === "number" ? v.toLocaleString() : String(v));

  return (
    <ResponsiveContainer width="100%" height={height}>
      {chartType === "line" ? (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey={xKey} stroke="var(--muted-foreground)" fontSize={11} />
          <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={kpi.yFmt} width={60} />
          <Tooltip contentStyle={tooltipStyle} formatter={tooltipFormatter} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {regions.map((r) => (
            <Line key={r} type="monotone" dataKey={r} stroke={REGION_COLOR[r]} strokeWidth={2} dot={{ r: 2.5 }} connectNulls />
          ))}
        </LineChart>
      ) : chartType === "area" ? (
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey={xKey} stroke="var(--muted-foreground)" fontSize={11} />
          <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={kpi.yFmt} width={60} />
          <Tooltip contentStyle={tooltipStyle} formatter={tooltipFormatter} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {regions.map((r) => (
            <Area key={r} type="monotone" dataKey={r} stackId="1" stroke={REGION_COLOR[r]} fill={REGION_COLOR[r]} fillOpacity={0.5} />
          ))}
        </AreaChart>
      ) : (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey={xKey} stroke="var(--muted-foreground)" fontSize={11} />
          <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={kpi.yFmt} width={60} />
          <Tooltip contentStyle={tooltipStyle} formatter={tooltipFormatter} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {regions.map((r) => (
            <Bar key={r} dataKey={r} fill={REGION_COLOR[r]} stackId={chartType === "barStack" ? "1" : undefined} />
          ))}
        </BarChart>
      )}
    </ResponsiveContainer>
  );
}
