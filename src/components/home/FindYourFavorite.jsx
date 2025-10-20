
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Gift, Sparkles, Package, Calendar } from "lucide-react";

export default function FindYourFavorite() {
  const items = [
    {
      label: "Custom Bundle",
      img: "https://magicspoon.imgix.net/files/custom-case.png?v=1643411934&width=474&auto=format,compress",
      to: createPageUrl("Products")
    },
    {
      label: "Honey Almond Granola",
      img: "https://magicspoon.imgix.net/files/MS_G_PDP_NEW_V2_HA.png?v=1735833313&width=474&auto=format,compress",
      to: createPageUrl("Products?category=granola")
    },
    {
      label: "Mixed Berry Granola",
      img: "https://magicspoon.imgix.net/files/MS_G_PDP_NEW_V2_MB.png?v=1735833944&width=474&auto=format,compress",
      to: createPageUrl("Products?category=granola")
    },
    {
      label: "Peanut Butter Granola",
      img: "https://magicspoon.imgix.net/files/MS_G_PDP_NEW_V2_PB.png?v=1735833688&width=474&auto=format,compress",
      to: createPageUrl("Products?category=granola")
    },
    {
      label: "Fruity Cereal",
      img: "https://magicspoon.imgix.net/products/MS_FRUITY_RENDERING_FRONT.png?v=1682304928&width=474&auto=format,compress",
      to: createPageUrl("Products?category=cereal")
    },
    {
      label: "Cocoa Cereal",
      img: "https://magicspoon.imgix.net/files/MS-Front-Cocoa_2x-132329_79f7505d-cc94-48dc-9c70-014dec408a42-463410.png?v=1735834843&width=474&auto=format,compress",
      to: createPageUrl("Products?category=cereal")
    },
    {
      label: "Frosted Cereal",
      img: "https://magicspoon.imgix.net/files/MS-Front-Frosted_2x-901293_b2cc7d31-7716-47b3-a3ed-33d2cd06b787-667822.png?v=1735835989&width=474&auto=format,compress",
      to: createPageUrl("Products?category=cereal")
    },
    {
      label: "Marshmallow Treats",
      img: "https://magicspoon.imgix.net/files/MS_T_MALLOW_BYO_7921e307-0168-4049-8355-5151b0294d48.png?v=1744119800&width=474&auto=format,compress",
      to: createPageUrl("Products?category=treats")
    },
    {
      label: "Double Chocolate Treats",
      img: "https://magicspoon.imgix.net/files/MS_T_CHOC_BYO_c231b89c-258c-4350-ba78-ea0748c99abc.png?v=1745951737&width=474&auto=format,compress",
      to: createPageUrl("Products?category=treats")
    }
  ];

  return (
    <>
      <section className="py-12 sm:py-14 md:py-16 bg-[#DAD9FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h4 className="text-2xl sm:text-3xl font-extrabold text-[#5222e3] text-center mb-8 sm:mb-10">
            Find Your Favorite
          </h4>

          {/* 桌面端与平板：9列单行，无滚动 */}
          <div className="hidden md:grid grid-cols-9 gap-6">
            {items.map((item) => (
              <Link key={item.label} to={item.to} className="group">
                <img
                  src={item.img}
                  alt={item.label}
                  className="mx-auto h-24 lg:h-28 object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <p className="mt-3 text-center text-sm sm:text-base font-semibold text-[#462b8e] leading-snug">
                  {item.label}
                </p>
              </Link>
            ))}
          </div>

          {/* 移动端：保留横向滚动并显示滚动条 */}
          <div className="md:hidden flex gap-6 overflow-x-auto px-2">
            {items.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="flex-shrink-0 w-32"
                style={{ scrollSnapAlign: "center" }}
              >
                <img
                  src={item.img}
                  alt={item.label}
                  className="mx-auto h-24 object-contain transition-transform duration-300"
                  loading="lazy"
                />
                <p className="mt-3 text-center text-sm font-semibold text-[#462b8e] leading-snug">
                  {item.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 订阅权益区块 - 渐变背景精细还原 */}
      <section className="relative py-16 overflow-hidden">
        {/* 背景层：顶部浅蓝 -> 底部淡紫 */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "linear-gradient(180deg, #CDEAFF 0%, #DAD9FF 100%)"
          }}
        />
        {/* 高光叠加：左上到中部的柔和高光，增强层次 */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(120% 80% at 20% 0%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%)"
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* 文案 */}
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#5222e3] mb-4">
                Get your childhood favorites delivered to your door monthly
              </h2>
              <p className="text-lg font-semibold text-[#5222e3] mb-6">
                Subscribe &amp; Save 20%
              </p>

              <ul className="space-y-4 text-[#4A3FB0]">
                <li className="flex items-start gap-3">
                  <Gift className="w-5 h-5 text-[#5222e3] mt-1" />
                  <span>Free bowl set with your first order</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#5222e3] mt-1" />
                  <span>VIP Access to limited-edition launches</span>
                </li>
                <li className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-[#5222e3] mt-1" />
                  <span>Change flavors anytime</span>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#5222e3] mt-1" />
                  <span>Skip or cancel delivery anytime</span>
                </li>
              </ul>

              <div className="mt-8">
                <Link to={createPageUrl("Products")}>
                  <button className="px-6 py-3 rounded-full bg-[#5222e3] hover:bg-[#3e1abd] text-white font-bold shadow-lg">
                    BUILD YOUR BUNDLE
                  </button>
                </Link>
              </div>
            </div>

            {/* 图片 */}
            <div className="order-1 md:order-2">
              <div className="rounded-3xl overflow-hidden shadow-xl ring-4 ring-white/60">
                <img
                  src="https://magicspoon.com/cdn/shop/files/MS20_v1.webp?v=1733194940"
                  alt="Magic Spoon subscription box"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
