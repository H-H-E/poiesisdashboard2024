import type { UseEmblaCarouselType } from "embla-carousel-react"

export type CarouselApi = UseEmblaCarouselType[1]
export type CarouselOptions = Parameters<typeof UseEmblaCarouselType>[0]
export type CarouselPlugin = Parameters<typeof UseEmblaCarouselType>[1]

export type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

export type CarouselContextProps = {
  carouselRef: UseEmblaCarouselType[0]
  api: CarouselApi
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps