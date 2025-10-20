import React, { useEffect, useState } from 'react';
import { LocalPixelSettings as PixelSettings } from '@/api/localEntities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Save, Plus, Trash2, Target, Copy, Eye, EyeOff, TestTube, Play, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  trackProductView, 
  trackAddToCart, 
  trackPurchase, 
  trackSearch,
  trackLead,
  trackCustomEvent 
} from '@/utils/facebookPixelUsage';

// 轻量通知组件（代替未安装的 toast 库）
function useNotifier() {
  const [notice, setNotice] = useState(null); // {type: 'success'|'error'|'info', message: string}
  const notify = (message, type = 'info', timeout = 2600) => {
    setNotice({ message, type });
    window.clearTimeout((notify)._t);
    (notify)._t = window.setTimeout(() => setNotice(null), timeout);
  };
  const NoticeView = () =>
    notice ? (
      <div className="fixed top-4 right-4 z-[100]">
        <div
          className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm ${
            notice.type === 'success'
              ? 'bg-emerald-600'
              : notice.type === 'error'
              ? 'bg-red-600'
              : 'bg-gray-800'
          }`}
        >
          {notice.message}
        </div>
      </div>
    ) : null;
  return { notify, NoticeView };
}

export default function PixelManagement() {
  const [settings, setSettings] = useState({
    is_active: true,
    facebook_pixels: [],
    tiktok_pixels: [],
    google_pixels: [],
    other_pixels: [],
    custom_pixels: [],
    enable_server_side: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPixelCode, setShowPixelCode] = useState({});
  const [testResults, setTestResults] = useState([]);
  const [activeTab, setActiveTab] = useState('settings');

  const { notify, NoticeView } = useNotifier();

  // Dialog states for different pixel types
  const [dialogs, setDialogs] = useState({
    facebook: false,
    tiktok: false,
    google: false,
    other: false,
    custom: false
  });

  // Form states for different pixel types
  const [forms, setForms] = useState({
    facebook: { name: '', pixel_id: '', access_token: '', is_active: true },
    tiktok: { name: '', pixel_id: '', access_token: '', is_active: true },
    google: { name: '', analytics_id: '', ads_conversion_id: '', is_active: true },
    other: { name: '', platform: '', pixel_id: '', is_active: true },
    custom: { name: '', platform: '', pixel_code: '', is_active: true }
  });

  // 生成像素代码的函数
  const generateFacebookPixelCode = (pixelId) => {
    return `<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"
/></noscript>
<!-- End Facebook Pixel Code -->`;
  };

  const generateTikTokPixelCode = (pixelId) => {
    return `<!-- TikTok Pixel Code Start -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;
  var ttq=w[t]=w[t]||[];
  ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
  ttq.setAndDefer=function(t,e){
    t[e]=function(){
      t.push([e].concat(Array.prototype.slice.call(arguments,0)))
    }
  };
  for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
  ttq.instance=function(t){
    for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);
    return e
  };
  ttq.load=function(e,n){
    var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;
    ttq._i=ttq._i||{},ttq._i[e]=[],ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
    var c=document.createElement("script");
    c.type="text/javascript",c.async=!0,c.src=r+"?sdkid="+e+"&lib="+t;
    var a=document.getElementsByTagName("script")[0];
    a.parentNode.insertBefore(c,a)
  };
  ttq.load('${pixelId}');
  ttq.page();
}(window, document, 'ttq');
</script>
<!-- TikTok Pixel Code End -->`;
  };

  const generateGoogleAnalyticsCode = (analyticsId) => {
    return `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${analyticsId}"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${analyticsId}');
</script>
<!-- End Google Analytics -->`;
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const settingsList = await PixelSettings.list();
      if (settingsList.length > 0) {
        const loadedSettings = settingsList[0];
        setSettings({
          is_active: loadedSettings.is_active ?? true,
          facebook_pixels: loadedSettings.facebook_pixels || [],
          tiktok_pixels: loadedSettings.tiktok_pixels || [],
          google_pixels: loadedSettings.google_pixels || [],
          other_pixels: loadedSettings.other_pixels || [],
          custom_pixels: loadedSettings.custom_pixels || [],
          enable_server_side: loadedSettings.enable_server_side || false
        });
      } else {
        const defaultSettings = {
          is_active: true,
          facebook_pixels: [],
          tiktok_pixels: [],
          google_pixels: [],
          other_pixels: [],
          custom_pixels: [],
          enable_server_side: false
        };
        await PixelSettings.create(defaultSettings);
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('加载像素设置失败:', error);
      notify('加载像素设置失败: ' + (error?.message || ''), 'error');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const settingsList = await PixelSettings.list();
      if (settingsList.length > 0) {
        await PixelSettings.update(settingsList[0].id, settings);
      } else {
        await PixelSettings.create(settings);
      }
      notify('像素设置保存成功！', 'success');
    } catch (error) {
      console.error('保存设置失败:', error);
      notify('保存失败: ' + (error?.message || ''), 'error');
    }
    setSaving(false);
  };

  const handleAddPixel = (type) => {
    const newPixel = { ...forms[type] };
    // 验证
    if (!newPixel.name) {
      notify('请输入像素名称', 'error');
      return;
    }
    if (type === 'facebook' && !newPixel.pixel_id) {
      notify('请输入Facebook Pixel ID', 'error');
      return;
    }
    if (type === 'tiktok' && !newPixel.pixel_id) {
      notify('请输入TikTok Pixel ID', 'error');
      return;
    }
    if (type === 'google' && !newPixel.analytics_id) {
      notify('请输入Google Analytics ID', 'error');
      return;
    }

    // 自动生成像素代码
    if (type === 'facebook' && newPixel.pixel_id) {
      newPixel.pixel_code = generateFacebookPixelCode(newPixel.pixel_id);
    } else if (type === 'tiktok' && newPixel.pixel_id) {
      newPixel.pixel_code = generateTikTokPixelCode(newPixel.pixel_id);
    } else if (type === 'google' && newPixel.analytics_id) {
      newPixel.pixel_code = generateGoogleAnalyticsCode(newPixel.analytics_id);
    }

    // 更新设置
    const updatedSettings = {
      ...settings,
      [`${type}_pixels`]: [...settings[`${type}_pixels`], newPixel]
    };
    setSettings(updatedSettings);

    // 重置表单 & 关闭弹窗
    const defaultForms = {
      facebook: { name: '', pixel_id: '', access_token: '', is_active: true },
      tiktok: { name: '', pixel_id: '', access_token: '', is_active: true },
      google: { name: '', analytics_id: '', ads_conversion_id: '', is_active: true },
      other: { name: '', platform: '', pixel_id: '', is_active: true },
      custom: { name: '', platform: '', pixel_code: '', is_active: true }
    };
    setForms(prev => ({ ...prev, [type]: defaultForms[type] }));
    setDialogs(prev => ({ ...prev, [type]: false }));

    notify('像素已添加！请点击“保存设置”使其生效。', 'success');
  };

  const copyPixelCode = (pixelCode) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(pixelCode).then(
        () => notify('像素代码已复制到剪贴板！', 'success'),
        () => notify('复制失败，请手动复制代码', 'error')
      );
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = pixelCode;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        notify('像素代码已复制到剪贴板！', 'success');
      } catch {
        notify('复制失败，请手动复制代码', 'error');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleRemovePixel = (type, index) => {
    const updatedPixels = settings[`${type}_pixels`].filter((_, i) => i !== index);
    setSettings(prev => ({
      ...prev,
      [`${type}_pixels`]: updatedPixels
    }));
    notify('像素已删除！请保存设置使其生效。', 'success');
  };

  const handleTogglePixel = (type, index) => {
    const updatedPixels = [...settings[`${type}_pixels`]];
    updatedPixels[index] = {
      ...updatedPixels[index],
      is_active: !updatedPixels[index].is_active
    };
    setSettings(prev => ({
      ...prev,
      [`${type}_pixels`]: updatedPixels
    }));
  };

  const togglePixelCodeVisibility = (type, index) => {
    const key = `${type}_${index}`;
    setShowPixelCode(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // 测试相关函数
  const addTestResult = (event, status) => {
    const result = {
      id: Date.now(),
      event,
      status,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [result, ...prev.slice(0, 9)]); // 保留最近10个结果
  };

  const testProductView = () => {
    try {
      const testProduct = {
        id: 'test-product-123',
        name: '测试产品',
        price: 29.99,
        currency: 'USD',
        category: '测试分类'
      };
      
      trackProductView(testProduct);
      addTestResult('ViewContent (产品查看)', '✅ 已发送');
      notify('产品查看事件已发送', 'success');
    } catch (error) {
      addTestResult('ViewContent (产品查看)', '❌ 发送失败');
      notify('产品查看事件发送失败', 'error');
    }
  };

  const testAddToCart = () => {
    try {
      const testProduct = {
        id: 'test-product-123',
        name: '测试产品',
        price: 29.99,
        currency: 'USD'
      };
      
      trackAddToCart(testProduct, 2);
      addTestResult('AddToCart (添加到购物车)', '✅ 已发送');
      notify('添加到购物车事件已发送', 'success');
    } catch (error) {
      addTestResult('AddToCart (添加到购物车)', '❌ 发送失败');
      notify('添加到购物车事件发送失败', 'error');
    }
  };

  const testPurchase = () => {
    try {
      const testOrder = {
        id: 'test-order-456',
        total: 59.98,
        currency: 'USD',
        items: [
          { product_id: 'test-product-123', quantity: 2 }
        ]
      };
      
      trackPurchase(testOrder);
      addTestResult('Purchase (完成购买)', '✅ 已发送');
      notify('完成购买事件已发送', 'success');
    } catch (error) {
      addTestResult('Purchase (完成购买)', '❌ 发送失败');
      notify('完成购买事件发送失败', 'error');
    }
  };

  const testSearch = () => {
    try {
      trackSearch('测试搜索词');
      addTestResult('Search (搜索)', '✅ 已发送');
      notify('搜索事件已发送', 'success');
    } catch (error) {
      addTestResult('Search (搜索)', '❌ 发送失败');
      notify('搜索事件发送失败', 'error');
    }
  };

  const testLead = () => {
    try {
      trackLead({
        value: 0,
        currency: 'USD',
        content_type: 'form'
      });
      addTestResult('Lead (潜在客户)', '✅ 已发送');
      notify('潜在客户事件已发送', 'success');
    } catch (error) {
      addTestResult('Lead (潜在客户)', '❌ 发送失败');
      notify('潜在客户事件发送失败', 'error');
    }
  };

  const testCustomEvent = () => {
    try {
      trackCustomEvent('test_custom_event', {
        test_param: 'test_value',
        timestamp: Date.now()
      });
      addTestResult('CustomEvent (自定义事件)', '✅ 已发送');
      notify('自定义事件已发送', 'success');
    } catch (error) {
      addTestResult('CustomEvent (自定义事件)', '❌ 发送失败');
      notify('自定义事件发送失败', 'error');
    }
  };

  const checkFacebookSDK = () => {
    if (typeof window.fbq === 'function') {
      addTestResult('Facebook SDK', '✅ 已加载');
      notify('Facebook SDK已加载', 'success');
    } else {
      addTestResult('Facebook SDK', '❌ 未加载');
      notify('Facebook SDK未加载', 'error');
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
    notify('测试结果已清空', 'info');
  };

  const renderPixelCard = (type, pixels, title, description) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Dialog open={dialogs[type]} onOpenChange={(open) => setDialogs(prev => ({ ...prev, [type]: open }))}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                添加{title}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>添加{title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>名称 *</Label>
                  <Input
                    value={forms[type].name}
                    onChange={(e) => setForms(prev => ({ ...prev, [type]: { ...prev[type], name: e.target.value } }))}
                    placeholder="像素名称，例如：主广告账户"
                  />
                </div>

                {type === 'facebook' && (
                  <>
                    <div className="space-y-2">
                      <Label>Facebook Pixel ID *</Label>
                      <Input
                        value={forms[type].pixel_id}
                        onChange={(e) => setForms(prev => ({ ...prev, [type]: { ...prev[type], pixel_id: e.target.value } }))}
                        placeholder="例如：123456789012345"
                      />
                      <p className="text-xs text-gray-500">在 Facebook 广告管理器的事件管理器中找到</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Access Token (可选)</Label>
                      <Input
                        type="password"
                        value={forms[type].access_token}
                        onChange={(e) => setForms(prev => ({ ...prev, [type]: { ...prev[type], access_token: e.target.value } }))}
                        placeholder="用于 Conversions API 服务器端跟踪"
                      />
                    </div>
                  </>
                )}

                {type === 'tiktok' && (
                  <>
                    <div className="space-y-2">
                      <Label>TikTok Pixel ID *</Label>
                      <Input
                        value={forms[type].pixel_id}
                        onChange={(e) => setForms(prev => ({ ...prev, [type]: { ...prev[type], pixel_id: e.target.value } }))}
                        placeholder="例如：D2A5IU3C77U89NHRL6E0"
                      />
                      <p className="text-xs text-gray-500">在 TikTok 广告管理器的事件中找到像素 ID</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Access Token (可选)</Label>
                      <Input
                        type="password"
                        value={forms[type].access_token}
                        onChange={(e) => setForms(prev => ({ ...prev, [type]: { ...prev[type], access_token: e.target.value } }))}
                        placeholder="用于 Events API 服务器端跟踪"
                      />
                    </div>
                  </>
                )}

                {type === 'google' && (
                  <>
                    <div className="space-y-2">
                      <Label>Google Analytics ID *</Label>
                      <Input
                        value={forms[type].analytics_id}
                        onChange={(e) => setForms(prev => ({ ...prev, [type]: { ...prev[type], analytics_id: e.target.value } }))}
                        placeholder="例如：G-XXXXXXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Google Ads Conversion ID (可选)</Label>
                      <Input
                        value={forms[type].ads_conversion_id}
                        onChange={(e) => setForms(prev => ({ ...prev, [type]: { ...prev[type], ads_conversion_id: e.target.value } }))}
                        placeholder="例如：AW-123456789"
                      />
                    </div>
                  </>
                )}

                {type === 'other' && (
                  <>
                    <div className="space-y-2">
                      <Label>平台名称 *</Label>
                      <Input
                        value={forms[type].platform}
                        onChange={(e) => setForms(prev => ({ ...prev, [type]: { ...prev[type], platform: e.target.value } }))}
                        placeholder="例如：Snapchat, Twitter, Pinterest"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pixel ID *</Label>
                      <Input
                        value={forms[type].pixel_id}
                        onChange={(e) => setForms(prev => ({ ...prev, [type]: { ...prev[type], pixel_id: e.target.value } }))}
                        placeholder="像素ID"
                      />
                    </div>
                  </>
                )}

                {type === 'custom' && (
                  <>
                    <div className="space-y-2">
                      <Label>平台名称 *</Label>
                      <Input
                        value={forms[type].platform}
                        onChange={(e) => setForms(prev => ({ ...prev, [type]: { ...prev[type], platform: e.target.value } }))}
                        placeholder="平台名称"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>像素代码 *</Label>
                      <Textarea
                        value={forms[type].pixel_code}
                        onChange={(e) => setForms(prev => ({ ...prev, [type]: { ...prev[type], pixel_code: e.target.value } }))}
                        placeholder="粘贴完整的像素代码..."
                        rows={8}
                      />
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogs(prev => ({ ...prev, [type]: false }))}>
                  取消
                </Button>
                <Button onClick={() => handleAddPixel(type)}>添加</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {pixels.length > 0 ? (
          <div className="space-y-4">
            {pixels.map((pixel, index) => (
              <Card key={`${type}-${index}`} className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={pixel.is_active ? "default" : "secondary"}>
                        {pixel.is_active ? "启用" : "禁用"}
                      </Badge>
                      <span className="font-medium">{pixel.name}</span>
                      {pixel.platform && <Badge variant="outline">{pixel.platform}</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={pixel.is_active}
                        onCheckedChange={() => handleTogglePixel(type, index)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePixel(type, index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    {pixel.pixel_id && <p><span className="font-medium">ID:</span> {pixel.pixel_id}</p>}
                    {pixel.analytics_id && <p><span className="font-medium">Analytics:</span> {pixel.analytics_id}</p>}
                    {pixel.ads_conversion_id && <p><span className="font-medium">Ads:</span> {pixel.ads_conversion_id}</p>}
                  </div>

                  {pixel.pixel_code && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-gray-700">像素代码</Label>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePixelCodeVisibility(type, index)}
                          >
                            {showPixelCode[`${type}_${index}`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyPixelCode(pixel.pixel_code)}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            复制
                          </Button>
                        </div>
                      </div>
                      {showPixelCode[`${type}_${index}`] && (
                        <pre className="text-xs bg-white p-3 rounded border overflow-x-auto max-h-32 whitespace-pre-wrap">
                          {pixel.pixel_code}
                        </pre>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无{title}，点击上方按钮添加</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <NoticeView />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">广告像素管理</h1>
            <p className="text-gray-600 mt-1">管理多个平台的跟踪像素，自动生成标准代码</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              像素配置
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              像素测试
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            {/* 全局开关 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>全局设置</CardTitle>
                <CardDescription>控制整个像素系统的启用状态</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>启用像素跟踪系统</Label>
                    <p className="text-sm text-gray-500">关闭此选项将禁用所有像素跟踪功能</p>
                  </div>
                  <Switch
                    checked={settings.is_active}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, is_active: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {renderPixelCard('facebook', settings.facebook_pixels, 'Facebook像素', '管理多个Facebook像素用于跟踪不同的广告活动')}
              {renderPixelCard('tiktok', settings.tiktok_pixels, 'TikTok像素', '管理多个TikTok像素用于跟踪不同的广告活动')}
              {renderPixelCard('google', settings.google_pixels, 'Google跟踪', '管理Google Analytics和Google Ads转化跟踪')}
              {renderPixelCard('other', settings.other_pixels, '其他平台像素', '管理Snapchat、Twitter、Pinterest等平台的跟踪像素')}
              {renderPixelCard('custom', settings.custom_pixels, '自定义像素', '添加自定义的跟踪代码')}

              <Card>
                <CardHeader>
                  <CardTitle>高级设置</CardTitle>
                  <CardDescription>配置服务器端跟踪和其他高级功能</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>启用服务器端跟踪</Label>
                      <p className="text-sm text-gray-500">通过服务器端API发送事件，提高数据准确性</p>
                    </div>
                    <Switch
                      checked={settings.enable_server_side}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enable_server_side: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end mt-8">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-purple-600 hover:bg-purple-700 shadow-lg px-8 py-3"
                size="lg"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    保存设置
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-6">
            {/* 测试工具 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 测试按钮 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">测试事件</Badge>
                    事件跟踪测试
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={testProductView} variant="outline" size="sm">
                      <Play className="w-3 h-3 mr-1" />
                      产品查看
                    </Button>
                    <Button onClick={testAddToCart} variant="outline" size="sm">
                      <Play className="w-3 h-3 mr-1" />
                      添加到购物车
                    </Button>
                    <Button onClick={testPurchase} variant="outline" size="sm">
                      <Play className="w-3 h-3 mr-1" />
                      完成购买
                    </Button>
                    <Button onClick={testSearch} variant="outline" size="sm">
                      <Play className="w-3 h-3 mr-1" />
                      搜索
                    </Button>
                    <Button onClick={testLead} variant="outline" size="sm">
                      <Play className="w-3 h-3 mr-1" />
                      潜在客户
                    </Button>
                    <Button onClick={testCustomEvent} variant="outline" size="sm">
                      <Play className="w-3 h-3 mr-1" />
                      自定义事件
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button onClick={checkFacebookSDK} variant="secondary" size="sm" className="w-full">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      检查Facebook SDK状态
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 测试结果 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Badge variant="outline">结果</Badge>
                      测试结果
                    </span>
                    <Button onClick={clearTestResults} variant="ghost" size="sm">
                      <XCircle className="w-3 h-3 mr-1" />
                      清空
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {testResults.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>暂无测试结果</p>
                      <p className="text-sm">点击左侧按钮开始测试</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {testResults.map((result) => (
                        <div
                          key={result.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                        >
                          <span className="font-medium">{result.event}</span>
                          <div className="flex items-center gap-2">
                            <span className={result.status.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                              {result.status}
                            </span>
                            <span className="text-gray-400 text-xs">{result.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 使用说明 */}
            <Card>
              <CardHeader>
                <CardTitle>使用说明</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">测试前准备：</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• 确保已在像素配置中配置Facebook像素</li>
                      <li>• 打开浏览器开发者工具查看控制台</li>
                      <li>• 安装Facebook像素助手扩展（可选）</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">验证方法：</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• 查看控制台日志确认事件发送</li>
                      <li>• 在Facebook事件管理器中查看实时事件</li>
                      <li>• 使用像素助手扩展验证像素状态</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 提示</h4>
                  <p className="text-blue-800 text-sm">
                    测试事件会发送到您配置的Facebook像素。请确保在测试环境中进行测试，避免影响生产数据。
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}