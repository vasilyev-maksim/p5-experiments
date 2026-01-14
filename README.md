# 👨‍💻 IN PROGRESS

# 📋 TODO

- make animations independent from canvas size (?)
- catch particular sketch errors (to show other more successful ones)
- each preset may have a timestamp to play animation from (for better showiness)
- add "save as image" button
- use query params for direct sketch links
- add randomize button for controls
- remove param controls margin-top if no presets
- focus trap for modal (home page links are accessible)
- make WIDTH and HEIGHT a dynamic pro, not a factory func arg (The problem is when we resize canvas (going fullscreen) animation drops)
- FIX: links are not clickable in app header
- tabIndex everywhere
- make opening by link more smooth + disable list animation in bg

# 💡 NICE TO HAVE

- move left side bar to the right (?)
- mobile version (?), at least info message inviting to desktop version
- perf opt: use cache for init data (like precomputed partitions array in TILES)
- position of preview fragment (in px)
- worm like transition of site header when scrolling down

# ✅ DONE

- convert all props to `ValueWithHistory`
- remove animation delay for modal footer when no presets/controls provided
- move sequences declaration code to separate file/folder
- make timedelta separate param
  - restore old value after long press
- rerender paused sketch on param change
- move play controls to sketch bottom-center (show up on mouse hover)
  - move playback speed there as well
- call `draw()` manually on preset change
- refactor oscillateBetween (or better signature)
- auto-select first preset by default
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

- next/prev animation modal (using keyboard arrows)
- more advanced controls: transformers, l/r arrows
- Smooth animation start (with easing)
