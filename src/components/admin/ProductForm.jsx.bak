import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Save } from "lucide-react";

export default function ProductForm({ value, onChange, onSubmit, submitting }) {
  const form = value;
  const set = (k, v) => onChange({ ...form, [k]: v });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-1 block">名称</Label>
          <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="产品名称" />
        </div>
        <div>
          <Label className="mb-1 block">价格</Label>
          <Input type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="例如 39.99" />
        </div>
        <div>
          <Label className="mb-1 block">原价</Label>
          <Input type="number" value={form.original_price} onChange={e => set("original_price", e.target.value)} placeholder="可选" />
        </div>
        <div>
          <Label className="mb-1 block">分类</Label>
          <Select value={form.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger><SelectValue placeholder="选择分类" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="electronics">electronics</SelectItem>
              <SelectItem value="fashion">fashion</SelectItem>
              <SelectItem value="home">home</SelectItem>
              <SelectItem value="beauty">beauty</SelectItem>
              <SelectItem value="sports">sports</SelectItem>
              <SelectItem value="books">books</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label className="mb-1 block">主图 URL</Label>
          <Input value={form.image_url} onChange={e => set("image_url", e.target.value)} placeholder="https://..." />
        </div>
        <div className="md:col-span-2">
          <Label className="mb-1 block">描述</Label>
          <Textarea value={form.description} onChange={e => set("description", e.target.value)} rows={4} placeholder="产品描述" />
        </div>
        <div>
          <Label className="mb-1 block">库存</Label>
          <Input type="number" value={form.stock} onChange={e => set("stock", e.target.value)} />
        </div>
        <div>
          <Label className="mb-1 block">评分(0-5)</Label>
          <Input type="number" value={form.rating} onChange={e => set("rating", e.target.value)} />
        </div>
        <div>
          <Label className="mb-1 block">评论数</Label>
          <Input type="number" value={form.reviews_count} onChange={e => set("reviews_count", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Label className="mb-1 block">标签（英文逗号分隔）</Label>
          <Input value={form.tags} onChange={e => set("tags", e.target.value)} placeholder="例如: cereal, granola, treats" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2">
          <Checkbox checked={!!form.is_featured} onCheckedChange={(v) => set("is_featured", !!v)} />
          推荐商品 is_featured
        </label>
        <label className="flex items-center gap-2">
          <Checkbox checked={!!form.is_bestseller} onCheckedChange={(v) => set("is_bestseller", !!v)} />
          畅销商品 is_bestseller
        </label>
      </div>

      <Button onClick={onSubmit} disabled={submitting} className="mt-2">
        <Save className="w-4 h-4 mr-2" />
        {submitting ? "保存中..." : "保存"}
      </Button>
    </div>
  );
}