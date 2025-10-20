import React, { useState, useEffect } from 'react';
import { LocalCustomRedirect } from '@/api/localEntities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugRedirect() {
  const [redirects, setRedirects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRedirects();
  }, []);

  const loadRedirects = async () => {
    try {
      const allRedirects = await LocalCustomRedirect.list();
      setRedirects(allRedirects);
      console.log('Debug: All redirects:', allRedirects);
    } catch (error) {
      console.error('Debug: Failed to load redirects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTestRedirect = async () => {
    try {
      await LocalCustomRedirect.create({
        redirect_type: '301',
        from_path: '/',
        url: '/Products',
        label: '调试重定向',
        is_active: true,
        open_in_new_tab: false,
        note: '调试创建的重定向规则'
      });
      console.log('Debug: Created test redirect');
      loadRedirects();
    } catch (error) {
      console.error('Debug: Failed to create redirect:', error);
    }
  };

  const testRedirect = () => {
    console.log('Debug: Testing redirect...');
    window.location.href = '/';
  };

  if (loading) {
    return <div>Loading redirects...</div>;
  }

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>重定向调试</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">当前重定向规则:</h3>
            {redirects.length === 0 ? (
              <p>没有重定向规则</p>
            ) : (
              <ul className="list-disc pl-5">
                {redirects.map((redirect, index) => (
                  <li key={index} className="text-sm">
                    {redirect.redirect_type}: {redirect.from_path} → {redirect.url} 
                    ({redirect.is_active ? '启用' : '禁用'})
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="space-x-2">
            <Button onClick={createTestRedirect}>创建测试重定向</Button>
            <Button onClick={testRedirect} variant="outline">测试重定向</Button>
            <Button onClick={loadRedirects} variant="outline">刷新</Button>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">
              当前路径: {window.location.pathname}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 