import { useEffect, useRef } from 'react';
import { LocalPixelSettings as PixelSettings } from '@/api/localEntities';

export default function FacebookPixel() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    
    const initFacebookPixel = async () => {
      try {
        // 加载像素设置
        const settingsList = await PixelSettings.list();
        if (!settingsList.length) return;
        
        const settings = settingsList[0];
        
        // 检查全局开关和Facebook像素
        if (!settings.is_active || !settings.facebook_pixels?.length) {
          console.log('Facebook像素未启用或未配置');
          return;
        }

        // 获取启用的Facebook像素
        const activePixels = settings.facebook_pixels.filter(pixel => pixel.is_active);
        if (!activePixels.length) {
          console.log('没有启用的Facebook像素');
          return;
        }

        // 初始化Facebook SDK
        await loadFacebookSDK();
        
        // 初始化所有启用的像素
        activePixels.forEach(pixel => {
          if (pixel.pixel_id) {
            initPixel(pixel.pixel_id);
          }
        });

        // 跟踪页面浏览
        setTimeout(() => {
          trackPageView();
        }, 1000);

        initialized.current = true;
        console.log('✅ Facebook像素初始化完成');
        
      } catch (error) {
        console.error('❌ Facebook像素初始化失败:', error);
      }
    };

    initFacebookPixel();
  }, []);

  // 加载Facebook SDK
  const loadFacebookSDK = () => {
    return new Promise((resolve, reject) => {
      // 检查是否已经加载
      if (window.fbq) {
        resolve();
        return;
      }

      // 创建Facebook SDK脚本
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      script.setAttribute('data-pixel-tracker', 'facebook-sdk');
      
      script.onload = () => {
        console.log('✅ Facebook SDK加载成功');
        resolve();
      };
      
      script.onerror = () => {
        console.error('❌ Facebook SDK加载失败');
        reject(new Error('Facebook SDK加载失败'));
      };

      document.head.appendChild(script);
    });
  };

  // 初始化单个像素
  const initPixel = (pixelId) => {
    if (typeof window.fbq !== 'function') {
      console.warn('Facebook SDK未加载');
      return;
    }

    try {
      window.fbq('init', pixelId);
      console.log(`✅ Facebook像素初始化: ${pixelId}`);
    } catch (error) {
      console.error(`❌ Facebook像素初始化失败 ${pixelId}:`, error);
    }
  };

  // 跟踪页面浏览
  const trackPageView = () => {
    if (typeof window.fbq !== 'function') {
      console.warn('Facebook SDK未加载，无法跟踪页面浏览');
      return;
    }

    try {
      window.fbq('track', 'PageView');
      console.log('✅ Facebook页面浏览事件已发送');
    } catch (error) {
      console.error('❌ Facebook页面浏览事件发送失败:', error);
    }
  };

  // 这个组件不渲染任何可见内容
  return null;
}

// 导出Facebook事件跟踪函数
export const trackFacebookEvent = (eventName, eventData = {}) => {
  if (typeof window.fbq !== 'function') {
    console.warn('Facebook SDK未加载，无法发送事件');
    return;
  }

  const fbEventMap = {
    'page_view': 'PageView',
    'add_to_cart': 'AddToCart',
    'purchase': 'Purchase',
    'initiate_checkout': 'InitiateCheckout',
    'view_content': 'ViewContent',
    'search': 'Search',
    'lead': 'Lead',
    'complete_registration': 'CompleteRegistration',
    'add_to_wishlist': 'AddToWishlist',
    'add_payment_info': 'AddPaymentInfo',
    'start_checkout': 'StartCheckout',
    'view_cart': 'ViewCart',
    'contact': 'Contact',
    'customize_product': 'CustomizeProduct',
    'donate': 'Donate',
    'find_location': 'FindLocation',
    'schedule': 'Schedule',
    'subscribe': 'Subscribe',
    'download': 'Download',
    'share': 'Share'
  };

  const fbEvent = fbEventMap[eventName] || 'CustomEvent';
  
  try {
    // 格式化事件数据
    const formattedData = {};
    
    if (eventData.value) formattedData.value = parseFloat(eventData.value);
    if (eventData.currency) formattedData.currency = eventData.currency;
    if (eventData.content_ids) formattedData.content_ids = eventData.content_ids;
    if (eventData.content_type) formattedData.content_type = eventData.content_type;
    if (eventData.content_name) formattedData.content_name = eventData.content_name;
    if (eventData.search_string) formattedData.search_string = eventData.search_string;
    if (eventData.num_items) formattedData.num_items = parseInt(eventData.num_items);
    if (eventData.order_id) formattedData.order_id = eventData.order_id;
    if (eventData.delivery_category) formattedData.delivery_category = eventData.delivery_category;
    if (eventData.custom_data) formattedData.custom_data = eventData.custom_data;

    window.fbq('track', fbEvent, formattedData);
    console.log(`✅ Facebook事件已发送: ${fbEvent}`, formattedData);
  } catch (error) {
    console.error('❌ Facebook事件发送失败:', error);
  }
};

// 快捷事件方法
export const facebookEvents = {
  // 页面浏览
  pageView: () => trackFacebookEvent('page_view'),
  
  // 查看内容
  viewContent: (contentData) => trackFacebookEvent('view_content', contentData),
  
  // 添加到购物车
  addToCart: (productData) => trackFacebookEvent('add_to_cart', {
    content_ids: [productData.id],
    content_type: 'product',
    value: productData.price,
    currency: productData.currency || 'USD',
    content_name: productData.name,
    num_items: productData.quantity || 1
  }),
  
  // 开始结账
  initiateCheckout: (cartData) => trackFacebookEvent('initiate_checkout', {
    value: cartData.value,
    currency: cartData.currency || 'USD',
    content_type: 'product',
    num_items: cartData.num_items
  }),
  
  // 完成购买
  purchase: (orderData) => trackFacebookEvent('purchase', {
    value: orderData.value,
    currency: orderData.currency || 'USD',
    content_ids: orderData.content_ids,
    content_type: 'product',
    order_id: orderData.order_id,
    num_items: orderData.num_items
  }),
  
  // 搜索
  search: (searchData) => trackFacebookEvent('search', {
    search_string: searchData.search_string,
    content_type: searchData.content_type || 'product'
  }),
  
  // 潜在客户
  lead: (leadData) => trackFacebookEvent('lead', {
    value: leadData.value || 0,
    currency: leadData.currency || 'USD',
    content_type: leadData.content_type || 'form'
  }),
  
  // 完成注册
  completeRegistration: (registrationData) => trackFacebookEvent('complete_registration', {
    value: registrationData.value,
    currency: registrationData.currency || 'USD',
    content_type: registrationData.content_type || 'form'
  }),
  
  // 添加到愿望清单
  addToWishlist: (productData) => trackFacebookEvent('add_to_wishlist', {
    content_ids: [productData.id],
    content_type: 'product',
    value: productData.price,
    currency: productData.currency || 'USD',
    content_name: productData.name
  }),
  
  // 查看购物车
  viewCart: (cartData) => trackFacebookEvent('view_cart', {
    value: cartData.value,
    currency: cartData.currency || 'USD',
    content_type: 'product',
    content_ids: cartData.content_ids
  }),
  
  // 联系
  contact: (contactData) => trackFacebookEvent('contact', {
    content_type: contactData.content_type || 'form',
    value: contactData.value || 0,
    currency: contactData.currency || 'USD'
  })
}; 