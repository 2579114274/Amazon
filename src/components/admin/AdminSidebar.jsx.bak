import React from "react";
import { Package, ClipboardList, Settings, DollarSign, Shield, Tag, ExternalLink, Target, Sparkles } from "lucide-react";

const NavItem = ({ icon: Icon, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
      active ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:bg-white/70"
    }`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

export default function AdminSidebar({ username = "admin@system", activeKey = "products", onSelect = () => {} }) {
  return (
    <aside className="hidden md:flex w-64 shrink-0 bg-gray-50 border-r border-gray-200">
      <div className="flex flex-col w-full h-full">
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold">
              A
            </div>
            <div className="text-sm">
              <div className="font-semibold">Admin Panel</div>
              <div className="text-gray-500">Management</div>
            </div>
          </div>
        </div>

        <div className="p-3 space-y-1">
          <div className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase">Management</div>
          <NavItem icon={Package} label="Product Management" active={activeKey === 'products'} onClick={() => onSelect('products')} />
          <NavItem icon={Tag} label="Category Management" active={activeKey === 'categories'} onClick={() => onSelect('categories')} />
          <NavItem icon={ClipboardList} label="Order Management" active={activeKey === 'orders'} onClick={() => onSelect('orders')} />
          <NavItem icon={Settings} label="Settings" active={activeKey === 'settings'} onClick={() => onSelect('settings')} />
          <NavItem icon={DollarSign} label="Currency Management" active={activeKey === 'currency'} onClick={() => onSelect('currency')} />
          <NavItem icon={Target} label="Pixel Management" active={activeKey === 'pixel'} onClick={() => onSelect('pixel')} />
          <NavItem icon={Shield} label="Cloak Management" active={activeKey === 'cloak'} onClick={() => onSelect('cloak')} />
          <NavItem icon={ExternalLink} label="Redirect Management" active={activeKey === 'redirects'} onClick={() => onSelect('redirects')} />
          <NavItem icon={Sparkles} label="Gemini API" active={activeKey === 'gemini'} onClick={() => onSelect('gemini')} />
        </div>

        <div className="mt-auto p-4 text-xs text-gray-500">
          Logged in as: <span className="font-medium">{username}</span>
        </div>
      </div>
    </aside>
  );
}