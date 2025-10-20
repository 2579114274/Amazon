// 像素事件跟踪工具
import { LocalPixelSettings } from '@/api/localEntities';

export class PixelEventTracker {
  static instance = null;
  
  constructor() {
    if (PixelEventTracker.instance) {
      return PixelEventTracker.instance;
    }
    
    this.settings = null;
    this.isReady = false;
    PixelEventTracker.instance = this;
  }
  
  static getInstance() {
    if (!PixelEventTracker.instance) {
      PixelEventTracker.instance = new PixelEventTracker();
    }
    return PixelEventTracker.instance;
  }
  
  // 初始化设置
  async init() {
    try {
      const settingsList = await LocalPixelSettings.list();
      
      if (settingsList.length > 0) {
        this.settings = settingsList[0];
        this.isReady = this.settings.is_active;
      }
    } catch (error) {
      console.error('初始化像素事件跟踪失败:', error);
    }
  }
  
  // 通用事件跟踪
  trackEvent(eventName, eventData = {}) {
    if (!this.isReady || !this.settings?.is_active) return;
    
    console.log(`🎯 跟踪事件: ${eventName}`, eventData);
    
    // Facebook Pixel 事件
    this.trackFacebookEvent(eventName, eventData);
    
    // TikTok Pixel 事件
    this.trackTikTokEvent(eventName, eventData);
    
    // Google Analytics 事件
    this.trackGoogleEvent(eventName, eventData);
  }
  
  // Facebook Pixel 事件
  trackFacebookEvent(eventName, eventData) {
    if (!this.settings?.facebook_pixels?.length) return;
    
    if (typeof window.fbq !== 'function') {
      console.warn('Facebook Pixel 未加载');
      return;
    }
    
    const fbEventMap = {
      'page_view': 'PageView',
      'add_to_cart': 'AddToCart',
      'purchase': 'Purchase',
      'initiate_checkout': 'InitiateCheckout',
      'view_content': 'ViewContent',
      'search': 'Search',
      'lead': 'Lead'
    };
    
    const fbEvent = fbEventMap[eventName] || 'CustomEvent';
    
    try {
      window.fbq('track', fbEvent, this.formatFacebookEventData(eventData));
      console.log(`✅ Facebook事件已发送: ${fbEvent}`);
    } catch (error) {
      console.error('发送Facebook事件失败:', error);
    }
  }
  
  // TikTok Pixel 事件
  trackTikTokEvent(eventName, eventData) {
    if (!this.settings?.tiktok_pixels?.length) return;
    
    if (typeof window.ttq !== 'object') {
      console.warn('TikTok Pixel 未加载');
      return;
    }
    
    const ttEventMap = {
      'page_view': 'ViewContent',
      'add_to_cart': 'AddToCart',
      'purchase': 'CompletePayment',
      'initiate_checkout': 'InitiateCheckout',
      'view_content': 'ViewContent',
      'search': 'Search',
      'lead': 'SubmitForm'
    };
    
    const ttEvent = ttEventMap[eventName] || 'CustomEvent';
    
    try {
      window.ttq.track(ttEvent, this.formatTikTokEventData(eventData));
      console.log(`✅ TikTok事件已发送: ${ttEvent}`);
    } catch (error) {
      console.error('发送TikTok事件失败:', error);
    }
  }
  
  // Google Analytics 事件
  trackGoogleEvent(eventName, eventData) {
    if (!this.settings?.google_pixels?.length) return;
    
    if (typeof window.gtag !== 'function') {
      console.warn('Google Analytics 未加载');
      return;
    }
    
    const gaEventMap = {
      'page_view': 'page_view',
      'add_to_cart': 'add_to_cart',
      'purchase': 'purchase',
      'initiate_checkout': 'begin_checkout',
      'view_content': 'view_item',
      'search': 'search',
      'lead': 'generate_lead'
    };
    
    const gaEvent = gaEventMap[eventName] || 'custom_event';
    
    try {
      window.gtag('event', gaEvent, this.formatGoogleEventData(eventData));
      console.log(`✅ Google事件已发送: ${gaEvent}`);
    } catch (error) {
      console.error('发送Google事件失败:', error);
    }
  }
  
  // 格式化 Facebook 事件数据
  formatFacebookEventData(data) {
    const formatted = {};
    
    if (data.value) formatted.value = parseFloat(data.value);
    if (data.currency) formatted.currency = data.currency;
    if (data.content_ids) formatted.content_ids = data.content_ids;
    if (data.content_type) formatted.content_type = data.content_type;
    if (data.search_string) formatted.search_string = data.search_string;
    
    return formatted;
  }
  
  // 格式化 TikTok 事件数据
  formatTikTokEventData(data) {
    const formatted = {};
    
    if (data.value) formatted.value = parseFloat(data.value);
    if (data.currency) formatted.currency = data.currency;
    if (data.content_id) formatted.content_id = data.content_id;
    if (data.content_type) formatted.content_type = data.content_type;
    if (data.quantity) formatted.quantity = parseInt(data.quantity);
    
    return formatted;
  }
  
  // 格式化 Google 事件数据
  formatGoogleEventData(data) {
    const formatted = {};
    
    if (data.value) formatted.value = parseFloat(data.value);
    if (data.currency) formatted.currency = data.currency;
    if (data.item_id) formatted.item_id = data.item_id;
    if (data.item_name) formatted.item_name = data.item_name;
    if (data.item_category) formatted.item_category = data.item_category;
    if (data.quantity) formatted.quantity = parseInt(data.quantity);
    
    return formatted;
  }
  
  // 快捷事件方法
  trackPageView() {
    this.trackEvent('page_view', {
      content_type: 'website'
    });
  }
  
  trackAddToCart(product) {
    this.trackEvent('add_to_cart', {
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'USD',
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      quantity: 1
    });
  }
  
  trackPurchase(order) {
    this.trackEvent('purchase', {
      value: order.total,
      currency: order.currency || 'USD',
      content_ids: order.items.map(item => item.product_id),
      content_type: 'product'
    });
  }
  
  trackInitiateCheckout(cartValue) {
    this.trackEvent('initiate_checkout', {
      value: cartValue,
      currency: 'USD',
      content_type: 'product'
    });
  }
  
  trackViewContent(product) {
    this.trackEvent('view_content', {
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'USD',
      item_id: product.id,
      item_name: product.name,
      item_category: product.category
    });
  }
  
  trackSearch(searchTerm) {
    this.trackEvent('search', {
      search_string: searchTerm,
      content_type: 'product'
    });
  }
  
  trackLead(formData) {
    this.trackEvent('lead', {
      content_type: 'form',
      value: formData.value || 0,
      currency: 'USD'
    });
  }
}

// 导出单例实例
export const pixelTracker = PixelEventTracker.getInstance(); 