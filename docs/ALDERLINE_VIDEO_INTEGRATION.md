# Alderline Environmental — Video Integration Architecture

**Document Version:** 1.0  
**Status:** Implemented & Verified  
**Target Environment:** Next.js 16 (App Router) / Tailwind CSS v4  

---

## 1. Overview & Strategy

Alderline Environmental utilizes ambient, looped background videos across three strategic touchpoints to communicate environmental field presence, scientific rigor, and natural habitat conservation without distracting from core editorial messaging.

All ambient videos are designed to be:
- **Zero-Audio:** Encoded strictly without audio tracks or with completely silenced audio channels, satisfying modern browser autoplay policies.
- **Loop-Ready:** Trimmed with natural cross-fade or steady-state frames to avoid jarring visual cuts.
- **Fail-Safe:** Paired with static JPG poster frames and fallback static images so users on low-bandwidth networks, data-saver mode, or battery-saver mobile browsers experience a complete and beautiful visual presentation.

---

## 2. Integrated Video Inventory

| Video ID | Filename | Deployment Route | Placement Section | Aspect Ratio | Poster Fallback Asset | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **VID-001** | `hero-ambient.mp4` | `/` (Home) | **S02** Hero Right Panel | 16:9 (`rounded-3xl`) | `IMG-006` (`hero-video-poster.jpg`) & `IMG-005` (`hero-landscape.jpg`) | Ambient sweep of pristine watershed and forested riparian buffer under morning light. |
| **VID-002** | `about-ambient.mp4` | `/about` | **S14** About Mission Showcase | 16:9 (`rounded-2xl`) | `IMG-026` (`about-video-poster.jpg`) | Environmental field survey team conducting wetland soil coring and water quality sampling. |
| **VID-003** | `services-ambient.mp4` | `/services` | **S19** Services Visual Lead | 16:9 (`rounded-2xl`) | `IMG-034` (`services-video-poster.jpg`) | Coastal habitat drone survey tracking intertidal restoration and sediment boundaries. |

---

## 3. Storage & Asset Organization

All video assets are served from the Next.js `public/` directory with explicit cache headers configured in Next.js static asset serving:

```
public/assets/alderline/videos/
├── hero-ambient.mp4       # 1920x1080, H.264, optimized bitrate (VID-001)
├── about-ambient.mp4      # 1920x1080, H.264, optimized bitrate (VID-002)
└── services-ambient.mp4   # 1920x1080, H.264, optimized bitrate (VID-003)
```

Companion posters reside in their corresponding section subdirectories:
- `public/assets/alderline/hero/hero-video-poster.jpg`
- `public/assets/alderline/about/about-video-poster.jpg`
- `public/assets/alderline/services/services-video-poster.jpg`

---

## 4. Frontend Component Implementation Pattern

Every ambient video component conforms to the resilient HTML5 `<video>` structure implemented in Alderline:

```tsx
<div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-[#15190d]/5">
  <video
    autoPlay
    loop
    muted
    playsInline
    poster="/assets/alderline/hero/hero-video-poster.jpg"
    preload="metadata"
    className="w-full h-full object-cover"
    aria-hidden="true"
  >
    <source src="/assets/alderline/videos/hero-ambient.mp4" type="video/mp4" />
    {/* Fallback image for non-video browser environments */}
    <img
      src="/assets/alderline/hero/hero-landscape.jpg"
      alt="Alderline Environmental field research and watershed assessment"
      className="w-full h-full object-cover"
    />
  </video>
  {/* Subtle gradient vignette to integrate with warm sand background */}
  <div className="absolute inset-0 bg-gradient-to-t from-[#15190d]/20 to-transparent pointer-events-none" />
</div>
```

### Critical Attribute Explanations
1. `autoPlay`: Initiates playback automatically without user interaction.
2. `muted`: Required by Chromium, WebKit, and Gecko for unprompted autoplay.
3. `playsInline`: Prevents iOS Safari from forcefully opening videos into native fullscreen mode.
4. `loop`: Continuously loops ambient motion for seamless background presence.
5. `preload="metadata"`: Avoids downloading the complete video payload until the element enters or nears viewport, preserving mobile data.
6. `poster`: Instantly displays an optimized high-resolution screenshot while video segments buffer.
7. `aria-hidden="true"`: Designates the video as purely atmospheric background media, preventing screen reader announcement clutter.

---

## 5. Mobile & Performance Optimizations

### Reduced Motion Query (`prefers-reduced-motion`)
For users with vestibular disorders or motion sensitivity, the global CSS rules in `src/app/globals.css` provide motion suppression:

```css
@media (prefers-reduced-motion: reduce) {
  video {
    animation: none !important;
  }
}
```
In a full production release, a React hook `usePrefersReducedMotion()` can pause video elements automatically via `ref.current.pause()`.

### Mobile Data-Saver & Low-Power Mode
When iOS Safari or Android Chrome activates Low Power Mode, autoplay is blocked by the operating system. Because every `<video>` container includes `poster="/path/to/poster.jpg"`, the interface gracefully degrades into a static, high-resolution editorial photograph with zero layout shift or visual breakage.

---

## 6. Enterprise Production & CDN Scaling Architecture

While serving MP4 files from `public/` is optimal for initial self-contained deployment and staging, high-volume production should adopt specialized video delivery infrastructure:

```
┌─────────────────────────────────────────────────────────────┐
│                   Future Production Architecture            │
└─────────────────────────────────────────────────────────────┘

 [Raw Field Footage] ───> [Transcoding Pipeline (Mux / AWS Elastic Transcoder)]
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       [Adaptive HLS (.m3u8)]        [Direct Fallback MP4]
       (1080p, 720p, 480p, 360p)     (Optimized 720p 1.5Mbps)
               │                               │
               └───────────────┬───────────────┘
                               ▼
                [Edge CDN (Cloudflare Stream)]
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
     Desktop Safari/Chrome                  Mobile Safari
     (Auto-switches to 1080p)            (Drops to 480p on cellular)
```

### Recommended Next Steps for Enterprise Scale:
1. **Cloudflare Stream or Mux Integration:**
   - Migrate raw `.mp4` files to Cloudflare Stream.
   - Utilize lightweight web components (e.g. `<mux-video>`) or native HLS player via `@hls.js`.
2. **AV1 / WebM Alternative Sources:**
   - Add `<source src="...webm" type="video/webm; codecs=vp9" />` ahead of the MP4 source for a 35% reduction in bandwidth consumption on Chromium browsers.
3. **IntersectionObserver Pause/Play:**
   - Attach an `IntersectionObserver` to each ambient container to pause playback when scrolled out of viewport, freeing GPU memory and CPU cycles on mobile devices.
