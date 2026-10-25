import { useEffect, useRef, useState } from 'react'

const SRC = '/story/avatar.webp'
const MARGIN = 110 // css px of free space around the portrait where grains can drift
const CELL = 3 // css px per grain
const RADIUS = 34 // css px of the hover brush
const MAX_PARTICLES = 45000

/**
 * The hero portrait. Hovering brushes the picture away as drifting grains, and a click or tap
 * disintegrates all of it from left to right before it re-forms. The plain <img> stays in the
 * DOM as the accessible and no-JS fallback, and is the only thing shown with reduced motion.
 */
export function GrainPortrait() {
  const wrap = useRef<HTMLDivElement>(null)
  const base = useRef<HTMLCanvasElement>(null)
  const fx = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    const wrapEl = wrap.current, baseEl = base.current, fxEl = fx.current
    if (!wrapEl || !baseEl || !fxEl) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bctx = baseEl.getContext('2d', { willReadFrequently: true })
    const fctx = fxEl.getContext('2d')
    if (!bctx || !fctx) return

    let dead = false
    let raf = 0
    let img: HTMLImageElement | null = null

    // geometry (css px unless suffixed I for internal device px)
    let W = 0, H = 0, sc = 1, S = 3, cols = 0, rows = 0, mI = 0
    let src: HTMLCanvasElement | null = null
    let pix: Uint8ClampedArray | null = null
    let st = new Uint8Array(0) // 0 intact, 1 gone, 2 regrowing
    let live = new Uint8Array(0) // cell has visible pixels
    let regAt = new Float32Array(0)
    let prog = new Float32Array(0)
    let active = new Set<number>()
    let snapOrder: number[] = []
    let snapAt = new Float32Array(0)
    let snapPtr = 0
    let snapping = false
    let reformAt = 0

    // particles
    const cap = MAX_PARTICLES
    const px = new Float32Array(cap), py = new Float32Array(cap)
    const vx = new Float32Array(cap), vy = new Float32Array(cap)
    const life = new Float32Array(cap), maxLife = new Float32Array(cap)
    const col = new Uint32Array(cap)
    let n = 0
    let fxImg: ImageData | null = null
    let fxBuf: Uint32Array | null = null
    let fxDirty = false

    const ptr = { x: 0, y: 0, on: false }

    const build = () => {
      if (!img) return
      const cssW = wrapEl.offsetWidth, cssH = wrapEl.offsetHeight
      if (!cssW || !cssH) return
      W = cssW; H = cssH
      sc = Math.min(devicePixelRatio || 1, 1.5)
      S = Math.max(2, Math.round(CELL * sc))
      mI = Math.round(MARGIN * sc)
      const wI = Math.round(W * sc), hI = Math.round(H * sc)
      baseEl.width = wI; baseEl.height = hI
      baseEl.style.width = `${W}px`; baseEl.style.height = `${H}px`
      const fw = wI + mI * 2, fh = hI + mI * 2
      fxEl.width = fw; fxEl.height = fh
      fxEl.style.width = `${fw / sc}px`; fxEl.style.height = `${fh / sc}px`
      fxEl.style.left = `${-MARGIN}px`; fxEl.style.top = `${-MARGIN}px`
      fxImg = fctx.createImageData(fw, fh)
      fxBuf = new Uint32Array(fxImg.data.buffer)

      // contain, anchored to the bottom (same as the CSS fallback)
      const k = Math.min(wI / img.naturalWidth, hI / img.naturalHeight)
      const dw = img.naturalWidth * k, dh = img.naturalHeight * k
      src = document.createElement('canvas')
      src.width = wI; src.height = hI
      const sctx = src.getContext('2d', { willReadFrequently: true })!
      sctx.drawImage(img, (wI - dw) / 2, hI - dh, dw, dh)
      pix = sctx.getImageData(0, 0, wI, hI).data

      cols = Math.ceil(wI / S); rows = Math.ceil(hI / S)
      const total = cols * rows
      st = new Uint8Array(total); live = new Uint8Array(total)
      regAt = new Float32Array(total); prog = new Float32Array(total)
      active = new Set(); n = 0; snapping = false; snapPtr = 0
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const x = Math.min(wI - 1, cx * S + (S >> 1)), y = Math.min(hI - 1, cy * S + (S >> 1))
          if (pix[(y * wI + x) * 4 + 3] > 40) live[cy * cols + cx] = 1
        }
      }
      paintBase()
      setReady(true)
    }

    const paintBase = () => {
      if (!src) return
      bctx.clearRect(0, 0, baseEl.width, baseEl.height)
      bctx.globalAlpha = 1
      bctx.drawImage(src, 0, 0)
      active.forEach((i) => {
        const x = (i % cols) * S, y = Math.floor(i / cols) * S
        bctx.clearRect(x, y, S, S)
        if (st[i] === 2 && prog[i] > 0) {
          bctx.globalAlpha = prog[i]
          bctx.drawImage(src!, x, y, S, S, x, y, S, S)
          bctx.globalAlpha = 1
        }
      })
    }

    const spawn = (i: number, fast: boolean) => {
      if (!pix || n >= cap) return
      const cx = i % cols, cy = Math.floor(i / cols)
      const wI = baseEl.width
      const x = Math.min(wI - 1, cx * S + (S >> 1)), y = Math.min(baseEl.height - 1, cy * S + (S >> 1))
      const o = (y * wI + x) * 4
      const c = (255 << 24) | (pix[o + 2] << 16) | (pix[o + 1] << 8) | pix[o]
      const count = Math.random() < 0.45 ? 2 : 1
      for (let q = 0; q < count && n < cap; q++) {
        px[n] = x + (Math.random() - 0.5) * S
        py[n] = y + (Math.random() - 0.5) * S
        const spd = (fast ? 1.6 : 0.8) * (0.7 + Math.random() * 2.4) * sc
        vx[n] = spd * (0.8 + Math.random() * 0.8)
        vy[n] = -spd * (0.15 + Math.random() * 0.7) + (Math.random() - 0.5) * 0.8 * sc
        maxLife[n] = life[n] = fast ? 45 + Math.random() * 70 : 22 + Math.random() * 34
        col[n] = c
        n++
      }
    }

    const erode = (i: number, now: number, fast = false) => {
      if (!live[i] || st[i] === 1) return
      st[i] = 1
      prog[i] = 0
      regAt[i] = fast ? 0 : now + 90 + Math.random() * 170
      active.add(i)
      spawn(i, fast)
    }

    const kick = () => { if (!raf && !dead) raf = requestAnimationFrame(frame) }

    const frame = (now: number) => {
      raf = 0
      if (dead) return

      // hover brush
      if (ptr.on && src) {
        const rI = RADIUS * sc, cx0 = Math.max(0, Math.floor((ptr.x * sc - rI) / S)), cx1 = Math.min(cols - 1, Math.ceil((ptr.x * sc + rI) / S))
        const cy0 = Math.max(0, Math.floor((ptr.y * sc - rI) / S)), cy1 = Math.min(rows - 1, Math.ceil((ptr.y * sc + rI) / S))
        for (let cy = cy0; cy <= cy1; cy++) {
          for (let cx = cx0; cx <= cx1; cx++) {
            const dx = cx * S + S / 2 - ptr.x * sc, dy = cy * S + S / 2 - ptr.y * sc
            const d = Math.hypot(dx, dy)
            if (d < rI && Math.random() < 0.3 * (1 - d / rI) + 0.07) erode(cy * cols + cx, now)
          }
        }
      }

      // snap wave
      if (snapping) {
        while (snapPtr < snapOrder.length && snapAt[snapOrder[snapPtr]] <= now) erode(snapOrder[snapPtr++], now, true)
        if (reformAt && now >= reformAt) {
          reformAt = 0
          active.forEach((i) => { if (st[i] === 1) regAt[i] = now + ((i % cols) / cols) * 900 + Math.random() * 250 })
          snapping = false
        }
      }

      // regrow
      let changed = false
      active.forEach((i) => {
        if (st[i] === 1 && regAt[i] > 0 && now >= regAt[i]) { st[i] = 2; prog[i] = 0 }
        if (st[i] === 2) {
          prog[i] += 0.2
          if (prog[i] >= 1) { st[i] = 0; active.delete(i) }
        }
        changed = true
      })
      if (changed) paintBase()

      // particles
      if (fxBuf && fxImg) {
        if (n > 0 || fxDirty) {
          fxBuf.fill(0)
          const fw = fxEl.width, fh = fxEl.height, sz = Math.max(1, Math.round(sc * 1.4))
          for (let i = 0; i < n; i++) {
            life[i]--
            if (life[i] <= 0) {
              n--
              px[i] = px[n]; py[i] = py[n]; vx[i] = vx[n]; vy[i] = vy[n]
              life[i] = life[n]; maxLife[i] = maxLife[n]; col[i] = col[n]
              i--
              continue
            }
            vx[i] += 0.035 * sc
            vy[i] += (Math.random() - 0.52) * 0.1 * sc
            px[i] += vx[i]; py[i] += vy[i]
            const a = Math.min(1, (life[i] / maxLife[i]) * 1.6)
            const x0 = (px[i] + mI) | 0, y0 = (py[i] + mI) | 0
            if (x0 < 0 || y0 < 0 || x0 >= fw - sz || y0 >= fh - sz) continue
            const c = ((a * 255) << 24) | (col[i] & 0xffffff)
            for (let yy = 0; yy < sz; yy++) for (let xx = 0; xx < sz; xx++) fxBuf[(y0 + yy) * fw + x0 + xx] = c
          }
          fctx.putImageData(fxImg, 0, 0)
          fxDirty = n > 0
        }
      }

      if (n > 0 || active.size > 0 || ptr.on || snapping) raf = requestAnimationFrame(frame)
    }

    const toLocal = (e: PointerEvent) => {
      const r = wrapEl.getBoundingClientRect()
      ptr.x = ((e.clientX - r.left) / r.width) * W
      ptr.y = ((e.clientY - r.top) / r.height) * H
    }
    const onMove = (e: PointerEvent) => { toLocal(e); ptr.on = true; setTouched(true); kick() }
    const onLeave = () => { ptr.on = false }
    const onDown = (e: PointerEvent) => {
      toLocal(e); setTouched(true)
      if (snapping || !src) return
      snapping = true
      const now = performance.now()
      const order: number[] = []
      snapAt = new Float32Array(cols * rows)
      for (let i = 0; i < cols * rows; i++) {
        if (!live[i] || st[i] === 1) continue
        // The wave starts where you clicked and spreads outward.
        const cx = i % cols, cy = Math.floor(i / cols)
        const d = Math.hypot(cx * S - ptr.x * sc, cy * S - ptr.y * sc) / (Math.hypot(W, H) * sc)
        snapAt[i] = now + d * 1500 + Math.random() * 260
        order.push(i)
      }
      order.sort((a, b) => snapAt[a] - snapAt[b])
      snapOrder = order; snapPtr = 0
      reformAt = now + 3600
      kick()
    }

    wrapEl.addEventListener('pointermove', onMove)
    wrapEl.addEventListener('pointerleave', onLeave)
    wrapEl.addEventListener('pointerdown', onDown)

    const im = new Image()
    im.src = SRC
    im.decode().then(() => { if (dead) return; img = im; build() }).catch(() => {})

    let rt = 0
    const ro = new ResizeObserver(() => {
      clearTimeout(rt)
      rt = window.setTimeout(() => { if (!dead && img) build() }, 150)
    })
    ro.observe(wrapEl)

    return () => {
      dead = true
      cancelAnimationFrame(raf)
      clearTimeout(rt)
      ro.disconnect()
      wrapEl.removeEventListener('pointermove', onMove)
      wrapEl.removeEventListener('pointerleave', onLeave)
      wrapEl.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return (
    <div className={`gp${ready ? ' gp-ready' : ''}`} ref={wrap}>
      <img
        className="gp-img"
        src="/story/avatar-640.webp"
        srcSet="/story/avatar-640.webp 640w, /story/avatar.webp 1120w"
        sizes="(min-width: 900px) 40vw, 80vw"
        alt="Manish Chauhan"
        width={640}
        height={800}
      />
      <canvas className="gp-base" ref={base} aria-hidden="true" />
      <canvas className="gp-fx" ref={fx} aria-hidden="true" />
      <span className={`gp-hint${touched ? ' gone' : ''}`} aria-hidden="true">Hover, or tap me</span>
    </div>
  )
}
