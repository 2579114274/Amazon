import React, { useState, useEffect, useRef } from "react";
import { LocalProduct as Product } from "@/api/localEntities";
import { LocalCartItem as CartItem } from "@/api/localEntities";
import { LocalUser as User } from "@/api/localEntities";
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CreditCard, Sparkles } from "lucide-react";
import { LocalCustomRedirect as CustomRedirect, LocalGeminiSettings } from "@/api/localEntities";
import { pixelTracker } from "@/components/PixelEventTracker";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { GeminiGenerate } from "@/api/integrations";

function sanitizeShortDescription(text) {
  const raw = String(text || '');
  let t = raw
    .replace(/\*\*|__/g, '')
    .replace(/^#+\s*/gm, '')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/\(.*?\)/g, (m) => (m.length <= 30 ? m : ''))
    .replace(/\s+/g, ' ')
    .trim();
  t = t.replace(/^(Short\s*Description|概要|简介)\s*[:：-]?\s*/i, '');
  t = t.replace(/^\d+\)\s*Customer\s*Reviews\s*[:：-]?\s*/i, '');
  t = t.replace(/^\d+\)\s*Review\s*\d*\s*[:：-]?\s*/i, '');
  const markers = [
    /Customer\s+Reviews/i,
    /Reviews?:/i,
    /\d+\)\s*Review/i,
    /\d+\)\s/
  ];
  let cutIdx = -1;
  for (const r of markers) {
    const m = t.search(r);
    if (m >= 0 && (cutIdx === -1 || m < cutIdx)) cutIdx = m;
  }
  if (cutIdx >= 0) t = t.slice(0, cutIdx).trim();
  if (!t) {
    let plain = raw
      .replace(/\*\*|__/g, '')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    const dot = plain.indexOf('.');
    t = (dot > 0 ? plain.slice(0, dot + 1) : plain.slice(0, 120)).trim();
  }
  if (t.length > 120) {
    const dot = t.lastIndexOf('.', 120);
    t = (dot > 60 ? t.slice(0, dot + 1) : t.slice(0, 120)).trim();
  }
  return t;
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const thumbsRef = useRef(null);
  // 移除首屏用户加载，避免未登录重定向
  const [addingToCart, setAddingToCart] = useState(false);
  // purchaseType will now effectively always be "one_time" as "subscribe" option is removed
  const [purchaseType, setPurchaseType] = useState("one_time"); 
  const [sortBy, setSortBy] = useState("highest"); // "highest" | "recent"
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [amazonPayCfg, setAmazonPayCfg] = useState(null);
  const [variantOpen, setVariantOpen] = useState(false);
  const productVariants = (product?.variants || []).filter(Boolean);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  const selectedVariant = productVariants.length > 0 && selectedVariantIndex != null ? productVariants[selectedVariantIndex] : null;
  const [heroImageOverride, setHeroImageOverride] = useState(null);
  const [aiBusy, setAiBusy] = useState(false);
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('admin_auth') === 'ok';
  const [useGemini, setUseGemini] = useState(false);
  const [geminiReady, setGeminiReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const list = await LocalGeminiSettings.list();
        const s = list[0];
        setUseGemini(!!s?.use_for_product_ai);
        setGeminiReady(Boolean(s?.api_key));
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    if (productId) {
      loadProduct(productId);
    }
    loadAmazonPayCfg();
  }, []);

  const loadProduct = async (productId) => {
    try {
      const products = await Product.filter({ id: productId });
      if (products.length > 0) {
        const loadedProduct = products[0];
        setProduct(loadedProduct);
        setSelectedImage(0);
        // Initialize selected variant if variants exist
        if (loadedProduct.variants && loadedProduct.variants.length > 0) {
          setSelectedVariantIndex(0);
          // Set hero image override for the initial variant if it has one
          if (loadedProduct.variants[0].image) {
            setHeroImageOverride(loadedProduct.variants[0].image);
          } else {
            setHeroImageOverride(null);
          }
        } else {
          setSelectedVariantIndex(null); // No variants, no selection
          setHeroImageOverride(null); // No variants, no override
        }
        
        // 发送产品浏览事件
        setTimeout(() => {
          pixelTracker.trackViewContent(loadedProduct);
        }, 1000); // 延迟1秒确保页面完全加载
      }
    } catch (error) {
      console.error("Failed to load product:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAmazonPayCfg = async () => {
    try {
      const recs = await CustomRedirect.filter({ key: "amazon_pay", is_active: true });
      if (recs && recs.length > 0) setAmazonPayCfg(recs[0]);
    } catch (e) {
      // ignore
    }
  };

  const handleAmazonPay = () => {
    if (!amazonPayCfg?.url) return;
    
    // 计算购物车价值
    const base = Number((selectedVariant?.price ?? product?.price) || 39);
    const cartValue = (base * quantity).toFixed(2);
    
    // 发送结账事件 ⭐
    if (product) {
      pixelTracker.trackInitiateCheckout(parseFloat(cartValue));
    }
    
    // 跳转到Amazon Pay
    if (amazonPayCfg.open_in_new_tab) {
      window.open(amazonPayCfg.url, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = amazonPayCfg.url;
    }
  };

  const handleGenerateDescription = async () => {
    if (!product) return;
    setAiBusy(true);
    try {
      let shortDesc = '';
      if (useGemini && geminiReady) {
        const prompt = `Write a concise, catchy short description (<=120 chars) for the product \"${product.name}\", focusing on benefits. Product details (HTML stripped):\n${String(product.description || '').replace(/<[^>]*>/g, '')}`;
        const res = await GeminiGenerate({ prompt });
        shortDesc = sanitizeShortDescription(res.text || '');
      } else {
        // fallback: lightweight heuristic
        const base = String(product.description || product.short_description || product.name || '').replace(/<[^>]*>/g, '').trim();
        shortDesc = sanitizeShortDescription(base);
      }
      await Product.update(product.id, { short_description: shortDesc });
      setProduct(prev => ({ ...prev, short_description: shortDesc }));
      alert('生成并保存成功');
    } catch (e) {
      console.error('生成失败', e);
      alert('生成失败，请重试');
    }
    setAiBusy(false);
  };

  const addToCart = async () => {
    // 按需鉴权：仅在点击购买时尝试获取用户，公开浏览不触发登录
    let currentUser = null;
    try {
      currentUser = await User.me();
    } catch (e) {
      currentUser = null;
    }
    if (!currentUser) {
      alert("Please log in before adding to cart");
      return;
    }
    if (!product) return;
    setAddingToCart(true);
    try {
      await CartItem.create({
        product_id: product.id,
        quantity,
        user_email: currentUser.email,
        purchase_type: "one_time",
      });
      
      // 发送添加到购物车事件
      pixelTracker.trackAddToCart(product);
      
      alert("Added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const scrollThumbs = (dir) => {
    const el = thumbsRef.current;
    if (!el) return;
    const amount = 120 * 3; // Scroll approximately 3 thumbnails at a time
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  const changeImage = (delta) => {
    if (!images || images.length === 0) return;
    const next = (selectedImage + delta + images.length) % images.length;
    setSelectedImage(next);
    setHeroImageOverride(images[next] || null);
  };

  const fallbackHero =
    "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/4d09b0d62_magicspooncom_products_peanut-butter-1-case-4-boxes.png";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[151.19px] pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Skeleton className="h-96 w-full rounded-2xl mb-4" />
              <div className="flex gap-2">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-20 w-20 rounded-lg" />
                  ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-[151.19px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to={createPageUrl("Products")}>
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image_url || fallbackHero];

  return (
    <div className="min-h-screen bg-[#FFEBD6] pt-[96px] md:pt-[151.19px] pb-24 md:pb-0">
      <style>{`
        .right-section { width: 100%; display: flex; justify-content: flex-end; }
        .amazon-pay-btn { width: 100%; height: 50px; background: linear-gradient(to bottom, #FFD700, #FFA500); border: 2px solid #DAA520; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: relative; }
        .amazon-pay-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); background: linear-gradient(to bottom, #FFE55C, #FFB347); }
        .amazon-pay-btn:active { transform: translateY(0); box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .amazon-pay-content { display: flex; align-items: center; gap: 12px; width: 100%; justify-content: space-between; padding: 0 16px; }
        .amazon-s-icon { width: 24px; height: 24px; border: 2px solid #8B4513; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #fff; flex-shrink: 0; margin-top: -7px; }
        .amazon-s-icon .s-letter { font-size: 14px; font-weight: bold; color: #8B4513; font-family: Arial, sans-serif; }
        .amazon-pay-text { display: flex; flex-direction: row; justify-content: center; align-items: flex-start; flex: 1; gap: 6px; }
        .amazon-logo { display: flex; align-items: flex-start; }
        .amazon-logo .amazon-icon { height: 22px; width: auto; object-fit: contain; }
        .pay-text { font-size: 23px; font-weight: bold; color: #000; font-family: Arial, sans-serif; line-height: 1; text-transform: lowercase; margin-top: -7px; }
        .chevron-icon { font-size: 16px; font-weight: bold; color: #000; font-family: Arial, sans-serif; flex-shrink: 0; margin-top: -7px; }
        @media (max-width: 768px) { .right-section { width: 100%; } }
        @media (max-width: 400px) { .amazon-s-icon { display: none; } }
      `}</style>
      {/* 顶部主视觉：左图右购买卡（仿参考图的米色背景） */}
      <section id="product-hero" className="relative py-10 md:py-14" style={{ background: "#FEDEAC" }}>
        {/* 彩色底角装饰（简化版） */}
        <div className="pointer-events-none absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tr from-purple-500 to-pink-500 opacity-30 rounded-tl-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* 左侧：产品主图 */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative">
                <img
                  src={heroImageOverride || images[selectedImage]}
                  alt={product.name}
                  className="mx-auto w-full max-w-[520px] h-[320px] md:h-[440px] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.25)]"
                />
                {images.length > 1 && (
                  <div className="mt-6 relative">
                    <button
                      type="button"
                      onClick={() => changeImage(-1)}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 border border-purple-200 text-[#4A1FB8] rounded-full p-2 shadow hover:bg-white disabled:opacity-50"
                      aria-label="Previous images"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div
                      ref={thumbsRef}
                      className="flex items-center gap-3 overflow-hidden px-10"
                    >
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => { setSelectedImage(index); setHeroImageOverride(images[index] || null); }}
                          className={`w-12 h-12 shrink-0 rounded-full overflow-hidden ring-2 ${
                            selectedImage === index ? "ring-[#5F2FE8]" : "ring-[#5F2FE8]/50"
                          } hover:ring-[#B300FF] transition-all`}
                          aria-label={`View image ${index + 1}`}
                          title={`View image ${index + 1}`}
                        >
                          <img
                            src={image}
                            alt={`${product.name}-${index}`}
                            className="w-full h-full object-cover"
                            draggable={false}
                          />
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => changeImage(1)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 border border-purple-200 text-[#4A1FB8] rounded-full p-2 shadow hover:bg-white disabled:opacity-50"
                      aria-label="Next images"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

            </motion.div>

            {/* 右侧：标题/副标题/评分/描述/按钮/要点 + 购买卡片 */}
            <div className="self-start">
              <div className="mb-5">
                <h1 className="t-heading t-outline text-[#3F0791] text-3xl md:text-4xl font-extrabold">
                  {product.name || "Peanut Butter"}
                </h1>
                {/* <h2 className="t-ant text-[#3F0791] text-lg md:text-xl font-semibold mt-1">1 case (4 boxes)</h2> */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(product.rating || 5)
                            ? "text-[#B300FF] fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-[#3F0791]/80">
                    {(product.reviews_count || 2636).toLocaleString()} reviews
                  </span>
                </div>
                {/* <p className="mt-3 text-[#3F0791] text-sm leading-relaxed">
                  {product.short_description || product.description || "Crunchy, nutty, and perfectly sweet. We’ve reimagined your favorite peanut butter cereal."}
                </p> */}
                {/* removed "View Nutrition Facts" button since the section is deleted */}
                {/* <ul className="mt-4 grid grid-cols-2 gap-2 text-[#3F0791] text-sm font-bold">
                  {["4g Net Carbs", "0g Total Sugar", "14g Complete Protein", "No Artificial Ingredients"].map((txt, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <img
                        src="https://magicspoon.com/cdn/shop/t/667/assets/purple-check.svg?v=7207404648609249851748358445"
                        alt="check"
                        className="w-4 h-4"
                        loading="lazy"
                      />
                      {txt}
                    </li>
                  ))}
                </ul> */}
              </div>

              {/* 购买卡片（保持原有交互与样式） */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.05 }}
              >
                <div className="relative bg-transparent border-0 rounded-none p-0 shadow-none">
                  {(() => {
                    const basePrice = Number((selectedVariant?.price ?? product.price) || 39);
                    const oneTime = basePrice;
                    // Assuming a standard "case" contains 20 servings for per-serving calculation reference
                    const perServing = (v) => (v / 20).toFixed(2);
                    return (
                      <>
                        {/* Step 1 */}
                        <div className="text-xs font-bold tracking-wider text-[#4A1FB8] uppercase mb-2">
                          1: Choose your flavor
                        </div>
                        <div className="relative z-40"> {/* z-40 防止被遮挡 */}
                          <button
                            type="button"
                            onClick={() => setVariantOpen(v => !v)}
                            className="w-full rounded-full border-2 border-[#5F2FE8] bg-white text-[#4A1FB8] flex items-center justify-between pl-3 pr-4 py-3 mb-2 md:mb-3"
                          >
                            <span className="flex items-center gap-3 font-extrabold">
                              <span className="inline-flex h-8 w-8 rounded-full overflow-hidden ring-2 ring-[#5F2FE8] bg-white">
                                <img
                                  src={
                                    (selectedVariant?.image) ||
                                    product.image_url ||
                                    (product.gallery && product.gallery[0]) ||
                                    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200"
                                  }
                                  alt="Flavor"
                                  className="w-full h-full object-cover"
                                />
                              </span>
                              <span className="uppercase">
                                {selectedVariant?.option1 ||
                                  selectedVariant?.sku ||
                                  (selectedVariant?.attributes ? Object.values(selectedVariant.attributes).join(" / ") : null) ||
                                  product.name ||
                                  "Flavor"}
                              </span>
                            </span>
                            <ChevronDown className={`w-5 h-5 text-[#4A1FB8] transition-transform ${variantOpen ? "rotate-180" : ""}`} />
                          </button>
                          {variantOpen && (
                            <div className="absolute left-0 right-0 mt-2 bg-white border border-purple-200 rounded-2xl shadow-xl max-h-64 overflow-auto p-2">
                              {productVariants.length > 0 ? (
                                productVariants.map((v, idx) => {
                                  const label =
                                    v.option1 ||
                                    v.sku ||
                                    (v.attributes ? Object.values(v.attributes).join(" / ") : `Variant ${idx + 1}`);
                                  return (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => {
                                        setSelectedVariantIndex(idx);
                                        setVariantOpen(false);
                                        if (v.image) setHeroImageOverride(v.image);
                                        else setHeroImageOverride(null); // Clear override if variant has no specific image
                                      }}
                                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-purple-50 text-left ${
                                        selectedVariantIndex === idx ? "bg-purple-50 ring-1 ring-purple-200" : ""
                                      }`}
                                    >
                                      <span className="inline-flex h-8 w-8 rounded-full overflow-hidden ring-2 ring-[#5F2FE8] bg-white">
                                        <img
                                          src={v.image || product.image_url || (product.gallery && product.gallery[0]) || ""}
                                          alt={label}
                                          className="w-full h-full object-cover"
                                        />
                                      </span>
                                      <div className="flex-1">
                                        <div className="font-bold text-[#4A1FB8] uppercase">{label}</div>
                                        {typeof v.price === "number" && (
                                          <div className="text-xs text-[#4A1FB8]/70">${Number(v.price).toFixed(2)}</div>
                                        )}
                                      </div>
                                    </button>
                                  );
                                })
                              ) : (
                                <div className="px-3 py-2 text-sm text-gray-500">暂无可选变体</div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Step 2 */}
                        <div className="text-xs font-bold tracking-wider text-[#4A1FB8] uppercase mb-2">
                          2: Choose your frequency
                        </div>

                        {/* One-time purchase option */}
                        <button
                          type="button"
                          onClick={() => setPurchaseType("one_time")}
                          className={`w-full rounded-2xl border-2 px-4 py-3 md:py-4 mb-3 transition-all flex items-center justify-between ${
                            purchaseType === "one_time"
                              ? "border-[#5F2FE8] bg-white shadow-[0_8px_24px_rgba(82,34,227,0.18)]"
                              : "border-[#CFC7FF] bg-white/60 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center">
                            <span
                              className={`mr-3 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#5F2FE8] ${
                                purchaseType === "one_time" ? "bg-[#5F2FE8]" : "bg-white"
                              }`}
                            >
                              {purchaseType === "one_time" && <span className="h-2 w-2 rounded-full bg-white" />}
                            </span>
                            <span className="uppercase font-extrabold text-[#4A1FB8]">One-time purchase:</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="h-6 w-px bg-[#CFC7FF]" />
                            <div className="text-right min-w-[110px]">
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-[#4A1FB8] font-extrabold">${oneTime.toFixed(2)}</span>
                                {product.original_price && 
                                  <span className="text-sm text-gray-500 line-through">${product.original_price}</span>
                                }
                              </div>
                              <div className="text-xs text-[#4A1FB8]/70">${perServing(oneTime)} / serving</div>
                            </div>
                          </div>
                        </button>

                        {/* subscribe option removed as requested */}

                        {/* Quantity + CTA */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center rounded-full border-2 border-[#5F2FE8] text-[#4A1FB8] overflow-hidden">
                            <button
                              type="button"
                              disabled
                              className="px-3 py-2 opacity-50 cursor-not-allowed"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 font-bold">{quantity}</span>
                            <button
                              type="button"
                              disabled
                              className="px-3 py-2 opacity-50 cursor-not-allowed"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="right-section">
                            <button
                              type="button"
                              onClick={handleAmazonPay}
                              className="amazon-pay-btn"
                              aria-label={amazonPayCfg?.label || "Amazon Pay"}
                              title={amazonPayCfg?.label || "Amazon Pay"}
                            >
                              <div className="amazon-pay-content">
                                <div className="amazon-s-icon"><span className="s-letter">S</span></div>
                                <div className="amazon-pay-text">
                                  <div className="amazon-logo"><img src="/images/amazon.png" alt="Amazon" className="amazon-icon" /></div>
                                  <span className="pay-text">pay</span>
                                </div>
                                <div className="chevron-icon">&gt;&gt;</div>
                              </div>
                            </button>
                          </div>
                        </div>

                        <p className="mt-3 text-xs text-[#4A1FB8]/80">
                          Try risk-free, 100% happiness guaranteed.{" "}
                          <a href="#" className="underline">See terms of use.</a>
                        </p>
                      </>
                    );
                  })()}

                  {/* guarantees row removed as requested */}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        {/* 英雄区底部装饰（移动端也适度展示） */}
        {/* 右下角装饰圆形麦圈图像（已保留在上一版） */}
        <img
          src="https://magicspoon.com/cdn/shop/t/667/assets/MS-PB-ASSET3_2x_e2ddf730-f3c0-4840-b7a2-a7aefaa34c71-202409.png?v=1673988958&auto=format,compress&w=800"
          alt=""
          className="md:hidden pointer-events-none select-none absolute -bottom-10 right-4 w-28"
          aria-hidden="true"
          loading="lazy"
        />

        {/* 底部左右彩色帐篷装饰（SVG 实现，参照参考图） */}
        <svg
          className="hidden md:block pointer-events-none absolute bottom-6 left-6 w-40 h-auto"
          viewBox="0 0 160 120" aria-hidden="true">
          <defs>
            <linearGradient id="tentL" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FF60C1" />
              <stop offset="100%" stopColor="#6B2FE8" />
            </linearGradient>
          </defs>
          <rect x="10" y="70" width="140" height="30" fill="#FFF" />
          <polygon points="80,10 150,70 10,70" fill="url(#tentL)" />
          <rect x="30" y="70" width="16" height="30" fill="#F59E0B" />
          <rect x="50" y="70" width="16" height="30" fill="#6B2FE8" />
          <rect x="70" y="70" width="16" height="30" fill="#FFFFFF" />
          <rect x="90" y="70" width="16" height="30" fill="#FF60C1" />
          <rect x="110" y="70" width="16" height="30" fill="#10B981" />
        </svg>
        <svg
          className="hidden md:block pointer-events-none absolute bottom-6 right-6 w-40 h-auto"
          viewBox="0 0 160 120" aria-hidden="true">
          <defs>
            <linearGradient id="tentR" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FF60C1" />
              <stop offset="100%" stopColor="#6B2FE8" />
            </linearGradient>
          </defs>
          <rect x="10" y="70" width="140" height="30" fill="#FFF" />
          <polygon points="80,10 150,70 10,70" fill="url(#tentR)" />
          <rect x="30" y="70" width="16" height="30" fill="#F59E0B" />
          <rect x="50" y="70" width="16" height="30" fill="#6B2FE8" />
          <rect x="70" y="70" width="16" height="30" fill="#FFFFFF" />
          <rect x="90" y="70" width="16" height="30" fill="#FF60C1" />
          <rect x="110" y="70" width="16" height="30" fill="#10B981" />
        </svg>
      </section>

      {/* removed ingredients bowl section (blue gradient) as requested */}

      {/* Ingredients section removed as requested */}

      {/* Nutrition Facts section removed as requested */}

      {/* 评价区（黄绿渐变仿参考） */}
      <section className="py-16" style={{ background: "linear-gradient(180deg, #FFF3B0 0%, #D4FFB0 100%)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {(() => {
            const avg = Number(product?.rating ?? 4.6);
            const count = Number(product?.reviews_count ?? 2636);
            const fullStars = Math.round(avg);
            const reviews = [
              {
                name: "STEPHEN R.",
                // title: "MY FAVORITE",
                body: " The taste is great, my whole family loves it. It's a great value, and I'll be buying this often!",
                rating: 5,
                when: "about 13 hours ago",
                ts: Date.now() - 13 * 60 * 60 * 1000,
              },
              {
                name: "ANDREW C.",
                // title: "CRUNCHY",
                body: " It's delicious, and the portion is generous. It's exactly as described, and I wasn't disappointed.",
                rating: 5,
                when: "13 days ago",
                ts: Date.now() - 14 * 24 * 60 * 60 * 1000,
              },
              {
                name: "CLAUDIA S.",
                // title: "GREAT TASTE BUT STICKY",
                body:
                  "The packaging is excellent, no damage. The texture is crispy/soft, and delicious.",
                rating: 5,
                when: "14 days ago",
                ts: Date.now() - 15 * 24 * 60 * 60 * 1000,
              },
              {
                name: "Anisia",
                // title: "GREAT TASTE BUT STICKY",
                body:  " I've bought from this store many times, and the quality is always consistent. I trust this store.",
                rating: 5,
                when: "14 days ago",
                ts: Date.now() - 15 * 24 * 60 * 60 * 1000,
              },
              {
                name: "	Rosa",
                // title: "GREAT TASTE BUT STICKY",
                body: " It's good, delicious, and the price is great. I'll definitely be back.",
                rating: 5,
                when: "15 days ago",
                ts: Date.now() - 15 * 24 * 60 * 60 * 1000,
              },
            ];
            const sorted =
              sortBy === "highest"
                ? [...reviews].sort((a, b) => b.rating - a.rating)
                : [...reviews].sort((a, b) => b.ts - a.ts);
            return (
              <>
                {/* Header: average + stars + count + sorter */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="text-4xl md:text-5xl font-extrabold text-[#4A1FB8]">{avg.toFixed(1)}</div>
                    <div className="mt-1 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < fullStars ? "text-[#B300FF] fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <div className="mt-1 text-[#4A1FB8] opacity-90 text-sm">
                      Based on {count.toLocaleString()} reviews
                    </div>
                  </div>
                  <div className="shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="rounded-full border-2 border-[#5F2FE8] text-[#4A1FB8] bg-white hover:bg-white/90 px-4 py-2 h-auto"
                        >
                          {sortBy === "highest" ? "Highest Rating" : "Most Recent"}
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSortBy("highest")}>Highest Rating</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("recent")}>Most Recent</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Review list */}
                <div className="space-y-6">
                  {sorted.map((r, idx) => (
                    <div key={idx} className="bg-white p-6 md:p-7 rounded-sm shadow-sm">
                      <div className="flex items-center justify-between text-xs font-bold tracking-wide text-[#4A1FB8] uppercase">
                        <div className="opacity-90">
                          {r.name} <span className="opacity-70">·</span> <span className="opacity-70">Verified Buyer</span>
                        </div>
                        <div className="opacity-70">{r.when}</div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < r.rating ? "text-[#B300FF] fill-current" : "text-gray-300"}`} />
                          ))}
                        </div>
                        <div className="mt-3 h-[2px] bg-[#5F2FE8]" />
                      </div>
                      <h4
                        className="mt-4 text-xl md:text-2xl font-extrabold uppercase tracking-wide"
                        style={{
                          WebkitTextStroke: "2px #4A1FB8",
                          WebkitTextFillColor: "transparent",
                          color: "transparent",
                        }}
                      >
                        {r.title}
                      </h4>
                      <p className="mt-3 text-sm text-gray-700">{r.body}</p>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* FAQ section - purple layout with outlined heading and collapsible rows */}
      {/* <section className="py-16 bg-[#3B1DC9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl md:text-4xl font-extrabold mb-8 uppercase tracking-wide"
            style={{
              WebkitTextStroke: "2px #FFFFFF",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            Frequently Asked Questions
          </h2>

          <div className="divide-y divide-white/50">
            {[
              {
                q: "What kind of sorcery is this? Where did all the carbs and sugar go?",
                a: "We've spent years perfecting our recipes in our quest to reimagine our favorite childhood breakfasts and snacks, swapping sugar and grains for high quality protein sources and natural sweeteners. Try our Cereal, Treats, and Granola to fuel your own kind of high-protein, gluten-free, keto-friendly magic!",
              },
              {
                q: "What are net carbs?",
                a: "Not all carbs are created equal. Fiber and (most) natural sweeteners don’t affect your blood sugar, so they’re stripped out to get “net carbs,” which you can think of as the active carbs that affect your body. In our case, net carbs = total carbs - allulose - fiber.",
              },
              {
                q: "What does Magic Spoon taste like?",
                a: "Whether it's our cereal, treats, or granola, Magic Spoon tastes just like you remember—only better. If you’re curious about a specific flavor, check out the flavor page and the reviews! If you still need help, feel free to email us.",
              },
              {
                q: "Are Magic Spoon products high protein?",
                a: "Yes! Just one serving of Magic Spoon Cereal, Treats, or Granola has 11–14g of high-quality protein—about 22–26% of an average daily protein intake. Magic Spoon is also keto-friendly, gluten-free, and grain-free.",
              },
              {
                q: "Why is this more expensive than “regular” breakfast options?",
                a: "At $1.95 per bowl of cereal, $2.78 per bowl of granola, or $2.43 per Treat, our products are more cost-effective than many other typical breakfast options (not to mention your morning coffee). Making high-protein products means using more expensive ingredients than sugar, corn, and wheat—it's part of our commitment to bring you the best.",
              },
              {
                q: "How often do you release new flavors?",
                a: "New flavors drop every few months—and sometimes sooner! Be the first to know what's coming by signing up for our newsletter or SMS list.",
              },
              {
                q: "What is the nutritional content of your products?",
                a: "Full nutritional info for any product can be found on its product page.",
              },
            ].map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span className="text-white text-base md:text-lg">{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-white transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pt-4 text-white/90 text-sm leading-7">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <a
            href="https://magicspoon.com/pages/faq"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-8 text-white underline font-semibold"
          >
            VIEW MORE FAQ'S ›
          </a>
        </div>
      </section> */}

      {/* Mobile sticky purchase bar */}
      {product && (
        (() => {
          const base = Number((selectedVariant?.price ?? product.price) || 39);
          // Only one-time purchase option is available now
          const curr = base;
          const total = (curr * quantity).toFixed(2);
          return (
            <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-purple-100">
              <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs text-[#4A1FB8] font-semibold truncate">
                    {"One-time purchase"}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-[#4A1FB8]">${total}</span>
                    {product.original_price && 
                      <span className="text-sm text-gray-500 line-through">${product.original_price}</span>
                    }
                  </div>
                </div>
                <button
                  onClick={handleAmazonPay}
                  className="amazon-pay-btn flex-1 h-12 px-4"
                >
                  <div className="amazon-pay-content">
                    <div className="amazon-s-icon"><span className="s-letter">S</span></div>
                    <div className="amazon-pay-text">
                      <div className="amazon-logo"><img src="/images/amazon.png" alt="Amazon" className="amazon-icon" /></div>
                      <span className="pay-text">pay</span>
                    </div>
                    <div className="chevron-icon">&gt;&gt;</div>
                  </div>
                </button>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
}
