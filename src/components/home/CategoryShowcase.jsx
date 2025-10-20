
import React from "react";
import { motion } from "framer-motion";

export default function CategoryShowcase() {
  return (
    <section className="relative overflow-hidden py-12 md:py-0 md:h-[724px]">
      {/* PC 背景图：全宽覆盖 */}
      <div
        className="absolute inset-0 -z-10 hidden md:block"
        style={{
          backgroundImage:
          "url('https://magicspoon.imgix.net/files/PDP_-_Desktop_-_Frame2_3.jpg?v=1744144623&auto=format,compress&w=2880')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover"
        }} />

      {/* 移动端背景图：全宽覆盖 */}
      <div
        className="absolute inset-0 -z-10 md:hidden"
        style={{
          backgroundImage:
          "url('https://magicspoon.imgix.net/files/PDP_-_Mobile_-_Frame2_3.jpg?v=1744144740&width=1656&auto=format,compress')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover"
        }} />


      {/* 渐变底色（置于背景图之下） */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
          "linear-gradient(180deg, #CDEAFF 0%, #DAD9FF 60%, #F7B4D8 100%)"
        }} />

      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
          "radial-gradient(120% 80% at 20% 0%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%)"
        }} />


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        {/* 文案区：左上角对齐，字号略小 */}
        <div className="h-full flex items-start justify-start">
          <div className="hidden md:block mb-10 ml-1 pb-4 md:pt-16 lg:pt-16 max-w-2xl">
            <motion.h3
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-left text-3xl md:text-5xl font-extrabold text-[#4A1FB8] tracking-tight">

              Crispy. Puffy. Crunchy.
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-4 md:mt-5 text-left text-base md:text-lg leading-7 md:leading-8 text-[#4A3FB0]">

              Need Magic Spoon on-the-go? We turned our delicious, high-protein cereal into a high-protein Treat!
              Tastes just like those classic, crispy cereal bars with{" "}
              <span className="font-extrabold text-[#4A1FB8]">11–12g protein</span>,{" "}
              <span className="font-extrabold text-[#4A1FB8]">1–2g added sugars</span>, and{" "}
              <span className="font-extrabold text-[#4A1FB8]">none of the artificial ingredients</span>.
            </motion.p>
          </div>
        </div>
      </div>

      {/* 装饰环 */}
      <div className="pointer-events-none absolute left-10 md:left-24 top-36 w-10 h-10 rounded-full border-[10px] border-[#F59E0B]/80 opacity-80" />
      <div className="pointer-events-none absolute left-1/3 bottom-10 w-12 h-12 rounded-full border-[10px] border-[#7C3AED]/70 opacity-80" />
      <div className="pointer-events-none absolute right-10 md:right-24 top-1/2 w-10 h-10 rounded-full border-[10px] border-[#EF4444]/70 opacity-80" />
    </section>);

}
