import { createFileRoute } from "@tanstack/react-router";
import { Shuffle } from "lucide-react";

export const Route = createFileRoute("/product-flow")({
  head: () => ({ meta: [{ title: "商品流转 · Kolon" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl py-20 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Shuffle className="h-6 w-6" />
      </div>
      <h1 className="text-2xl font-bold">商品流转</h1>
      <p className="mt-3 text-sm text-muted-foreground">待数据接入</p>
    </div>
  ),
});
