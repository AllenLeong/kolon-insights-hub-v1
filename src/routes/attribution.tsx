import { createFileRoute } from "@tanstack/react-router";
import { Target } from "lucide-react";

export const Route = createFileRoute("/attribution")({
  head: () => ({ meta: [{ title: "归因分析 · Kolon" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl py-20 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Target className="h-6 w-6" />
      </div>
      <h1 className="text-2xl font-bold">归因分析</h1>
      <p className="mt-3 text-sm text-muted-foreground">待数据接入</p>
    </div>
  ),
});
