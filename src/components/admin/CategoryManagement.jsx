
import React, { useEffect, useMemo, useState } from "react";
import { LocalCategory as Category } from "@/api/localEntities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Tag, Image as ImageIcon } from "lucide-react";
import { UploadFile } from "@/api/localIntegrations";

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    parent_id: "",
    is_active: true,
    sort_order: 0
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const list = await Category.list("-created_date");
    setCategories(list);
    setLoading(false);
  };

  const parentOptions = useMemo(() => {
    return categories
      .filter(c => !editing || c.id !== editing.id)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name));
  }, [categories, editing]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      slug: "",
      description: "",
      image_url: "",
      parent_id: "",
      is_active: true,
      sort_order: 0
    });
    setIsDialogOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      image_url: cat.image_url || "",
      parent_id: cat.parent_id || "",
      is_active: cat.is_active ?? true,
      sort_order: cat.sort_order ?? 0
    });
    setIsDialogOpen(true);
  };

  const onChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      name: form.name.trim(),
      slug: (form.slug || slugify(form.name)).trim()
    };
    if (!payload.name || !payload.slug) {
      alert("Please enter name (slug will be auto-generated if empty).");
      return;
    }
    if (editing) {
      await Category.update(editing.id, payload);
    } else {
      await Category.create(payload);
    }
    setIsDialogOpen(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    await Category.delete(id);
    load();
  };

  const sorted = useMemo(() => {
    return [...categories].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name));
  }, [categories]);

  return (
    <div className="p-4 md:p-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Tag className="w-6 h-6 text-indigo-600" />
            Category Management
          </h1>
          <p className="text-gray-500 mt-1">Create, edit, and organize your product categories.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-gray-500">Loading...</div>
          ) : sorted.length === 0 ? (
            <div className="py-10 text-center text-gray-500">No categories yet. Click “Add Category”.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Sort</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map(cat => (
                    <TableRow key={cat.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          {cat.image_url ? (
                            <img src={cat.image_url} alt={cat.name} className="w-8 h-8 rounded object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-gray-500" />
                            </div>
                          )}
                          <div>{cat.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{cat.slug}</TableCell>
                      <TableCell>
                        {categories.find(p => p.id === cat.parent_id)?.name || "-"}
                      </TableCell>
                      <TableCell>{cat.is_active ? "Yes" : "No"}</TableCell>
                      <TableCell>{cat.sort_order ?? 0}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(cat)}>
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(cat.id)}>
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name} onChange={e => onChange("name", e.target.value)} placeholder="e.g., Cereal" required />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={form.slug} onChange={e => onChange("slug", slugify(e.target.value))} placeholder="auto if empty" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={form.description} onChange={e => onChange("description", e.target.value)} rows={3} placeholder="Short description (optional)" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input id="image_url" value={form.image_url} onChange={e => onChange("image_url", e.target.value)} placeholder="https://..." />
              </div>
              <div className="md:col-span-2">
                <Label>Upload Image</Label>
                <div className="mt-2 flex items-start gap-4">
                  <div className="w-24 h-24 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden">
                    {form.image_url ? (
                      <img src={form.image_url} alt="Category" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      id="cat_image_upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files && e.target.files[0];
                        if (!file) return;
                        setUploading(true);
                        try {
                            const { file_url } = await UploadFile({ file });
                            setForm(prev => ({ ...prev, image_url: file_url }));
                        } catch (error) {
                            console.error("Error uploading file:", error);
                            alert("Failed to upload image. Please try again.");
                        } finally {
                            setUploading(false);
                            e.target.value = ""; // Clear the input so same file can be selected again
                        }
                      }}
                    />
                    <label htmlFor="cat_image_upload">
                      <Button type="button" variant="outline" disabled={uploading}>
                        {uploading ? "Uploading..." : "Upload Image"}
                      </Button>
                    </label>
                    <p className="text-xs text-gray-500">支持 jpg、png，点击按钮选择图片上传。</p>
                  </div>
                </div>
              </div>
              <div>
                <Label>Parent Category</Label>
                <Select value={form.parent_id || ""} onValueChange={(val) => onChange("parent_id", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>None</SelectItem>
                    {parentOptions.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input id="sort_order" type="number" value={form.sort_order} onChange={e => onChange("sort_order", parseInt(e.target.value) || 0)} />
              </div>
              <div className="flex items-center gap-2">
                <Switch id="is_active" checked={!!form.is_active} onCheckedChange={(val) => onChange("is_active", !!val)} />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editing ? "Save Changes" : "Create Category"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
