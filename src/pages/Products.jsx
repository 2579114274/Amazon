
import React, { useState, useEffect, useMemo } from "react";
import { LocalProduct as Product } from "@/api/localEntities";
import { LocalCategory as Category } from "@/api/localEntities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // sortBy is kept but its usage in the outline is removed
  const [categoryOptions, setCategoryOptions] = useState([]); // 来自分类管理的分类
  const [currentImageIndex, setCurrentImageIndex] = useState({}); // 跟踪每个产品的当前图片索引

  useEffect(() => {
    loadProducts();
  }, [sortBy]); // Only sortBy is a dependency now, category filtering is client-side

  // 初始从 URL 参数读取分类（如 ?category=cereal）
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get("category");
    if (cat) setSelectedCategory(cat);
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const list = await Category.list();
      const actives = (list || []).filter(c => c.is_active !== false);
      actives.sort(
        (a, b) =>
          (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
          String(a.name || "").localeCompare(String(b.name || ""))
      );
      setCategoryOptions(
        actives.map(c => ({ id: c.id, name: c.name, slug: c.slug }))
      );
    } catch (e) {
      console.error("Failed to load categories:", e);
      setCategoryOptions([]);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const sortOrder =
      sortBy === "price_low" ?
      "price" :
      sortBy === "price_high" ?
      "-price" :
      sortBy === "rating" ?
      "-rating" :
      "-created_date";
      // Fetch all products (or a predefined large amount) and then filter by category on the frontend
      const data = await Product.filter({}, sortOrder, 50);
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const matchesCategory = (product, key) => {
    if (!product) return false;
    if (key === "all") return true;
    const slug = String(product.category || "").toLowerCase();
    const tags = (product.tags || []).map(t => String(t).toLowerCase());
    const k = String(key).toLowerCase();
    return slug === k || tags.includes(k);
  };

  // 获取产品的图片数组
  const getProductImages = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    if (product.gallery && product.gallery.length > 0) {
      return product.gallery;
    }
    if (product.image_url) {
      return [product.image_url];
    }
    return ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600"];
  };

  // 切换产品图片
  const switchProductImage = (productId, newIndex) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: newIndex
    }));
  };

  const filteredProducts = useMemo(
    () => products.filter((p) => matchesCategory(p, selectedCategory)),
    [products, selectedCategory]
  );

  // Insert Bundle Card at index 3 (0-indexed) of the filtered products
  const withBundleCard = useMemo(() => {
    const items = [...filteredProducts];
    const shouldInsert = false; // Hide the bundle card as requested
    if (shouldInsert) {
      items.splice(3, 0, { __bundleCard: true, id: 'bundle-promo' }); // Add a unique ID for key prop
    }
    return items;
  }, [filteredProducts]);

  // 分类按钮：固定“SHOP ALL” + 分类管理的分类（按排序/名称）
  const categories = useMemo(() => ([
    { value: "all", label: "SHOP ALL" },
    // ...categoryOptions.map(c => ({
    //   value: c.slug,
    //   label: String(c.name || "").toUpperCase()
    // }))
  ]), [categoryOptions]);

  // The sort options are implicitly removed by removing the Select component
  // as per the outline, but keeping the state and loadProducts logic for sortBy.

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[151.19px] pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Skeleton for the top gradient banner */}
          <Skeleton className="h-12 mb-8 rounded-xl bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-300" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(12).fill(0).map((_, i) =>
            <div key={i} className="bg-white rounded-2xl p-4 shadow-lg">
                <Skeleton className="h-48 w-full rounded-xl mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-8 w-full" />
              </div>
            )}
          </div>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[151.19px] pb-8">
      {/* 顶部渐变横幅 + 标题 */}
      <div
        style={{
          background:
          "linear-gradient(270deg, rgba(153, 223, 255, 1) 35%, rgba(221, 203, 255, 1) 50%, rgba(255, 228, 179, 1) 65%)"
        }}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-5 text-center">
            <h1
              className="inline-block text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide uppercase"
              style={{
                color: "transparent",
                WebkitTextFillColor: "transparent",
                WebkitTextStrokeWidth: "2px",
                WebkitTextStrokeColor: "#3f0791"
              }}>

              EXPLORE OUR PRODUCTS
            </h1>
          </div>
        </div>
      </div>

      {/* 整段内容渐变背景（与参考图一致的浅紫过渡） */}
      <div
        className="w-full"
        style={{
          background: "linear-gradient(180deg, #E9DDFF 0%, #DAD7FF 100%)"
        }}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Category Capsules */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>

            {categories.map((c) => {
              const active = selectedCategory === c.value;
              return (
                <button
                  key={c.value}
                  onClick={() => setSelectedCategory(c.value)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-sm font-extrabold tracking-wide uppercase transition-all ${
                  active ?
                  "bg-gradient-to-r from-[#FF3ECF] to-[#5F2FE8] text-white border-2 border-transparent shadow-md" :
                  "bg-transparent text-[#3f0791] border-2 border-[#3f0791] hover:bg-white/10"}`
                  }>

                  {c.label}
                </button>);

            })}
          </motion.div>

          {/* Products Grid */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {withBundleCard.map((item, index) =>
            <motion.div
              key={item.__bundleCard ? `bundle-${index}` : item.id}
              className="group rounded-2xl overflow-hidden transition-all duration-300 h-[466.84px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}>

                {item.__bundleCard ?
              <div className="relative h-full bg-gradient-to-b from-[#592DEB] to-[#FF35C6]">
                    {/* Desktop images (default + hover) */}
                    <img
                  src="https://magicspoon.imgix.net/files/shop-all-byob.png?v=1718406065&auto=format,compress&w=1200"
                  alt="Build Your Own"
                  className="hidden md:block absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-100 group-hover:opacity-0" />

                    <img
                  src="https://magicspoon.imgix.net/files/shop-all-byob-hover.png?v=1718406064&auto=format,compress&w=1200"
                  alt="Build Your Own"
                  className="hidden md:block absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

                    {/* Mobile images (default + hover) */}
                    <img
                  src="https://magicspoon.imgix.net/files/shop-all-byob-mobile.png?v=1718406064&auto=format,compress&w=1200"
                  alt="Build Your Own"
                  className="block md:hidden absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-100 group-hover:opacity-0" />

                    <img
                  src="https://magicspoon.imgix.net/files/shop-all-byob-hover-mobile.png?v=1718406064&auto=format,compress&w=1200"
                  alt="Build Your Own"
                  className="block md:hidden absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

                    {/* Bottom CTA */}
                    <div className="absolute left-0 right-0 bottom-4 md:bottom-5 flex justify-center px-4">
                      <Link to={createPageUrl("Products")}>
                        <Button className="rounded-full bg-white text-[#5F2FE8] hover:bg-white/90 font-extrabold uppercase tracking-wide px-6 py-2 h-auto shadow-md">
                          GET STARTED
                        </Button>
                      </Link>
                    </div>
                  </div> :

              <div className="h-full flex flex-col">
                    {(item.is_bestseller || item.is_featured) &&
                <img
                  src={
                  item.is_bestseller ?
                  "https://magicspoon.imgix.net/files/best-seller-badge.png?v=1717791043&auto=format,compress&w=120" :
                  "https://magicspoon.imgix.net/files/MS_BYO_New_Badge.svg?v=1676482418&auto=format,compress&w=120"
                  }
                  alt={item.is_bestseller ? "Best Seller" : "New"}
                  className="absolute top-3 left-3 w-10 h-10" />

                }
                    {/* 产品图 + 装饰小圆点 */}
                    <div className="relative overflow-hidden pt-4 px-4">
                      <Link to={createPageUrl(`ProductDetail?id=${item.id}`)} className="block">
                        <div className="relative rounded-xl bg-[#FDFBFF] cursor-pointer">
                          {(() => {
                            const images = getProductImages(item);
                            const currentIndex = currentImageIndex[item.id] || 0;
                            return (
                              <img
                                src={images[currentIndex]}
                                alt={item.name}
                                loading={index < 8 ? "eager" : "lazy"}
                                decoding="async"
                                fetchpriority={index < 4 ? "high" : "auto"}
                                width="600"
                                height="192"
                                className="w-full h-48 object-contain rounded-xl" />
                            );
                          })()}

                          {/* 悬浮渐变叠层 */}
                          <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-tr from-[#5F2FE8]/25 via-[#B300FF]/20 to-[#FF3ECF]/25" />
                        </div>
                      </Link>
                      {/* 可点击的轮播小圆点 */}
                        <div className="flex items-center justify-center gap-2 py-3" aria-hidden>
                        {(() => {
                          const images = getProductImages(item);
                          const currentIndex = currentImageIndex[item.id] || 0;
                          return images.slice(0, 4).map((_, i) => (
                            <button
                              key={i}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                switchProductImage(item.id, i);
                              }}
                              className={`h-2 w-2 rounded-full transition-all duration-200 ${
                                i === currentIndex 
                                  ? "bg-[#4A1FB8] scale-110" 
                                  : "bg-[#4A1FB8]/30 hover:bg-[#4A1FB8]/50"
                              }`}
                            />
                          ));
                        })()}
                      </div>
                    </div>
                    {/* 文字与价格 + CTA 底部对齐 */}
                    <div className="pb-4 px-4 flex-1 flex flex-col">
                      <h3 className="text-center font-extrabold text-[#4A1FB8] leading-tight text-xl mb-2">
                        {item.name}
                      </h3>
                      <div className="mt-auto">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-lg font-extrabold text-[#4A1FB8]">${item.price}</span>
                          {item.original_price &&
                      <span className="text-sm text-gray-500 line-through">${item.original_price}</span>
                      }
                        </div>
                        <Link to={createPageUrl(`ProductDetail?id=${item.id}`)}>
                          <Button
                        className={`w-full h-11 rounded-full font-extrabold ${item.stock === 0 ? "bg-white text-gray-400 border border-white/60 cursor-not-allowed" : "bg-white text-[#5F2FE8] hover:bg-white/90"}`}
                        disabled={item.stock === 0}>

                            {item.stock === 0 ? "OUT OF STOCK" :
                        <>
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                SHOP NOW
                              </>
                        }
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
              }
              </motion.div>
            )}
          </div>

          {/* No Products Found State */}
          {withBundleCard.filter((i) => !i.__bundleCard).length === 0 && // Check only actual products
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}>

              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-gray-400" /> {/* Changed icon */}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try browsing other categories</p>
              <Button onClick={() => setSelectedCategory("all")}> {/* Reset to "all" category */}
                Reset Filters
              </Button>
            </motion.div>
          }
        </div> {/* 结束：内容区域渐变背景 */}
      </div>
    </div>);

}
