# UX Profiles Reference

Pick a persona that matches how you want your desktop to feel. Each includes a **paste-ready `hyprland.lua`** — just change your monitor names and keyboard layout.

## Quick Guide

| I want it to feel like... | Jump to |
|---|---|
| macOS — top bar, smooth, polished | [macOS Refugee](#-macos-refugee) |
| Windows — taskbar, start menu, familiar | [Windows Migrant](#-windows-migrant) |
| GNOME — overview, clean, simple | [GNOME Transplant](#-gnome-transplant) |
| Gaming rig — minimal chrome, VRR, performance | [Gamer](#-gamer) |
| Dev machine — terminal-heavy, vim, scratchpad | [Developer](#-developer) |
| Creative workstation — color-accurate, float tools | [Designer](#-designer) |

---

##  macOS Refugee

**Vibe:** A polished, smooth desktop with a top menu bar, smooth animations, and keyboard shortcuts that feel like macOS. Your workflows stay the same — just the window manager changes.

### Key Decisions

| Area | Choice | Why |
|------|--------|-----|
| Bar framework | Quickshell (top, ~/Quickshell/bar.qml) | Menubar-style bar at the top, QML-native smooth animations |
| Launcher | rofi (Cmd+Space) | Spotlight replacement |
| Notifications | swaync | Banner-style notifications like macOS |
| Wallpaper | hyprpaper | Smooth crossfade transitions |
| Lock screen | hyprlock (or loginctl) | Native, good macOS-like blur |
| Mod key | SUPER (acts as Cmd) | Cmd+Q = quit, Cmd+W = close, etc. |
| Layout | Master-stack | Primary window on left/right like macOS split |
| Animations | Smooth + popin | Scale/fade effects reminiscent of Dock genie |
| Theme | Catppuccin Latte (light) or Mocha (dark) | Clean, polished, matches macOS aesthetic |
| Window behavior | Float dialogs, tile editors/terminals | macOS mixes floating panels with tiled splits |

### Drop-In Lua Config

Save as `~/.config/hypr/hyprland.lua`:

```lua
-- ~/.config/hypr/hyprland.lua
-- macOS Refugee Profile

-- == MONITORS ==
-- Replace with your monitors from `hyprctl monitors`
hl.monitor({
    output   = "DP-1",
    mode     = "2560x1440@144",
    position = "0x0",
    scale    = 1,
})
hl.monitor({
    output   = "HDMI-A-1",
    mode     = "1920x1080@60",
    position = "2560x0",
    scale    = 1,
})

-- == INPUT ==

hl.config({
    input = {
        kb_layout = "us",
        kb_variant = "",
        follow_mouse = 1,
        numlock_by_default = true,
        touchpad = {
            natural_scroll = true,
            drag_lock = true,
        },
    },
    general = {
        gaps_in = 5,
        gaps_out = 12,
        border_size = 1,
        col = {
            active_border = { colors = {"rgba(cba6f7ee)", "rgba(89b4faee)"}, angle = 45 },
            inactive_border = "rgba(45475aee)",
        },
        layout = "master",
    },
    decoration = {
        rounding = 12,
        active_opacity = 1.0,
        inactive_opacity = 0.92,
        fullscreen_opacity = 1.0,
        blur = {
            enabled = true,
            size = 4,
            passes = 2,
            new_optimizations = true,
        },
        shadow = {
            enabled = true,
            range = 8,
            render_power = 3,
            color = "rgba(11111b44)",
        },
    },
    misc = {
        disable_hyprland_logo = true,
        disable_splash_rendering = true,
        mouse_move_enables_dpms = true,
        key_press_enables_dpms = true,
        enable_swallow = true,
        swallow_regex = "^(com\\.mitchellh\\.ghostty|alacritty|foot)$",
        force_default_wallpaper = 0,
    },
})

hl.curve("smooth", { type = "bezier", points = {{0.04, 0.83}, {0.19, 0.98}} })
hl.curve("bounce", { type = "bezier", points = {{0.13, 0.99}, {0.29, 1.1}} })
hl.animation({ leaf = "global", enabled = true, speed = 10, bezier = "default" })
hl.animation({ leaf = "windows", enabled = true, speed = 7, bezier = "smooth", style = "popin" })
hl.animation({ leaf = "windowsOut", enabled = true, speed = 7, bezier = "smooth", style = "popin" })
hl.animation({ leaf = "fade", enabled = true, speed = 8, bezier = "default" })
hl.animation({ leaf = "workspaces", enabled = true, speed = 6, bezier = "smooth" })
hl.animation({ leaf = "borderangle", enabled = true, speed = 100, bezier = "default", style = "once" })

-- == APPEARANCE ==
local mod = "SUPER"
local terminal = "ghostty"
local browser = "firefox"

-- == WINDOW RULES ==
hl.window_rule({
    name  = "float-pavucontrol-blueman-manager-gnome-calculator-org.gnome.Nautilus",
    match = { class = "^(pavucontrol|blueman-manager|gnome-calculator|org.gnome.Nautilus)$" },
    float = true,
})
hl.window_rule({
    name  = "float-firefox",
    match = { class = "^(firefox)$", title = "^(Picture-in-Picture|Library)$" },
    float = true,
})
hl.window_rule({
    name  = "ws-custom",
    match = { class = "^" .. terminal .. "$" },
    workspace = "1",
})
hl.window_rule({
    name  = "ws-custom",
    match = { class = "^" .. browser .. "$" },
    workspace = "2",
})
hl.window_rule({
    name  = "ws-Code-jetbrains-idea",
    match = { class = "^(Code|jetbrains-idea)$" },
    workspace = "3",
})
-- Note: per-window opacity is not available in the Lua API as of v0.55

-- == KEYBINDINGS (macOS-style) ==
-- App launcher (Spotlight: Cmd+Space)
hl.bind(mod .. " + Space", hl.dsp.exec_cmd("rofi -show drun"))

-- Close/kill (Cmd+Q = quit app, Cmd+W = close window)
hl.bind(mod .. " + Q", hl.dsp.window.close())
hl.bind(mod .. " + W", hl.dsp.exec_cmd("hyprctl dispatch killactive"))

-- Fullscreen (green button: Cmd+F)
hl.bind(mod .. " + F", hl.dsp.window.fullscreen())

-- Toggle float (Cmd+D)
hl.bind(mod .. " + D", hl.dsp.window.float({ action = "toggle" }))

-- Minimize (Cmd+M — sends to special workspace)
hl.bind(mod .. " + M", hl.dsp.window.move({ workspace = "special:minimized" }))

-- Focus movement (arrows + Vim keys)
hl.bind(mod .. " + left", hl.dsp.focus({ direction = "l" }))
hl.bind(mod .. " + right", hl.dsp.focus({ direction = "r" }))
hl.bind(mod .. " + up", hl.dsp.focus({ direction = "u" }))
hl.bind(mod .. " + down", hl.dsp.focus({ direction = "d" }))
hl.bind(mod .. " + H", hl.dsp.focus({ direction = "l" }))
hl.bind(mod .. " + J", hl.dsp.focus({ direction = "d" }))
hl.bind(mod .. " + K", hl.dsp.focus({ direction = "u" }))
hl.bind(mod .. " + L", hl.dsp.focus({ direction = "r" }))

-- Move windows (Cmd+Opt+arrows)
hl.bind(mod .. " SHIFT" .. " + left", hl.dsp.window.move({ direction = "l" }))
hl.bind(mod .. " SHIFT" .. " + right", hl.dsp.window.move({ direction = "r" }))
hl.bind(mod .. " SHIFT" .. " + up", hl.dsp.window.move({ direction = "u" }))
hl.bind(mod .. " SHIFT" .. " + down", hl.dsp.window.move({ direction = "d" }))

-- Workspaces (Cmd+number)
for i = 1, 9 do
    hl.bind(mod .. " + " .. tostring(i), hl.dsp.focus({ workspace = tostring(i) }))
    hl.bind(mod .. " SHIFT" .. " + " .. tostring(i), hl.dsp.window.move({ workspace = tostring(i) }))
end

-- Mission Control / Overview (Ctrl+Up like macOS)
hl.bind("CTRL" .. " + Up", hl.dsp.exec_cmd("rofi -show window"))
hl.bind(mod .. " + Tab", hl.dsp.window.group("next"))

-- Exit (Cmd+Opt+Esc)
hl.bind(mod .. " SHIFT" .. " + Escape", hl.dsp.exit())

-- Scratchpad (Cmd+grave)
hl.bind(mod .. " + grave", hl.dsp.workspace.toggle_special("scratchpad"))
hl.bind(mod .. " SHIFT" .. " + grave", hl.dsp.window.move({ workspace = "special:scratchpad" }))

-- Mouse scrolling for workspaces
hl.bind(mod .. " + mouse_down", hl.dsp.focus({ workspace = "e+1" }))
hl.bind(mod .. " + mouse_up", hl.dsp.focus({ workspace = "e-1" }))

-- Media keys
hl.bind("XF86AudioRaiseVolume", hl.dsp.exec_cmd("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+"), { locked = true })
hl.bind("XF86AudioLowerVolume", hl.dsp.exec_cmd("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-"), { locked = true })
hl.bind("XF86AudioMute", hl.dsp.exec_cmd("wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle"), { locked = true })
hl.bind("XF86AudioPlay", hl.dsp.exec_cmd("playerctl play-pause"), { locked = true })

-- == ENVIRONMENT ==
hl.env("XCURSOR_SIZE", "24")
hl.env("HYPRCURSOR_SIZE", "24")
hl.env("GDK_BACKEND", "wayland,x11,*")
hl.env("QT_QPA_PLATFORM", "wayland;xcb")
hl.env("SDL_VIDEODRIVER", "wayland")
hl.env("CLUTTER_BACKEND", "wayland")
hl.env("ELECTRON_OZONE_PLATFORM_HINT", "auto")

-- == AUTOSTART ==
hl.on("hyprland.start", function()
    hl.exec_cmd("quickshell ~/.config/quickshell/bar.qml")
    hl.exec_cmd("hyprpaper")
    hl.exec_cmd("hypridle")
    hl.exec_cmd("swaync")
    hl.exec_cmd("/usr/libexec/hyprpolkitagent")
    hl.exec_cmd("sleep 5; nm-applet")
end)
```

### Tweak Further

- [Bar: customize Quickshell QML](companion-tools.md#quickshell-qt6qml)
- [Theme: Catppuccin ecosystem drop-in](theming.md#catppuccin-mocha)
- [Keybindings: full reference](keybindings.md)
- [Animations: tweak curves and presets](animations.md)
- [Window rules: more app rules](window-rules.md)

---

## 🪟 Windows Migrant

**Vibe:** A familiar Windows-like desktop with a taskbar at the bottom, Win key shortcuts, snap-like tiling, and minimal animations. Zero learning curve for Windows power users.

### Key Decisions

| Area | Choice | Why |
|------|--------|-----|
| Bar framework | Waybar (bottom, taskbar-style) | Bottom bar with active window indicators like Windows taskbar |
| Launcher | wofi (Win key, type to search) | Start menu replacement |
| Notifications | swaync | Action center feel |
| Wallpaper | hyprpaper | Simple, no transitions |
| Lock screen | hyprlock (or loginctl) | Blur background like Windows lock |
| Mod key | SUPER (Win key) | Win+arrow = snap, Win+D = show desktop |
| Layout | Dwindle | PowerToys FancyZones-like window splitting |
| Animations | Minimal, fast | Windows restrained animation style |
| Theme | Dracula or Nord | Clean, neutral, professional |
| Window behavior | Float most dialogs, fullscreen on maximize | Like Windows: some floating, some tiled |

### Drop-In Lua Config

Save as `~/.config/hypr/hyprland.lua`:

```lua
-- ~/.config/hypr/hyprland.lua
-- Windows Migrant Profile

-- == MONITORS ==
hl.monitor({
    output   = "DP-1",
    mode     = "2560x1440@144",
    position = "0x0",
    scale    = 1,
})
hl.monitor({
    output   = "HDMI-A-1",
    mode     = "1920x1080@60",
    position = "2560x0",
    scale    = 1,
})

-- == INPUT ==

hl.config({
    input = {
        kb_layout = "us",
        follow_mouse = 0,
        numlock_by_default = true,
        touchpad = {
            natural_scroll = false,
        }
    },
    general = {
        gaps_in = 4,
        gaps_out = 8,
        border_size = 1,
        col = {
            active_border = "rgba(8a9ba8ff)",
            inactive_border = "rgba(3b4252ff)",
        },
        layout = "dwindle",
    },
    decoration = {
        rounding = 4,
        active_opacity = 1.0,
        inactive_opacity = 1.0,
        blur = { enabled = false },
        shadow = {
            enabled = true,
            range = 4,
            color = "rgba(00000044)",
        },
    },
    misc = {
        disable_hyprland_logo = true,
        disable_splash_rendering = true,
        mouse_move_enables_dpms = true,
        key_press_enables_dpms = true,
        enable_swallow = true,
        swallow_regex = "^(com\\.mitchellh\\.ghostty|alacritty|foot)$",
        force_default_wallpaper = 0,
    },
})

hl.curve("fast", { type = "bezier", points = {{0.0, 0.0}, {0.2, 1.0}} })
hl.animation({ leaf = "global", enabled = true, speed = 3, bezier = "default" })
hl.animation({ leaf = "windows", enabled = true, speed = 4, bezier = "fast" })
hl.animation({ leaf = "windowsOut", enabled = true, speed = 3, bezier = "fast" })
hl.animation({ leaf = "fade", enabled = true, speed = 3, bezier = "default" })
hl.animation({ leaf = "workspaces", enabled = true, speed = 2, bezier = "default" })

-- == APPEARANCE ==
local mod = "SUPER"
local terminal = "ghostty"
local browser = "firefox"

-- == WINDOW RULES ==
hl.window_rule({
    name  = "float-pavucontrol-blueman-manager-gnome-calculator-org.gnome.Nautilus",
    match = { class = "^(pavucontrol|blueman-manager|gnome-calculator|org.gnome.Nautilus)$" },
    float = true,
})
hl.window_rule({
    name  = "float-custom",
    match = { class = "^" .. terminal .. "$", title = "^(Settings|Preferences)$" },
    float = true,
})
hl.window_rule({
    name  = "ws-custom",
    match = { class = "^" .. browser .. "$" },
    workspace = "1",
})
hl.window_rule({
    name  = "ws-custom",
    match = { class = "^" .. terminal .. "$" },
    workspace = "2",
})

-- == KEYBINDINGS (Windows-style) ==
-- Start menu: Win key opens launcher
hl.bind(mod .. " + D", hl.dsp.exec_cmd("wofi --show drun"))

-- Close window (Alt+F4)
hl.bind("ALT" .. " + F4", hl.dsp.window.close())

-- Snap-like window management (Win+arrows)
hl.bind(mod .. " + Left", hl.dsp.focus({ direction = "l" }))
hl.bind(mod .. " + Right", hl.dsp.focus({ direction = "r" }))
hl.bind(mod .. " + Up", hl.dsp.focus({ direction = "u" }))
hl.bind(mod .. " + Down", hl.dsp.focus({ direction = "d" }))

-- Move to other monitor (Win+Shift+arrow)
hl.bind(mod .. " SHIFT" .. " + Left", hl.dsp.window.move({ direction = "l" }))
hl.bind(mod .. " SHIFT" .. " + Right", hl.dsp.window.move({ direction = "r" }))
hl.bind(mod .. " SHIFT" .. " + Up", hl.dsp.window.move({ direction = "u" }))
hl.bind(mod .. " SHIFT" .. " + Down", hl.dsp.window.move({ direction = "d" }))

-- Show desktop (Win+D already taken by launcher, so Win+,)
hl.bind(mod .. " + comma", hl.dsp.exec_cmd("hyprctl dispatch workspace 1"))

-- Fullscreen (Win+Enter or F11)
hl.bind(mod .. " + Return", hl.dsp.exec_cmd(terminal))
hl.bind(mod .. " + F", hl.dsp.window.fullscreen())
hl.bind("F11", hl.dsp.window.fullscreen())

-- Toggle float (Win+Space)
hl.bind(mod .. " + Space", hl.dsp.window.float({ action = "toggle" }))

-- Workspaces (Win+number)
for i = 1, 9 do
    hl.bind(mod .. " + " .. tostring(i), hl.dsp.focus({ workspace = tostring(i) }))
    hl.bind(mod .. " SHIFT" .. " + " .. tostring(i), hl.dsp.window.move({ workspace = tostring(i) }))
end

-- Task view (Win+Tab — workspace overview)
hl.bind(mod .. " + Tab", hl.dsp.exec_cmd("rofi -show window"))

-- Exit (Alt+F4 on desktop = log out)
hl.bind(mod .. " SHIFT" .. " + Q", hl.dsp.exit())

-- Media keys
hl.bind("XF86AudioRaiseVolume", hl.dsp.exec_cmd("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+"), { locked = true })
hl.bind("XF86AudioLowerVolume", hl.dsp.exec_cmd("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-"), { locked = true })
hl.bind("XF86AudioMute", hl.dsp.exec_cmd("wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle"), { locked = true })

-- == ENVIRONMENT ==
hl.env("XCURSOR_SIZE", "24")
hl.env("HYPRCURSOR_SIZE", "24")
hl.env("GDK_BACKEND", "wayland,x11,*")
hl.env("QT_QPA_PLATFORM", "wayland;xcb")
hl.env("SDL_VIDEODRIVER", "wayland")
hl.env("ELECTRON_OZONE_PLATFORM_HINT", "auto")

-- == AUTOSTART ==
hl.on("hyprland.start", function()
    hl.exec_cmd("waybar")
    hl.exec_cmd("hyprpaper")
    hl.exec_cmd("hypridle")
    hl.exec_cmd("swaync")
    hl.exec_cmd("/usr/libexec/hyprpolkitagent")
    hl.exec_cmd("sleep 5; nm-applet")
end)
```

### Tweak Further

- [Bar: customize Waybar modules and styling](companion-tools.md#status-bar-waybar)
- [Theme: Dracula ecosystem](theming.md#dracula)
- [Keybindings: full reference](keybindings.md)
- [Window rules: more app rules](window-rules.md)

---

## 🐧 GNOME Transplant

**Vibe:** Clean, simple, and modern with a top bar, workspace overview, and intuitive shortcuts. If you liked GNOME's workflow but wanted better performance and customization, this is it.

### Key Decisions

| Area | Choice | Why |
|------|--------|-----|
| Bar framework | AGS (top, with clock + quick settings) | Activities-like bar, scriptable in JS |
| Launcher | rofi (with desktop overview mode) | Activities overview replacement |
| Notifications | swaync | Notification center like GNOME |
| Wallpaper | hyprpaper | Smooth transitions |
| Lock screen | hyprlock (or loginctl) | Clean blur like GNOME lock |
| Mod key | SUPER | Activities overview, just like GNOME |
| Layout | Master-stack | One main window + side stack, like GNOME tiling |
| Animations | Medium, smooth curves | Polished but not slow |
| Theme | Adwaita-dark or Catppuccin | Clean, GNOME-like |
| Plugin | hyprspace | Workspace overview (Activities-like) |

### Drop-In Lua Config

Save as `~/.config/hypr/hyprland.lua`:

```lua
-- ~/.config/hypr/hyprland.lua
-- GNOME Transplant Profile

-- == MONITORS ==
hl.monitor({
    output   = "DP-1",
    mode     = "2560x1440@144",
    position = "0x0",
    scale    = 1,
})
hl.monitor({
    output   = "HDMI-A-1",
    mode     = "1920x1080@60",
    position = "2560x0",
    scale    = 1,
})

-- == INPUT ==

hl.config({
    input = {
        kb_layout = "us",
        follow_mouse = 1,
        numlock_by_default = true,
        touchpad = {
            natural_scroll = true,
            scroll_factor = 0.8,
        }
    },
    general = {
        gaps_in = 6,
        gaps_out = 12,
        border_size = 1,
        col = {
            active_border = "rgba(cba6f7ee)",
            inactive_border = "rgba(45475aee)",
        },
        layout = "master",
    },
    decoration = {
        rounding = 10,
        active_opacity = 1.0,
        inactive_opacity = 0.95,
        blur = {
            enabled = true,
            size = 3,
            passes = 1,
            new_optimizations = true,
        },
        shadow = {
            enabled = true,
            range = 6,
            color = "rgba(11111b44)",
        },
    },
    misc = {
        disable_hyprland_logo = true,
        disable_splash_rendering = true,
        mouse_move_enables_dpms = true,
        key_press_enables_dpms = true,
        enable_swallow = true,
        swallow_regex = "^(com\\.mitchellh\\.ghostty|alacritty|foot)$",
        animate_mouse_windowdragging = true,
        force_default_wallpaper = 0,
    },
})

hl.curve("smooth", { type = "bezier", points = {{0.04, 0.83}, {0.19, 0.98}} })
hl.animation({ leaf = "global", enabled = true, speed = 8, bezier = "default" })
hl.animation({ leaf = "windows", enabled = true, speed = 6, bezier = "smooth" })
hl.animation({ leaf = "windowsOut", enabled = true, speed = 5, bezier = "smooth" })
hl.animation({ leaf = "fade", enabled = true, speed = 6, bezier = "default" })
hl.animation({ leaf = "workspaces", enabled = true, speed = 5, bezier = "smooth" })

-- == APPEARANCE ==
local mod = "SUPER"
local terminal = "ghostty"
local browser = "firefox"

-- == WINDOW RULES ==
hl.window_rule({
    name  = "float-pavucontrol-blueman-manager-gnome-calculator",
    match = { class = "^(pavucontrol|blueman-manager|gnome-calculator)$" },
    float = true,
})
hl.window_rule({
    name  = "float-firefox",
    match = { class = "^(firefox)$", title = "^(Picture-in-Picture)$" },
    float = true,
})
hl.window_rule({
    name  = "ws-custom",
    match = { class = "^" .. browser .. "$" },
    workspace = "1",
})
hl.window_rule({
    name  = "ws-custom",
    match = { class = "^" .. terminal .. "$" },
    workspace = "2",
})
hl.window_rule({
    name  = "ws-org.gnome.Nautilus-thunar-nemo",
    match = { class = "^(org.gnome.Nautilus|thunar|nemo)$" },
    workspace = "3",
})
hl.window_rule({
    name  = "noblur-rofi",
    match = { class = "^(rofi)$" },
    no_blur = true,
})

-- == KEYBINDINGS (GNOME-style) ==
-- Activities overview (Super key = rofi desktop mode)
hl.bind(mod .. " + D", hl.dsp.exec_cmd("rofi -show drun"))

-- Workspace overview (Super+Up = overview, like GNOME)
hl.bind(mod .. " + Up", hl.dsp.exec_cmd("hyprctl dispatch workspace e+1"))
hl.bind(mod .. " + Down", hl.dsp.exec_cmd("hyprctl dispatch workspace e-1"))

-- Close window (Super+Q)
hl.bind(mod .. " + Q", hl.dsp.window.close())

-- Fullscreen (Super+F)
hl.bind(mod .. " + F", hl.dsp.window.fullscreen())

-- Focus movement (Super+arrows)
hl.bind(mod .. " + Left", hl.dsp.focus({ direction = "l" }))
hl.bind(mod .. " + Right", hl.dsp.focus({ direction = "r" }))
hl.bind(mod .. " + Up", hl.dsp.focus({ direction = "u" }))
hl.bind(mod .. " + Down", hl.dsp.focus({ direction = "d" }))

-- Move windows (Super+Shift+arrows)
hl.bind(mod .. " SHIFT" .. " + Left", hl.dsp.window.move({ direction = "l" }))
hl.bind(mod .. " SHIFT" .. " + Right", hl.dsp.window.move({ direction = "r" }))
hl.bind(mod .. " SHIFT" .. " + Up", hl.dsp.window.move({ direction = "u" }))
hl.bind(mod .. " SHIFT" .. " + Down", hl.dsp.window.move({ direction = "d" }))

-- Toggle maximized (Super+Up = max, Super+Down = unmax)
hl.bind(mod .. " + Space", hl.dsp.window.float({ action = "toggle" }))

-- Window switcher (Alt+Tab)
hl.bind("ALT" .. " + Tab", hl.dsp.exec_cmd("rofi -show window"))

-- Workspaces (Super+number)
for i = 1, 9 do
    hl.bind(mod .. " + " .. tostring(i), hl.dsp.focus({ workspace = tostring(i) }))
    hl.bind(mod .. " SHIFT" .. " + " .. tostring(i), hl.dsp.window.move({ workspace = tostring(i) }))
end

-- Launch terminal (Super+Return)
hl.bind(mod .. " + Return", hl.dsp.exec_cmd(terminal))

-- Show all windows (Super+A)
hl.bind(mod .. " + A", hl.dsp.exec_cmd("rofi -show window"))

-- Lock screen (Super+L)
hl.bind(mod .. " + L", hl.dsp.exec_cmd("hyprlock"))  -- or use: loginctl lock-session

-- Exit (Super+Shift+Q)
hl.bind(mod .. " SHIFT" .. " + Q", hl.dsp.exit())

-- Media keys
hl.bind("XF86AudioRaiseVolume", hl.dsp.exec_cmd("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+"), { locked = true })
hl.bind("XF86AudioLowerVolume", hl.dsp.exec_cmd("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-"), { locked = true })
hl.bind("XF86AudioMute", hl.dsp.exec_cmd("wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle"), { locked = true })

-- == ENVIRONMENT ==
hl.env("XCURSOR_SIZE", "24")
hl.env("HYPRCURSOR_SIZE", "24")
hl.env("GDK_BACKEND", "wayland,x11,*")
hl.env("QT_QPA_PLATFORM", "wayland;xcb")
hl.env("SDL_VIDEODRIVER", "wayland")
hl.env("ELECTRON_OZONE_PLATFORM_HINT", "auto")

-- == AUTOSTART ==
hl.on("hyprland.start", function()
    hl.exec_cmd("ags")
    hl.exec_cmd("hyprpaper")
    hl.exec_cmd("hypridle")
    hl.exec_cmd("swaync")
    hl.exec_cmd("/usr/libexec/hyprpolkitagent")
end)
```

### Tweak Further

- [Bar: customize AGS config](companion-tools.md#ags-aylurs-gtk-shell)
- [Plugin: hyprspace workspace overview](plugins.md#plugin-index)
- [Theme: Catppuccin ecosystem](theming.md#catppuccin-mocha)
- [Keybindings: full reference](keybindings.md)
- [Animations: tweak curves](animations.md)

---

## 🎮 Gamer

**Vibe:** Minimal screen chrome, maximum performance. All eyecandy disabled during gameplay, VRR active, full-screen mode default. Quick toggle between gaming and desktop.

### Key Decisions

| Area | Choice | Why |
|------|--------|-----|
| Bar framework | Waybar (auto-hide, minimal) | Only visible when you need it |
| Launcher | wofi or Steam Big Picture | Lightweight launcher, Steam for game library |
| Notifications | dunst (minimal) | No notification center needed |
| Wallpaper | hyprpaper (static) | No GPU wasted on animations |
| Lock screen | hyprlock (or loginctl) | Simple, fast |
| Mod key | SUPER | Minimal modifier conflicts with games |
| Layout | Fullscreen + Scrolling | Games fullscreen, library scrollable |
| Animations | **Disabled** during gameplay | Max FPS, enable VRR |
| Theme | Dark, minimal chrome | Don't distract from gameplay |
| Special | Gaming mode toggle, gamescope, immediate mode | Performance-focused game windows |

### Drop-In Lua Config

Save as `~/.config/hypr/hyprland.lua`:

```lua
-- ~/.config/hypr/hyprland.lua
-- Gamer Profile

-- == MONITORS ==
hl.monitor({
    output   = "DP-1",
    mode     = "2560x1440@144",
    position = "0x0",
    scale    = 1,
})
hl.monitor({
    output   = "HDMI-A-1",
    mode     = "1920x1080@60",
    position = "2560x0",
    scale    = 1,
})

-- == INPUT ==

hl.config({
    input = {
        kb_layout = "us",
        follow_mouse = 1,
        touchpad = { natural_scroll = false }
    },
    general = {
        gaps_in = 3,
        gaps_out = 5,
        border_size = 1,
        col = {
            active_border = "rgba(f38ba8ee)",
            inactive_border = "rgba(45475aee)",
        },
        layout = "dwindle",
    },
    decoration = {
        rounding = 6,
        active_opacity = 1.0,
        inactive_opacity = 1.0,
        fullscreen_opacity = 1.0,
        blur = { enabled = false },
        shadow = { enabled = false },
    },
    misc = {
        disable_hyprland_logo = true,
        disable_splash_rendering = true,
        mouse_move_enables_dpms = true,
        key_press_enables_dpms = true,
        enable_swallow = true,
        swallow_regex = "^(com\\.mitchellh\\.ghostty)$",
        vrr = 0,  -- Gaming mode script sets to 2
        force_default_wallpaper = 0,
    },
})

hl.curve("fast", { type = "bezier", points = {{0.0, 0.0}, {0.2, 1.0}} })
hl.animation({ leaf = "global", enabled = true, speed = 1, bezier = "default" })
hl.animation({ leaf = "windows", enabled = true, speed = 2, bezier = "fast" })
hl.animation({ leaf = "fade", enabled = true, speed = 1, bezier = "default" })
hl.animation({ leaf = "workspaces", enabled = true, speed = 1, bezier = "default" })

-- == APPEARANCE ==
local mod = "SUPER"
local terminal = "ghostty"

-- Start with animations ON for desktop, gaming_mode.sh turns them OFF

-- == WINDOW RULES ==
hl.window_rule({
    name  = "ws-steam-steam_app",
    match = { class = "^(steam|steam_app)$" },
    workspace = "9",
})
hl.window_rule({
    name  = "ws-lutris-heroic-bottles",
    match = { class = "^(lutris|heroic|bottles)$" },
    workspace = "8",
})
hl.window_rule({
    name  = "immediate-steam_app-gamescope",
    match = { class = "^(steam_app|gamescope)$" },
    immediate = true,
})
hl.window_rule({
    name  = "suppress-steam",
    match = { class = "^(steam)$" },
    suppress_event = "fullscreen",
})
hl.window_rule({
    name  = "float-pavucontrol-blueman-manager",
    match = { class = "^(pavucontrol|blueman-manager)$" },
    float = true,
})
hl.window_rule({
    name  = "noanim-steam_app",
    match = { class = "^(steam_app)$" },
    no_anim = true,
})

-- == SCRIPTS ==
-- Create ~/.config/hypr/scripts/gaming_mode.sh:
--
-- #!/bin/bash
-- if hyprctl getoption animations:enabled | grep -q "bool: true"; then
--     hyprctl keyword animations:enabled false
--     hyprctl keyword decoration:blur:enabled false
--     hyprctl keyword decoration:shadow:enabled false
--     hyprctl keyword general:gaps_in 0
--     hyprctl keyword general:gaps_out 0
--     hyprctl keyword misc:vrr 2
--     notify-send "🎮 Gaming Mode ON"
-- else
--     hyprctl keyword animations:enabled true
--     hyprctl keyword decoration:blur:enabled true
--     hyprctl keyword decoration:shadow:enabled true
--     hyprctl keyword general:gaps_in 3
--     hyprctl keyword general:gaps_out 5
--     hyprctl keyword misc:vrr 0
--     notify-send "🖥 Gaming Mode OFF"
-- fi

-- == KEYBINDINGS ==
hl.bind(mod .. " + Return", hl.dsp.exec_cmd(terminal))
hl.bind(mod .. " + Q", hl.dsp.window.close())
hl.bind(mod .. " + F", hl.dsp.window.fullscreen())
hl.bind(mod .. " + Space", hl.dsp.window.float({ action = "toggle" }))
hl.bind(mod .. " + F11", hl.dsp.exec_cmd(terminal .. " -e gamescope -W 2560 -H 1440 --"))
hl.bind(mod .. " + G", hl.dsp.exec_cmd("~/.config/hypr/scripts/gaming_mode.sh"))

hl.bind(mod .. " + Left", hl.dsp.focus({ direction = "l" }))
hl.bind(mod .. " + Right", hl.dsp.focus({ direction = "r" }))
hl.bind(mod .. " + Up", hl.dsp.focus({ direction = "u" }))
hl.bind(mod .. " + Down", hl.dsp.focus({ direction = "d" }))

hl.bind(mod .. " SHIFT" .. " + Left", hl.dsp.window.move({ direction = "l" }))
hl.bind(mod .. " SHIFT" .. " + Right", hl.dsp.window.move({ direction = "r" }))
hl.bind(mod .. " SHIFT" .. " + Up", hl.dsp.window.move({ direction = "u" }))
hl.bind(mod .. " SHIFT" .. " + Down", hl.dsp.window.move({ direction = "d" }))

for i = 1, 9 do
    hl.bind(mod .. " + " .. tostring(i), hl.dsp.focus({ workspace = tostring(i) }))
    hl.bind(mod .. " SHIFT" .. " + " .. tostring(i), hl.dsp.window.move({ workspace = tostring(i) }))
end

hl.bind(mod .. " + mouse_down", hl.dsp.focus({ workspace = "e+1" }))
hl.bind(mod .. " + mouse_up", hl.dsp.focus({ workspace = "e-1" }))
hl.bind(mod .. " + D", hl.dsp.exec_cmd("wofi --show drun"))
hl.bind(mod .. " SHIFT" .. " + Q", hl.dsp.exit())

hl.bind("XF86AudioRaiseVolume", hl.dsp.exec_cmd("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+"), { locked = true })
hl.bind("XF86AudioLowerVolume", hl.dsp.exec_cmd("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-"), { locked = true })
hl.bind("XF86AudioMute", hl.dsp.exec_cmd("wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle"), { locked = true })

-- == ENVIRONMENT ==
hl.env("XCURSOR_SIZE", "24")
hl.env("HYPRCURSOR_SIZE", "24")
hl.env("GDK_BACKEND", "wayland,x11,*")
hl.env("QT_QPA_PLATFORM", "wayland;xcb")
hl.env("SDL_VIDEODRIVER", "wayland")

-- Steam GameMode
hl.env("GAMEMODE_REQUEST", "1")

-- == AUTOSTART ==
hl.on("hyprland.start", function()
    hl.exec_cmd("waybar")
    hl.exec_cmd("hyprpaper")
    hl.exec_cmd("hypridle")
    hl.exec_cmd("dunst")
end)
```

### Tweak Further

- [Gaming mode detailed guide](workflow-patterns.md#gaming-mode)
- [VRR and performance tuning](hyprland-conf.md#misc)
- [HDR for gaming](color-management.md#hdr-gaming)
- [Wallpaper: static hyprpaper](companion-tools.md#wallpaper-hyprpaper)

---

## 💻 Developer

**Vibe:** Terminal-focused, keyboard-driven, maximize screen space. A thin bar, a drop-down terminal, Vim-like navigation, and apps organized across workspaces by task.

### Key Decisions

| Area | Choice | Why |
|------|--------|-----|
| Bar framework | Waybar (thin: 24px, left=workspaces, center=window, right=clock) | Minimal chrome, max screen space |
| Launcher | rofi | Fast, extensible, dev-friendly |
| Notifications | dunst | Minimal, no GUI needed |
| Wallpaper | hyprpaper (static) | No distractions |
| Lock screen | hyprlock (or loginctl) | Quick lock/unlock |
| Mod key | SUPER | Standard |
| Layout | Dwindle | Best for multi-terminal splits |
| Animations | Medium, fast | Sub-second transitions |
| Theme | Catppuccin Mocha (dark) | Easy on the eyes, popular in dev tools |
| Special | Scratchpad terminal, terminal grouping, Vim navigation | Developer workflow essentials |

### Drop-In Lua Config

Save as `~/.config/hypr/hyprland.lua`:

```lua
-- ~/.config/hypr/hyprland.lua
-- Developer Profile

-- == MONITORS ==
hl.monitor({
    output   = "DP-1",
    mode     = "2560x1440@144",
    position = "0x0",
    scale    = 1,
})
hl.monitor({
    output   = "HDMI-A-1",
    mode     = "1920x1080@60",
    position = "2560x0",
    scale    = 1,
})

-- == INPUT ==

hl.config({
    input = {
        kb_layout = "us",
        follow_mouse = 1,
        touchpad = {
            natural_scroll = true,
        }
    },
    general = {
        gaps_in = 4,
        gaps_out = 8,
        border_size = 2,
        col = {
            active_border = { colors = {"rgba(cba6f7ee)", "rgba(89b4faee)"}, angle = 45 },
            inactive_border = "rgba(45475aee)",
        },
        layout = "dwindle",
    },
    decoration = {
        rounding = 8,
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
            color = "rgba(1e1e2e88)",
        },
    },
    misc = {
        disable_hyprland_logo = true,
        disable_splash_rendering = true,
        mouse_move_enables_dpms = true,
        key_press_enables_dpms = true,
        enable_swallow = true,
        swallow_regex = "^(com\\.mitchellh\\.ghostty|alacritty|foot)$",
        force_default_wallpaper = 0,
    },
})

hl.curve("fast", { type = "bezier", points = {{0.0, 0.0}, {0.2, 1.0}} })
hl.animation({ leaf = "global", enabled = true, speed = 4, bezier = "default" })
hl.animation({ leaf = "windows", enabled = true, speed = 4, bezier = "fast" })
hl.animation({ leaf = "windowsOut", enabled = true, speed = 3, bezier = "fast" })
hl.animation({ leaf = "fade", enabled = true, speed = 4, bezier = "default" })
hl.animation({ leaf = "workspaces", enabled = true, speed = 3, bezier = "fast" })

-- == APPEARANCE ==
local mod = "SUPER"
local terminal = "ghostty"
local browser = "firefox"
local editor = "Code"

-- == WINDOW RULES ==
-- Workspace assignments: 1=browser, 2=code, 3=terminals, 4=comms, 5=misc, 6=scratchpad
hl.window_rule({
    name  = "ws-custom",
    match = { class = "^" .. browser .. "$" },
    workspace = "1",
})
hl.window_rule({
    name  = "ws-custom",
    match = { class = "^" .. editor .. "$" },
    workspace = "2",
})
hl.window_rule({
    name  = "ws-custom",
    match = { class = "^" .. terminal .. "$" },
    workspace = "3",
})
hl.window_rule({
    name  = "ws-discord-Slack-Teams",
    match = { class = "^(discord|Slack|Teams)$" },
    workspace = "4",
})
hl.window_rule({
    name  = "ws-misc",
    match = { class = "^(org.gnome.Nautilus|thunar|vlc|obsidian)$" },
    workspace = "5",
})
-- Note: per-window opacity and grouping are not available in the Lua API as of v0.55
-- Use decoration { active_opacity, inactive_opacity } in hl.config() instead
hl.window_rule({
    name  = "float-pavucontrol-blueman-manager-gnome-calculator",
    match = { class = "^(pavucontrol|blueman-manager|gnome-calculator)$" },
    float = true,
})
hl.window_rule({
    name  = "float-firefox",
    match = { class = "^(firefox)$", title = "^(Picture-in-Picture)$" },
    float = true,
})
hl.window_rule({
    name  = "float-discord",
    match = { class = "^(discord)$", title = "^(Quick Switcher|Settings)$" },
    float = true,
})
hl.window_rule({
    name  = "noblur-terminal",
    match = { class = "^" .. terminal .. "$" },
    no_blur = true,
})

-- == KEYBINDINGS (Vim-adjacent) ==
-- Launch
hl.bind(mod .. " + Return", hl.dsp.exec_cmd(terminal))
hl.bind(mod .. " + D", hl.dsp.exec_cmd("rofi -show drun"))

-- Close
hl.bind(mod .. " + Q", hl.dsp.window.close())

-- Vim-style focus (H/J/K/L)
hl.bind(mod .. " + H", hl.dsp.focus({ direction = "l" }))
hl.bind(mod .. " + J", hl.dsp.focus({ direction = "d" }))
hl.bind(mod .. " + K", hl.dsp.focus({ direction = "u" }))
hl.bind(mod .. " + L", hl.dsp.focus({ direction = "r" }))

-- Also arrow keys for newcomers
hl.bind(mod .. " + Left", hl.dsp.focus({ direction = "l" }))
hl.bind(mod .. " + Right", hl.dsp.focus({ direction = "r" }))
hl.bind(mod .. " + Up", hl.dsp.focus({ direction = "u" }))
hl.bind(mod .. " + Down", hl.dsp.focus({ direction = "d" }))

-- Move windows (Vim-style)
hl.bind(mod .. " SHIFT" .. " + H", hl.dsp.window.move({ direction = "l" }))
hl.bind(mod .. " SHIFT" .. " + J", hl.dsp.window.move({ direction = "d" }))
hl.bind(mod .. " SHIFT" .. " + K", hl.dsp.window.move({ direction = "u" }))
hl.bind(mod .. " SHIFT" .. " + L", hl.dsp.window.move({ direction = "r" }))

-- Build and test shortcuts (Ctrl+B / Ctrl+T)
hl.bind(mod .. " + B", hl.dsp.exec_cmd(terminal .. " -e make"))
hl.bind(mod .. " + T", hl.dsp.exec_cmd(terminal .. " -e npm test"))

-- Quick build output
hl.bind(mod .. " SHIFT", "T", "exec", terminal .. " -e cargo build")

-- Wifi menu
hl.bind(mod .. " + F2", hl.dsp.exec_cmd("nm-connection-editor"))

-- Workspaces
for i = 1, 9 do
    hl.bind(mod .. " + " .. tostring(i), hl.dsp.focus({ workspace = tostring(i) }))
    hl.bind(mod .. " SHIFT" .. " + " .. tostring(i), hl.dsp.window.move({ workspace = tostring(i) }))
end

-- Scratchpad (drop-down terminal)
hl.bind(mod .. " + grave", hl.dsp.workspace.toggle_special("scratchpad"))
hl.bind(mod .. " SHIFT" .. " + grave", hl.dsp.window.move({ workspace = "special:scratchpad" }))

-- Window management
hl.bind(mod .. " + Space", hl.dsp.window.float({ action = "toggle" }))
hl.bind(mod .. " + F", hl.dsp.window.fullscreen())
hl.bind(mod .. " + T", hl.dsp.window.group("toggle"))
hl.bind(mod .. " + Tab", hl.dsp.window.group("next"))

-- Mouse workspace scroll
hl.bind(mod .. " + mouse_down", hl.dsp.focus({ workspace = "e+1" }), { mouse = true })
hl.bind(mod .. " + mouse_up", hl.dsp.focus({ workspace = "e-1" }), { mouse = true })

-- Exit
hl.bind(mod .. " SHIFT" .. " + Q", hl.dsp.exit())

-- Media keys
hl.bind("XF86AudioRaiseVolume", hl.dsp.exec_cmd("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+"), { locked = true })
hl.bind("XF86AudioLowerVolume", hl.dsp.exec_cmd("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-"), { locked = true })
hl.bind("XF86AudioMute", hl.dsp.exec_cmd("wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle"), { locked = true })
hl.bind("XF86AudioPlay", hl.dsp.exec_cmd("playerctl play-pause"), { locked = true })

-- == ENVIRONMENT ==
hl.env("XCURSOR_SIZE", "24")
hl.env("HYPRCURSOR_SIZE", "24")
hl.env("GDK_BACKEND", "wayland,x11,*")
hl.env("QT_QPA_PLATFORM", "wayland;xcb")
hl.env("SDL_VIDEODRIVER", "wayland")
hl.env("ELECTRON_OZONE_PLATFORM_HINT", "auto")

-- == AUTOSTART ==
hl.on("hyprland.start", function()
    hl.exec_cmd("waybar")
    hl.exec_cmd("hyprpaper")
    hl.exec_cmd("hypridle")
    hl.exec_cmd("dunst")
    hl.exec_cmd("/usr/libexec/hyprpolkitagent")
    hl.exec_cmd("nmcli radio wifi on")
    hl.exec_cmd("wl-paste --type text --watch cliphist store")
    hl.exec_cmd("sleep 5; nm-applet")
end)
```

### Tweak Further

- [Development workflow with workspace layout](workflow-patterns.md#development-workflow)
- [Scratchpad script](workflow-patterns.md#scratchpad)
- [Animations: fast presets](animations.md#animation-presets)
- [Theme: Catppuccin Mocha ecosystem](theming.md#catppuccin-mocha)

---

## 🎨 Designer

**Vibe:** A color-accurate, dark-themed creative workstation. Design tools float by default, color-critical apps are pinned, and the desktop stays out of your way. ICC profiles loaded, smooth animations, and a polished dark interface.

### Key Decisions

| Area | Choice | Why |
|------|--------|-----|
| Bar framework | Waybar (minimal, dark, unobtrusive) | Stays out of the way |
| Launcher | rofi | Fast, search-driven |
| Notifications | swaync | Dark-themed notification center |
| Wallpaper | hyprpaper (static, solid color or subtle gradient) | Avoid distraction from color-critical work |
| Lock screen | hyprlock (or loginctl) | Dark blur lock screen |
| Mod key | SUPER | Standard |
| Layout | Master-stack | Reference material tiled, tools float |
| Animations | Smooth, medium | Polished but not slow |
| Theme | Catppuccin Mocha (dark) | Neutral dark palette, good for color work |
| Window behavior | Float design tools (GIMP, Inkscape, Figma), tile browser/docs | Creative workflow: tools float, content tiles |
| Color | ICC profiles per monitor, HDR, color-critical apps configured | Color accuracy |

### Drop-In Lua Config

Save as `~/.config/hypr/hyprland.lua`:

```lua
-- ~/.config/hypr/hyprland.lua
-- Designer Profile

-- == MONITORS ==
-- Add ICC profiles natively (v0.55+):
hl.monitor({
    output   = "DP-1",
    mode     = "2560x1440@144",
    position = "0x0",
    scale    = 1,
    ["icc:path"] = "icc:/home/user/.local/share/icc/dell-u2723qe.icc",
})
hl.monitor({
    output   = "HDMI-A-1",
    mode     = "1920x1080@60",
    position = "2560x0",
    scale    = 1,
    ["icc:path"] = "icc:/home/user/.local/share/icc/lg-27gp950.icc",
})

-- == INPUT ==

hl.config({
    input = {
        kb_layout = "us",
        follow_mouse = 1,
        touchpad = {
            natural_scroll = true,
        }
    },
    general = {
        gaps_in = 6,
        gaps_out = 12,
        border_size = 1,
        col = {
            active_border = "rgba(cba6f7ee)",
            inactive_border = "rgba(45475aee)",
        },
        layout = "master",
        no_border_on_floating = false,
        resize_corner = 2,
    },
    decoration = {
        rounding = 12,
        active_opacity = 1.0,
        inactive_opacity = 0.92,
        blur = {
            enabled = true,
            size = 4,
            passes = 2,
            new_optimizations = true,
        },
        shadow = {
            enabled = true,
            range = 6,
            color = "rgba(11111b55)",
    },
    misc = {
        disable_hyprland_logo = true,
        disable_splash_rendering = true,
        mouse_move_enables_dpms = true,
        key_press_enables_dpms = true,
        font_family = "Noto Sans",
        force_default_wallpaper = 0,
    },
})

hl.curve("smooth", { type = "bezier", points = {{0.04, 0.83}, {0.19, 0.98}} })
hl.animation({ leaf = "global", enabled = true, speed = 8, bezier = "default" })
hl.animation({ leaf = "windows", enabled = true, speed = 7, bezier = "smooth" })
hl.animation({ leaf = "windowsOut", enabled = true, speed = 7, bezier = "smooth" })
hl.animation({ leaf = "fade", enabled = true, speed = 6, bezier = "default" })
hl.animation({ leaf = "workspaces", enabled = true, speed = 5, bezier = "smooth" })

-- == APPEARANCE ==
local mod = "SUPER"
local terminal = "ghostty"
local browser = "firefox"

-- == WINDOW RULES ==
-- Float design tools, pin their palettes
hl.window_rule({
    name  = "float-Gimp-inkscape-krita",
    match = { class = "^(Gimp|inkscape|krita)$" },
    float = true,
})
hl.window_rule({
    name  = "pin-Gimp",
    match = { class = "^(Gimp)$", title = "^(Toolbox|Layers|Brushes|Colors|Options)" },
    pin = true,
})
hl.window_rule({
    name  = "pin-inkscape",
    match = { class = "^(inkscape)$", title = "^(Fill and Stroke|Layers|Swatches)" },
    pin = true,
})
hl.window_rule({
    name  = "dimaround-Gimp-inkscape",
    match = { class = "^(Gimp|inkscape)$" },
    dim_around = true,
})
hl.window_rule({
    name  = "centerwindow-Gimp-inkscape",
    match = { class = "^(Gimp|inkscape)$" },
    center = true,
})
hl.window_rule({
    name  = "size-Gimp",
    match = { class = "^(Gimp)$" },
    size = { 1400, 900 },
})

-- Tile reference material, browser, terminal
hl.window_rule({
    name  = "ws-custom",
    match = { class = "^" .. browser .. "$" },
    workspace = "1",
})
hl.window_rule({
    name  = "ws-custom",
    match = { class = "^" .. terminal .. "$" },
    workspace = "2",
})
hl.window_rule({
    name  = "ws-org.gnome.Nautilus-thunar",
    match = { class = "^(org.gnome.Nautilus|thunar)$" },
    workspace = "3",
})

-- Standard floats
hl.window_rule({
    name  = "float-pavucontrol-blueman-manager-gnome-calculator",
    match = { class = "^(pavucontrol|blueman-manager|gnome-calculator)$" },
    float = true,
})
hl.window_rule({
    name  = "float-firefox",
    match = { class = "^(firefox)$", title = "^(Picture-in-Picture)$" },
    float = true,
})

-- == KEYBINDINGS ==
hl.bind(mod .. " + Return", hl.dsp.exec_cmd(terminal))
hl.bind(mod .. " + D", hl.dsp.exec_cmd("rofi -show drun"))
hl.bind(mod .. " + Q", hl.dsp.window.close())
hl.bind(mod .. " + Space", hl.dsp.window.float({ action = "toggle" }))
hl.bind(mod .. " + F", hl.dsp.window.fullscreen())

-- Focus
hl.bind(mod .. " + Left", hl.dsp.focus({ direction = "l" }))
hl.bind(mod .. " + Right", hl.dsp.focus({ direction = "r" }))
hl.bind(mod .. " + Up", hl.dsp.focus({ direction = "u" }))
hl.bind(mod .. " + Down", hl.dsp.focus({ direction = "d" }))

-- Move windows
hl.bind(mod .. " SHIFT" .. " + Left", hl.dsp.window.move({ direction = "l" }))
hl.bind(mod .. " SHIFT" .. " + Right", hl.dsp.window.move({ direction = "r" }))
hl.bind(mod .. " SHIFT" .. " + Up", hl.dsp.window.move({ direction = "u" }))
hl.bind(mod .. " SHIFT" .. " + Down", hl.dsp.window.move({ direction = "d" }))

-- Workspaces
for i = 1, 9 do
    hl.bind(mod .. " + " .. tostring(i), hl.dsp.focus({ workspace = tostring(i) }))
    hl.bind(mod .. " SHIFT" .. " + " .. tostring(i), hl.dsp.window.move({ workspace = tostring(i) }))
end

-- Color picker
hl.bind(mod .. " + P", hl.dsp.exec_cmd("hyprpicker -a"))

-- Color management toggle (night light)
hl.bind(mod .. " + N", hl.dsp.exec_cmd("hyprsunset -t 3500"))
hl.bind(mod .. " SHIFT" .. " + N", hl.dsp.exec_cmd("pkill hyprsunset"))

-- Screenshots (region for design reference)
hl.bind("Print", hl.dsp.exec_cmd("hyprshot -m region"))
hl.bind(mod .. " + Print", hl.dsp.exec_cmd("hyprshot -m output"))

-- Group management
hl.bind(mod .. " + T", hl.dsp.window.group("toggle"))
hl.bind(mod .. " + Tab", hl.dsp.window.group("next"))

-- Mouse workspace
hl.bind(mod .. " + mouse_down", hl.dsp.focus({ workspace = "e+1" }), { mouse = true })
hl.bind(mod .. " + mouse_up", hl.dsp.focus({ workspace = "e-1" }), { mouse = true })

hl.bind(mod .. " SHIFT" .. " + Q", hl.dsp.exit())

-- Media keys
hl.bind("XF86AudioRaiseVolume", hl.dsp.exec_cmd("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+"), { locked = true })
hl.bind("XF86AudioLowerVolume", hl.dsp.exec_cmd("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-"), { locked = true })
hl.bind("XF86AudioMute", hl.dsp.exec_cmd("wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle"), { locked = true })

-- == ENVIRONMENT ==
hl.env("XCURSOR_SIZE", "24")
hl.env("HYPRCURSOR_SIZE", "24")
hl.env("GDK_BACKEND", "wayland,x11,*")
hl.env("QT_QPA_PLATFORM", "wayland;xcb")
hl.env("SDL_VIDEODRIVER", "wayland")

-- HDR and color management
hl.env("AQ_HDR_ENABLED", "1")
hl.env("AQ_TONE_MAPPING", "aces")
hl.env("AQ_HDR_METADATA", "1")

-- == AUTOSTART ==
hl.on("hyprland.start", function()
    hl.exec_cmd("waybar")
    hl.exec_cmd("hyprpaper")
    hl.exec_cmd("hypridle")
    hl.exec_cmd("swaync")
    hl.exec_cmd("hyprsunset -t 6500")
    hl.exec_cmd("/usr/libexec/hyprpolkitagent")
end)
```

### Tweak Further

- [Color management: ICC profiles, HDR, night light](color-management.md)
- [Design workflow workspace layout](workflow-patterns.md#design-workflow)
- [Theme: Catppuccin Mocha ecosystem](theming.md#catppuccin-mocha)
- [Plugins: hyprpicker color picker](companion-tools.md#hyprpicker--color-picker)
- [Animations: smooth presets](animations.md)
