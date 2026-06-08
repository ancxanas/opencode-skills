---

## Plugin Index

### hyprgrass — Touch Gestures

Adds multi-touch trackpad gestures (swipe between workspaces, etc.).

**Use case:** Laptop users who want macOS-like gesture navigation.

```
hyprpm add https://github.com/horriblename/hyprgrass
hyprpm enable hyprgrass
```

```conf
# hyprland.conf
gestures {
    workspace_swipe = true
    workspace_swipe_touch = true
}

bind = SUPER, 1, exec, hyprctl dispatch workspace 1
```

**Swipe config:**
```conf
gestures {
    workspace_swipe = true
    workspace_swipe_touch = true
    workspace_swipe_fingers = 3   # 3-finger swipe = workspace switch
    workspace_swipe_distance = 300
    workspace_swipe_invert = false
    workspace_swipe_min_speed_to_force = 10
    workspace_swipe_cancel_ratio = 0.5
    workspace_swipe_create_new = true
    workspace_swipe_direction_lock = true
    workspace_swipe_direction_lock_threshold = 5
    workspace_swipe_forever = true
    workspace_swipe_use_r = false
}
```

**Known issues:**
- May conflict with `hyprctl` touch gesture assignments
- Requires Hyprland v0.44+

---
{% raw %}


### hyprspace — Workspace Overview

Press a key to show a Mission Control-style overview of all workspaces.

**Use case:** Visual workspace switching with many workspaces.

```
hyprpm add https://github.com/KZDKM/Hyprspace
hyprpm enable Hyprspace
```

```conf
# Keybind to toggle overview
bind = $mainMod, Tab, exec, hyprctl dispatch togglespecialworkspace HYPRSPACE
```

```lua
-- Or from Lua:
hyprland.bind("SUPER", "Tab", "exec", "hyprctl dispatch togglespecialworkspace HYPRSPACE")
```

**Features:**
- Shows all workspaces as thumbnails
- Click or type to switch
- Search by window title

---

### hyprbars — Window Title Bars

Adds title bars to windows, useful for floating layouts.

**Use case:** Users coming from floating desktops who miss title bars.

```
hyprpm add https://github.com/hyprwm/hyprbars
hyprpm enable hyprbars
```

```conf
# hyprland.conf — hyprbars config
plugin {
    hyprbars {
        bar_height = 30
        bar_color = rgba(1e1e2eff)
        bar_text_color = rgba(cdd6f4ff)
        bar_text_font = JetBrainsMono Nerd Font
        bar_text_size = 12
        bar_text_align = left
        bar_button_padding = 8
        bar_buttons_enabled = true
        bar_precedence_over_border = true
        bar_part_of_window = true
        bar_button_close_color = rgba(f38ba8ff)
        bar_button_maximize_color = rgba(a6e3a1ff)
        bar_button_minimize_color = rgba(f9e2afff)
        bar_button_close_size = 12
        bar_button_maximize_size = 12
        bar_button_minimize_size = 12
    }
}
```

**Known issues:**
- Incompatible with some Java/Swing apps
- Can overlap with custom borders from other plugins

---

### hyprtrails — Cursor Trail Effect

Adds a smooth cursor trail / mouse ghost effect.

**Use case:** Aesthetic visual effect; screen recording cursor highlighting.

```
hyprpm add https://github.com/hyprwm/hyprtrails
hyprpm enable hyprtrails
```

```conf
plugin {
    hyprtrails {
        color = rgba(cba6f7ff)
        length = 7
        falloff = 3
        width = 5
    }
}
```

---

### split-monitor-workspaces — Per-Monitor Workspace Numbering

Makes each monitor have its own set of workspaces (e.g., monitor 1 has 1-5, monitor 2 has 6-10).

**Use case:** Users who want independent workspace sets per monitor (like i3).

```
hyprpm add https://github.com/Duckonaut/split-monitor-workspaces
hyprpm enable split-monitor-workspaces
```

```conf
plugin {
    split-monitor-workspaces {
        count = 5          # Workspaces per monitor
        enable_notifications = true
        enable_persistent_workspaces = true
        sort_by_name = true
    }
}
```

**Behavior:**
- Monitor 1: workspaces 1-5
- Monitor 2: workspaces 6-10
- `$mainMod+1` goes to workspace 1 on current monitor
- `$mainMod+SHIFT+1` moves window to workspace 1 on current monitor

**Known issues:**
- Conflicts with explicit `workspace X, monitor:Y` assignments
- May not work correctly with `hyprspace`

---

### borders-plus-plus — Enhanced Borders

Adds colored, animated, multi-layered borders.

**Use case:** Maximum customization for border appearance.

```
hyprpm add https://github.com/hyprwm/hyprbars   # Actually hyprbars repo includes this
# OR standalone:
hyprpm add https://github.com/hyprwm/hyprborder
hyprpm enable hyprborder
```

```conf
plugin {
    hyprborder {
        border_size = 3
        border_color = rgba(cba6f7ee) rgba(89b4faee) rgba(f5c2e7ee) 45deg
        border_angle_animation = true
        border_angle_animation_speed = 100
    }
}
```

---

### hyprfocus — Focus Rings

Adds focus indicators (rings) around the active window.

**Use case:** Visual clarity on which window is focused.

```
hyprpm add https://github.com/outfoxxed/hyprfocus
hyprpm enable hyprfocus
```

```conf
plugin {
    hyprfocus {
        ring_color = rgba(cba6f7ee)
        ring_width = 3
        ring_offset = 0
        ring_gradient = true
        ring_gradient_color1 = rgba(89b4faee)
        ring_gradient_color2 = rgba(cba6f7ee)
    }
}
```

---

## Plugin Conflict Matrix

Some plugins conflict with each other or with specific Hyprland features.

| Plugin A | Plugin B | Conflict |
|----------|----------|----------|
| `hyprbars` | `hyprborder` | Both modify window decoration — use one |
| `hyprbars` | Java/Swing apps | Title bars may not render correctly |
| `hyprspace` | `split-monitor-workspaces` | Workspace overview may show wrong workspaces |
| `hyprgrass` | Custom `bind=,touchgesture` | Touch gestures may fire twice |
| `hyprbars` | `windowrulev2=noborder` | `noborder` disables title bar too |
| Gesture plugins | `misc:no_direct_scanout` | Disable scanout for gesture reliability |

**Safe combinations:**
- `hyprtrails` + anything (pure visual, no conflicts)
- `hyprspace` + `hyprbars` (no overlap)
- `hyprfocus` + anything (no known conflicts)
- `borders-plus-plus` + `hyprspace` (no overlap)

---

## Performance Considerations

| Plugin | CPU Impact | Memory | GPU Impact |
|--------|-----------|--------|------------|
| hyprgrass | Low | ~2MB | None |
| hyprspace | Medium (only when open) | ~30MB (thumbnails) | Medium |
| hyprbars | Low | ~1MB | Low |
| hyprtrails | Low | ~1MB | Low-Medium |
| split-monitor-workspaces | None | ~1MB | None |
| hyprfocus | Low | ~1MB | Low |
| borders-plus-plus | Low | ~1MB | Low |

---

## Custom Plugin Template (C++)

For advanced users who want to write their own plugins:

```cpp
// my-plugin/main.cpp
#include "src/includes.hpp"
#include "src/plugins/PluginAPI.hpp"

class CMyPlugin : public IPlugin {
public:
    void onEnable() override {
        // Called when hyprpm enables the plugin
        HyprlandAPI::addConfigValue(PHANDLE, "plugin:myplugin:some_option", { .intValue = 42 });
        HyprlandAPI::addNotification(PHANDLE, "My plugin enabled!", { .time = 5000 });
    }

    void onDisable() override {
        // Called when hyprpm disables the plugin
    }

    void onReload() override {
        // Called on config reload
    }

    // Register a dispatcher (can be called as a keybind)
    void registerDispatchers() {
        HyprlandAPI::addDispatcher(PHANDLE, "myplugin:do_thing", [&](std::string args) {
            // Handle the dispatcher call
        });
    }
};

// Entry point — required for all plugins
APICALL EXPORT PLUGIN_DESCRIPTION_INFO PLUGIN_INIT(IHandle* handle) {
    PHANDLE = handle;
    return {"myplugin", "Your Name", "Description", "1.0.0"};
}

APICALL EXPORT void PLUGIN_EXIT() {
    // Cleanup
}
```

### Build System

```cmake
# CMakeLists.txt
cmake_minimum_required(VERSION 3.20)
project(myplugin)

find_package(PkgConfig REQUIRED)
pkg_check_modules(HYPRLAND REQUIRED hyprland)

add_library(myplugin MODULE main.cpp)
target_compile_options(myplugin PRIVATE ${HYPRLAND_CFLAGS_OTHER})
target_include_directories(myplugin PRIVATE ${HYPRLAND_INCLUDE_DIRS})
target_link_libraries(myplugin PRIVATE ${HYPRLAND_LIBRARIES})

install(TARGETS myplugin LIBRARY DESTINATION ${CMAKE_INSTALL_PREFIX}/lib/hyprland-plugins)
```

```bash
# Build
mkdir build && cd build
cmake .. -DCMAKE_INSTALL_PREFIX=/usr
make
sudo make install
```

{% endraw %}
