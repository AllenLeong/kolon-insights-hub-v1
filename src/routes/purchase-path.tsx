import { createFileRoute } from "@tanstack/react-router";
import { Route as RouteIcon } from "lucide-react";

export const Route = createFileRoute("/purchase-path")({
  head: () => ({ meta: [{ title: "购买路径 · Kolon" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl py-20 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <RouteIcon className="h-6 w-6" />
      </div>
      <h1 className="text-2xl font-bold">购买路径</h1>
      <p className="mt-3 text-sm text-muted-foreground">待数据接入</p>
    </div>
  ),
});
