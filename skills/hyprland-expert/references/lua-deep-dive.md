# Lua Configuration Deep Dive (v0.55+)

## Overview

Starting from Hyprland v0.55, you can use Lua instead of hyprlang for configuration. Create `~/.config/hypr/hyprland.lua` instead of `hyprland.conf`. If both exist, `hyprland.lua` takes priority.

**Why Lua?** The old hyprlang syntax became unwieldy for complex configs. Lua gives you variables, functions, conditionals, loops, events, and timers — a full programming language for desktop configuration.

## Basic API Reference

### Display

```lua
hyprland.monitor(name, resolution, position, scale)
hyprland.monitor("DP-1", "2560x1440@144", "0x0", 1)
hyprland.monitor("HDMI-A-1", "1920x1080@60", "2560x0", 1)
```

### Input

```lua
hyprland.input {
    kb_layout = "us",
    kb_variant = "",
    follow_mouse = 1,
    touchpad = {
        natural_scroll = true,
        tap_to_click = true,
    }
}
```

### Appearance

```lua
hyprland.general {
    gaps_in = 5,
    gaps_out = 10,
    border_size = 2,
    layout = "dwindle",
}

hyprland.decoration {
    rounding = 10,
    active_opacity = 1.0,
    inactive_opacity = 0.9,
    blur = {
        enabled = true,
        size = 3,
        passes = 1,
    },
    drop_shadow = true,
    shadow_range = 4,
}

hyprland.animations {
    enabled = true,
    bezier = "overshot,0.13,0.99,0.29,1.1",
    animation = "windows,1,7,overshot,popin",
}
```

### Window Rules

```lua
-- Named rules (same as v1)
hyprland.windowrule("float", { class = "^pavucontrol$" })
hyprland.windowrule("workspace 2", { class = "^firefox$" })

-- v2 rules (with property matching)
hyprland.windowrulev2("opacity 0.9 0.8", { class = "^(kitty)$" })
hyprland.windowrulev2("float", { class = "^(pavucontrol)$", title = "^(Volume Control)$" })
```

### Keybindings

```lua
hyprland.bind("SUPER", "Return", "exec", "kitty")
hyprland.bind("SUPER", "Q", "killactive")
hyprland.bind("SUPER SHIFT", "l", "exec", "hyprctl dispatch exit")

-- Mouse bindings
hyprland.bindm("SUPER", "mouse:272", "movewindow")
hyprland.bindl(", XF86AudioRaiseVolume, \"exec\", \"wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+\"")
```

### Environment & Autostart

```lua
hyprland.env("XCURSOR_SIZE", "24")
hyprland.env("GDK_BACKEND", "wayland,x11,*")

hyprland.exec_once("waybar")
hyprland.exec_once("hyprpaper")
hyprland.exec_once("hypridle")
```

### Source

```lua
hyprland.source("~/.config/hypr/configs/monitors.conf")
```

## Advanced: Variables and Functions

```lua
-- Variables
local terminal = "kitty"
local browser = "firefox"
local file_manager = "thunar"

-- Functions
function open_or_focus(class, cmd)
    hyprland.windowrulev2("float", { class = "^" .. class .. "$" })
    hyprland.bind("SUPER", class:sub(1,1):upper(), "exec",
        "~/.config/hypr/scripts/focus_or_launch.sh " .. class .. " " .. cmd)
end

-- Generate bindings programmatically
local workspaces = { "1", "2", "3", "4", "5" }
for _, ws in ipairs(workspaces) do
    hyprland.bind("SUPER", ws, "workspace", ws)
    hyprland.bind("SUPER SHIFT", ws, "movetoworkspace", ws)
end

-- Conditional config based on hostname
local handle = io.popen("hostname")
local hostname = handle:read("*a"):gsub("%s+", "")
handle:close()

if hostname == "laptop" then
    hyprland.monitor("eDP-1", "1920x1080@60", "0x0", 1)
elseif hostname == "desktop" then
    hyprland.monitor("DP-1", "2560x1440@144", "0x0", 1)
    hyprland.monitor("HDMI-A-1", "1920x1080@60", "2560x0", 1)
end
```

## Events and Callbacks

Hyprland Lua exposes events that fire when things happen in the compositor.

### Available Events

```lua
-- Called when a window is opened
hyprland.on("windowOpened", function(window)
    -- window.class, window.title, window.address, window.workspace.id
    if window.class == "firefox" then
        hyprland.dispatch("workspace", "1")
    end
end)

-- Called when focus changes
hyprland.on("activeWindowChanged", function(window)
    print("Now focused: " .. window.class .. " - " .. window.title)
end)

-- Called on workspace change
hyprland.on("workspaceChanged", function(id, name)
    if id == 9 then
        hyprland.keyword("decoration:blur:enabled", false)
    else
        hyprland.keyword("decoration:blur:enabled", true)
    end
end)

-- Called when a monitor is added/removed
hyprland.on("monitorAdded", function(monitor)
    print("Monitor connected: " .. monitor.name)
end)

hyprland.on("monitorRemoved", function(monitor)
    print("Monitor disconnected: " .. monitor.name)
end)
```

### Full Event List

| Event | Callback Args | When |
|-------|---------------|------|
| `windowOpened` | `window` | New window created |
| `windowClosed` | `window` | Window destroyed |
| `activeWindowChanged` | `window` | Focus changed |
| `workspaceChanged` | `id, name` | Workspace switched |
| `monitorAdded` | `monitor` | Monitor connected |
| `monitorRemoved` | `monitor` | Monitor disconnected |
| `fullscreenChanged` | `window, fullscreenClient, fullscreenInternal` | Fullscreen toggled |
| `windowMoved` | `window, workspaceID` | Window moved between workspaces |
| `urgent` | `window` | Window requests attention |

## Timers

```lua
-- One-shot timer
hyprland.timer.timeout(5000, function()
    hyprland.keyword("decoration:blur:enabled", true)
    print("Blur re-enabled after 5 seconds")
end)

-- Interval timer
local counter = 0
hyprland.timer.interval(60000, function()
    counter = counter + 1
    -- Auto-lock after 30 minutes of inactivity
    if counter >= 30 then
        hyprland.dispatch("exec", "hyprlock")
        counter = 0
    end
end)
```

## Dynamic Rule Generation

Generate window rules programmatically based on conditions:

```lua
-- Read a file with application workspace assignments
local function load_app_rules(path)
    local rules = {}
    for line in io.lines(path) do
        local class, ws = line:match("(%S+)%s*(%d+)")
        if class and ws then
            table.insert(rules, { class = class, workspace = ws })
        end
    end
    return rules
end

-- Apply rules from external file
local app_rules = load_app_rules(os.getenv("HOME") .. "/.config/hypr/apps.conf")
for _, rule in ipairs(app_rules) do
    hyprland.windowrule("workspace " .. rule.workspace, { class = "^(." .. rule.class .. ")$" })
end
```

## Migration Guide: hyprlang → Lua

### Syntax Comparison

| hyprlang | Lua |
|----------|-----|
| `monitor=DP-1,preferred,auto,1` | `hyprland.monitor("DP-1", "preferred", "auto", 1)` |
| `general { gaps_in=5 }` | `hyprland.general { gaps_in = 5 }` |
| `windowrule=float,^(kitty)$` | `hyprland.windowrule("float", { class = "^(kitty)$" })` |
| `bind=SUPER,Return,exec,kitty` | `hyprland.bind("SUPER", "Return", "exec", "kitty")` |
| `$var = value` | `local var = "value"` |
| `source=file.conf` | `hyprland.source("file.conf")` |
| `env=KEY,val` | `hyprland.env("KEY", "val")` |
| `exec-once=cmd` | `hyprland.exec_once("cmd")` |
| `bezier=name,x1,y1,x2,y2` | `hyprland.animations { bezier = "name,x1,y1,x2,y2" }` |

### Migration Steps

1. Rename `hyprland.conf` to `hyprland.conf.bak`
2. Create `hyprland.lua`
3. Start with basic sections (monitor, input, general, decoration)
4. Move keybindings using `hyprland.bind()`
5. Move window rules using `hyprland.windowrule()`
6. Add `local` variables for common values
7. Gradually introduce functions, events, and timers

**Note:** Hyprland will still load `hyprland.conf` if `hyprland.lua` doesn't exist. You can migrate incrementally.

## Layout API (v0.55+)

Create custom tiling layouts that define exactly how windows are arranged. Layouts are Lua functions registered with the compositor.

### Basic Layout

```lua
-- Register a custom layout called "mygrid"
hyprland.layout("mygrid", {
    name = "My Grid Layout",

    -- Called when the layout needs to arrange windows
    arrange = function(workspaceID, windows, monitor)
        local rows = math.ceil(#windows / 2)
        local cols = math.min(#windows, 2)
        local mw = monitor.width
        local mh = monitor.height

        for i, win in ipairs(windows) do
            local row = math.floor((i - 1) / cols)
            local col = (i - 1) % cols
            local x = monitor.x + (mw / cols) * col
            local y = monitor.y + (mh / rows) * row
            local w = mw / cols
            local h = mh / rows
            hyprland.arrange_window(win.address, x, y, w, h)
        end
    end,

    -- Called when user requests window position change
    move_window = function(workspaceID, windows, window, direction)
        -- direction: "l", "r", "u", "d"
        -- Return true if handled, false for default behavior
        return false
    end,
})
```

### Switch to a Custom Layout

```lua
hyprland.keyword("general:layout", "mygrid")
```

Or via keybind:
```lua
hyprland.bind("SUPER", "F5", "exec", "hyprctl keyword general:layout mygrid")
```

### Full Layout API Functions

| Function | Description |
|----------|-------------|
| `hyprland.layout(name, opts)` | Register a layout (at config load time) |
| `arrange(workspaceID, windows, monitor)` | Arrange windows callback |
| `move_window(workspaceID, windows, window, direction)` | Move focus between windows |
| `hyprland.arrange_window(address, x, y, w, h)` | Position a window |

**Note:** Layouts must be registered during config loading. They cannot be added dynamically after the config has loaded.

## Limits & Migration Notes

- **⚠ hyprlang is deprecated** since v0.55 — all new configs should use Lua
- Lua config replaces hyprlang entirely — you can't use both at once. If both `hyprland.lua` and `hyprland.conf` exist, Lua takes priority
- `hyprctl keyword` still works with Lua config values
- Some hyprlang-only modules (hyprlock, hypridle) don't support Lua yet
- The Lua API is still evolving — check the wiki for the latest changes
- No Lua support for plugin configuration (yet)

## Full Example

```lua
-- ~/.config/hypr/hyprland.lua

-- Variables
local terminal = "kitty"
local browser = "firefox"
local fileManager = "thunar"
local mod = "SUPER"

-- Monitor
hyprland.monitor("DP-1", "2560x1440@144", "0x0", 1)

-- Input
hyprland.input {
    kb_layout = "us",
    follow_mouse = 1,
    touchpad = {
        natural_scroll = true,
        tap_to_click = true,
    }
}

-- Appearance
hyprland.general { gaps_in = 5, gaps_out = 10, border_size = 2, layout = "dwindle" }

hyprland.decoration {
    rounding = 10,
    active_opacity = 1.0,
    inactive_opacity = 0.9,
    blur = { enabled = true, size = 3, passes = 1 },
    drop_shadow = true,
}

hyprland.animations {
    enabled = true,
    bezier = "smooth,0.04,0.83,0.19,0.98",
    animation = "windows,1,7,smooth,popin",
    animation = "fade,1,7,smooth",
}

-- Window rules
hyprland.windowrule("float", { class = "^pavucontrol$" })
hyprland.windowrule("workspace 1", { class = "^" .. browser .. "$" })
hyprland.windowrule("workspace 2", { class = "^" .. terminal .. "$" })

hyprland.bind(mod, "Return", "exec", terminal)
hyprland.bind(mod, "D", "exec", "wofi --show drun")
hyprland.bind(mod, "Q", "killactive")
hyprland.bind(mod, "Space", "togglefloating")
hyprland.bind(mod, "F", "fullscreen")

for i = 1, 5 do
    hyprland.bind(mod, tostring(i), "workspace", tostring(i))
    hyprland.bind(mod .. " SHIFT", tostring(i), "movetoworkspace", tostring(i))
end

-- Events
hyprland.on("workspaceChanged", function(id)
    if id == 9 then
        hyprland.keyword("decoration:blur:enabled", false)
        hyprland.keyword("animations:enabled", false)
    else
        hyprland.keyword("decoration:blur:enabled", true)
        hyprland.keyword("animations:enabled", true)
    end
end)

-- Environment
hyprland.env("XCURSOR_SIZE", "24")
hyprland.env("GDK_BACKEND", "wayland,x11,*")
hyprland.env("QT_QPA_PLATFORM", "wayland;xcb")

-- Autostart
hyprland.exec_once("waybar")
hyprland.exec_once("hyprpaper")
hyprland.exec_once("hypridle")
hyprland.exec_once("/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1")
```
