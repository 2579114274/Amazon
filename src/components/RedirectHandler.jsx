import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LocalCustomRedirect } from '@/api/localEntities';

export default function RedirectHandler({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        console.log('RedirectHandler: Checking redirect for path:', location.pathname);
        
        // 获取所有301重定向规则
        const redirects = await LocalCustomRedirect.filter({ 
          redirect_type: '301', 
          is_active: true 
        });

        console.log('RedirectHandler: Found redirects:', redirects);

        // 查找匹配当前路径的重定向规则
        let matchingRedirect = redirects.find(redirect => {
          const fromPath = redirect.from_path;
          if (!fromPath) return false;
          
          console.log(`RedirectHandler: Comparing "${fromPath}" with "${location.pathname}"`);
          
          // 精确匹配
          if (fromPath === location.pathname) return true;
          
          // 如果配置的是根路径 "/"，也匹配空路径
          if (fromPath === '/' && (location.pathname === '/' || location.pathname === '')) return true;
          
          return false;
        });
        
        // 特殊处理：检查/product/:id格式的路由
        if (!matchingRedirect) {
          const productMatch = location.pathname.match(/^\/product\/(\d+)$/i);
          if (productMatch && productMatch[1]) {
            console.log('RedirectHandler: Matched /product/:id format');
            const productId = productMatch[1];
            // 使用window.location.replace进行硬重定向，确保URL正确更新
            window.location.replace(`/ProductDetail?id=${productId}`);
            return;
          }
        }

        if (matchingRedirect) {
          const targetUrl = matchingRedirect.url;
          console.log('RedirectHandler: Redirecting to:', targetUrl);
          
          // 判断是外部链接还是内部路径
          if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
            // 外部链接，使用 window.location.replace 实现301重定向
            console.log('RedirectHandler: External redirect');
            window.location.replace(targetUrl);
          } else {
            // 内部路径，使用 navigate 并替换历史记录
            console.log('RedirectHandler: Internal redirect');
            navigate(targetUrl, { replace: true });
          }
        } else {
          console.log('RedirectHandler: No matching redirect found');
        }
      } catch (error) {
        console.error('RedirectHandler: Failed to check redirects:', error);
      }
    };

    // 添加延迟确保数据加载完成
    const timer = setTimeout(checkRedirect, 100);
    return () => clearTimeout(timer);
  }, [location.pathname, navigate]);

  return children;
}