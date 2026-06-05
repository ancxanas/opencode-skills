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
| Wallpaper | swww | Smooth crossfade transitions |
| Lock screen | hyprlock | Native, good macOS-like blur |
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
hyprland.monitor("DP-1", "2560x1440@144", "0x0", 1)
hyprland.monitor("HDMI-A-1", "1920x1080@60", "2560x0", 1)

-- == INPUT ==
hyprland.input {
    kb_layout = "us",
    kb_variant = "",
    follow_mouse = 1,
    numlock_by_default = true,
    touchpad {
        natural_scroll = true,
        tap_to_click = true,
        drag_lock = true,
    }
}

-- == APPEARANCE ==
local mod = "SUPER"
local terminal = "kitty"
local browser = "firefox"

hyprland.general {
    gaps_in = 5,
    gaps_out = 12,
    border_size = 1,
    col.active_border = "rgba(cba6f7ee) rgba(89b4faee) 45deg",
    col.inactive_border = "rgba(45475aee)",
    layout = "master",
    cursor_inactive_timeout = 3,
}

hyprland.decoration {
    rounding = 12,
    active_opacity = 1.0,
    inactive_opacity = 0.92,
    fullscreen_opacity = 1.0,
    blur {
        enabled = true,
        size = 4,
        passes = 2,
        new_optimizations = true,
    },
    drop_shadow = true,
    shadow_range = 8,
    shadow_render_power = 3,
    col.shadow = "rgba(11111b44)",
}

hyprland.animations {
    enabled = true,
    bezier = "smooth,0.04,0.83,0.19,0.98",
    bezier = "bounce,0.13,0.99,0.29,1.1",
    animation = "global,1,10,default",
    animation = "windows,1,7,smooth,popin",
    animation = "windowsOut,1,7,smooth,popin",
    animation = "fade,1,8,default",
    animation = "workspaces,1,6,smooth",
    animation = "borderangle,1,100,default,once",
}

hyprland.misc {
    disable_hyprland_logo = true,
    disable_splash_rendering = true,
    mouse_move_enables_dpms = true,
    key_press_enables_dpms = true,
    enable_swallow = true,
    swallow_regex = "^(kitty|alacritty|foot)$",
    force_default_wallpaper = 0,
}

-- == WINDOW RULES ==
hyprland.windowrule("float", { class = "^(pavucontrol|blueman-manager|gnome-calculator|org.gnome.Nautilus)$" })
hyprland.windowrule("float", { class = "^(firefox)$", title = "^(Picture-in-Picture|Library)$" })
hyprland.windowrule("workspace 1", { class = "^" .. terminal .. "$" })
hyprland.windowrule("workspace 2", { class = "^" .. browser .. "$" })
hyprland.windowrule("workspace 3", { class = "^(Code|jetbrains-idea)$" })
hyprland.windowrule("opacity 0.95 0.85", { class = "^(kitty)$" })

-- == KEYBINDINGS (macOS-style) ==
-- App launcher (Spotlight: Cmd+Space)
hyprland.bind(mod, "Space", "exec", "rofi -show drun")

-- Close/kill (Cmd+Q = quit app, Cmd+W = close window)
hyprland.bind(mod, "Q", "killactive")
hyprland.bind(mod, "W", "exec", "hyprctl dispatch killactive")

-- Fullscreen (green button: Cmd+F)
hyprland.bind(mod, "F", "fullscreen")

-- Toggle float (Cmd+D)
hyprland.bind(mod, "D", "togglefloating")

-- Minimize (Cmd+M — sends to special workspace)
hyprland.bind(mod, "M", "movetoworkspace,special:minimized")

-- Focus movement (arrows + Vim keys)
hyprland.bind(mod, "left", "movefocus", "l")
hyprland.bind(mod, "right", "movefocus", "r")
hyprland.bind(mod, "up", "movefocus", "u")
hyprland.bind(mod, "down", "movefocus", "d")
hyprland.bind(mod, "H", "movefocus", "l")
hyprland.bind(mod, "J", "movefocus", "d")
hyprland.bind(mod, "K", "movefocus", "u")
hyprland.bind(mod, "L", "movefocus", "r")

-- Move windows (Cmd+Opt+arrows)
hyprland.bind(mod .. " SHIFT", "left", "movewindow", "l")
hyprland.bind(mod .. " SHIFT", "right", "movewindow", "r")
hyprland.bind(mod .. " SHIFT", "up", "movewindow", "u")
hyprland.bind(mod .. " SHIFT", "down", "movewindow", "d")

-- Workspaces (Cmd+number)
for i = 1, 9 do
    hyprland.bind(mod, tostring(i), "workspace", tostring(i))
    hyprland.bind(mod .. " SHIFT", tostring(i), "movetoworkspace", tostring(i))
end

-- Mission Control / Overview (Ctrl+Up like macOS)
hyprland.bind("CTRL", "Up", "exec", "rofi -show window")
hyprland.bind(mod, "Tab", "changegroupactive")

-- Exit (Cmd+Opt+Esc)
hyprland.bind(mod .. " SHIFT", "Escape", "exit", "")

-- Scratchpad (Cmd+grave)
hyprland.bind(mod, "grave", "togglespecialworkspace")
hyprland.bind(mod .. " SHIFT", "grave", "movetoworkspace", "special:scratchpad")

-- Mouse scrolling for workspaces
hyprland.bindm(mod, "mouse_down", "workspace", "e+1")
hyprland.bindm(mod, "mouse_up", "workspace", "e-1")

-- Media keys
hyprland.bindl(",", "XF86AudioRaiseVolume", "exec", "wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+")
hyprland.bindl(",", "XF86AudioLowerVolume", "exec", "wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-")
hyprland.bindl(",", "XF86AudioMute", "exec", "wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle")
hyprland.bindl(",", "XF86AudioPlay", "exec", "playerctl play-pause")

-- == ENVIRONMENT ==
hyprland.env("XCURSOR_SIZE", "24")
hyprland.env("HYPRCURSOR_SIZE", "24")
hyprland.env("GDK_BACKEND", "wayland,x11,*")
hyprland.env("QT_QPA_PLATFORM", "wayland;xcb")
hyprland.env("SDL_VIDEODRIVER", "wayland")
hyprland.env("CLUTTER_BACKEND", "wayland")
hyprland.env("ELECTRON_OZONE_PLATFORM_HINT", "auto")

-- == AUTOSTART ==
hyprland.exec_once("quickshell ~/.config/quickshell/bar.qml")
hyprland.exec_once("swww-daemon")
hyprland.exec_once("hypridle")
hyprland.exec_once("swaync")
hyprland.exec_once("/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1")
hyprland.exec_once("sleep 5; nm-applet")
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
| Lock screen | hyprlock | Blur background like Windows lock |
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
hyprland.monitor("DP-1", "2560x1440@144", "0x0", 1)
hyprland.monitor("HDMI-A-1", "1920x1080@60", "2560x0", 1)

-- == INPUT ==
hyprland.input {
    kb_layout = "us",
    follow_mouse = 0,
    numlock_by_default = true,
    touchpad {
        natural_scroll = false,
        tap_to_click = true,
    }
}

-- == APPEARANCE ==
local mod = "SUPER"
local terminal = "kitty"
local browser = "firefox"

hyprland.general {
    gaps_in = 4,
    gaps_out = 8,
    border_size = 1,
    col.active_border = "rgba(8a9ba8ff)",
    col.inactive_border = "rgba(3b4252ff)",
    layout = "dwindle",
    cursor_inactive_timeout = 0,
}

hyprland.decoration {
    rounding = 4,
    active_opacity = 1.0,
    inactive_opacity = 1.0,
    blur { enabled = false },
    drop_shadow = true,
    shadow_range = 4,
    col.shadow = "rgba(00000044)",
}

hyprland.animations {
    enabled = true,
    bezier = "fast,0.0,0.0,0.2,1.0",
    animation = "global,1,3,default",
    animation = "windows,1,4,fast",
    animation = "windowsOut,1,3,fast",
    animation = "fade,1,3,default",
    animation = "workspaces,1,2,default",
}

hyprland.misc {
    disable_hyprland_logo = true,
    disable_splash_rendering = true,
    mouse_move_enables_dpms = true,
    key_press_enables_dpms = true,
    enable_swallow = true,
    swallow_regex = "^(kitty|alacritty|foot)$",
    force_default_wallpaper = 0,
}

-- == WINDOW RULES ==
hyprland.windowrule("float", { class = "^(pavucontrol|blueman-manager|gnome-calculator|org.gnome.Nautilus)$" })
hyprland.windowrule("float", { class = "^" .. terminal .. "$", title = "^(Settings|Preferences)$" })
hyprland.windowrule("workspace 1", { class = "^" .. browser .. "$" })
hyprland.windowrule("workspace 2", { class = "^" .. terminal .. "$" })

-- == KEYBINDINGS (Windows-style) ==
-- Start menu: Win key opens launcher
hyprland.bind(mod, "D", "exec", "wofi --show drun")

-- Close window (Alt+F4)
hyprland.bind("ALT", "F4", "killactive", "")

-- Snap-like window management (Win+arrows)
hyprland.bind(mod, "Left", "movefocus", "l")
hyprland.bind(mod, "Right", "movefocus", "r")
hyprland.bind(mod, "Up", "movefocus", "u")
hyprland.bind(mod, "Down", "movefocus", "d")

-- Move to other monitor (Win+Shift+arrow)
hyprland.bind(mod .. " SHIFT", "Left", "movewindow", "l")
hyprland.bind(mod .. " SHIFT", "Right", "movewindow", "r")
hyprland.bind(mod .. " SHIFT", "Up", "movewindow", "u")
hyprland.bind(mod .. " SHIFT", "Down", "movewindow", "d")

-- Show desktop (Win+D already taken by launcher, so Win+,)
hyprland.bind(mod, "comma", "exec", "hyprctl dispatch workspace 1")

-- Fullscreen (Win+Enter or F11)
hyprland.bind(mod, "Return", "exec", terminal)
hyprland.bind(mod, "F", "fullscreen")
hyprland.bind(",", "F11", "fullscreen")

-- Toggle float (Win+Space)
hyprland.bind(mod, "Space", "togglefloating")

-- Workspaces (Win+number)
for i = 1, 9 do
    hyprland.bind(mod, tostring(i), "workspace", tostring(i))
    hyprland.bind(mod .. " SHIFT", tostring(i), "movetoworkspace", tostring(i))
end

-- Task view (Win+Tab — workspace overview)
hyprland.bind(mod, "Tab", "exec", "rofi -show window")

-- Exit (Alt+F4 on desktop = log out)
hyprland.bind(mod .. " SHIFT", "Q", "exit", "")

-- Media keys
hyprland.bindl(",", "XF86AudioRaiseVolume", "exec", "wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+")
hyprland.bindl(",", "XF86AudioLowerVolume", "exec", "wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-")
hyprland.bindl(",", "XF86AudioMute", "exec", "wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle")

-- == ENVIRONMENT ==
hyprland.env("XCURSOR_SIZE", "24")
hyprland.env("HYPRCURSOR_SIZE", "24")
hyprland.env("GDK_BACKEND", "wayland,x11,*")
hyprland.env("QT_QPA_PLATFORM", "wayland;xcb")
hyprland.env("SDL_VIDEODRIVER", "wayland")
hyprland.env("ELECTRON_OZONE_PLATFORM_HINT", "auto")

-- == AUTOSTART ==
hyprland.exec_once("waybar")
hyprland.exec_once("hyprpaper")
hyprland.exec_once("hypridle")
hyprland.exec_once("swaync")
hyprland.exec_once("/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1")
hyprland.exec_once("sleep 5; nm-applet")
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
| Wallpaper | swww | Smooth transitions |
| Lock screen | hyprlock | Clean blur like GNOME lock |
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
hyprland.monitor("DP-1", "2560x1440@144", "0x0", 1)
hyprland.monitor("HDMI-A-1", "1920x1080@60", "2560x0", 1)

-- == INPUT ==
hyprland.input {
    kb_layout = "us",
    follow_mouse = 1,
    numlock_by_default = true,
    touchpad {
        natural_scroll = true,
        tap_to_click = true,
        scroll_factor = 0.8,
    }
}

-- == APPEARANCE ==
local mod = "SUPER"
local terminal = "kitty"
local browser = "firefox"

hyprland.general {
    gaps_in = 6,
    gaps_out = 12,
    border_size = 1,
    col.active_border = "rgba(cba6f7ee)",
    col.inactive_border = "rgba(45475aee)",
    layout = "master",
    cursor_inactive_timeout = 5,
}

hyprland.decoration {
    rounding = 10,
    active_opacity = 1.0,
    inactive_opacity = 0.95,
    blur {
        enabled = true,
        size = 3,
        passes = 1,
        new_optimizations = true,
    },
    drop_shadow = true,
    shadow_range = 6,
    col.shadow = "rgba(11111b44)",
}

hyprland.animations {
    enabled = true,
    bezier = "smooth,0.04,0.83,0.19,0.98",
    animation = "global,1,8,default",
    animation = "windows,1,6,smooth",
    animation = "windowsOut,1,5,smooth",
    animation = "fade,1,6,default",
    animation = "workspaces,1,5,smooth",
}

hyprland.misc {
    disable_hyprland_logo = true,
    disable_splash_rendering = true,
    mouse_move_enables_dpms = true,
    key_press_enables_dpms = true,
    enable_swallow = true,
    swallow_regex = "^(kitty|alacritty|foot)$",
    animate_mouse_windowdragging = true,
    force_default_wallpaper = 0,
}

-- == WINDOW RULES ==
hyprland.windowrule("float", { class = "^(pavucontrol|blueman-manager|gnome-calculator)$" })
hyprland.windowrule("float", { class = "^(firefox)$", title = "^(Picture-in-Picture)$" })
hyprland.windowrule("workspace 1", { class = "^" .. browser .. "$" })
hyprland.windowrule("workspace 2", { class = "^" .. terminal .. "$" })
hyprland.windowrule("workspace 3", { class = "^(org.gnome.Nautilus|thunar|nemo)$" })
hyprland.windowrule("noblur", { class = "^(rofi)$" })

-- == KEYBINDINGS (GNOME-style) ==
-- Activities overview (Super key = rofi desktop mode)
hyprland.bind(mod, "D", "exec", "rofi -show drun")

-- Workspace overview (Super+Up = overview, like GNOME)
hyprland.bind(mod, "Up", "exec", "hyprctl dispatch workspace e+1")
hyprland.bind(mod, "Down", "exec", "hyprctl dispatch workspace e-1")

-- Close window (Super+Q)
hyprland.bind(mod, "Q", "killactive")

-- Fullscreen (Super+F)
hyprland.bind(mod, "F", "fullscreen")

-- Focus movement (Super+arrows)
hyprland.bind(mod, "Left", "movefocus", "l")
hyprland.bind(mod, "Right", "movefocus", "r")
hyprland.bind(mod, "Up", "movefocus", "u")
hyprland.bind(mod, "Down", "movefocus", "d")

-- Move windows (Super+Shift+arrows)
hyprland.bind(mod .. " SHIFT", "Left", "movewindow", "l")
hyprland.bind(mod .. " SHIFT", "Right", "movewindow", "r")
hyprland.bind(mod .. " SHIFT", "Up", "movewindow", "u")
hyprland.bind(mod .. " SHIFT", "Down", "movewindow", "d")

-- Toggle maximized (Super+Up = max, Super+Down = unmax)
hyprland.bind(mod, "Space", "togglefloating")

-- Window switcher (Alt+Tab)
hyprland.bind("ALT", "Tab", "exec", "rofi -show window")

-- Workspaces (Super+number)
for i = 1, 9 do
    hyprland.bind(mod, tostring(i), "workspace", tostring(i))
    hyprland.bind(mod .. " SHIFT", tostring(i), "movetoworkspace", tostring(i))
end

-- Launch terminal (Super+Return)
hyprland.bind(mod, "Return", "exec", terminal)

-- Show all windows (Super+A)
hyprland.bind(mod, "A", "exec", "rofi -show window")

-- Lock screen (Super+L)
hyprland.bind(mod, "L", "exec", "hyprlock")

-- Exit (Super+Shift+Q)
hyprland.bind(mod .. " SHIFT", "Q", "exit", "")

-- Media keys
hyprland.bindl(",", "XF86AudioRaiseVolume", "exec", "wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+")
hyprland.bindl(",", "XF86AudioLowerVolume", "exec", "wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-")
hyprland.bindl(",", "XF86AudioMute", "exec", "wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle")

-- == ENVIRONMENT ==
hyprland.env("XCURSOR_SIZE", "24")
hyprland.env("HYPRCURSOR_SIZE", "24")
hyprland.env("GDK_BACKEND", "wayland,x11,*")
hyprland.env("QT_QPA_PLATFORM", "wayland;xcb")
hyprland.env("SDL_VIDEODRIVER", "wayland")
hyprland.env("ELECTRON_OZONE_PLATFORM_HINT", "auto")

-- == AUTOSTART ==
hyprland.exec_once("ags")
hyprland.exec_once("swww-daemon")
hyprland.exec_once("hypridle")
hyprland.exec_once("swaync")
hyprland.exec_once("/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1")
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
| Lock screen | hyprlock | Simple, fast |
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
hyprland.monitor("DP-1", "2560x1440@144", "0x0", 1)
hyprland.monitor("HDMI-A-1", "1920x1080@60", "2560x0", 1)

-- == INPUT ==
hyprland.input {
    kb_layout = "us",
    follow_mouse = 1,
    touchpad { natural_scroll = false, tap_to_click = true }
}

-- == APPEARANCE ==
local mod = "SUPER"
local terminal = "kitty"

hyprland.general {
    gaps_in = 3,
    gaps_out = 5,
    border_size = 1,
    col.active_border = "rgba(f38ba8ee)",
    col.inactive_border = "rgba(45475aee)",
    layout = "dwindle",
}

hyprland.decoration {
    rounding = 6,
    active_opacity = 1.0,
    inactive_opacity = 1.0,
    fullscreen_opacity = 1.0,
    blur { enabled = false },
    drop_shadow = false,
}

-- Start with animations ON for desktop, gaming_mode.sh turns them OFF
hyprland.animations {
    enabled = true,
    bezier = "fast,0.0,0.0,0.2,1.0",
    animation = "global,1,1,default",
    animation = "windows,1,2,fast",
    animation = "fade,1,1,default",
    animation = "workspaces,1,1,default",
}

hyprland.misc {
    disable_hyprland_logo = true,
    disable_splash_rendering = true,
    mouse_move_enables_dpms = true,
    key_press_enables_dpms = true,
    enable_swallow = true,
    swallow_regex = "^(kitty)$",
    vrr = 0,  -- Gaming mode script sets to 2
    force_default_wallpaper = 0,
}

-- == WINDOW RULES ==
hyprland.windowrule("workspace 9", { class = "^(steam|steam_app)$" })
hyprland.windowrule("workspace 8", { class = "^(lutris|heroic|bottles)$" })
hyprland.windowrule("immediate", { class = "^(steam_app|gamescope)$" })
hyprland.windowrule("suppressevent fullscreen", { class = "^(steam)$" })
hyprland.windowrule("float", { class = "^(pavucontrol|blueman-manager)$" })
hyprland.windowrule("noanim", { class = "^(steam_app)$" })

-- == SCRIPTS ==
-- Create ~/.config/hypr/scripts/gaming_mode.sh:
--
-- #!/bin/bash
-- if hyprctl getoption animations:enabled | grep -q "bool: true"; then
--     hyprctl keyword animations:enabled false
--     hyprctl keyword decoration:blur:enabled false
--     hyprctl keyword decoration:drop_shadow false
--     hyprctl keyword general:gaps_in 0
--     hyprctl keyword general:gaps_out 0
--     hyprctl keyword misc:vrr 2
--     notify-send "🎮 Gaming Mode ON"
-- else
--     hyprctl keyword animations:enabled true
--     hyprctl keyword decoration:blur:enabled true
--     hyprctl keyword decoration:drop_shadow true
--     hyprctl keyword general:gaps_in 3
--     hyprctl keyword general:gaps_out 5
--     hyprctl keyword misc:vrr 0
--     notify-send "🖥 Gaming Mode OFF"
-- fi

-- == KEYBINDINGS ==
hyprland.bind(mod, "Return", "exec", terminal)
hyprland.bind(mod, "Q", "killactive")
hyprland.bind(mod, "F", "fullscreen")
hyprland.bind(mod, "Space", "togglefloating")
hyprland.bind(mod, "F11", "exec", terminal .. " -e gamescope -W 2560 -H 1440 --")
hyprland.bind(mod, "G", "exec", "~/.config/hypr/scripts/gaming_mode.sh")

hyprland.bind(mod, "Left", "movefocus", "l")
hyprland.bind(mod, "Right", "movefocus", "r")
hyprland.bind(mod, "Up", "movefocus", "u")
hyprland.bind(mod, "Down", "movefocus", "d")

hyprland.bind(mod .. " SHIFT", "Left", "movewindow", "l")
hyprland.bind(mod .. " SHIFT", "Right", "movewindow", "r")
hyprland.bind(mod .. " SHIFT", "Up", "movewindow", "u")
hyprland.bind(mod .. " SHIFT", "Down", "movewindow", "d")

for i = 1, 9 do
    hyprland.bind(mod, tostring(i), "workspace", tostring(i))
    hyprland.bind(mod .. " SHIFT", tostring(i), "movetoworkspace", tostring(i))
end

hyprland.bind(mod, "mouse_down", "workspace", "e+1")
hyprland.bind(mod, "mouse_up", "workspace", "e-1")
hyprland.bind(mod, "D", "exec", "wofi --show drun")
hyprland.bind(mod .. " SHIFT", "Q", "exit", "")

hyprland.bindl(",", "XF86AudioRaiseVolume", "exec", "wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+")
hyprland.bindl(",", "XF86AudioLowerVolume", "exec", "wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-")
hyprland.bindl(",", "XF86AudioMute", "exec", "wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle")

-- == ENVIRONMENT ==
hyprland.env("XCURSOR_SIZE", "24")
hyprland.env("HYPRCURSOR_SIZE", "24")
hyprland.env("GDK_BACKEND", "wayland,x11,*")
hyprland.env("QT_QPA_PLATFORM", "wayland;xcb")
hyprland.env("SDL_VIDEODRIVER", "wayland")

-- Steam GameMode
hyprland.env("GAMEMODE_REQUEST", "1")

-- == AUTOSTART ==
hyprland.exec_once("waybar")
hyprland.exec_once("hyprpaper")
hyprland.exec_once("hypridle")
hyprland.exec_once("dunst")
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
| Lock screen | hyprlock | Quick lock/unlock |
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
hyprland.monitor("DP-1", "2560x1440@144", "0x0", 1)
hyprland.monitor("HDMI-A-1", "1920x1080@60", "2560x0", 1)

-- == INPUT ==
hyprland.input {
    kb_layout = "us",
    follow_mouse = 1,
    touchpad {
        natural_scroll = true,
        tap_to_click = true,
    }
}

-- == APPEARANCE ==
local mod = "SUPER"
local terminal = "kitty"
local browser = "firefox"
local editor = "Code"

hyprland.general {
    gaps_in = 4,
    gaps_out = 8,
    border_size = 2,
    col.active_border = "rgba(cba6f7ee) rgba(89b4faee) 45deg",
    col.inactive_border = "rgba(45475aee)",
    layout = "dwindle",
    cursor_inactive_timeout = 2,
}

hyprland.decoration {
    rounding = 8,
    active_opacity = 1.0,
    inactive_opacity = 0.9,
    blur {
        enabled = true,
        size = 3,
        passes = 1,
    },
    drop_shadow = true,
    shadow_range = 4,
    col.shadow = "rgba(1e1e2e88)",
}

hyprland.animations {
    enabled = true,
    bezier = "fast,0.0,0.0,0.2,1.0",
    animation = "global,1,4,default",
    animation = "windows,1,4,fast",
    animation = "windowsOut,1,3,fast",
    animation = "fade,1,4,default",
    animation = "workspaces,1,3,fast",
}

hyprland.misc {
    disable_hyprland_logo = true,
    disable_splash_rendering = true,
    mouse_move_enables_dpms = true,
    key_press_enables_dpms = true,
    enable_swallow = true,
    swallow_regex = "^(kitty|alacritty|foot)$",
    force_default_wallpaper = 0,
}

-- == WINDOW RULES ==
hyprland.windowrule("workspace 1", { class = "^" .. editor .. "$" })
hyprland.windowrule("workspace 2", { class = "^" .. browser .. "$" })
hyprland.windowrule("workspace 3", { class = "^" .. terminal .. "$" })
hyprland.windowrule("workspace 5", { class = "^(discord|Slack|Teams)$" })
hyprland.windowrule("opacity 0.9 0.8", { class = "^(kitty)$" })
hyprland.windowrule("group", { class = "^(kitty|Alacritty)$" })
hyprland.windowrule("float", { class = "^(pavucontrol|blueman-manager|gnome-calculator)$" })
hyprland.windowrule("float", { class = "^(firefox)$", title = "^(Picture-in-Picture)$" })
hyprland.windowrule("float", { class = "^(discord)$", title = "^(Quick Switcher|Settings)$" })

-- == KEYBINDINGS (Vim-adjacent) ==
-- Launch
hyprland.bind(mod, "Return", "exec", terminal)
hyprland.bind(mod, "D", "exec", "rofi -show drun")

-- Close
hyprland.bind(mod, "Q", "killactive")

-- Vim-style focus (H/J/K/L)
hyprland.bind(mod, "H", "movefocus", "l")
hyprland.bind(mod, "J", "movefocus", "d")
hyprland.bind(mod, "K", "movefocus", "u")
hyprland.bind(mod, "L", "movefocus", "r")

-- Also arrow keys for newcomers
hyprland.bind(mod, "Left", "movefocus", "l")
hyprland.bind(mod, "Right", "movefocus", "r")
hyprland.bind(mod, "Up", "movefocus", "u")
hyprland.bind(mod, "Down", "movefocus", "d")

-- Move windows (Vim-style)
hyprland.bind(mod .. " SHIFT", "H", "movewindow", "l")
hyprland.bind(mod .. " SHIFT", "J", "movewindow", "d")
hyprland.bind(mod .. " SHIFT", "K", "movewindow", "u")
hyprland.bind(mod .. " SHIFT", "L", "movewindow", "r")

-- Build and test shortcuts (Ctrl+B / Ctrl+T)
hyprland.bind(mod, "B", "exec", terminal .. " -e make")
hyprland.bind(mod, "T", "exec", terminal .. " -e npm test")

-- Quick build output
hyprland.bind(mod .. " SHIFT", "T", "exec", terminal .. " -e cargo build")

-- Workspaces
for i = 1, 9 do
    hyprland.bind(mod, tostring(i), "workspace", tostring(i))
    hyprland.bind(mod .. " SHIFT", tostring(i), "movetoworkspace", tostring(i))
end

-- Scratchpad (drop-down terminal)
hyprland.bind(mod, "grave", "togglespecialworkspace")
hyprland.bind(mod .. " SHIFT", "grave", "movetoworkspace", "special:scratchpad")

-- Window management
hyprland.bind(mod, "Space", "togglefloating")
hyprland.bind(mod, "F", "fullscreen")
hyprland.bind(mod, "T", "togglegroup")
hyprland.bind(mod, "Tab", "changegroupactive")

-- Mouse workspace scroll
hyprland.bindm(mod, "mouse_down", "workspace", "e+1")
hyprland.bindm(mod, "mouse_up", "workspace", "e-1")

-- Exit
hyprland.bind(mod .. " SHIFT", "Q", "exit", "")

-- Media keys
hyprland.bindl(",", "XF86AudioRaiseVolume", "exec", "wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+")
hyprland.bindl(",", "XF86AudioLowerVolume", "exec", "wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-")
hyprland.bindl(",", "XF86AudioMute", "exec", "wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle")
hyprland.bindl(",", "XF86AudioPlay", "exec", "playerctl play-pause")

-- == ENVIRONMENT ==
hyprland.env("XCURSOR_SIZE", "24")
hyprland.env("HYPRCURSOR_SIZE", "24")
hyprland.env("GDK_BACKEND", "wayland,x11,*")
hyprland.env("QT_QPA_PLATFORM", "wayland;xcb")
hyprland.env("SDL_VIDEODRIVER", "wayland")
hyprland.env("ELECTRON_OZONE_PLATFORM_HINT", "auto")

-- == AUTOSTART ==
hyprland.exec_once("waybar")
hyprland.exec_once("hyprpaper")
hyprland.exec_once("hypridle")
hyprland.exec_once("dunst")
hyprland.exec_once("/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1")
hyprland.exec_once("sleep 5; nm-applet")
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
| Lock screen | hyprlock | Dark blur lock screen |
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
hyprland.monitor("DP-1", "2560x1440@144", "0x0", 1, "icc:/home/user/.local/share/icc/dell-u2723qe.icc")
hyprland.monitor("HDMI-A-1", "1920x1080@60", "2560x0", 1, "icc:/home/user/.local/share/icc/lg-27gp950.icc")

-- == INPUT ==
hyprland.input {
    kb_layout = "us",
    follow_mouse = 1,
    touchpad {
        natural_scroll = true,
        tap_to_click = true,
    }
}

-- == APPEARANCE ==
local mod = "SUPER"
local terminal = "kitty"
local browser = "firefox"

hyprland.general {
    gaps_in = 6,
    gaps_out = 12,
    border_size = 1,
    col.active_border = "rgba(cba6f7ee)",
    col.inactive_border = "rgba(45475aee)",
    layout = "master",
    cursor_inactive_timeout = 5,
    no_border_on_floating = false,
    resize_corner = 2,
}

hyprland.decoration {
    rounding = 12,
    active_opacity = 1.0,
    inactive_opacity = 0.92,
    blur {
        enabled = true,
        size = 4,
        passes = 2,
        new_optimizations = true,
    },
    drop_shadow = true,
    shadow_range = 6,
    col.shadow = "rgba(11111b55)",
}

hyprland.animations {
    enabled = true,
    bezier = "smooth,0.04,0.83,0.19,0.98",
    animation = "global,1,8,default",
    animation = "windows,1,7,smooth",
    animation = "windowsOut,1,7,smooth",
    animation = "fade,1,6,default",
    animation = "workspaces,1,5,smooth",
}

hyprland.misc {
    disable_hyprland_logo = true,
    disable_splash_rendering = true,
    mouse_move_enables_dpms = true,
    key_press_enables_dpms = true,
    font_family = "Noto Sans",
    force_default_wallpaper = 0,
}

-- == WINDOW RULES ==
-- Float design tools, pin their palettes
hyprland.windowrule("float", { class = "^(Gimp|inkscape|krita)$" })
hyprland.windowrule("pin", { class = "^(Gimp)$", title = "^(Toolbox|Layers|Brushes|Colors|Options)" })
hyprland.windowrule("pin", { class = "^(inkscape)$", title = "^(Fill and Stroke|Layers|Swatches)" })
hyprland.windowrule("dimaround", { class = "^(Gimp|inkscape)$" })
hyprland.windowrule("centerwindow", { class = "^(Gimp|inkscape)$" })
hyprland.windowrule("size 1400 900", { class = "^(Gimp)$" })

-- Tile reference material, browser, terminal
hyprland.windowrule("workspace 1", { class = "^" .. browser .. "$" })
hyprland.windowrule("workspace 2", { class = "^" .. terminal .. "$" })
hyprland.windowrule("workspace 3", { class = "^(org.gnome.Nautilus|thunar)$" })

-- Standard floats
hyprland.windowrule("float", { class = "^(pavucontrol|blueman-manager|gnome-calculator)$" })
hyprland.windowrule("float", { class = "^(firefox)$", title = "^(Picture-in-Picture)$" })

-- == KEYBINDINGS ==
hyprland.bind(mod, "Return", "exec", terminal)
hyprland.bind(mod, "D", "exec", "rofi -show drun")
hyprland.bind(mod, "Q", "killactive")
hyprland.bind(mod, "Space", "togglefloating")
hyprland.bind(mod, "F", "fullscreen")

-- Focus
hyprland.bind(mod, "Left", "movefocus", "l")
hyprland.bind(mod, "Right", "movefocus", "r")
hyprland.bind(mod, "Up", "movefocus", "u")
hyprland.bind(mod, "Down", "movefocus", "d")

-- Move windows
hyprland.bind(mod .. " SHIFT", "Left", "movewindow", "l")
hyprland.bind(mod .. " SHIFT", "Right", "movewindow", "r")
hyprland.bind(mod .. " SHIFT", "Up", "movewindow", "u")
hyprland.bind(mod .. " SHIFT", "Down", "movewindow", "d")

-- Workspaces
for i = 1, 9 do
    hyprland.bind(mod, tostring(i), "workspace", tostring(i))
    hyprland.bind(mod .. " SHIFT", tostring(i), "movetoworkspace", tostring(i))
end

-- Color picker
hyprland.bind(mod, "P", "exec", "hyprpicker -a")

-- Color management toggle (night light)
hyprland.bind(mod, "N", "exec", "hyprsunset -t 3500")
hyprland.bind(mod .. " SHIFT", "N", "exec", "pkill hyprsunset")

-- Screenshots (region for design reference)
hyprland.bind(",", "Print", "exec", "hyprshot -m region")
hyprland.bind(mod, "Print", "exec", "hyprshot -m output")

-- Group management
hyprland.bind(mod, "T", "togglegroup")
hyprland.bind(mod, "Tab", "changegroupactive")

-- Mouse workspace
hyprland.bindm(mod, "mouse_down", "workspace", "e+1")
hyprland.bindm(mod, "mouse_up", "workspace", "e-1")

hyprland.bind(mod .. " SHIFT", "Q", "exit", "")

-- Media keys
hyprland.bindl(",", "XF86AudioRaiseVolume", "exec", "wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+")
hyprland.bindl(",", "XF86AudioLowerVolume", "exec", "wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-")
hyprland.bindl(",", "XF86AudioMute", "exec", "wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle")

-- == ENVIRONMENT ==
hyprland.env("XCURSOR_SIZE", "24")
hyprland.env("HYPRCURSOR_SIZE", "24")
hyprland.env("GDK_BACKEND", "wayland,x11,*")
hyprland.env("QT_QPA_PLATFORM", "wayland;xcb")
hyprland.env("SDL_VIDEODRIVER", "wayland")

-- HDR and color management
hyprland.env("AQ_HDR_ENABLED", "1")
hyprland.env("AQ_TONE_MAPPING", "aces")
hyprland.env("AQ_HDR_METADATA", "1")

-- == AUTOSTART ==
hyprland.exec_once("waybar")
hyprland.exec_once("hyprpaper")
hyprland.exec_once("hypridle")
hyprland.exec_once("swaync")
hyprland.exec_once("hyprsunset -t 6500")
hyprland.exec_once("/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1")
```

### Tweak Further

- [Color management: ICC profiles, HDR, night light](color-management.md)
- [Design workflow workspace layout](workflow-patterns.md#design-workflow)
- [Theme: Catppuccin Mocha ecosystem](theming.md#catppuccin-mocha)
- [Plugins: hyprpicker color picker](companion-tools.md#hyprpicker--color-picker)
- [Animations: smooth presets](animations.md)
