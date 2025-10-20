import React, { useEffect, useState } from "react";
import { LocalCustomRedirect as CustomRedirect } from "@/api/localEntities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, ExternalLink, Route } from "lucide-react";

export default function RedirectManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    key: "",
    label: "Amazon Pay",
    url: "",
    redirect_type: "button", // button | 301
    from_path: "", // 仅用于301重定向
    open_in_new_tab: false,
    is_active: true,
    note: "商品详情页购买区按钮（key=amazon_pay）"
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const list = await CustomRedirect.list("-updated_date");
    setItems(list);
    setLoading(false);
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      key: "",
      label: "Amazon Pay",
      url: "",
      redirect_type: "button",
      from_path: "",
      open_in_new_tab: false,
      is_active: true,
      note: ""
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // 验证逻辑根据重定向类型调整
    if (form.redirect_type === "301") {
      if (!form.from_path || !form.url) {
        alert("请填写源路径和目标URL");
        return;
      }
    } else {
      if (!form.key || !form.url) {
        alert("请填写 key 与跳转 URL");
        return;
      }
    }
    
    if (editing) {
      await CustomRedirect.update(editing.id, form);
    } else {
      await CustomRedirect.create(form);
    }
    setOpen(false);
    resetForm();
    load();
  };

  const onEdit = (item) => {
    setEditing(item);
    setForm({
      key: item.key || "",
      label: item.label || "",
      url: item.url || "",
      redirect_type: item.redirect_type || "button",
      from_path: item.from_path || "",
      open_in_new_tab: !!item.open_in_new_tab,
      is_active: item.is_active !== false,
      note: item.note || ""
    });
    setOpen(true);
  };

  const onDelete = async (id) => {
    if (!confirm("确认删除该跳转配置？")) return;
    await CustomRedirect.delete(id);
    load();
  };

  return (
    <div className="p-4 md:p-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Route className="w-5 h-5 text-gray-700" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">重定向管理</h1>
        </div>
        <Button
          onClick={() => { resetForm(); setOpen(true); }}
        >
          <Plus className="w-4 h-4 mr-2" /> 新建重定向
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>重定向配置列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>类型</TableHead>
                  <TableHead>Key/源路径</TableHead>
                  <TableHead>显示文本</TableHead>
                  <TableHead>目标URL</TableHead>
                  <TableHead>新窗口</TableHead>
                  <TableHead>启用</TableHead>
                  <TableHead>备注</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((it) => (
                  <TableRow key={it.id}>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        it.redirect_type === "301" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-green-100 text-green-800"
                      }`}>
                        {it.redirect_type === "301" ? "301重定向" : "按钮跳转"}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {it.redirect_type === "301" ? it.from_path : it.key}
                    </TableCell>
                    <TableCell>{it.label}</TableCell>
                    <TableCell className="max-w-[280px] truncate">{it.url}</TableCell>
                    <TableCell>{it.open_in_new_tab ? "是" : "否"}</TableCell>
                    <TableCell>{it.is_active !== false ? "是" : "否"}</TableCell>
                    <TableCell className="max-w-[240px] truncate">{it.note}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(it)}>
                        <Edit className="w-4 h-4 mr-1" /> 编辑
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onDelete(it.id)}>
                        <Trash2 className="w-4 h-4 mr-1" /> 删除
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500">
                      暂无数据，点击右上角"新建重定向"添加。
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "编辑重定向" : "新建重定向"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>重定向类型</Label>
                <Select value={form.redirect_type} onValueChange={(value) => setForm({ ...form, redirect_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择重定向类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="button">按钮跳转</SelectItem>
                    <SelectItem value="301">301重定向</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  {form.redirect_type === "301" 
                    ? "301重定向：用户访问源路径时自动跳转到目标URL" 
                    : "按钮跳转：用于商品详情页等按钮的跳转链接"}
                </p>
              </div>
              
              {form.redirect_type === "301" ? (
                <div className="md:col-span-2">
                  <Label>源路径</Label>
                  <Input 
                    value={form.from_path} 
                    onChange={(e) => setForm({ ...form, from_path: e.target.value.trim() })} 
                    placeholder="例如: / 或 /old-page" 
                  />
                  <p className="text-xs text-gray-500 mt-1">用户访问此路径时将被重定向</p>
                </div>
              ) : (
                <div>
                  <Label>Key</Label>
                  <Input 
                    value={form.key} 
                    onChange={(e) => setForm({ ...form, key: e.target.value.trim() })} 
                    placeholder="amazon_pay" 
                  />
                  <p className="text-xs text-gray-500 mt-1">商品详情页按钮使用 key=amazon_pay</p>
                </div>
              )}
              
              {form.redirect_type === "button" && (
                <div>
                  <Label>显示文本</Label>
                  <Input 
                    value={form.label} 
                    onChange={(e) => setForm({ ...form, label: e.target.value })} 
                    placeholder="Amazon Pay" 
                  />
                </div>
              )}
              
              <div className={form.redirect_type === "301" ? "md:col-span-2" : "md:col-span-2"}>
                <Label>目标URL</Label>
                <Input 
                  value={form.url} 
                  onChange={(e) => setForm({ ...form, url: e.target.value })} 
                  placeholder="https://... 或 /products" 
                />
              </div>
              
              <div>
                <Label className="block mb-2">新窗口打开</Label>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={form.open_in_new_tab} 
                    onCheckedChange={(v) => setForm({ ...form, open_in_new_tab: !!v })} 
                  />
                  <span className="text-sm text-gray-700">{form.open_in_new_tab ? "是" : "否"}</span>
                </div>
              </div>
              
              <div>
                <Label className="block mb-2">启用</Label>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={form.is_active} 
                    onCheckedChange={(v) => setForm({ ...form, is_active: !!v })} 
                  />
                  <span className="text-sm text-gray-700">{form.is_active ? "是" : "否"}</span>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Label>备注</Label>
                <Input 
                  value={form.note} 
                  onChange={(e) => setForm({ ...form, note: e.target.value })} 
                  placeholder="该重定向的用途说明" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>取消</Button>
              <Button type="submit">{editing ? "保存修改" : "创建"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}