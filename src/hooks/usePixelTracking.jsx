import { useEffect } from 'react';
import { pixelTracker } from '@/components/PixelEventTracker';

export function usePixelTracking() {
  useEffect(() => {
    // 组件挂载时初始化跟踪器（如果还没有初始化）
    pixelTracker.init().catch(error => {
      console.error('初始化像素跟踪失败:', error);
    });
  }, []);

  return {
    // 页面浏览跟踪
    trackPageView: () => pixelTracker.trackPageView(),
    
    // 产品相关跟踪
    trackViewContent: (product) => pixelTracker.trackViewContent(product),
    trackAddToCart: (product) => pixelTracker.trackAddToCart(product),
    
    // 购买流程跟踪
    trackInitiateCheckout: (cartValue) => pixelTracker.trackInitiateCheckout(cartValue),
    trackPurchase: (order) => pixelTracker.trackPurchase(order),
    
    // 其他行为跟踪
    trackSearch: (searchTerm) => pixelTracker.trackSearch(searchTerm),
    trackLead: (formData) => pixelTracker.trackLead(formData),
    
    // 通用事件跟踪
    trackEvent: (eventName, eventData) => pixelTracker.trackEvent(eventName, eventData)
  };
} 