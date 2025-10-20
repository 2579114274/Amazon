import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LocalCloakSettings as CloakSettings } from '@/api/localEntities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Shield, Save, Globe, Smartphone, ScreenShare, Plus } from 'lucide-react';

const initialSettings = {
  is_active: false,
  safe_page_url: '',
  bypass_parameter: 'bypass',
  bypass_value: '1',
  allowed_countries: '',
  disallowed_countries: '',
  allow_desktop: true,
  allow_mobile: true,
  disallowed_user_agents_keywords: ''
};

const COMMON_BOT_KEYWORDS = [
  'bot','spider','crawler','facebookexternalhit','facebookcatalog','googlebot','bingbot','yandexbot','baiduspider','twitterbot','linkedinbot','whatsapp','telegram','slackbot','discordbot','applebot','amazonbot','msnbot','duckduckbot','ahrefsbot','semrushbot','mj12bot','dotbot','archive.org_bot','ia_archiver','wayback','curl','wget','python-requests','postman','scrapy','headless','phantom','selenium','puppeteer'
];

export default function CloakManagement() {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recordId, setRecordId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const list = await CloakSettings.list();
      if (list.length > 0) {
        setSettings(prev => ({ ...prev, ...list[0] }));
        setRecordId(list[0].id);
      } else {
        setSettings(initialSettings);
        setRecordId(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const setField = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (recordId) {
        await CloakSettings.update(recordId, settings);
      } else {
        const created = await CloakSettings.create(settings);
        setRecordId(created.id);
      }
      alert('设置已保存');
    } catch (e) {
      console.error('保存失败', e);
      alert('保存失败，请重试');
    }
    setSaving(false);
  };

  const addCommonBotKeywords = () => {
    const current = (settings.disallowed_user_agents_keywords || '').split('\n').filter(Boolean);
    const merged = Array.from(new Set([...current, ...COMMON_BOT_KEYWORDS]));
    setField('disallowed_user_agents_keywords', merged.join('\n'));
  };

  if (loading) return <div className="p-8">加载中...</div>;

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${settings.is_active ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gray-400'}`}>
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cloak 斗篷系统</h1>
            <p className="text-gray-600 mt-1">智能流量分配，保护您的推广页面</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>全局设置</span>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? '保存中...' : '保存设置'}
                </Button>
              </CardTitle>
              <CardDescription>设置基本拦截规则与跳转逻辑</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active" className="font-medium">启用 Cloak</Label>
                <Switch id="is_active" checked={!!settings.is_active} onCheckedChange={(v) => setField('is_active', !!v)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="safe_page_url">安全页 URL（命中规则时跳转）</Label>
                  <Input id="safe_page_url" value={settings.safe_page_url} onChange={(e) => setField('safe_page_url', e.target.value)} placeholder="https://example.com/safe" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="bypass_parameter">绕过参数名</Label>
                    <Input id="bypass_parameter" value={settings.bypass_parameter} onChange={(e) => setField('bypass_parameter', e.target.value)} placeholder="bypass" />
                  </div>
                  <div>
                    <Label htmlFor="bypass_value">绕过参数值</Label>
                    <Input id="bypass_value" value={settings.bypass_value} onChange={(e) => setField('bypass_value', e.target.value)} placeholder="1" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2"><Globe className="w-4 h-4" />允许国家（逗号或换行分隔）</Label>
                  <Textarea rows={4} value={settings.allowed_countries} onChange={(e) => setField('allowed_countries', e.target.value)} placeholder="US, CA, GB 或者每行一个" />
                </div>
                <div>
                  <Label className="flex items-center gap-2"><Globe className="w-4 h-4" />拒绝国家（逗号或换行分隔）</Label>
                  <Textarea rows={4} value={settings.disallowed_countries} onChange={(e) => setField('disallowed_countries', e.target.value)} placeholder="CN, RU 或者每行一个" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between border rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <ScreenShare className="w-4 h-4" />
                    <span>允许桌面设备</span>
                  </div>
                  <Switch checked={!!settings.allow_desktop} onCheckedChange={(v) => setField('allow_desktop', !!v)} />
                </div>
                <div className="flex items-center justify-between border rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <span>允许移动设备</span>
                  </div>
                  <Switch checked={!!settings.allow_mobile} onCheckedChange={(v) => setField('allow_mobile', !!v)} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>拦截UA关键字（每行一个）</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addCommonBotKeywords}>
                    <Plus className="w-4 h-4 mr-1" />
                    一键填充常见Bot
                  </Button>
                </div>
                <Textarea
                  rows={8}
                  value={settings.disallowed_user_agents_keywords}
                  onChange={(e) => setField('disallowed_user_agents_keywords', e.target.value)}
                  placeholder="如：bot、crawler、googlebot（每行一个）"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}