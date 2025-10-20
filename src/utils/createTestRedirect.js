import { LocalCustomRedirect } from '@/api/localEntities';

export async function createTestRedirect() {
  try {
    // 先清理可能存在的重定向规则
    const existingRedirects = await LocalCustomRedirect.list();
    console.log('Existing redirects:', existingRedirects);
    
    // 删除所有现有的根路径重定向
    for (const redirect of existingRedirects) {
      if (redirect.from_path === '/' && redirect.redirect_type === '301') {
        await LocalCustomRedirect.delete(redirect.id);
        console.log('Deleted existing redirect:', redirect);
      }
    }
    
    // 创建新的重定向规则
    const newRedirect = await LocalCustomRedirect.create({
      redirect_type: '301',
      from_path: '/',
      url: '/Products',
      label: '首页重定向到产品页',
      is_active: true,
      open_in_new_tab: false,
      note: '手动创建的测试重定向：/ -> /Products'
    });
    
    console.log('Created new redirect:', newRedirect);
    
    // 验证创建结果
    const allRedirects = await LocalCustomRedirect.list();
    console.log('All redirects after creation:', allRedirects);
    
    return newRedirect;
  } catch (error) {
    console.error('Failed to create test redirect:', error);
    throw error;
  }
}

export default createTestRedirect; 