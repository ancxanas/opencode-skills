------
{% raw %}
----|-------|
| `SUPER` | Windows/Command key |
| `SHIFT` | Shift key |
| `CTRL` / `CONTROL` | Control key |
| `ALT` | Alt key |
| `MOD2`-`MOD5` | Extra modifier groups |

Combine with spaces: `SUPER SHIFT`, `CTRL ALT`

## Top 20 Dispatchers

| Dispatcher | Params | What it does |
|------------|--------|-------------|
| `exec` | `command` | Run a command |
| `killactive` | — | Close focused window |
| `togglefloating` | — | Float/unfloat window |
| `fullscreen` | `0`/`1` | Toggle fullscreen |
| `workspace` | `n`/`+n`/`-n`/`e+1` | Switch workspace |
| `movetoworkspace` | `n` | Move window to workspace |
| `movefocus` | `l`/`r`/`u`/`d` | Focus adjacent window |
| `movewindow` | `l`/`r`/`u`/`d` | Move window in layout |
| `exit` | — | Quit Hyprland |
| `togglegroup` | — | Group/ungroup windows |
| `changegroupactive` | — | Cycle group tabs |
| `pin` | — | Pin (visible on all workspaces) |
| `toggleopaque` | — | Toggle forced opacity |
| `submap` | `name` | Enter keybinding submap |
| `focusmonitor` | `l`/`r`/`name` | Focus another monitor |
| `resizeactive` | `x% y%` | Resize active window |
| `centerwindow` | — | Center floating window |
| `renameworkspace` | `id name` | Name a workspace |
| `pass` | — | Pass key through to app |
| `global` | `name` | Trigger global shortcut |

## `hyprctl` Commands

| Command | What it does |
|---------|-------------|
| `hyprctl monitors` | List monitors |
| `hyprctl clients` | List all windows |
| `hyprctl activewindow` | Current window info |
| `hyprctl reload` | Reload config |
| `hyprctl dispatch <dispatcher> <args>` | Execute any dispatcher |
| `hyprctl keyword <key> <value>` | Set config value at runtime |
| `hyprctl getoption <key>` | Read current config value |
| `hyprctl setcursor <theme> <size>` | Set cursor |
| `hyprctl version` | Show Hyprland version |
| `hyprctl -j <cmd>` | JSON output (pipe to `jq`) |

## Environment Variables

```conf
env=XDG_CURRENT_DESKTOP,Hyprland
env=XCURSOR_SIZE,24
env=HYPRCURSOR_SIZE,24
env=GDK_BACKEND,wayland,x11,*
env=QT_QPA_PLATFORM,wayland;xcb
env=SDL_VIDEODRIVER,wayland
env=CLUTTER_BACKEND,wayland
env=ELECTRON_OZONE_PLATFORM_HINT,auto
env=_JAVA_AWT_WM_NONREPARENTING,1
```

## Window Rules Quick Ref

```
# v1 syntax: windowrule = effect, class_or_title_regex
# v2 syntax: windowrulev2 = effect, prop:regex, prop:regex

# Common props: class, title, initialClass, initialTitle, workspace, float, fullscreen
# Common effects: float, tile, fullscreen, pin, nofocus, noblur, noborder, noanim
#                opacity, workspace, border_size, dimaround, group, suppressevent
```

## Animation Curve Presets

```
bezier=smooth,0.04,0.83,0.19,0.98          # Smooth ease-out
bezier=overshot,0.13,0.99,0.29,1.1         # Bouncy overshoot
bezier=bounce,0.05,0.9,0.1,1.05            # Bounce effect
bezier=snappy,0.4,0.0,0.2,1.0              # Quick snap
bezier=linear,0.0,0.0,1.0,1.0              # No easing
bezier=easeInOut,0.42,0.0,0.58,1.0         # Smooth in-out
```

## Filesystem Layout

```
~/.config/hypr/
├── hyprland.conf          # Main config
├── hyprland.lua           # Lua config (v0.55+, alternative to .conf)
├── configs/               # Modular configs
│   ├── monitors.conf
│   ├── keybinds.conf
│   ├── window_rules.conf
│   └── exec.conf
├── scripts/               # Custom scripts
├── hyprlock.conf          # Lock screen
├── hypridle.conf          # Idle daemon
└── hyprpaper.conf         # Wallpaper

~/.config/waybar/
├── config.jsonc           # Bar layout
└── style.css              # Bar styling
```

## Common Fixes

| Problem | Fix |
|---------|-----|
| Blank screen | Install polkit, check NVIDIA kernel params |
| No keybindings | Check `kb_layout`, `$mainMod` definition |
| Waybar missing | Use `button.active` not `button.focused` |
| Screen sharing | Enable `xdg-desktop-portal-hyprland` |
| Electron apps glitchy | Set `ELECTRON_OZONE_PLATFORM_HINT=auto` |
| NVIDIA flickering | `nvidia_drm.modeset=1`, `WLR_NO_HARDWARE_CURSORS=1` |

{% endraw %}
