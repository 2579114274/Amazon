import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { trackProductView, trackAddToCart, trackAddToWishlist } from '@/utils/facebookPixelUsage';

export default function ProductCard({ product, onAddToCart, onViewDetails }) {
  const handleViewDetails = () => {
    // 跟踪产品查看事件
    trackProductView(product);
    
    // 执行原有的查看详情逻辑
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  const handleAddToCart = () => {
    // 跟踪添加到购物车事件
    trackAddToCart(product, 1);
    
    // 执行原有的添加到购物车逻辑
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleAddToWishlist = () => {
    // 跟踪添加到愿望清单事件
    trackAddToWishlist(product);
    
    // 这里可以添加愿望清单逻辑
    console.log('添加到愿望清单:', product.name);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onClick={handleViewDetails}
            style={{ cursor: 'pointer' }}
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white/80 hover:bg-white"
              onClick={handleViewDetails}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white/80 hover:bg-white"
              onClick={handleAddToWishlist}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          {product.badge && (
            <Badge className="absolute top-2 left-2">
              {product.badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
          {product.name}
        </CardTitle>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            添加到购物车
          </Button>
          <Button
            variant="outline"
            onClick={handleViewDetails}
          >
            查看详情
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// 使用示例：
/*
import ProductCard from '@/components/ProductCard';

const product = {
  id: 'product-123',
  name: 'Magic Spoon 谷物',
  price: 29.99,
  originalPrice: 39.99,
  description: '美味的健康谷物，无糖添加',
  image: '/images/product.jpg',
  category: '谷物',
  badge: '热销'
};

function ProductList() {
  const handleAddToCart = (product) => {
    // 添加到购物车的逻辑
    console.log('添加到购物车:', product);
  };

  const handleViewDetails = (product) => {
    // 查看详情的逻辑
    console.log('查看详情:', product);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProductCard
        product={product}
        onAddToCart={handleAddToCart}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}
*/ 