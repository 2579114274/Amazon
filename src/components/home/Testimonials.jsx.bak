
import React from "react";
import { motion } from "framer-motion";

const items = [
  {
    quote:
      "I just ate delicious cereal for dinner and the last time I did that was my sophomore year in college!",
    name: "KELLY LEVEQUE",
    title:
      "Holistic Nutritionist, Wellness Expert, and Celebrity Health Coach",
    img: "https://magicspoon.imgix.net/files/KELLY-LEVEQUE_2x_3b58a2bf-4c78-4d18-be5d-2bbce7d784dc.jpg?v=1613785477&width=304&auto=format,compress",
  },
  {
    quote: "When they said ‘Breakfast of Champions’, they meant Magic Spoon.",
    name: "PRISCILLA FREDERICK-LOOMIS",
    title:
      "Olympian, Entrepreneur, Radio Personality, Podcast Host & Public Speaker",
    img: "https://magicspoon.imgix.net/files/IMG_0697_a1df8eac-3061-4761-8399-94505e8afbbc.jpg?v=1621961610&width=304&auto=format,compress",
  },
  {
    quote:
      "Magic Spoon is my adult life and kid life smashed into one fantastic box of cereal.",
    name: "NATALIE DURAN",
    title: "Rock Climber, Ninja Warrior, Neuroscientist, Producer",
    img: "https://magicspoon.imgix.net/files/49E7A619-BFBF-4A02-9CF5-2483B733C93A.jpg?v=1622666809&width=304&auto=format,compress",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-[#5F2FE8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 三列白卡 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="relative"
            >
              <div className="relative bg-white rounded-none border-[6px] border-[#5F2FE8] px-6 md:px-8 pt-10 pb-16 text-center shadow-[0_12px_30px_rgba(82,34,227,0.18)]">
                <q className="block text-[#4A1FB8] font-semibold leading-8 md:leading-9 text-xl md:text-2xl lg:text-3xl mx-auto max-w-md md:max-w-none min-h-[160px] md:min-h-[175px]">
                  {t.quote}
                </q>

                <div className="mt-6">
                  {/* 空心描边标题 */}
                  <h3
                    className="text-transparent text-lg md:text-xl font-extrabold tracking-wide uppercase"
                    style={{
                      WebkitTextStroke: '2px #4A1FB8',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent'
                    }}
                  >
                    {t.name}
                  </h3>
                  <p className="mt-2 text-[#4A3FB0] text-sm md:text-base leading-relaxed">
                    {t.title}
                  </p>
                </div>

                {/* 头像（底部悬浮覆盖） */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-10 w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-4 ring-white">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
