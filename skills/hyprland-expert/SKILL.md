---
title: hyprland-expert

name: hyprland-expert
description: Configures and optimizes Hyprland Wayland compositor, including window rules, keybindings, animations, multi-monitor setup, companion tools (waybar, hyprlock, hypridle, hyprpaper), and troubleshooting. Use when setting up or customizing Hyprland, writing hyprland.lua, configuring window rules, creating keybindings, tuning animations, installing companion tools, or debugging Hyprland issues.
license: MIT
compatibility: opencode
metadata:
  author: opencode
  version: "1.0.0"
  domain: specialized
  triggers: hyprland, wayland, tiling wm, window rules, hyprctl, hyprlock, hypridle, hyprpaper, waybar, wofi, rofi, swaync, dwindle, master-stack, scrolling layout, window tape, monocle, hyprpm, plugins, themes, catppuccin, migration, i3, sway, bspwm, dotfiles, security, accessibility, color management, hdr, screen recording, wayland debugging, fractional scaling, icc profile, night light, lua config, hl.config, hl.bind, hl.dsp, hl.curve, hl.animation, hl.window_rule, hl.on, hl.monitor, hl.layout.register, hl.env, hl.exec_cmd, hl.timer, hl.gesture, hl.device, hl.permission, hl.layer_rule, hl.workspace_rule, hl.get_config, hl.dispatch, ux profiles, macos refugee, windows migrant, gnome transplant, layout api, custom layouts, quickshell, ags, eww, astal, hyprpolkitagent, hyprsysteminfo, hyprland-autoname-workspaces, hyprpanel
  role: specialist
  scope: implementation
  output-format: config
  related-skills: devops-engineer
  targets-version: hyprland@0.55
  last-reviewed: 2026-06-08
parent: Specialized
nav_order: 3
render_with_liquid: false
---

# Hyprland Expert

Senior Hyprland configuration specialist with deep expertise in Wayland compositor setup, dynamic tiling window management, and Linux desktop customization.

## Learning Path

This skill supports users at every level. Follow the path that matches your experience:

### 🟢 Beginner — "I just want a working desktop"
1. Start with `references/getting-started.md` — explains what Hyprland is, first launch, annotated config
2. Print `references/cheatsheet.md` for quick reference
3. Use the minimal template in this file to get a working setup fast
4. Explore `references/keybindings.md` to learn essential shortcuts
5. Add basic `references/window-rules.md` for common apps
6. Check `references/troubleshooting.md` if something breaks
7. Set up companion tools from `references/companion-tools.md`

### 🟡 Intermediate — "I want to optimize my workflow"
1. Organize config into modules using `source=` directives
2. Study `references/workflow-patterns.md` for dev/design/productivity/gaming setups
3. Customize animations in `references/animations.md`
4. Write custom scripts from `references/scripts-and-ipc.md`
5. Add per-application window rules from `references/window-rules.md`
6. Fine-tune keybindings with workflow groups from `references/keybindings.md`
7. Apply a theme from `references/theming.md` across the whole ecosystem
8. Manage dotfiles with the strategies in `references/getting-started.md`

### 🔴 Expert — "I want full control"
1. Migrate to Lua config (v0.55+) with `references/lua-deep-dive.md`
2. Explore the Scrolling Layout and Monocle Layout — see the Layouts section in `references/workflow-patterns.md`
3. Create custom tiling layouts using the Layout API (v0.55+) — see `references/lua-deep-dive.md`
4. Write IPC event-driven scripts from `references/scripts-and-ipc.md`
5. Add plugins via `hyprpm` from `references/plugins.md`
6. Set up color-managed workflow from `references/color-management.md`
7. Migrate from i3/sway/bspwm using `references/migration-guides.md`
8. Build from source for bleeding-edge features
9. Contribute to Hyprland upstream

## Core Workflow

### Beginner Track
1. **Assess environment** - Identify GPU (AMD/NVIDIA/Intel), monitor layout, distro (Arch/Fedora/Debian/NixOS), Hyprland version
2. **Install & launch** - Follow distro-specific install, log into Hyprland for the first time
3. **Copy starter config** - Use the annotated minimal config from `references/getting-started.md`
4. **Learn essential keybindings** - Focus, close, switch workspace, launch apps
5. **Add a bar** - Install and configure waybar
6. **Test & iterate** - `hyprctl reload`, fix issues from `references/troubleshooting.md`
7. **Done** — You have a functional Hyprland desktop. Explore the intermediate path when ready.

### Intermediate Track
1. **Assess environment** — Identify GPU, monitor layout, distro, Hyprland version (v0.55+ uses Lua)
2. **Configure core** — Set up `hyprland.lua` using the `hl.*` API namespace: monitors, input, general, decoration, misc
3. **Set window rules** — Define match props (class, title, initialClass) and effects (float, fullscreen, workspace, opacity, etc.)
4. **Bind keys** — Map keybindings for window management, launchers, screenshots, media controls
5. **Add animations & theming** — Configure bezier curves, animation presets, gaps, rounding, blur, shadows
6. **Integrate companion tools** — Set up waybar, hyprlock, hypridle, hyprpaper, xdg-desktop-portal-hyprland, notification daemon
7. **Validate** — Run `hyprctl reload`, test keybindings, check logs with `journalctl -f -u hyprland`

### Expert Track
1. **Migrate to Lua** — Convert `hyprland.conf` to `hyprland.lua` using the `hl.*` API namespace
2. **Write IPC scripts** — Use `hyprctl` + socket events for dynamic desktop behavior
3. **Create dynamic workflows** — Event-driven workspace management, conditional rules
4. **Add plugins** — Use `hyprpm` for touch gestures, workspace overview, title bars, enhanced borders
5. **Color management** — Load ICC profiles, enable HDR, configure night light
6. **Migrate from another WM** — Translate i3/sway/bspwm configs with `references/migration-guides.md`
7. **Performance tune** — Profile rendering, optimize for gaming/HDR/VRR
8. **Extend Hyprland** — Build from source, explore plugin API, write custom plugins

## FAQs

### "How do I start?"
Install Hyprland, log in, then follow `references/getting-started.md`. You'll have a working desktop in 10 minutes.

### "How do I make Hyprland look good?"
Add `decoration { blur, drop_shadow }`, configure `animations` with smooth bezier curves, install waybar with a theme, use hyprpaper for wallpapers. See `references/companion-tools.md`.

### "How do I make my apps open on the right workspace?"
Use window rules: `windowrulev2=workspace 2,class:^(firefox)$`. See `references/window-rules.md`.

### "How do I fix [something]?"
Check `references/troubleshooting.md` — covers blank screen, keybinding issues, NVIDIA, screen sharing, and performance.

### "Should I use Lua or hyprlang?"
**Use Lua.** hyprlang has been deprecated since Hyprland v0.55 (May 2026) and will be removed in 1–2 releases. All new configs should use `hyprland.lua`. Use the `hl.*` namespace (`hl.monitor()`, `hl.config()`, `hl.bind()`, `hl.window_rule()`, etc.) — do not use `hyprland.*`. See `references/lua-deep-dive.md` for complete API reference.

### "What is the hl.* namespace?"
The `hl.*` namespace is the canonical Lua API in Hyprland v0.55+. All config functions use the `hl` prefix: `hl.config()`, `hl.bind()`, `hl.monitor()`, `hl.window_rule()`, `hl.on()`, `hl.dsp.*` dispatchers, `hl.exec_cmd()`, `hl.curve()`, `hl.animation()`, `hl.layout.register()`, `hl.timer()`, `hl.dispatch()`, `hl.env()`, etc. The `hyprland.*` alias is NOT guaranteed to work — always use `hl.*`.

### "How do I get started with a pre-built opinionated config?"
Choose your UX persona from `references/ux-profiles.md`: macOS Refugee, Windows Migrant, GNOME Transplant, Gamer, Developer, or Designer. Each profile is a complete drop-in `hyprland.lua` config tuned for that user's expectations, with theme, keybindings, autostart, and companion tools included.

### "How do I switch from i3/sway/bspwm?"
See `references/migration-guides.md` — side-by-side configs, tool replacements, and checklists for each source WM.

### "Hyprland keeps regenerating hyprland.conf when I delete it!"

This happens when Hyprland starts without finding a config at all — it auto-generates a stub `hyprland.conf` with `autogenerated=1`. To use Lua config:
1. Create `hyprland.lua` first
2. Delete the stub `hyprland.conf`
3. **Log out and log back in** — `configProvider` is set at session start; `hyprctl reload` cannot change it

If you already deleted the conf and see regeneration, just create `hyprland.lua` before the next logout, then restart the session.

### "How do I make Hyprland look like the screenshots I see?"
Apply a Catppuccin Mocha theme across hyprland.lua, waybar, rofi, ghostty, and swaync. See `references/theming.md` for full ecosystem drop-in configs.

### "What plugins should I install?"
Start with `hyprspace` (workspace overview) and `hyprbars` (title bars). For laptops, add `hyprgrass` (touch gestures). See `references/plugins.md`.

### "How do I record my screen?"
Use `wf-recorder` for CLI, OBS Studio with PipeWire for GUI. See `references/companion-tools.md` for install and usage.

### "How do I manage my dotfiles?"
See `references/getting-started.md` for 4 approaches: git bare repo, GNU Stow, chezmoi, or Nix home-manager.

### "How do I set up HDR?"
Enable `misc { hdr=true }` and verify monitor support. See `references/color-management.md` for HDR + SDR tone mapping.

### "Is Hyprland accessible?"
It supports sticky keys, slow keys, on-screen keyboards, screen readers, and high contrast mode. See `references/accessibility.md`.

## Reference Guide

| Topic | Reference | Best For | Load When |
|-------|-----------|----------|-----------|
| Getting Started | `references/getting-started.md` | Beginner | First-time setup, learning basics |
| Cheatsheet | `references/cheatsheet.md` | All levels | Quick syntax lookup |
| Core Config | `references/hyprland-conf.md` | All levels | Writing or editing `hyprland.conf` |
| Window Rules | `references/window-rules.md` | Intermediate | Defining window matching and behavior |
| Keybindings | `references/keybindings.md` | All levels | Setting up keyboard shortcuts |
| Animations | `references/animations.md` | Intermediate | Tuning animation curves and presets |
| Companion Tools | `references/companion-tools.md` | All levels | Installing/configuring waybar, hyprlock, etc. |
| Distro-Specific | `references/distro-notes.md` | All levels | Installing on Arch, Fedora, Debian, NixOS |
| Troubleshooting | `references/troubleshooting.md` | All levels | Debugging common issues |
| Workflow Patterns | `references/workflow-patterns.md` | Intermediate→Expert | Dev, design, gaming, productivity setups |
| Scripts & IPC | `references/scripts-and-ipc.md` | Expert | Custom scripts, hyprctl, event-driven config |
| Lua Deep Dive | `references/lua-deep-dive.md` | Expert | v0.55+ Lua config, events, timers |
| Theming | `references/theming.md` | All levels | 5 theme palettes, ecosystem coordination, Catppuccin config pack |
| Migration Guides | `references/migration-guides.md` | Intermediate→Expert | i3/sway/bspwm → Hyprland side-by-side configs |
| Plugins | `references/plugins.md` | Expert | hyprpm, plugin index, conflicts, custom plugin template |
| Security | `references/security.md` | Intermediate | Wayland security model, screen lock, clipboard, polkit |
| Accessibility | `references/accessibility.md` | All levels | Sticky keys, on-screen keyboard, screen reader, high contrast |
| Color Management | `references/color-management.md` | Expert | ICC profiles, HDR, night light, color-accurate workflow |
| UX Profiles | `references/ux-profiles.md` | All levels | 6 drop-in persona configs (macOS, Windows, GNOME, Gamer, Dev, Design) |

## Key Concepts

### Config Structure

```
~/.config/hypr/
├── hyprland.lua           # Main config (Lua syntax, v0.55+, recommended)
├── hyprland.conf          # Legacy config (hyprlang, deprecated since v0.55)
├── configs/               # Modular configs sourced from main
│   ├── monitors.conf
│   ├── keybinds.conf
│   ├── window_rules.conf
│   └── exec.conf
├── scripts/               # Helper scripts
├── animations/            # Animation presets
└── themes/                # Theme definitions
```

### Distro Support Matrix

| Distro | Install Command | Package Notes | Init |
|--------|----------------|---------------|------|
| Arch | `sudo pacman -S hyprland` | AUR: `hyprland-nvidia`, `hyprland-git` | systemd |
| Fedora | `sudo dnf install hyprland` | COPR `solopasha/hyprland` for newer versions | systemd |
| Debian | `sudo apt install hyprland` | Backports for newer versions; check `apt policy hyprland` | systemd |
| NixOS | `programs.hyprland.enable = true;` | Flake or nixpkgs-unstable for v0.55+ | systemd |

### Config Sections — Lua API (`hl.*` namespace)

In Lua configs (`hyprland.lua`), use `hl.config({ ... })` to set most section-based settings. Key API functions:

| API Call | Purpose | Equivalent to hyprlang |
|----------|---------|----------------------|
| `hl.monitor({...})` | Display setup | `monitor=` |
| `hl.config({input={...}})` | Keyboard, mouse, touchpad | `input {}` |
| `hl.config({general={...}})` | Gaps, border, layout | `general {}` |
| `hl.config({decoration={...}})` | Rounding, blur, shadows | `decoration {}` |
| `hl.curve()` / `hl.animation()` | Bezier curves and animation presets | `animations {}` |
| `hl.config({misc={...}})` | Logo, splash, DPMS | `misc {}` |
| `hl.window_rule({...})` | Match windows with named rules | `windowrule=`, `windowrulev2=` |
| `hl.bind(...)` | Keybindings with dispatcher functions | `bind=` |
| `hl.env(...)` | Environment variables | `env=` |
| `hl.on("hyprland.start", ...)` | Autostart commands | `exec-once=` |

### Lua Config (v0.55+) — Primary Configuration Language

Since Hyprland v0.55 (May 2026), Lua is the **primary** config language. hyprlang is deprecated. Create `hyprland.lua` instead of `hyprland.conf`:

```lua
-- hyprland.lua
hl.monitor({ output = "DP-1", mode = "2560x1440@144", position = "0x0", scale = 1 })
hl.monitor({ output = "HDMI-A-1", mode = "1920x1080@60", position = "2560x0", scale = 1 })

hl.config({
    input = {
        kb_layout = "us",
        kb_variant = "",
        follow_mouse = 1,
        touchpad = {
            natural_scroll = true,
            ["tap-to-click"] = true,
        },
    },
    general = {
        gaps_in = 5,
        gaps_out = 10,
        border_size = 2,
        layout = "dwindle",
    },
    decoration = {
        rounding = 10,
        active_opacity = 1.0,
        inactive_opacity = 0.9,
        blur = {
            enabled = true,
            size = 3,
            passes = 1,
        },
        shadow = {
            enabled = true,
            range = 4,
        },
    },
})

hl.window_rule({ name = "float-pavucontrol", match = { class = "^pavucontrol$" }, float = true })
hl.window_rule({ name = "float-blueman", match = { class = "^blueman-manager$" }, float = true })
hl.window_rule({ name = "ws-firefox", match = { class = "^firefox$" }, workspace = "2" })

hl.bind("SUPER + Return", hl.dsp.exec_cmd("ghostty"))
hl.bind("SUPER + Q", hl.dsp.window.close())
hl.bind("SUPER + Space", hl.dsp.window.float({ action = "toggle" }))
hl.bind("SUPER + F", hl.dsp.window.fullscreen())
hl.bind("SUPER + Shift + Q", hl.dsp.exit())

hl.on("hyprland.start", function()
    hl.exec_cmd("waybar")
    hl.exec_cmd("hyprpaper")
    hl.exec_cmd("hypridle")
end)
```

## Constraints

### MUST DO
- Use `hyprctl monitors` to get correct monitor names before configuring
- Set proper environment variables for Wayland (`GDK_BACKEND`, `QT_QPA_PLATFORM`, `SDL_VIDEODRIVER`, `ELECTRON_OZONE_PLATFORM_HINT`)
- Configure `xdg-desktop-portal-hyprland` for screen sharing
- Test window rules with `hyprctl clients` to verify class/title matching
- Handle multi-monitor with explicit workspace assignments
- Use `hyprctl reload` to apply config changes without restarting
- **Delete stub `hyprland.conf` with `autogenerated=1`** before using Lua config, then restart session
- **Remember `configProvider` is fixed at session start** — after switching from hyprlang to Lua (or vice versa), a full login/logout is required
- **`hl.monitor({scale=...})` changes require a full restart**, not just `hyprctl reload`; use `hyprctl keyword monitor "NAME,RES,POS,SCALE"` for runtime-only scale changes

### MUST NOT DO
- Use `autogenerated=1` in hyprland.conf (prevents manual edits from persisting)
- Hardcode monitor names without verifying with `hyprctl monitors`
- Ignore NVIDIA-specific requirements if using NVIDIA GPU
- Use blocking `exec` instead of `exec-once` for autostart
- Skip Polkit/seatd setup (will cause Hyprland launch failures)
- Force Wayland on applications known to break (e.g. 1password needs special handling)

## Templates

### Minimal `hyprland.lua`

```lua
-- ~/.config/hypr/hyprland.lua
-- Minimal Hyprland Lua config (v0.55+)

-- == MONITORS ==
-- Replace with your monitors from `hyprctl monitors`
hl.monitor({
    output   = "eDP-1",
    mode     = "preferred",
    position = "0x0",
    scale    = 1,
})

-- == INPUT & APPEARANCE ==
hl.config({
    input = {
        kb_layout = "us",
        kb_variant = "",
        follow_mouse = 1,
        touchpad = {
            natural_scroll = true,
            ["tap-to-click"] = true,
        },
    },
    general = {
        gaps_in = 5,
        gaps_out = 10,
        border_size = 2,
        layout = "dwindle",
    },
    decoration = {
        rounding = 10,
        active_opacity = 1.0,
        inactive_opacity = 0.9,
        blur = {
            enabled = true,
            size = 3,
            passes = 1,
        },
        shadow = {
            enabled = true,
            range = 4,
        },
    },
})

-- == ANIMATIONS ==
hl.curve("myBezier", { 0.05, 0.9, 0.1, 1.05 })
hl.animation("windows", { enabled = true, speed = 7, curve = "myBezier" })
hl.animation("fade", { enabled = true, speed = 7 })
hl.animation("workspaces", { enabled = true, speed = 6 })

-- == WINDOW RULES ==
hl.window_rule({ name = "float-pavucontrol", match = { class = "^pavucontrol$" }, float = true })
hl.window_rule({ name = "float-blueman", match = { class = "^blueman-manager$" }, float = true })
hl.window_rule({ name = "ws-firefox", match = { class = "^firefox$" }, workspace = "1" })
hl.window_rule({ name = "ws-code", match = { class = "^code$" }, workspace = "2" })

-- == KEYBINDS ==
local mod = "SUPER"
hl.bind(mod .. " + Return", hl.dsp.exec_cmd("ghostty"))
hl.bind(mod .. " + Q", hl.dsp.window.close())
hl.bind(mod .. " + Space", hl.dsp.window.float({ action = "toggle" }))
hl.bind(mod .. " + F", hl.dsp.window.fullscreen())
hl.bind(mod .. " + left", hl.dsp.window.focus({ direction = "l" }))
hl.bind(mod .. " + right", hl.dsp.window.focus({ direction = "r" }))
hl.bind(mod .. " + up", hl.dsp.window.focus({ direction = "u" }))
hl.bind(mod .. " + down", hl.dsp.window.focus({ direction = "d" }))
hl.bind(mod .. " + Shift + left", hl.dsp.window.move({ direction = "l" }))
hl.bind(mod .. " + Shift + right", hl.dsp.window.move({ direction = "r" }))
hl.bind(mod .. " + Shift + up", hl.dsp.window.move({ direction = "u" }))
hl.bind(mod .. " + Shift + down", hl.dsp.window.move({ direction = "d" }))
hl.bind(mod .. " + 1", hl.dsp.dispatch("workspace", "1"))
hl.bind(mod .. " + 2", hl.dsp.dispatch("workspace", "2"))
hl.bind(mod .. " + 3", hl.dsp.dispatch("workspace", "3"))
hl.bind(mod .. " + 4", hl.dsp.dispatch("workspace", "4"))
hl.bind(mod .. " + Shift + 1", hl.dsp.dispatch("movetoworkspace", "1"))
hl.bind(mod .. " + Shift + 2", hl.dsp.dispatch("movetoworkspace", "2"))
hl.bind(mod .. " + Shift + 3", hl.dsp.dispatch("movetoworkspace", "3"))
hl.bind(mod .. " + Shift + 4", hl.dsp.dispatch("movetoworkspace", "4"))
hl.bind(mod .. " + Shift + Q", hl.dsp.exit())

-- == AUTOSTART ==
hl.on("hyprland.start", function()
    hl.exec_cmd("waybar")
    hl.exec_cmd("hyprpaper")
    hl.exec_cmd("hypridle")
end)

-- == ENVIRONMENT ==
hl.env("XCURSOR_SIZE", "24")
hl.env("HYPRCURSOR_SIZE", "24")
hl.env("GDK_BACKEND", "wayland,x11,*")
hl.env("QT_QPA_PLATFORM", "wayland;xcb")
hl.env("SDL_VIDEODRIVER", "wayland")
```

### Multi-Monitor Setup

```conf
monitor=DP-1,2560x1440@144,0x0,1
monitor=HDMI-A-1,1920x1080@60,2560x0,1

workspace=1,monitor:DP-1,default:true
workspace=2,monitor:DP-1
workspace=3,monitor:HDMI-A-1,default:true
workspace=4,monitor:HDMI-A-1
```

### Window Rules Reference (Lua API)

```lua
hl.window_rule({ name = "float",       match = { class = "^(pavucontrol|blueman-manager)$" }, float = true })
hl.window_rule({ name = "ws-browser",  match = { class = "^(firefox)$" }, workspace = "1" })
hl.window_rule({ name = "ws-dev",      match = { class = "^(code|ghostty)$" }, workspace = "2" })
hl.window_rule({ name = "fullscreen",  match = { class = "^(firefox)$" }, fullscreen = true })
hl.window_rule({ name = "nofocus",     match = { class = "^(waybar)$" }, focus = false })
hl.window_rule({ name = "noborder",    match = { class = "^(rofi)$" }, border = false })
hl.window_rule({ name = "pin",         match = { class = "^(firefox)$" }, pin = true })
hl.window_rule({ name = "dimaround",   match = { class = "^(rofi)$" }, dim_around = true })
hl.window_rule({ name = "suppress",    match = { class = "^(steam)$" }, suppressevent = "fullscreen" })
```

### Debug Commands

```bash
hyprctl monitors           # List monitors
hyprctl clients            # List windows with class/title
hyprctl activewindow       # Current window info
hyprctl keyword            # Check/set config values at runtime
hyprctl reload             # Reload config
hyprctl dispatch           # Execute dispatcher commands
journalctl -f -u hyprland  # Live Hyprland logs
journalctl --user -f       # User service logs (waybar, etc.)
```

## Output Templates

When implementing Hyprland features, provide:
1. Complete config snippet with explanation of each section
2. Monitor layout with explicit workspace assignments
3. Window rules with regex patterns and effects
4. Keybinding scheme organized by category
5. Companion tool integration steps
6. Validation commands to verify the setup
