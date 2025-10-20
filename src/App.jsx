import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { useEffect } from 'react'
import setupDefaultRedirects from '@/utils/setupDefaultRedirects'
import testRedirectSetup from '@/utils/testRedirects'
import createTestRedirect from '@/utils/createTestRedirect'

function App() {
  useEffect(() => {
    const initRedirects = async () => {
      try {
        console.log('App: Initializing redirects...');
        
        // 先尝试设置默认重定向
        await setupDefaultRedirects();
        
        // 然后手动创建测试重定向（确保重定向存在）
        await createTestRedirect();
        
        // 测试重定向设置
        setTimeout(() => {
          testRedirectSetup();
        }, 500);
        
        console.log('App: Redirect initialization completed');
      } catch (error) {
        console.error('App: Failed to initialize redirects:', error);
      }
    };
    
    initRedirects();
  }, []);

  return (
    <>
      <Pages />
      <Toaster />
    </>
  )
}

export default App 