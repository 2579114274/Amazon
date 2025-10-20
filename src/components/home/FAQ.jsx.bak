import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function FAQ() {
  return (
    <section className="relative -mt-px py-16 md:py-24 min-h-[320px] md:min-h-[380px] overflow-hidden">
      {/* 背景：自上而下紫到浅蓝的渐变（顶色与上一块一致） */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, #5F2FE8 0%, #6B2FE8 20%, #8B6CF6 50%, #CDEAFF 100%)",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* 左：大标题（后半段空心描边） */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            <span className="text-white">Why did we grow</span>
            <br className="hidden sm:block" />
            <span
              className="text-transparent"
              style={{
                WebkitTextStroke: "2px #FFFFFF",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              {" "}up, but our cereal didn't?
            </span>
          </h2>

          {/* 右：描边圆角按钮 */}
          <a
            href="https://magicspoon.com/pages/our-journey"
            target="_blank"
            rel="noreferrer"
            className="shrink-0"
          >
            <Button
              variant="outline"
              className="rounded-full px-6 py-3 h-auto border-2 border-white text-white bg-transparent hover:bg-white/10 hover:text-white"
            >
              OUR STORY
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}