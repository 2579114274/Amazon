
import React, { useState, useEffect } from 'react';
import { Save, ExternalLink, Settings as SettingsIcon, Globe, Eye, EyeOff, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocalSiteSettings as SiteSettings } from '@/api/localEntities';
import { LocalAdminCredentials as AdminCredentials } from '@/api/localEntities';

export default function Settings() {
  const [settings, setSettings] = useState({
    payment_page_url: '',
    add_to_cart_url: '',
    buy_now_url: '',
    site_name: '优选商城',
    site_title: '',
    site_description: '',
    site_favicon: '',
    logo_url: '',
    contact_email: '',
    shipping_fee: 0,
    free_shipping_threshold: 99,
    currency: 'CNY'
  });

  const [adminCredentials, setAdminCredentials] = useState({
    username: 'admin',
    password: 'paidaxing888'
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState({ type: null, text: '' });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const s = await SiteSettings.list();
      if (s.length > 0) {
        setSettings(prev => ({ ...prev, ...s[0] }));
      }
    } catch (e) {
      setNotice({ type: 'error', text: '加载站点设置失败' });
    }
    try {
      const creds = await AdminCredentials.list();
      if (creds.length > 0) {
        setAdminCredentials({ username: creds[0].username || 'admin', password: creds[0].password || 'paidaxing888' });
      } else {
        const def = { username: 'admin', password: 'paidaxing888', is_active: true };
        await AdminCredentials.create(def);
        setAdminCredentials({ username: def.username, password: def.password });
      }
    } catch (e) {
      setNotice({ type: 'error', text: '加载后台口令失败' });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setNotice({ type: null, text: '' });
    try {
      // 保存站点设置
      const s = await SiteSettings.list();
      if (s.length > 0) {
        await SiteSettings.update(s[0].id, settings);
      } else {
        await SiteSettings.create(settings);
      }
      // 保存管理员口令
      const creds = await AdminCredentials.list();
      const data = {
        username: (adminCredentials.username || 'admin').trim(),
        password: adminCredentials.password || 'paidaxing888',
        is_active: true
      };
      if (creds.length > 0) {
        await AdminCredentials.update(creds[0].id, data);
      } else {
        await AdminCredentials.create(data);
      }
      // 清理旧本地缓存键（如存在）
      localStorage.removeItem('adminCredentials');
      localStorage.removeItem('adminLoggedIn');

      setNotice({ type: 'success', text: '保存成功' });
    } catch (e) {
      setNotice({ type: 'error', text: '保存失败，请重试' });
    }
    setSaving(false);
  };

  const row = (children) => <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;

  return (
    <div className="p-4 md:p-8">
      <header className="mb-6 flex items-center gap-2">
        <SettingsIcon className="w-5 h-5 text-gray-700" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">设置</h1>
      </header>

      {notice.type && (
        <div className={`mb-4 p-3 rounded border ${notice.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {notice.text}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>站点信息</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {row(
                <>
                  <div>
                    <Label>站点名称</Label>
                    <Input value={settings.site_name} onChange={(e) => setSettings({ ...settings, site_name: e.target.value })} />
                  </div>
                  <div>
                    <Label>联系邮箱</Label>
                    <Input value={settings.contact_email} onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })} placeholder="support@example.com" />
                  </div>
                  <div>
                    <Label>Logo URL</Label>
                    <Input value={settings.logo_url} onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })} placeholder="https://..." />
                  </div>
                  <div>
                    <Label>Favicon URL</Label>
                    <Input value={settings.site_favicon} onChange={(e) => setSettings({ ...settings, site_favicon: e.target.value })} placeholder="https://..." />
                  </div>
                </>
              )}
              <div>
                <Label>SEO 标题</Label>
                <Input value={settings.site_title} onChange={(e) => setSettings({ ...settings, site_title: e.target.value })} />
              </div>
              <div>
                <Label>SEO 描述</Label>
                <Textarea rows={3} value={settings.site_description} onChange={(e) => setSettings({ ...settings, site_description: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          {/* 链接与跳转 -> 改为仅保留货币与运费 */}
          <Card>
            <CardHeader><CardTitle>货币与运费</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {row(
                <>
                  <div>
                    <Label>货币</Label>
                    <Select value={settings.currency} onValueChange={(v) => setSettings({ ...settings, currency: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CNY">CNY</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              {row(
                <>
                  <div>
                    <Label>运费</Label>
                    <Input type="number" value={settings.shipping_fee} onChange={(e) => setSettings({ ...settings, shipping_fee: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <Label>免邮门槛</Label>
                    <Input type="number" value={settings.free_shipping_threshold} onChange={(e) => setSettings({ ...settings, free_shipping_threshold: parseFloat(e.target.value) || 0 })} />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>后台口令</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {row(
                <>
                  <div>
                    <Label>用户名</Label>
                    <div className="relative">
                      <Input value={adminCredentials.username} onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })} />
                      <User className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <div>
                    <Label>密码</Label>
                    <div className="relative">
                      <Input type={showPassword ? 'text' : 'password'} value={adminCredentials.password} onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="min-w-[140px]">
              <Save className="w-4 h-4 mr-2" />
              {saving ? '保存中...' : '保存设置'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
