
import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductManagement from "@/components/admin/ProductManagement";
import OrderManagement from "@/components/admin/OrderManagement";
import Settings from "@/components/admin/Settings";
import CurrencyManagement from "@/components/admin/CurrencyManagement";
import PixelManagement from "@/components/admin/PixelManagement";
import CloakManagement from "@/components/admin/CloakManagement";
import CategoryManagement from "@/components/admin/CategoryManagement";
import RedirectManagement from "@/components/admin/RedirectManagement"; // Added import for RedirectManagement component
import GeminiManagement from "@/components/admin/GeminiManagement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Admin() {
  const [authorized, setAuthorized] = useState(false);
  const [activeSection, setActiveSection] = useState('products');
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_auth");
    if (token === "ok") setAuthorized(true);
  }, []);

  const handleLogin = () => {
    if (loginForm.username === "admin" && loginForm.password === "paidaxing888") {
      localStorage.setItem("admin_auth", "ok");
      setAuthorized(true);
      setLoginError("");
    } else {
      setLoginError("账号或密码错误");
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center">
        <div className="max-w-md mx-auto px-4 w-full">
          <h1 className="text-2xl font-bold mb-4">后台登录</h1>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">账号</label>
              <Input
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="admin"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">密码</label>
              <Input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            <Button className="w-full" onClick={handleLogin}>进入后台</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <AdminSidebar activeKey={activeSection} onSelect={setActiveSection} />
        <main className="flex-1">
          {activeSection === 'products' ? (
            <ProductManagement />
          ) : activeSection === 'categories' ? (
            <CategoryManagement />
          ) : activeSection === 'orders' ? (
            <OrderManagement />
          ) : activeSection === 'settings' ? (
            <Settings />
          ) : activeSection === 'currency' ? (
            <CurrencyManagement />
          ) : activeSection === 'pixel' ? (
            <PixelManagement />
          ) : activeSection === 'cloak' ? (
            <CloakManagement />
          ) : activeSection === 'redirects' ? ( // New condition for 'redirects'
            <RedirectManagement />
          ) : activeSection === 'gemini' ? (
            <GeminiManagement />
          ) : null}
        </main>
      </div>
    </div>
  );
}
