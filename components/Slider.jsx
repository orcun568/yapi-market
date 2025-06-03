"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function BKSlider() {
  const [slider, setSlider] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch("/api/slider")
      .then((res) => res.json())
      .then((data) => setSlider(data));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!slider) return null;

  const images = [
    { src: slider.image1, title: slider.title1 },
    { src: slider.image2, title: slider.title2 },
    { src: slider.image3, title: slider.title3 },
  ];

  const smallOrderMap = {
    0: [2, 1],
    1: [0, 2],
    2: [1, 0],
  };

  const smallOrder = smallOrderMap[index];

  return (
    <div className="flex flex-col items-center w-full mt-10">
      {/* Büyük resim */}
      <div className="w-[90%] md:w-[70%] lg:w-[50%] rounded-xl overflow-hidden shadow-lg relative mb-6">
        <Image
          src={images[index].src}
          alt={images[index].title ? images[index].title : "Slider image"}
          width={800}
          height={500}
          className="w-full h-64 md:h-96 object-cover rounded-xl"
        />
        
      </div>

      {/* Küçük resimler */}
      <div className="flex gap-3 justify-center">
        {smallOrder.map((i) => (
          <div
            key={i}
            className="cursor-pointer border-2 border-transparent hover:border-green-600 rounded-lg overflow-hidden transition-all duration-300"
            onClick={() => setIndex(i)}
          >
            <Image
              src={images[i].src}
              alt={images[i].title ? images[i].title : `Slider thumbnail ${i + 1}`}
              width={100}
              height={60}
              className="object-cover w-24 h-16 md:w-28 md:h-20"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
