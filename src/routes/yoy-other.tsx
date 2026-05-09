import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X, GripVertical } from "lucide-react";

export const Route = createFileRoute("/yoy-other")({
  head: () => ({ meta: [{ title: "YOY · 其他分析 · Kolon" }] }),
  component: YoyOtherPage,
});

const reports = import.meta.glob("../reports/yoy/*.html", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const items = Object.entries(reports).map(([path, html]) => {
  const name = path.split("/").pop()!.replace(/\.html$/, "");
  return { id: path, name, html };
});

function YoyOtherPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const dragId = useRef<string | null>(null);
  const toggle = (id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };
  const onDrop = (target: string) => {
    const src = dragId.current;
    if (!src || src === target) return;
    setSelected((cur) => {
      const next = cur.filter((x) => x !== src);
      const idx = next.indexOf(target);
      next.splice(idx, 0, src);
      return next;
    });
    dragId.current = null;
  };

  return (
    <div className="mx-auto max-w-[1700px] space-y-6">
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Stage 01 · 其他</div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">其他分析</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          HTML 放入 <code className="bg-muted px-1 rounded">src/reports/yoy/</code>；卡片可拖拽排序，右下角拖动可缩放
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">可选分析（{items.length}）</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-sm text-muted-foreground">暂无 HTML 文件</div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {items.map((it) => (
                <label key={it.id} className="flex items-center gap-2 text-sm cursor-pointer rounded-md border px-3 py-1.5 hover:bg-muted/50">
                  <Checkbox checked={selected.includes(it.id)} onCheckedChange={() => toggle(it.id)} />
                  {it.name}
                </label>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4 items-start">
        {selected.map((id) => {
          const item = items.find((i) => i.id === id);
          if (!item) return null;
          return (
            <div
              key={id}
              draggable
              onDragStart={() => { dragId.current = id; }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(id)}
              className="resize overflow-hidden rounded-xl border bg-card shadow"
              style={{ width: 720, height: 540, minWidth: 320, minHeight: 240 }}
            >
              <div className="flex items-center justify-between border-b px-3 py-2 bg-muted/30">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toggle(id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <iframe
                srcDoc={item.html}
                title={item.name}
                sandbox="allow-scripts"
                className="w-full border-0 bg-white pointer-events-auto"
                style={{ height: "calc(100% - 41px)" }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
