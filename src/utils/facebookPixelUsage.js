// Facebook像素使用示例
// 在您的组件中导入并使用这些函数

import { facebookEvents, trackFacebookEvent } from '@/components/FacebookPixel';

// ===== 页面浏览事件 =====
// 在页面组件中使用
export const trackPageView = () => {
  facebookEvents.pageView();
};

// ===== 产品相关事件 =====

// 查看产品详情
export const trackProductView = (product) => {
  facebookEvents.viewContent({
    content_ids: [product.id],
    content_type: 'product',
    value: product.price,
    currency: product.currency || 'USD',
    content_name: product.name,
    content_category: product.category
  });
};

// 添加到购物车
export const trackAddToCart = (product, quantity = 1) => {
  facebookEvents.addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    currency: product.currency || 'USD',
    quantity: quantity
  });
};

// 查看购物车
export const trackViewCart = (cartItems, totalValue) => {
  facebookEvents.viewCart({
    value: totalValue,
    currency: 'USD',
    content_ids: cartItems.map(item => item.product_id)
  });
};

// ===== 结账流程事件 =====

// 开始结账
export const trackInitiateCheckout = (cartValue, numItems) => {
  facebookEvents.initiateCheckout({
    value: cartValue,
    currency: 'USD',
    num_items: numItems
  });
};

// 添加支付信息
export const trackAddPaymentInfo = (paymentData) => {
  trackFacebookEvent('add_payment_info', {
    value: paymentData.value,
    currency: paymentData.currency || 'USD',
    content_type: 'product',
    content_ids: paymentData.content_ids
  });
};

// 完成购买
export const trackPurchase = (order) => {
  facebookEvents.purchase({
    value: order.total,
    currency: order.currency || 'USD',
    content_ids: order.items.map(item => item.product_id),
    order_id: order.id,
    num_items: order.items.reduce((sum, item) => sum + item.quantity, 0)
  });
};

// ===== 搜索事件 =====
export const trackSearch = (searchTerm) => {
  facebookEvents.search({
    search_string: searchTerm,
    content_type: 'product'
  });
};

// ===== 用户互动事件 =====

// 添加到愿望清单
export const trackAddToWishlist = (product) => {
  facebookEvents.addToWishlist({
    id: product.id,
    name: product.name,
    price: product.price,
    currency: product.currency || 'USD'
  });
};

// 完成注册
export const trackCompleteRegistration = (registrationData) => {
  facebookEvents.completeRegistration({
    value: registrationData.value || 0,
    currency: registrationData.currency || 'USD',
    content_type: 'form'
  });
};

// 潜在客户
export const trackLead = (leadData) => {
  facebookEvents.lead({
    value: leadData.value || 0,
    currency: leadData.currency || 'USD',
    content_type: leadData.content_type || 'form'
  });
};

// 联系
export const trackContact = (contactData) => {
  facebookEvents.contact({
    content_type: contactData.content_type || 'form',
    value: contactData.value || 0,
    currency: contactData.currency || 'USD'
  });
};

// ===== 自定义事件 =====
export const trackCustomEvent = (eventName, customData) => {
  trackFacebookEvent('custom_event', {
    custom_data: {
      event_name: eventName,
      ...customData
    }
  });
};

// ===== 使用示例 =====

/*
// 在产品详情页面
import { trackProductView } from '@/utils/facebookPixelUsage';

useEffect(() => {
  if (product) {
    trackProductView(product);
  }
}, [product]);

// 在添加到购物车按钮点击时
import { trackAddToCart } from '@/utils/facebookPixelUsage';

const handleAddToCart = () => {
  // 添加到购物车的逻辑
  addToCart(product);
  
  // 跟踪Facebook事件
  trackAddToCart(product, quantity);
};

// 在结账页面
import { trackInitiateCheckout } from '@/utils/facebookPixelUsage';

useEffect(() => {
  if (cartItems.length > 0) {
    const totalValue = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const numItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    trackInitiateCheckout(totalValue, numItems);
  }
}, [cartItems]);

// 在购买完成页面
import { trackPurchase } from '@/utils/facebookPixelUsage';

useEffect(() => {
  if (order) {
    trackPurchase(order);
  }
}, [order]);

// 在搜索功能中
import { trackSearch } from '@/utils/facebookPixelUsage';

const handleSearch = (searchTerm) => {
  // 搜索逻辑
  performSearch(searchTerm);
  
  // 跟踪搜索事件
  trackSearch(searchTerm);
};
*/ 