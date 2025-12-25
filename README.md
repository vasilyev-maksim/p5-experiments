# 👨‍💻 IN PROGRESS

# 📋 TODO

- auto-select first preset by default
- use query params for direct sketch links
- add randomize button for controls
- move sequences declaration code to separate file/folder
- remove param controls margin-top if no presets
- remove animation delay for modal footer when no presets/controls provided
- focus trap for modal (home page links are accessible)
- make WIDTH and HEIGHT a dynamic pro, not a factory func arg (The problem is when we resize canvas (going fullscreen) animation drops)
- FIX: links are not clickable in app header
- tabIndex everywhere
- make opening by link more smooth + disable list animation in bg

# 💡 NICE TO HAVE

- mobile version (?)
- perf opt: use cache for init data (like precomputed partitions array in TILES)
- next/prev animation modal (using keyboard arrows)
- position of preview fragment (in px)
- make animations independent from canvas size (?)
- worm like transition of site header when scrolling down

# ✅ DONE

- fix links to sketches on prod (`base` config is ignored)
- pillars
  - add ending style for pillars (round, triangle, polygon)
  - add wave period as param to pillars
  - add color palette choice control (for pillars)
- make 1st deploy
- full screen mode (using browser native API)
- support links to a specific animation (like `/spiral`)
- presets for params (with gradual transition)
- pulse: make multiple threads in sync but with x-axis shift and color shift
- back button in footer
- player controls (stop, pause, time travel)
- "P" keyboard button as play/pause

# ❌ CANCELED

- more advanced controls: transformers, l/r arrows
- Smooth animation start (with easing)
