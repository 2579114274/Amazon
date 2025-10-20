

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ShoppingBag, Search, User, Menu, X, Heart, ShoppingCart, Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LocalCartItem as CartItem } from "@/api/localEntities";
import PixelTracker from "@/components/PixelTracker";
import FacebookPixel from "@/components/FacebookPixel";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    loadCartCount();
    // 使用 rAF 节流 + passive 监听，减少重绘与 Reflow
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sc = window.scrollY > 10;
          // 仅在状态变化时 setState，避免多余渲染
          setIsScrolled(prev => (prev === sc ? prev : sc));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 移除初始鉴权请求：公开模式下避免触发未登录重定向

  const loadCartCount = async (userEmail = null) => {
    const email = userEmail || user?.email;
    if (!email) return;
    try {
      const cartItems = await CartItem.filter({ user_email: email });
      const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalCount);
    } catch (error) {
      setCartCount(0);
    }
  };

  const navigationItems = [
    // { 
    //   name: "Cereal", 
    //   url: createPageUrl("Products"),
    //   hasDropdown: true,
    //   badge: null
    // },
    { 
      // name: "TREATS", 
      name: "SNACKS", 
      url: createPageUrl("Products"),
      hasDropdown: true,
      badge: null
    },
    // { 
    //   name: "Granola", 
    //   url: createPageUrl("Products"),
    //   hasDropdown: true,
    //   badge: "New"
    // },
    // { 
    //   name: "Bundle Builder", 
    //   url: createPageUrl("Products"),
    //   hasDropdown: false,
    //   badge: "Bestseller"
    // },
    { 
      name: "Shop All", 
      url: createPageUrl("Products"),
      hasDropdown: false,
      badge: null
    }
  ];

  // 根据页面类型决定标头样式
  const getHeaderStyle = () => {
    switch(currentPageName) {
      case 'Home':
        return isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-lg' 
          : 'bg-transparent';
      case 'Products':
        return isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-lg'
          : 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm';
      case 'ProductDetail':
        return isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-lg'
          : 'bg-gradient-to-r from-[#FEDEAC]/80 via-[#FFE8BF]/70 to-[#FCE0AB]/80 backdrop-blur-md border-b border-white/30 shadow-sm';
      case 'Cart': // Cart page is removed, but this case remains for robustness if `currentPageName` ever gets set to 'Cart' by accident.
        return 'bg-gradient-to-r from-purple-50/90 to-pink-50/90 backdrop-blur-md border-b border-purple-100';
      default:
        return 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-lg';
    }
  };

  // 根据页面类型决定文字颜色
  const getTextColor = () => {
    if (currentPageName === 'Home' && !isScrolled) {
      return 'text-white';
    }
    return 'text-gray-800';
  };

  const getLogoColor = () => {
    if (currentPageName === 'Home' && !isScrolled) {
      return '#FFFFFF';
    }
    return '#462b8e';
  };

  // Use a separate minimal layout for Admin pages (no site header/footer)
  if (currentPageName === 'admin' || currentPageName === 'Admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        body {
          font-family: 'Poppins', sans-serif;
        }
        .header-total-height {
          height: 151.19px; /* Desktop: 32px top bar + 119.19px header */
        }
        .header-height {
          height: 119.19px;
        }
        .top-bar-height {
          height: 32px;
        }
        /* Mobile: reduce header height */
        @media (max-width: 768px) {
          .header-total-height {
            height: calc(32px + 64px); /* 32px top bar + 64px header */
          }
          .header-height {
            height: 64px;
          }
        }
      `}</style>
      
      {/* Top Promo Bar */}
      <aside className="fixed top-0 left-0 right-0 z-50 bg-purple-600 text-white text-center text-sm font-medium top-bar-height flex items-center justify-center">
        <div className="container mx-auto px-4">
          <Link to={createPageUrl("Products")} className="hover:underline">
            ✨Free Shipping, and 80,000+ 5-Star Reviews✨
          </Link>
        </div>
      </aside>

      {/* Header */}
      <header className={`fixed top-8 left-0 right-0 z-40 transition-all duration-300 ${getHeaderStyle()}`}>
        {/* Background overlay for Product Detail hero (only when not scrolled) */}
        {currentPageName === 'ProductDetail' && !isScrolled && (
          <div
            className="absolute inset-0 pointer-events-none opacity-70"
            style={{
              background:
                'radial-gradient(120% 80% at 20% 0%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 55%)'
            }}
          />
        )}
        {/* Main Header */}
        <div className="header-height flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="relative flex justify-between items-center h-full">
              {/* Mobile menu button on the left (only mobile) */}
              <div className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`transition-colors duration-300 ${getTextColor()} ${
                    currentPageName === 'Home' && !isScrolled 
                      ? 'hover:bg-white/20' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Open menu"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
              </div>

              {/* Logo */}
              {/* Desktop logo (left) */}
              <Link to={createPageUrl("products")} className="hidden lg:flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 154.12 68.8" className="w-32 h-auto">
                    <g>
                    <path fill={getLogoColor()} d="M36.53.62l-7.47 31.32h6.17l1.52-6.71H47.4l1.52 6.71h6.17L47.62.62zm1.47 19l3.67-16h.81l3.62 16zM14.47.62h11.11V32h-5.47V3.57h-1L18 27.45a5.19 5.19 0 01-5.18 4.94 5.18 5.18 0 01-5.18-4.94L6.48 3.58h-1V32H0V.62h11.19l1.23 27.17h.81zm117.1 32A16.28 16.28 0 01122.15 3a16.29 16.29 0 0124.44 7l-5.33 2.26a10.76 10.76 0 00-8.45-6.48A10.54 10.54 0 00123 10.2a10.86 10.86 0 00-.72 11 10.58 10.58 0 009 5.73 10.73 10.73 0 0010-6.55l5.33 2.26a16.49 16.49 0 01-15.04 9.93zM23.9 58.69v.54a9.72 9.72 0 01-.78 4 8.31 8.31 0 01-2.26 3 10.08 10.08 0 01-3.58 1.92 15.46 15.46 0 01-4.74.67 15.64 15.64 0 01-5.44-.87 10.77 10.77 0 01-3.91-2.42 10.34 10.34 0 01-2.37-3.64A12.42 12.42 0 010 57.35V56h5.9v1.07a6.17 6.17 0 001.63 4.5q1.64 1.68 5.08 1.68a5.84 5.84 0 004-1.16 3.63 3.63 0 001.3-2.77 3.93 3.93 0 00-.27-1.45 3.07 3.07 0 00-.94-1.25 6.73 6.73 0 00-1.83-1 16.23 16.23 0 00-2.95-.76 30.34 30.34 0 01-4.34-1 12.19 12.19 0 01-3.42-1.72 7.49 7.49 0 01-2.26-2.68 9 9 0 01-.8-4v-.27a8.17 8.17 0 01.78-3.56 8.51 8.51 0 012.19-2.84 10.07 10.07 0 013.4-1.88 13.81 13.81 0 014.45-.67 14.35 14.35 0 014.92.78 10.48 10.48 0 013.6 2.13 8.74 8.74 0 012.19 3.09 9.4 9.4 0 01.74 3.67v1.61h-5.92v-1.08A4.42 4.42 0 0016 43.17a5.71 5.71 0 00-4.09-1.39 6 6 0 00-3.53.92 2.88 2.88 0 00-1.3 2.48 3.25 3.25 0 00.31 1.45 2.94 2.94 0 001.1 1.16 8.52 8.52 0 002.06.92 27.25 27.25 0 003.24.76 16.65 16.65 0 017.52 3 7.55 7.55 0 012.59 6.22zm23.79-19a8.76 8.76 0 00-3-2.06 10.44 10.44 0 00-4.21-.78H27.86v31.33h5.91V56.37h6.74a10.17 10.17 0 004.21-.81 8.69 8.69 0 004.77-5.12 10.1 10.1 0 00.6-3.42V46a9.6 9.6 0 00-.6-3.33 8.87 8.87 0 00-1.8-2.97zm-3.52 7.18A3.63 3.63 0 0143 49.65a4.34 4.34 0 01-3.11 1.07h-6.13V42.5h6.16A4.38 4.38 0 0143 43.57a3.64 3.64 0 011.14 2.77zm95.78-10h5.47v25.91a5.89 5.89 0 01-5.89 5.89 5.9 5.9 0 01-5.8-4.84l-4.35-24h-.82v28.34h-5.47v-31.3h11.26L139.27 64h.67V36.86zm-27.06-4.92H91.43V26.3h7.78v-20h-7.78V.62h21.46v5.64h-7.78v20h7.78zm-25.74-.3h-5V21.9H70.84v-5.57h16.32v15.31zm-16.55.89c-4-.15-8.48-2.69-11.16-6A16.29 16.29 0 0163 2.78 16.3 16.3 0 0187.15 10l-5.34 2.26a10.78 10.78 0 00-8.56-6.52 10.54 10.54 0 00-9.83 4.64 10.92 10.92 0 00-.53 11A10.55 10.55 0 0072.05 27a10.25 10.25 0 009.42-6.57l.69.07c.78 4.36-1.69 12.41-11.56 12.03zM69.08 68.8a16.28 16.28 0 1116.28-16.28A16.3 16.3 0 0169.08 68.8zm0-26.89a10.61 10.61 0 1010.49 10.61 10.56 10.56 0 00-10.49-10.61zm34.75 26.89a16.28 16.28 0 1116.28-16.28 16.3 16.3 0 01-16.28 16.28zm0-26.77a10.49 10.49 0 1010.49 10.49A10.5 10.5 0 00103.83 42zM150.27.32a3.81 3.81 0 013.85 3.85 3.85 3.85 0 11-7.7 0 3.81 3.81 0 013.85-3.85zm0 .9a2.91 2.91 0 00-2.93 2.94 2.93 2.93 0 105.86 0 2.91 2.91 0 00-2.93-2.94zm-1.56.83h1.93c.86 0 1.36.47 1.36 1.14a1.09 1.09 0 01-.81 1.09 1 1 0 01.67 1c0 .47 0 .67.22.86v.1h-1a1.76 1.76 0 01-.17-1c0-.54-.24-.74-.71-.74h-.61v1.7h-.91V2.05zm1.82 1.71c.35 0 .57-.17.57-.49s-.22-.44-.57-.44h-.91v.92z"></path>
                    </g>
                </svg>
              </Link>

              {/* Mobile centered logo (smaller, fits header height) */}
              <Link
                to={createPageUrl("products")}
                className="lg:hidden absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 154.12 68.8" className="w-24 h-auto">
                  <g>
                    <path fill={getLogoColor()} d="M36.53.62l-7.47 31.32h6.17l1.52-6.71H47.4l1.52 6.71h6.17L47.62.62zm1.47 19l3.67-16h.81l3.62 16zM14.47.62h11.11V32h-5.47V3.57h-1L18 27.45a5.19 5.19 0 01-5.18 4.94 5.18 5.18 0 01-5.18-4.94L6.48 3.58h-1V32H0V.62h11.19l1.23 27.17h.81zm117.1 32A16.28 16.28 0 01122.15 3a16.29 16.29 0 0124.44 7l-5.33 2.26a10.76 10.76 0 00-8.45-6.48A10.54 10.54 0 00123 10.2a10.86 10.86 0 00-.72 11 10.58 10.58 0 009 5.73 10.73 10.73 0 0010-6.55l5.33 2.26a16.49 16.49 0 01-15.04 9.93zM23.9 58.69v.54a9.72 9.72 0 01-.78 4 8.31 8.31 0 01-2.26 3 10.08 10.08 0 01-3.58 1.92 15.46 15.46 0 01-4.74.67 15.64 15.64 0 01-5.44-.87 10.77 10.77 0 01-3.91-2.42 10.34 10.34 0 01-2.37-3.64A12.42 12.42 0 010 57.35V56h5.9v1.07a6.17 6.17 0 001.63 4.5q1.64 1.68 5.08 1.68a5.84 5.84 0 004-1.16 3.63 3.63 0 001.3-2.77 3.93 3.93 0 00-.27-1.45 3.07 3.07 0 00-.94-1.25 6.73 6.73 0 00-1.83-1 16.23 16.23 0 00-2.95-.76 30.34 30.34 0 01-4.34-1 12.19 12.19 0 01-3.42-1.72 7.49 7.49 0 01-2.26-2.68 9 9 0 01-.8-4v-.27a8.17 8.17 0 01.78-3.56 8.51 8.51 0 012.19-2.84 10.07 10.07 0 013.4-1.88 13.81 13.81 0 014.45-.67 14.35 14.35 0 014.92.78 10.48 10.48 0 013.6 2.13 8.74 8.74 0 012.19 3.09 9.4 9.4 0 01.74 3.67v1.61h-5.92v-1.08A4.42 4.42 0 0016 43.17a5.71 5.71 0 00-4.09-1.39 6 6 0 00-3.53.92 2.88 2.88 0 00-1.3 2.48 3.25 3.25 0 00.31 1.45 2.94 2.94 0 001.1 1.16 8.52 8.52 0 002.06.92 27.25 27.25 0 003.24.76 16.65 16.65 0 017.52 3 7.55 7.55 0 012.59 6.22zm23.79-19a8.76 8.76 0 00-3-2.06 10.44 10.44 0 00-4.21-.78H27.86v31.33h5.91V56.37h6.74a10.17 10.17 0 004.21-.81 8.69 8.69 0 004.77-5.12 10.1 10.1 0 00.6-3.42V46a9.6 9.6 0 00-.6-3.33 8.87 8.87 0 00-1.8-2.97zm-3.52 7.18A3.63 3.63 0 0143 49.65a4.34 4.34 0 01-3.11 1.07h-6.13V42.5h6.16A4.38 4.38 0 0143 43.57a3.64 3.64 0 011.14 2.77zm95.78-10h5.47v25.91a5.89 5.89 0 01-5.89 5.89 5.9 5.9 0 01-5.8-4.84l-4.35-24h-.82v28.34h-5.47v-31.3h11.26L139.27 64h.67V36.86zm-27.06-4.92H91.43V26.3h7.78v-20h-7.78V.62h21.46v5.64h-7.78v20h7.78zm-25.74-.3h-5V21.9H70.84v-5.57h16.32v15.31zm-16.55.89c-4-.15-8.48-2.69-11.16-6A16.29 16.29 0 0163 2.78 16.3 16.3 0 0187.15 10l-5.34 2.26a10.78 10.78 0 00-8.56-6.52 10.54 10.54 0 00-9.83 4.64 10.92 10.92 0 00-.53 11A10.55 10.55 0 0072.05 27a10.25 10.25 0 009.42-6.57l.69.07c.78 4.36-1.69 12.41-11.56 12.03zM69.08 68.8a16.28 16.28 0 1116.28-16.28A16.3 16.3 0 0169.08 68.8zm0-26.89a10.61 10.61 0 1010.49 10.61 10.56 10.56 0 00-10.49-10.61zm34.75 26.89a16.28 16.28 0 1116.28-16.28 16.3 16.3 0 01-16.28 16.28zm0-26.77a10.49 10.49 0 1010.49 10.49A10.5 10.5 0 00103.83 42zM150.27.32a3.81 3.81 0 013.85 3.85 3.85 3.85 0 11-7.7 0 3.81 3.81 0 013.85-3.85zm0 .9a2.91 2.91 0 00-2.93 2.94 2.93 2.93 0 105.86 0 2.91 2.91 0 00-2.93-2.94zm-1.56.83h1.93c.86 0 1.36.47 1.36 1.14a1.09 1.09 0 01-.81 1.09 1 1 0 01.67 1c0 .47 0 .67.22.86v.1h-1a1.76 1.76 0 01-.17-1c0-.54-.24-.74-.71-.74h-.61v1.7h-.91V2.05zm1.82 1.71c.35 0 .57-.17.57-.49s-.22-.44-.57-.44h-.91v.92z"></path>
                  </g>
                </svg>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-6">
                {navigationItems.map((item) => (
                  <div key={item.name} className="relative">
                    <Link
                      to={item.url}
                      className={`font-bold transition-colors duration-300 flex items-center gap-2 py-2 ${getTextColor()} hover:opacity-80`}
                    >
                      <span className="text-base tracking-wider">{item.name.toUpperCase()}</span>
                      {item.badge && (
                        <Badge className={`text-xs font-bold rounded-md ${
                          item.badge === "New" ? "bg-green-500" : "bg-orange-500"
                        } text-white`}>
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </div>
                ))}
              </nav>

              {/* Right Actions (account + cart on the right of logo) */}
              <div className="flex items-center space-x-1">
                {/* Account */}
                {/* <Button 
                  variant="ghost" 
                  size="icon"
                  className={`transition-colors duration-300 ${getTextColor()} ${
                    currentPageName === 'Home' && !isScrolled 
                      ? 'hover:bg-white/20' 
                      : 'hover:bg-gray-100'
                  }`}
                  aria-label="Account"
                >
                  <User className="w-6 h-6" />
                </Button> */}

                {/* Cart - disabled/inactive */}
               {/* <Button
                 variant="ghost"
                 size="icon"
                 disabled
                 className={`relative opacity-50 cursor-not-allowed ${getTextColor()} ${
                   currentPageName === 'Home' && !isScrolled 
                     ? 'hover:bg-transparent' 
                     : 'hover:bg-transparent'
                 }`}
                 aria-label="Cart (disabled)"
               >
                 <ShoppingCart className="w-6 h-6" />
                 {cartCount > 0 && (
                   <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#5222e3] text-white text-xs flex items-center justify-center shadow-lg">
                     {cartCount}
                   </Badge>
                 )}
               </Button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-400">
            <div className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.url}
                  className="flex items-center justify-between px-3 py-3 rounded-lg font-bold text-white hover:bg-white/20 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{item.name.toUpperCase()}</span>
                  {item.badge && (
                    <Badge className={`text-xs font-bold rounded-md ${
                      item.badge === "New" ? "bg-green-500" : "bg-orange-500"
                    } text-white`}>
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-white">
        {/* Top guarantee banner */}
        <div className="bg-gradient-to-r from-[#6B2FE8] via-[#7D2FE8] to-[#8E2BE2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
              <div>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                  <span className="text-white">Happiness</span>{" "}
                  <span
                    className="text-transparent"
                    style={{
                      WebkitTextStroke: "2px #FFFFFF",
                      WebkitTextFillColor: "transparent",
                      color: "transparent",
                    }}
                  >
                    100% Guaranteed
                  </span>
                </h3>
                <p className="mt-2 text-xs uppercase tracking-wider text-white/70">
                  SEE TERMS OF USE.
                </p>
              </div>
              <Link to={createPageUrl("Products")}>
                <Button className="rounded-full px-6 py-6 h-auto bg-[#3B1DC9] hover:bg-[#2F16A6] text-white shadow-[0_10px_24px_rgba(0,0,0,0.25)]">
                  TRY NOW
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main footer content (black) */}
        <div className="bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left column */}
              <div>
                <Link to={createPageUrl("Home")} className="inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 154.12 68.8" className="w-40 h-auto">
                    <g>
                      <path fill="#ffffff" d="M36.53.62l-7.47 31.32h6.17l1.52-6.71H47.4l1.52 6.71h6.17L47.62.62zm1.47 19l3.67-16h.81l3.62 16zM14.47.62h11.11V32h-5.47V3.57h-1L18 27.45a5.19 5.19 0 01-5.18 4.94 5.18 5.18 0 01-5.18-4.94L6.48 3.58h-1V32H0V.62h11.19l1.23 27.17h.81zm117.1 32A16.28 16.28 0 01122.15 3a16.29 16.29 0 0124.44 7l-5.33 2.26a10.76 10.76 0 00-8.45-6.48A10.54 10.54 0 00123 10.2a10.86 10.86 0 00-.72 11 10.58 10.58 0 009 5.73 10.73 10.73 0 0010-6.55l5.33 2.26a16.49 16.49 0 01-15.04 9.93zM23.9 58.69v.54a9.72 9.72 0 01-.78 4 8.31 8.31 0 01-2.26 3 10.08 10.08 0 01-3.58 1.92 15.46 15.46 0 01-4.74.67 15.64 15.64 0 01-5.44-.87 10.77 10.77 0 01-3.91-2.42 10.34 10.34 0 01-2.37-3.64A12.42 12.42 0 010 57.35V56h5.9v1.07a6.17 6.17 0 001.63 4.5q1.64 1.68 5.08 1.68a5.84 5.84 0 004-1.16 3.63 3.63 0 001.3-2.77 3.93 3.93 0 00-.27-1.45 3.07 3.07 0 00-.94-1.25 6.73 6.73 0 00-1.83-1 16.23 16.23 0 00-2.95-.76 30.34 30.34 0 01-4.34-1 12.19 12.19 0 01-3.42-1.72 7.49 7.49 0 01-2.26-2.68 9 9 0 01-.8-4v-.27a8.17 8.17 0 01.78-3.56 8.51 8.51 0 012.19-2.84 10.07 10.07 0 013.4-1.88 13.81 13.81 0 014.45-.67 14.35 14.35 0 014.92.78 10.48 10.48 0 013.6 2.13 8.74 8.74 0 012.19 3.09 9.4 9.4 0 01.74 3.67v1.61h-5.92v-1.08A4.42 4.42 0 0016 43.17a5.71 5.71 0 00-4.09-1.39 6 6 0 00-3.53.92 2.88 2.88 0 00-1.3 2.48 3.25 3.25 0 00.31 1.45 2.94 2.94 0 001.1 1.16 8.52 8.52 0 002.06.92 27.25 27.25 0 003.24.76 16.65 16.65 0 017.52 3 7.55 7.55 0 012.59 6.22zm23.79-19a8.76 8.76 0 00-3-2.06 10.44 10.44 0 00-4.21-.78H27.86v31.33h5.91V56.37h6.74a10.17 10.17 0 004.21-.81 8.69 8.69 0 004.77-5.12 10.1 10.1 0 00.6-3.42V46a9.6 9.6 0 00-.6-3.33 8.87 8.87 0 00-1.8-2.97zm-3.52 7.18A3.63 3.63 0 0143 49.65a4.34 4.34 0 01-3.11 1.07h-6.13V42.5h6.16A4.38 4.38 0 0143 43.57a3.64 3.64 0 011.14 2.77zm95.78-10h5.47v25.91a5.89 5.89 0 01-5.89 5.89 5.9 5.9 0 01-5.8-4.84l-4.35-24h-.82v28.34h-5.47v-31.3h11.26L139.27 64h.67V36.86zm-27.06-4.92H91.43V26.3h7.78v-20h-7.78V.62h21.46v5.64h-7.78v20h7.78zm-25.74-.3h-5V21.9H70.84v-5.57h16.32v15.31zm-16.55.89c-4-.15-8.48-2.69-11.16-6A16.29 16.29 0 0163 2.78 16.3 16.3 0 0187.15 10l-5.34 2.26a10.78 10.78 0 00-8.56-6.52 10.54 10.54 0 00-9.83 4.64 10.92 10.92 0 00-.53 11A10.55 10.55 0 0072.05 27a10.25 10.25 0 009.42-6.57l.69.07c.78 4.36-1.69 12.41-11.56 12.03zM69.08 68.8a16.28 16.28 0 1116.28-16.28A16.3 16.3 0 0169.08 68.8zm0-26.89a10.61 10.61 0 1010.49 10.61 10.56 10.56 0 00-10.49-10.61zm34.75 26.89a16.28 16.28 0 1116.28-16.28 16.3 16.3 0 01-16.28 16.28zm0-26.77a10.49 10.49 0 1010.49 10.49A10.5 10.5 0 00103.83 42zM150.27.32a3.81 3.81 0 013.85 3.85 3.85 3.85 0 11-7.7 0 3.81 3.81 0 013.85-3.85zm0 .9a2.91 2.91 0 00-2.93 2.94 2.93 2.93 0 105.86 0 2.91 2.91 0 00-2.93-2.94zm-1.56.83h1.93c.86 0 1.36.47 1.36 1.14a1.09 1.09 0 01-.81 1.09 1 1 0 01.67 1c0 .47 0 .67.22.86v.1h-1a1.76 1.76 0 01-.17-1c0-.54-.24-.74-.71-.74h-.61v1.7h-.91V2.05zm1.82 1.71c.35 0 .57-.17.57-.49s-.22-.44-.57-.44h-.91v.92z"></path>
                    </g>
                  </svg>
                </Link>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-300">
                  {[
                    "Terms of Use",
                    "Privacy Policy",
                    "Accessibility Policy",
                    "FAQ",
                    "Reviews",
                    "Jobs",
                    "Track Orders",
                    "Store Locator",
                    "Terms of Service",
                    "Refund policy",
                  ].map((text) => (
                    <a key={text} href="#" className="hover:text-white transition-colors">
                      {text}
                    </a>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <Link to={createPageUrl("Products")}>
                    <Button
                      className="rounded-full px-6 py-3 h-auto border-2 border-white bg-black text-white uppercase font-extrabold tracking-wide hover:bg-white/10"
                    >
                      CONTACT US
                    </Button>
                  </Link>
                  <div className="flex items-center gap-4">
                    <a href="#" aria-label="Instagram" className="hover:opacity-80">
                      <Instagram className="w-6 h-6" />
                    </a>
                    <a href="#" aria-label="Facebook" className="hover:opacity-80">
                      <Facebook className="w-6 h-6" />
                    </a>
                    <a href="#" aria-label="Twitter" className="hover:opacity-80">
                      <Twitter className="w-6 h-6" />
                    </a>
                    {/* TikTok inline SVG */}
                    <a href="#" aria-label="TikTok" className="hover:opacity-80">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-6 h-6 fill-white">
                        <path d="M448 209.9a210.1 210.1 0 0 1-122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0h88a121.2 121.2 0 0 0 1.9 22.2A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"/>
                      </svg>
                    </a>
                  </div>
                </div>

                <p className="mt-6 text-sm text-gray-400">
                  &copy; {new Date().getFullYear()} Magic Spoon
                </p>
              </div>

              {/* Right column */}
              <div className="md:pl-12">
                <p className="text-white font-semibold mb-4">Don't miss the magic:</p>
                <form
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 bg-transparent border-2 border-white text-white placeholder-white/70 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <Button
                    className="rounded-full px-6 py-3 h-auto border-2 border-white bg-black text-white uppercase font-extrabold tracking-wide hover:bg-white/10"
                    type="submit"
                  >
                    SUBSCRIBE
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* 像素跟踪组件 */}
      <PixelTracker />
      <FacebookPixel />
    </div>
  );
}

