# 👨‍💻 IN PROGRESS

- tiles
  - add control for origin for animation (coords control)
  * impl flat sin
  - take into account -1..1 range (for animation)\
- color palette
- new type of animation (maybe even an animation type control!)\

# 📋 TODO

- [easy] Add arrows/wasd support to coords control
- [hard] focus trap for modal (home page links are accessible)
- [hard] tabIndex everywhere
- [hard] make opening by link more smooth + disable list animation in bg

- [medium] write meaningful README.md
- [medium] adopt `tiles` and `worm` to new architecture
- [medium] make play controls animation more user friendly
  - hide it by timer after mouse leave
  - keep it visible if pause is on pause
  - show it once on modal expand (even with no mouse hovering)

- [easy] test `Rectangle`
- [easy] test `Worm` and `WormNavigator`
- [easy] back button
- [easy] animate "shuffle presets" button (on modal open)
- [easy] add animated underline for my name link
- [easy] move fullscreen logic from `SketchModal` to `SketchCanvas`
- [easy] top and bottom shadows for sidebar
- [easy] experiment with lights in `cubes`
- [easy] refactor `useViewport`
  - maybe use context to store constant sizes
  - rename to `useSize` [?]
- [easy] make animations independent from canvas size [?]
  - tiles
- [easy] catch particular sketch errors (to show other more successful ones)

# 💡 NICE TO HAVE

- [hard] explicit keyboard usage hints in UI
  - use order number (0-9) of associated control shortcut
  - use "qwerty..." for 11-20
- [hard] city sketch
- [hard] get rid of react-wrapper
- [medium] add "collapse side panel" capabilities [?]
- [hard] think how to use `p.createGraphics` buffer
  - for export
  - to fix rendering issues of `curves` sketch
- [hard] undo/redo mechanism (event sourcing for params and timeDelta)
- [medium] try to use web workers for async calculation of memos in parallel thread
- move left side bar to the right [?]
- mobile version [?], at least info message inviting to desktop version
- [medium] perf opt: use cache for init data (like precomputed WORMS array)
- [easy] position of preview fragment (in px) [?]
- [medium] worm like transition of site header when scrolling down [?]

# ✅ DONE

- [easy] hide "export preset" button in prod
- [easy] redesign `Randomize` button
- [easy] draw fullscreen icon by myself (renders differently on windows)
- [easy] Create custom favicon (use spiral)
- [hard] optimize `SketchModal` (too many rerenders of controls)
- [easy] use "preset in url" only for custom param configs (not presets)
- [medium] each preset may have a timestamp to play animation from (for better showiness)
  - [x] spiral
  - [x] arcs
  - [x] pillars
  - [x] curve
- [medium] selected preset id in url
- [easy][bug] preset gets deselected because of long tail after decimal point (for inner thickness fo ex.) (worms - "hollowness" control)
- [easy][bug] nav back doesn't close sketch modal
- [easy] timeDelta value missing when exporting preset (as well as random seed etc.)
- [medium][bug] sketch previews (tiles) are super buggy when changing screen size / going fullscreen
- [medium] make preview sizes in percentages
- [herd] worms
  - presets
  - try mirror pattern
  - worm tail optimization
  - rename patterns
  - delete redundant patterns
  - new pattern: attractor
  - disable coords input for some patterns
  - remove Worm2
- [hard] presets for `worms`
- [medium] Add `randomSeed` to presets
- [hard] pass props as event payload in contrast with direct props of `ReactP5Wrapper`
  - do the same for time shifts, pauses, rewinds etc.
- [easy] implement playback controls using sketch event [?]
- [medium] refactor timeShift/timeDelta mess in `SketchModal`
- [hard] rethink `AnimatedValue.forceToEnd` usage when exporting sketch as image
- add onScreenResize callback to factory (for pulse bg = black on resize)
- refactor: use `drawGrid` in `cubes` sketch
- rename `playing` => `mode` (`static` | `animated`), `paused` => `playing`
- coordinates control
- add "hollow worm" bool control (second stroke of color black on top of the first)
- move `/p5-experiments/` base url from vite config to .env
- use query params for direct sketch links
- return back sketch start time but leave preset specific (needed for cube)
- beta flag for sketches
- rename timeShift to startTime
- add "save as image" button
- add randomize button for controls and random seed
- "export preset" button
- добавить в AnimatedValue возможность ориентироваться на time, потому что если на паузе, то получится сдвиг (тк вызов nextStep)
- make WIDTH and HEIGHT a dynamic pro, not a factory func arg (The problem is when we resize canvas (going fullscreen) animation drops)
- FIX: links are not clickable in app header (was fixed by itself somehow...)
- pass props to factory as init args
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

- [easy] remove param controls margin-top if no presets
- [easy] redesign `Capture` button
- [hard] don't mismatch preset on the first change (mark it with \*)
- recursive `worms` sourcing (place new worm not randomly, and walk not randomly too)
- rethink zigzags
- next/prev animation modal (using keyboard arrows)
- more advanced controls: transformers, l/r arrows
- Smooth animation start (with easing)
- add diff to `TrackedValue`
- добавить в метод draw аргумент playing (иногда надо по разному реагировать)
- add callback to `TrackedValue.ArrayUtils.someHasChanged` signature as 2nd arg
- returning `TrackedValue` from `getProp()` call makes sense only in `p.updateWithProps`, so pass `getTrackedValue` fn as arg to `updateWithProps` factory method
