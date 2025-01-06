import { log } from "~/utils"

export const ScrollMap = new Map<string, number>()

export const recordScroll = (path: string, scroll: number = window.scrollY) => {
  ScrollMap.set(path, scroll)
  log("recordScroll", path, scroll)
}

export const recoverScroll = (path: string) => {
  if (!ScrollMap.has(path)) return
  window.scroll({
    top: ScrollMap.get(path) || 0,
    behavior: "smooth",
  })
  log("recoverScroll", path, ScrollMap.get(path))
}

export const getScroll = (path: string) => {
  return ScrollMap.get(path) || 0
}

export const clearScroll = (path: string) => {
  ScrollMap.delete(path)
}
