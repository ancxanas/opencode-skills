# Lua Configuration Deep Dive (v0.55+)

## Overview

Starting from Hyprland v0.55, you can use Lua instead of hyprlang for configuration. Create `~/.config/hypr/hyprland.lua` instead of `hyprland.conf`. If both exist, `hyprland.lua` takes priority.

**Why Lua?** The old hyprlang syntax became unwieldy for complex configs. Lua gives you variables, functions, conditionals, loops, events, and timers — a full programming language for desktop configuration.

All Lua API functions are exposed through the `hl` global table.

## Basic API Reference

### Display

```lua
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
```

### General Config

All config sections (input, general, decoration, animations, misc, etc.) go through `hl.config()`:

```lua
hl.config({
    input = {
        kb_layout     = "us",
        kb_variant    = "",
        follow_mouse  = 1,
        touchpad = {
            natural_scroll = true,
            -- Note: tap_to_click is not available in the Lua API as of v0.55
        },
    },

    general = {
        gaps_in      = 5,
        gaps_out     = 10,
        border_size  = 2,
        ["col.active_border"] = { colors = {"rgba(33ccffee)", "rgba(00ff99ee)"}, angle = 45 },
        layout       = "dwindle",
    },

    decoration = {
        rounding       = 10,
        rounding_power = 2,
        active_opacity   = 1.0,
        inactive_opacity = 0.9,

        blur = {
            enabled = true,
            size    = 3,
            passes  = 1,
        },

        shadow = {
            enabled = true,
            range   = 4,
            color   = "rgba(1a1a1aee)",
        },
    },

    animations = {
        enabled = true,
    },

    misc = {
        force_default_wallpaper = -1,
    },
})
```

### Curves and Animations

Curves (bezier/spring) and individual animation leaves use separate top-level functions:

```lua
hl.curve("smooth", { type = "bezier", points = {{0.04, 0.83}, {0.19, 0.98}} })
hl.curve("overshot", { type = "bezier", points = {{0.13, 0.99}, {0.29, 1.1}} })
hl.curve("bounce",   { type = "spring", mass = 1, stiffness = 71.2633, dampening = 15.8273644 })

hl.animation({ leaf = "windows",    enabled = true, speed = 4.79, spring = "bounce", style = "popin 87%" })
hl.animation({ leaf = "fade",       enabled = true, speed = 3.03, bezier = "smooth" })
hl.animation({ leaf = "workspaces", enabled = true, speed = 1.94, bezier = "smooth", style = "fade" })
hl.animation({ leaf = "border",     enabled = true, speed = 5.39, bezier = "overshot" })
```

### Window Rules

Named rules with match tables. Returns a handle you can enable/disable:

```lua
hl.window_rule({
    name  = "float-pavucontrol",
    match = { class = "^(pavucontrol)$" },
    float = true,
})

hl.window_rule({
    name  = "workspace-firefox",
    match = { class = "^(firefox)$" },
    workspace = "1",
})

hl.window_rule({
    name  = "opacity-kitty",
    match = { class = "^(kitty)$" },
    -- Note: per-window opacity is not available in the Lua API as of v0.55
    -- Use decoration { active_opacity, inactive_opacity } in hl.config() instead
})

-- Toggle via handle
local rule = hl.window_rule({
    name  = "suppress-maximize",
    match = { class = ".*" },
    suppress_event = "maximize",
})
rule:set_enabled(false)
```

### Keybindings

Use `hl.bind()` with `hl.dsp.*` dispatchers:

```lua
local mod = "SUPER"

-- Execute a command
hl.bind(mod .. " + Return", hl.dsp.exec_cmd("kitty"))
hl.bind(mod .. " + D",      hl.dsp.exec_cmd("wofi --show drun"))

-- Built-in dispatchers
hl.bind(mod .. " + Q",      hl.dsp.window.close())
hl.bind(mod .. " + V",      hl.dsp.window.float({ action = "toggle" }))
hl.bind(mod .. " + F",      hl.dsp.window.fullscreen())
hl.bind(mod .. " + P",      hl.dsp.window.pseudo())
hl.bind(mod .. " + Space",  hl.dsp.window.float({ action = "toggle" }))

-- Focus and navigation
hl.bind(mod .. " + left",   hl.dsp.focus({ direction = "left" }))
hl.bind(mod .. " + right",  hl.dsp.focus({ direction = "right" }))
hl.bind(mod .. " + up",     hl.dsp.focus({ direction = "up" }))
hl.bind(mod .. " + down",   hl.dsp.focus({ direction = "down" }))

-- Workspace switching
hl.bind(mod .. " + 1", hl.dsp.focus({ workspace = 1 }))
hl.bind(mod .. " + 2", hl.dsp.focus({ workspace = 2 }))
hl.bind(mod .. " + 3", hl.dsp.focus({ workspace = 3 }))
hl.bind(mod .. " + 4", hl.dsp.focus({ workspace = 4 }))
hl.bind(mod .. " + 5", hl.dsp.focus({ workspace = 5 }))

-- Move windows between workspaces
hl.bind(mod .. " + SHIFT + 1", hl.dsp.window.move({ workspace = 1 }))
hl.bind(mod .. " + SHIFT + 2", hl.dsp.window.move({ workspace = 2 }))
hl.bind(mod .. " + SHIFT + 3", hl.dsp.window.move({ workspace = 3 }))
hl.bind(mod .. " + SHIFT + 4", hl.dsp.window.move({ workspace = 4 }))
hl.bind(mod .. " + SHIFT + 5", hl.dsp.window.move({ workspace = 5 }))

-- Loop bindings
for i = 1, 9 do
    hl.bind(mod .. " + " .. i,         hl.dsp.focus({ workspace = i }))
    hl.bind(mod .. " + SHIFT + " .. i, hl.dsp.window.move({ workspace = i }))
end
hl.bind(mod .. " + 0",         hl.dsp.focus({ workspace = 10 }))
hl.bind(mod .. " + SHIFT + 0", hl.dsp.window.move({ workspace = 10 }))

-- Mouse bindings (use { mouse = true })
hl.bind(mod .. " + mouse:272", hl.dsp.window.drag(),   { mouse = true })
hl.bind(mod .. " + mouse:273", hl.dsp.window.resize(), { mouse = true })

-- Scroll through workspaces
hl.bind(mod .. " + mouse_down", hl.dsp.focus({ workspace = "e+1" }))
hl.bind(mod .. " + mouse_up",   hl.dsp.focus({ workspace = "e-1" }))

-- Special workspace (scratchpad)
hl.bind(mod .. " + S",         hl.dsp.workspace.toggle_special("magic"))
hl.bind(mod .. " + SHIFT + S", hl.dsp.window.move({ workspace = "special:magic" }))

-- Locked (global shortcut) binds with repeating
hl.bind("XF86AudioRaiseVolume", hl.dsp.exec_cmd("wpctl set-volume -l 1 @DEFAULT_AUDIO_SINK@ 5%+"),   { locked = true, repeating = true })
hl.bind("XF86AudioLowerVolume", hl.dsp.exec_cmd("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-"),          { locked = true, repeating = true })
hl.bind("XF86AudioMute",        hl.dsp.exec_cmd("wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle"),         { locked = true, repeating = true })
hl.bind("XF86MonBrightnessUp",  hl.dsp.exec_cmd("brightnessctl -e4 -n2 set 5%+"),                      { locked = true, repeating = true })
hl.bind("XF86MonBrightnessDown",hl.dsp.exec_cmd("brightnessctl -e4 -n2 set 5%-"),                      { locked = true, repeating = true })

-- Layout messages
hl.bind(mod .. " + J", hl.dsp.layout("togglesplit"))    -- dwindle only
hl.bind(mod .. " + M", hl.dsp.layout("swapwithmaster")) -- master only
```

### Dispatcher Reference (`hl.dsp.*`)

| Dispatcher | Description |
|------------|-------------|
| `hl.dsp.exec_cmd(cmd)` | Execute shell command |
| `hl.dsp.window.close()` | Close active window |
| `hl.dsp.window.float({ action = "toggle"/"set"/"unset" })` | Toggle/set/unset float |
| `hl.dsp.window.fullscreen()` | Toggle fullscreen |
| `hl.dsp.window.pseudo()` | Toggle pseudo-tiling (dwindle) |
| `hl.dsp.window.drag()` | Drag window with mouse (use `{ mouse = true }`) |
| `hl.dsp.window.resize()` | Resize window with mouse (use `{ mouse = true }`) |
| `hl.dsp.window.move({ workspace = n })` | Move window to workspace |
| `hl.dsp.window.pin()` | Pin/unpin window |
| `hl.dsp.focus({ direction = "left"/"right"/"up"/"down" })` | Focus in direction |
| `hl.dsp.focus({ workspace = n })` | Focus workspace |
| `hl.dsp.workspace.toggle_special(name)` | Toggle special workspace |
| `hl.dsp.layout(msg)` | Send layout message (e.g., "togglesplit") |
| `hl.dsp.exit()` | Exit Hyprland |

### `hl.dispatch()` — Dynamic Dispatch

Use `hl.dispatch()` when you need to invoke a dispatcher outside a `hl.bind()` call, e.g. from event callbacks or `hyprctl eval`:

```lua
-- From an event callback
hl.on("window.open", function(w)
    if w.class == "firefox" then
        hl.dispatch(hl.dsp.focus({ workspace = 1 }))
    end
end)

-- From hyprctl eval (note: needs hl.dispatch wrapper)
-- $ hyprctl eval 'hl.dispatch(hl.dsp.focus({ workspace = "3" }))'
```

### Environment & Autostart

```lua
hl.env("XCURSOR_SIZE", "24")
hl.env("GDK_BACKEND", "wayland,x11,*")
hl.env("QT_QPA_PLATFORM", "wayland;xcb")

hl.on("hyprland.start", function()
    hl.exec_cmd("waybar")
    hl.exec_cmd("hyprpaper")
    hl.exec_cmd("hypridle")
    -- Use hyprpolkitagent if available, fallback to polkit-gnome
    -- hl.exec_cmd("/usr/lib/hyprpolkitagent")
    -- hl.exec_cmd("/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1")
end)
```

### Source / Require

Split config across multiple files using Lua's `require()`:

```lua
-- ~/.config/hypr/hyprland.lua
require("monitors")
require("keybinds")
require("colors")

-- These files live in ~/.config/hypr/ (same directory as hyprland.lua)
-- or you can use full paths:
-- require("~/.config/hypr/my-rules")
```

## Events and Callbacks

Hyprland Lua exposes events through `hl.on(event_name, callback)`.

**Important:** If you register multiple handlers for the same event name (e.g. two `hl.on("hyprland.start", ...)` calls), only the last one registered will fire. Merge all logic for the same event into a single handler:

```lua
-- GOOD: single handler for hyprland.start
hl.on("hyprland.start", function()
    hl.exec_cmd("waybar")
    hl.exec_cmd("hyprpaper")
    hl.exec_cmd("hypridle")
end)

-- BAD: two separate handlers — only the last one fires
-- hl.on("hyprland.start", function() hl.exec_cmd("waybar") end)
-- hl.on("hyprland.start", function() hl.exec_cmd("hyprpaper") end)

-- Called when a window is opened
hl.on("window.open", function(w)
    if w.class == "firefox" then
        hl.dispatch(hl.dsp.focus({ workspace = 1 }))
    end
end)

-- Called when focus changes
hl.on("window.active", function(w, is_active)
    print("Now focused: " .. w.class .. " - " .. w.title)
end)

-- Called on workspace change
hl.on("workspace.active", function(ws)
    if ws.id == 9 then
        hl.config({ decoration = { blur = { enabled = false } } })
    else
        hl.config({ decoration = { blur = { enabled = true } } })
    end
end)

-- Called when a monitor is connected
hl.on("monitor.added", function(m)
    print("Monitor connected: " .. m.name)
end)

hl.on("monitor.removed", function(m)
    print("Monitor disconnected: " .. m.name)
end)
```

### Full Event List

| Event | Callback Args | When |
|-------|---------------|------|
| `hyprland.start` | `()` | Emitted once on start |
| `hyprland.shutdown` | `()` | Before Hyprland exits |
| `window.open` | `(Window)` | Window initialized with rules applied |
| `window.open_early` | `(Window)` | Window created but before rules applied |
| `window.close` | `(Window)` | Window closed (may still be visible during anim) |
| `window.destroy` | `(Window)` | Window fully removed from compositor |
| `window.kill` | `(Window)` | Window forcefully killed via hyprctl |
| `window.active` | `(Window, int)` | Active window changed |
| `window.urgent` | `(Window)` | Window requests urgent state |
| `window.title` | `(Window)` | Window title changed |
| `window.class` | `(Window)` | Window class changed |
| `window.pin` | `(Window)` | Window pinned/unpinned |
| `window.fullscreen` | `(Window)` | Fullscreen status changed |
| `window.update_rules` | `(Window)` | Window rules re-evaluated |
| `window.move_to_workspace` | `(Window, Workspace)` | Window moved to different workspace |
| `layer.opened` | `(LayerSurface)` | Layer surface opened |
| `layer.closed` | `(LayerSurface)` | Layer surface closed |
| `monitor.added` | `(Monitor)` | Monitor connected and ready |
| `monitor.removed` | `(Monitor)` | Monitor disconnected and removed |
| `monitor.focused` | `(Monitor)` | Active monitor changed |
| `monitor.layout_changed` | `()` | Monitor arrangement changed |
| `workspace.active` | `(Workspace)` | Active workspace on monitor changed |
| `workspace.special_active` | `(Workspace or nil, Monitor)` | Special workspace toggled |
| `workspace.created` | `(Workspace)` | Workspace created |
| `workspace.removed` | `(Workspace)` | Workspace removed |
| `workspace.move_to_monitor` | `(Workspace, Monitor)` | Workspace moved to different monitor |
| `config.reloaded` | `()` | Config reloaded and applied |
| `keybinds.submap` | `(string)` | Active submap changed (empty = default) |
| `screenshare.state` | `(bool, int, string)` | Screenshare started/stopped |

## Convenience Functions

Query compositor state at runtime:

```lua
hl.get_config("general.gaps_in")       -- Returns { top, left, right, bottom }
hl.get_active_window()                 -- Returns Window or nil
hl.get_windows()                       -- Returns list of all windows
hl.get_window(selector)                -- Window by address/class/title
hl.get_urgent_window()                 -- Window with urgent state
hl.get_workspaces()                    -- Returns list of workspaces
hl.get_workspace(selector)             -- Workspace by id/name
hl.get_active_workspace()              -- Workspace currently active
hl.get_active_special_workspace()      -- Special workspace or nil
hl.get_monitors()                      -- Returns list of monitors
hl.get_monitor(selector)               -- Monitor by name/id
hl.get_active_monitor()                -- Monitor currently active
hl.get_monitor_at({ x = num, y = num }) -- Monitor at position
hl.get_monitor_at_cursor()             -- Monitor under cursor
hl.get_cursor_pos()                    -- Returns { x, y }
hl.get_last_window()                   -- Previously focused window
hl.get_last_workspace()                -- Previously focused workspace
hl.get_layers()                        -- Returns list of layer surfaces
hl.get_workspace_windows(selector)     -- Windows on a workspace
hl.get_current_submap()                -- Current submap name
hl.version()                           -- Hyprland version string
hl.get_loaded_plugins()                -- List of loaded plugins
hl.exec_cmd(cmd)                       -- Execute shell command
```

Use the LSP for return types of these functions. See the wiki for LSP setup.

## Dynamic Config Changes

Change config options at runtime using `hl.config()` or read with `hl.get_config()`:

```lua
-- Toggle gaps_in between 0 and 3
hl.bind("SUPER + SHIFT + G", function()
    local gaps = hl.get_config("general.gaps_in")
    if gaps.top == 3 then
        hl.config({ general = { gaps_in = 0 } })
    else
        hl.config({ general = { gaps_in = 3 } })
    end
end)

-- Toggle blur
hl.bind("SUPER + SHIFT + B", function()
    local current = hl.get_config("decoration.blur.enabled")
    -- hl.get_config returns boolean for simple types
    hl.config({ decoration = { blur = { enabled = not current } } })
end)
```

## Timers

```lua
-- One-shot timer (fires once after 5000ms)
local timer = hl.timer(function()
    hl.config({ decoration = { blur = { enabled = true } } })
    print("Blur re-enabled after 5 seconds")
end, { timeout = 5000, type = "once" })

-- Interval timer (fires every 60000ms)
local counter = 0
local lockTimer = hl.timer(function()
    counter = counter + 1
    if counter >= 30 then
        hl.dispatch(hl.dsp.exec_cmd("hyprlock"))
        counter = 0
    end
end, { timeout = 60000, type = "repeat" })

-- Toggle timer on/off
hl.bind("SUPER + X", function()
    lockTimer:set_enabled(not lockTimer:is_enabled())
end)
```

## Permissions

```lua
-- Requires ecosystem.enforce_permissions = true in config
hl.permission("/usr/bin/grim", "screencopy", "allow")
hl.permission("/usr/lib/xdg-desktop-portal-hyprland", "screencopy", "allow")
```

## Layer Rules

```lua
local overlayRule = hl.layer_rule({
    name  = "no-anim-overlay",
    match = { namespace = "^my-overlay$" },
    no_anim = true,
})
overlayRule:set_enabled(false)
```

## Workspace Rules

```lua
hl.workspace_rule({
    workspace = "w[tv1]",
    gaps_out  = 0,
    gaps_in   = 0,
})
hl.workspace_rule({
    workspace = "f[1]",
    gaps_out  = 0,
    gaps_in   = 0,
})
```

## Per-Device Config

```lua
hl.device({
    name        = "epic-mouse-v1",
    sensitivity = -0.5,
})

hl.device({
    name        = "at-translated-set-2-keyboard",
    kb_layout   = "us",
    kb_variant  = "colemak",
})
```

## Gestures

```lua
hl.gesture({
    fingers   = 3,
    direction = "horizontal",
    action    = "workspace",
})
```

## Dynamic Rule Generation

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
    hl.window_rule({
        name      = "auto-ws-" .. rule.class,
        match     = { class = "^(." .. rule.class .. ")$" },
        workspace = rule.workspace,
    })
end

-- On-the-fly rule generation
function open_or_focus(class, cmd)
    hl.window_rule({
        name  = "float-" .. class,
        match = { class = "^" .. class .. "$" },
        float = true,
    })
    hl.bind("SUPER", class:sub(1,1):upper(),
        hl.dsp.exec_cmd("~/.config/hypr/scripts/focus_or_launch.sh " .. class .. " " .. cmd))
end
```

## Layout API (v0.55+)

Create custom tiling layouts in Lua. Layouts dictate how windows are arranged on a workspace.

### Basic Layout

```lua
hl.layout.register("columns", {
    recalculate = function(ctx)
        local n = #ctx.targets
        if n == 0 then return end

        for i, target in ipairs(ctx.targets) do
            target:place(ctx:column(i, n))
        end
    end,
})
```

Use it with `hl.config({ general = { layout = "lua:columns" } })`.

### Example: Two-Column Grid

```lua
hl.layout.register("mygrid", {
    recalculate = function(ctx)
        local n = #ctx.targets
        if n == 0 then return end

        local cols = math.min(n, 3)
        local rows = math.ceil(n / cols)

        for i, target in ipairs(ctx.targets) do
            local col = (i - 1) % cols
            local row = math.floor((i - 1) / cols)
            target:place(ctx:grid_cell(col, row, cols, rows))
        end
    end,
})
```

### Layout Message Handler

```lua
hl.layout.register("mygrid", {
    recalculate = function(ctx)
        local n = #ctx.targets
        if n == 0 then return end

        for i, target in ipairs(ctx.targets) do
            target:place(ctx:column(i, n))
        end
    end,

    layout_msg = function(msg)
        -- Handle layoutmsg dispatches (e.g., "togglesplit")
        -- Return true if handled, false for default behavior
        return false
    end,
})
```

### Switching to a Custom Layout

```lua
-- In hl.config
hl.config({
    general = { layout = "lua:mygrid" },
})

-- Per-workspace
hl.config({
    general = { layout = "lua:columns" },
})
hl.workspace_rule({ workspace = "3", layout = "lua:columns" })
```

### Keybind to switch layouts

```lua
local current_layout = "dwindle"
hl.bind("SUPER + F5", function()
    if current_layout == "dwindle" then
        current_layout = "lua:columns"
    else
        current_layout = "dwindle"
    end
    hl.config({ general = { layout = current_layout } })
end)
```

### Layout Context API

The `ctx` object passed to `recalculate` provides:

| Method | Description |
|--------|-------------|
| `ctx.area` | Work area `{ x, y, w, h }` (the monitor area minus reserved space) |
| `ctx.targets` | Array of layout targets (one per window) |
| `target:place(rect)` | Position a target using `{ x, y, w, h }` — handles gaps, pseudotiling, reserved space |
| `target:set_box(rect)` | Position a target manually — NO gap/pseudotile calculations |
| `target.window` | The window object (may be nil for some targets, e.g. groups) |
| `ctx:column(i, n)` | Returns rect for column `i` of `n` |
| `ctx:row(i, n)` | Returns rect for row `i` of `n` |
| `ctx:grid_cell(col, row, cols, rows)` | Returns rect for cell position |
| `ctx:split(targets, splitsT)` | Split targets into multiple groups |

**Important:** Prefer `target:place()` over `target:set_box()` unless full manual positioning is required. `:place()` automatically handles gaps, pseudotiling, reserved borders, and other window decorations.

For example layouts, see the [Hyprland repo examples](https://github.com/hyprwm/Hyprland/tree/main/src/config/lua/examples).

### Layout Limits

- Layouts must be registered during config loading (in the top-level of a `require`d file)
- Custom layouts are used as `lua:name` in `general.layout`
- Available globally, per-workspace, or per-monitor via workspace rules
- `layout_msg` is optional — omit it if not needed

## Scrolling with `scroll_move` (v0.55+)

Native trackpad gesture for scrolling in the window tape:

```lua
-- In hl.config
hl.config({
    scrolling = {
        fullscreen_on_one_column = true,
    },
})
```

See `workflow-patterns.md` for full scrolling layout details.

## Migration Guide: hyprlang → Lua

### Syntax Comparison

| hyprlang | Lua |
|----------|-----|
| `monitor=DP-1,preferred,auto,1` | `hl.monitor({ output = "DP-1", mode = "preferred", position = "auto", scale = 1 })` |
| `general { gaps_in=5 }` | `hl.config({ general = { gaps_in = 5 } })` |
| `decoration { blur { enabled=true } }` | `hl.config({ decoration = { blur = { enabled = true } } })` |
| `windowrule=float,^(kitty)$` | `hl.window_rule({ name = "float-kitty", match = { class = "^(kitty)$" }, float = true })` |
| `bind=SUPER,Return,exec,kitty` | `hl.bind("SUPER + Return", hl.dsp.exec_cmd("kitty"))` |
| `bindl=,XF86AudioRaiseVolume,exec,cmd` | `hl.bind("XF86AudioRaiseVolume", hl.dsp.exec_cmd("cmd"), { locked = true })` |
| `bindm=SUPER,mouse:272,movewindow` | `hl.bind("SUPER + mouse:272", hl.dsp.window.drag(), { mouse = true })` |
| `$var = value` | `local var = "value"` |
| `source=file.conf` | `require("file")` |
| `env=KEY,val` | `hl.env("KEY", "val")` |
| `exec-once=cmd` | `hl.on("hyprland.start", function() hl.exec_cmd("cmd") end)` |
| `bezier=name,x1,y1,x2,y2` | `hl.curve("name", { type = "bezier", points = {{x1,y1},{x2,y2}} })` |
| `animation=windows,1,7,bezierName,popin` | `hl.animation({ leaf = "windows", enabled = true, speed = 7, bezier = "bezierName", style = "popin" })` |

### Migration Steps

1. Rename `hyprland.conf` to `hyprland.conf.bak`
2. Create `hyprland.lua`
3. Start with basic `hl.config()` calls (monitor, input, general, decoration)
4. Move keybindings using `hl.bind()` with `hl.dsp.*` dispatchers
5. Move window rules using `hl.window_rule()`
6. Add `local` variables for common values
7. Gradually introduce functions, events, and timers
8. Move autostart into `hl.on("hyprland.start", ...)` block

**Note:** Hyprland will still load `hyprland.conf` if `hyprland.lua` doesn't exist. You can migrate incrementally, but new features won't be added to hyprlang.

## Limits & Migration Notes

- **⚠ hyprlang is deprecated** since v0.55 — all new configs should use Lua
- Lua config replaces hyprlang entirely — you can't use both at once. If both `hyprland.lua` and `hyprland.conf` exist, Lua takes priority
- `hyprctl dispatch` syntax changed in v0.55: use `hyprctl dispatch 'hl.dsp.exec_cmd("cmd")'` instead of `hyprctl dispatch 'exec cmd'`
- `hyprctl eval` lets you run arbitrary Lua: `hyprctl eval 'hl.dispatch(hl.dsp.focus({ workspace = "3" }))'`
- Some hyprlang-only modules (hyprlock, hypridle) don't support Lua yet — they still use `hyprlang`
- The Lua API is still evolving — check the wiki for the latest changes
- No Lua support for plugin configuration (yet)

## Full Example

```lua
-- ~/.config/hypr/hyprland.lua

-- Variables
local terminal    = "kitty"
local browser     = "firefox"
local fileManager = "thunar"
local mod         = "SUPER"

-- Curves
hl.curve("smooth",      { type = "bezier", points = {{0.04, 0.83}, {0.19, 0.98}} })
hl.curve("easeOutQuint",{ type = "bezier", points = {{0.23, 1},    {0.32, 1}} })

-- Monitor
hl.monitor({ output = "DP-1", mode = "2560x1440@144", position = "0x0", scale = 1 })

-- Config sections
hl.config({
    input = {
        kb_layout = "us",
        follow_mouse = 1,
        touchpad = { natural_scroll = true },
    },
    general = {
        gaps_in = 5,
        gaps_out = 10,
        border_size = 2,
        ["col.active_border"] = { colors = {"rgba(33ccffee)", "rgba(00ff99ee)"}, angle = 45 },
        layout = "dwindle",
    },
    decoration = {
        rounding = 10,
        active_opacity = 1.0,
        inactive_opacity = 0.9,
        blur = { enabled = true, size = 3, passes = 1 },
        shadow = { enabled = true, range = 4 },
    },
    animations = { enabled = true },
    misc = { force_default_wallpaper = -1 },
})

-- Animations
hl.animation({ leaf = "windows",    enabled = true, speed = 4.79, spring = "easeOutQuint", style = "popin 87%" })
hl.animation({ leaf = "fade",       enabled = true, speed = 3.03, bezier = "smooth" })
hl.animation({ leaf = "workspaces", enabled = true, speed = 1.94, bezier = "smooth", style = "fade" })

-- Window rules
hl.window_rule({ name = "float-pavucontrol", match = { class = "^(pavucontrol)$" }, float = true })
hl.window_rule({ name = "ws-browser",        match = { class = "^" .. browser .. "$" }, workspace = "1" })
hl.window_rule({ name = "ws-terminal",       match = { class = "^" .. terminal .. "$" }, workspace = "2" })

-- Keybindings
hl.bind(mod .. " + Return", hl.dsp.exec_cmd(terminal))
hl.bind(mod .. " + D",      hl.dsp.exec_cmd("wofi --show drun"))
hl.bind(mod .. " + Q",      hl.dsp.window.close())
hl.bind(mod .. " + V",      hl.dsp.window.float({ action = "toggle" }))
hl.bind(mod .. " + F",      hl.dsp.window.fullscreen())
hl.bind(mod .. " + Space",  hl.dsp.window.float({ action = "toggle" }))

for i = 1, 9 do
    hl.bind(mod .. " + " .. i,              hl.dsp.focus({ workspace = i }))
    hl.bind(mod .. " + SHIFT + " .. i,      hl.dsp.window.move({ workspace = i }))
end

hl.bind(mod .. " + mouse:272", hl.dsp.window.drag(),   { mouse = true })
hl.bind(mod .. " + mouse:273", hl.dsp.window.resize(), { mouse = true })
hl.bind(mod .. " + mouse_down", hl.dsp.focus({ workspace = "e+1" }))
hl.bind(mod .. " + mouse_up",   hl.dsp.focus({ workspace = "e-1" }))

-- Environment
hl.env("XCURSOR_SIZE", "24")
hl.env("GDK_BACKEND", "wayland,x11,*")
hl.env("QT_QPA_PLATFORM", "wayland;xcb")

-- Autostart
hl.on("hyprland.start", function()
    hl.exec_cmd("waybar")
    hl.exec_cmd("hyprpaper")
    hl.exec_cmd("hypridle")
    -- hl.exec_cmd("/usr/lib/hyprpolkitagent")
end)

-- Events
hl.on("workspace.active", function(ws)
    if ws.id == 9 then
        hl.config({ decoration = { blur = { enabled = false } } })
        hl.config({ animations = { enabled = false } })
    else
        hl.config({ decoration = { blur = { enabled = true } } })
        hl.config({ animations = { enabled = true } })
    end
end)

-- Custom layout example
hl.layout.register("columns", {
    recalculate = function(ctx)
        local n = #ctx.targets
        if n == 0 then return end
        for i, target in ipairs(ctx.targets) do
            target:place(ctx:column(i, n))
        end
    end,
})

-- Timers example
local counter = 0
hl.timer(function()
    counter = counter + 1
    if counter >= 10 then
        hl.dispatch(hl.dsp.exec_cmd("hyprlock"))
        counter = 0
    end
end, { timeout = 60000, type = "repeat" })
```
