import { LocalCustomRedirect } from '@/api/localEntities';

export async function setupDefaultRedirects() {
  try {
    // 检查是否已经存在从根路径到/products的重定向
    const existingRedirects = await LocalCustomRedirect.filter({
      redirect_type: '301',
      from_path: '/'
    });

    // 如果不存在，则创建默认重定向
    if (existingRedirects.length === 0) {
      await LocalCustomRedirect.create({
        redirect_type: '301',
        from_path: '/',
        url: '/products',
        label: '首页重定向',
        is_active: true,
        open_in_new_tab: false,
        note: '自动创建的默认重定向：将首页访问重定向到产品页面'
      });
      console.log('Default redirect created: / -> /products');
    }
  } catch (error) {
    console.error('Failed to setup default redirects:', error);
  }
}

// 在应用启动时调用此函数
export default setupDefaultRedirects; 