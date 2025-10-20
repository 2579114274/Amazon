import { useEffect } from 'react';
import { LocalPixelSettings as PixelSettings } from '@/api/localEntities';
import { pixelTracker } from './PixelEventTracker';

export default function PixelTracker() {
  useEffect(() => {
    let isMounted = true;
    
    const loadAndInjectPixels = async () => {
      try {
        const settingsList = await PixelSettings.list();
        if (!settingsList.length || !isMounted) return;
        
        const settings = settingsList[0];
        
        // 检查全局开关
        if (!settings.is_active) {
          console.log('像素跟踪已全局禁用');
          return;
        }
        
        // 清理现有的像素脚本
        cleanupExistingPixels();
        
        // 注入启用的像素
        injectPixels(settings);
        
        // 初始化事件跟踪器
        await pixelTracker.init();
        
        // 跟踪页面浏览
        setTimeout(() => {
          pixelTracker.trackPageView();
        }, 1000); // 延迟1秒确保像素脚本已加载
        
      } catch (error) {
        console.error('加载像素设置失败:', error);
      }
    };
    
    loadAndInjectPixels();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  const cleanupExistingPixels = () => {
    // 清理已存在的像素脚本
    const existingPixelScripts = document.querySelectorAll('[data-pixel-tracker]');
    existingPixelScripts.forEach(script => script.remove());
  };
  
  const injectPixels = (settings) => {
    // 注入 Facebook 像素
    if (settings.facebook_pixels?.length) {
      settings.facebook_pixels.forEach(pixel => {
        if (pixel.is_active && pixel.pixel_code) {
          injectPixelCode(pixel.pixel_code, `facebook-${pixel.pixel_id}`);
        }
      });
    }
    
    // 注入 TikTok 像素
    if (settings.tiktok_pixels?.length) {
      settings.tiktok_pixels.forEach(pixel => {
        if (pixel.is_active && pixel.pixel_code) {
          injectPixelCode(pixel.pixel_code, `tiktok-${pixel.pixel_id}`);
        }
      });
    }
    
    // 注入 Google 像素
    if (settings.google_pixels?.length) {
      settings.google_pixels.forEach(pixel => {
        if (pixel.is_active && pixel.pixel_code) {
          injectPixelCode(pixel.pixel_code, `google-${pixel.analytics_id}`);
        }
      });
    }
    
    // 注入其他平台像素
    if (settings.other_pixels?.length) {
      settings.other_pixels.forEach((pixel, index) => {
        if (pixel.is_active && pixel.pixel_code) {
          injectPixelCode(pixel.pixel_code, `other-${index}`);
        }
      });
    }
    
    // 注入自定义像素
    if (settings.custom_pixels?.length) {
      settings.custom_pixels.forEach((pixel, index) => {
        if (pixel.is_active && pixel.pixel_code) {
          injectPixelCode(pixel.pixel_code, `custom-${index}`);
        }
      });
    }
  };
  
  const injectPixelCode = (pixelCode, pixelId) => {
    try {
      // 创建临时容器来解析 HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = pixelCode;
      
      // 处理脚本标签
      const scripts = tempDiv.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        
        // 复制所有属性
        Array.from(script.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        
        // 复制脚本内容
        if (script.innerHTML) {
          newScript.innerHTML = script.innerHTML;
        }
        
        // 添加跟踪标识
        newScript.setAttribute('data-pixel-tracker', pixelId);
        
        // 添加到 head
        document.head.appendChild(newScript);
      });
      
      // 处理 noscript 标签（Facebook Pixel 的图片回退）
      const noscripts = tempDiv.querySelectorAll('noscript');
      noscripts.forEach(noscript => {
        const newNoscript = document.createElement('noscript');
        newNoscript.innerHTML = noscript.innerHTML;
        newNoscript.setAttribute('data-pixel-tracker', pixelId);
        document.head.appendChild(newNoscript);
      });
      
      console.log(`✅ 像素已注入: ${pixelId}`);
      
    } catch (error) {
      console.error(`❌ 注入像素失败 ${pixelId}:`, error);
    }
  };
  
  // 这个组件不渲染任何可见内容
  return null;
} 