import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section 
      className="relative w-full flex items-center bg-cover bg-center"
      style={{
        backgroundImage: "url('https://magicspoon.imgix.net/files/MagicSpoon-T-H1_NewFlavors_HomepageCropsHomepageDesign_1.jpg?v=1751489105&auto=format,compress&w=2800')",
        height: '80vh',
      }}
    >
      {/* Content wrapper with top padding for header */}
      <div className="w-full h-full flex items-center pt-[119.19px]">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-end">
            <motion.div 
              className="text-left max-w-md"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-8" style={{color: '#462b8e'}}>
                Childhood classics.
                <br/>
                Grown-up
                <br/>
                ingredients.
              </h1>
              
              <div className="flex flex-col space-y-4">
                <Link to={createPageUrl("Products")}>
                  <Button 
                    size="lg" 
                    className="w-full bg-[#5222e3] hover:bg-[#462b8e] text-white px-8 py-6 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    SHOP CEREAL
                  </Button>
                </Link>
                <Link to={createPageUrl("Products")}>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full bg-transparent border-2 border-[#5222e3] text-[#5222e3] hover:bg-[#5222e3] hover:text-white px-8 py-6 rounded-full text-lg font-bold transition-all duration-300"
                  >
                    BUILD YOUR OWN BUNDLE
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}