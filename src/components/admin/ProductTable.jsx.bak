import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="w-10 px-3 py-3 text-left">
              <Checkbox />
            </th>
            <th className="px-3 py-3 text-left">Product Info</th>
            <th className="px-3 py-3 text-left">Price</th>
            <th className="px-3 py-3 text-left">Stock</th>
            <th className="px-3 py-3 text-left">Status</th>
            <th className="px-3 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const isActive = (p.stock ?? 0) > 0;
            return (
              <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                <td className="px-3 py-3">
                  <Checkbox />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image_url || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200"}
                      alt={p.name}
                      className="h-10 w-10 rounded object-contain bg-white ring-1 ring-gray-200"
                    />
                    <div>
                      <div className="font-medium text-gray-900 line-clamp-1">{p.name}</div>
                      <div className="text-xs text-gray-500">default_vendor · {(p.tags || []).length || 0} tags</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">${p.price}</span>
                    {p.original_price ? (
                      <span className="text-gray-400 line-through">${p.original_price}</span>
                    ) : null}
                  </div>
                </td>
                <td className="px-3 py-3">{p.stock ?? 0}</td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={isActive ? "bg-emerald-600" : "bg-gray-500"}>{isActive ? "Active" : "Inactive"}</Badge>
                    {p.is_featured ? <Badge className="bg-indigo-600">Featured</Badge> : null}
                    {p.is_bestseller ? <Badge className="bg-amber-600">Choice</Badge> : null}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <Link to={createPageUrl(`ProductDetail?id=${p.id}`)} target="_blank" rel="noreferrer">
                      <Button variant="ghost" size="icon" className="text-gray-600"><Eye className="w-4 h-4" /></Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="text-gray-600" onClick={() => onEdit(p)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => onDelete(p.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
          {products.length === 0 && (
            <tr>
              <td className="px-3 py-8 text-center text-gray-500" colSpan={6}>
                暂无产品，点击右上角 “Add New Product” 新建。
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}