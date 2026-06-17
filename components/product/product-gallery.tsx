"use client";

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  // Add Autoplay plugin with 4s delay and stop on user interaction
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
  ])
  
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  )

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className="space-y-4 relative group w-full max-w-full min-w-0">
      {/* Main Slider */}
      <div className="overflow-hidden rounded-3xl bg-[#F8FAFC] border border-border/40 shadow-inner w-full" ref={emblaRef}>
        <div className="flex">
          {images.map((src, index) => (
            <div className="flex-[0_0_100%] min-w-0 relative aspect-square md:aspect-[4/3]" key={index}>
              <Image
                src={src}
                alt={`${productName} - View ${index + 1}`}
                fill
                className="object-contain p-8 md:p-12"
                priority={index === 0}
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows (Absolute Overlay) */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-white border-border/60 shadow-md hover:bg-white pointer-events-auto h-12 w-12"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-6 w-6 text-primary" />
        </Button>
      </div>

      <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-white border-border/60 shadow-md hover:bg-white pointer-events-auto h-12 w-12"
          onClick={scrollNext}
        >
          <ChevronRight className="h-6 w-6 text-primary" />
        </Button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 justify-center overflow-x-auto pb-2 px-1 scrollbar-hide">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl overflow-hidden border transition-all duration-300",
              index === selectedIndex 
                ? "border-primary ring-2 ring-primary/20 scale-105 opacity-100" 
                : "border-transparent bg-muted opacity-60 hover:opacity-100"
            )}
          >
            <Image
              src={images[index]}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  )
}