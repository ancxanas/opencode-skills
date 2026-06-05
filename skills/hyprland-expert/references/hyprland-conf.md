# Hyprland Core Configuration Reference

## Config File Location

- `~/.config/hypr/hyprland.lua` (Lua syntax, v0.55+, **recommended**)
- `~/.config/hypr/hyprland.conf` (hyprlang syntax, **deprecated since v0.55**)

**⚠ Since Hyprland v0.55 (May 2026):** Lua is the primary config language. hyprlang is deprecated and will be removed in 1–2 releases. New configs should use `hyprland.lua`. Existing `hyprland.conf` files still work, but may stop in a future release.

## Section Reference

Each section below includes what it does in plain language.

### `monitor`

Controls your display(s): resolution, refresh rate, position, and scaling.

```
monitor=name,resolution@refresh_rate,position,scale
monitor=DP-1,2560x1440@144,0x0,1
monitor=HDMI-A-1,1920x1080@60,2560x0,1
monitor=,preferred,auto,1           # Auto-detect
monitor=,preferred,auto,1,mirror,DP-1 # Mirror DP-1
```

**What each part means:**
- `name` — Monitor identifier from `hyprctl monitors` (e.g. `DP-1`, `HDMI-A-1`, `eDP-1`). Leave empty for auto-detect
- `resolution@refresh_rate` — e.g. `2560x1440@144`. Use `preferred` to auto-detect best
- `position` — Where this monitor sits relative to others: `0x0` is top-left corner
- `scale` — `1` for normal, `2` for HiDPI (200% scaling)

**New in v0.55+ Lua:** `hyprland.monitor("DP-1", "2560x1440@144", "0x0", 1)`

### `input`

Controls keyboard, mouse, touchpad, and touchscreen behavior.

```
input {
    kb_layout=us,de           # Keyboard layout (comma-separated for multiple)
    kb_variant=               # Layout variant (e.g. dvorak, colemak)
    kb_options=caps:ctrl_modified  # Swap Caps Lock with Ctrl
    numlock_by_default=true   # Enable numlock on login
    follow_mouse=1            # 0=click to focus, 1=follow mouse, 2=click+drag, 3=full
    mouse_refocus=1           # Refocus when mouse moves off an unfocused window
    float_switch_override=2   # How many tiled windows before auto-float
    touchpad {
        natural_scroll=true   # Scroll direction like macOS (content moves with fingers)
        tap-to-click=true     # Tap to click instead of pressing
        drag_lock=true        # Lock drag after tap-hold
        scroll_factor=1.0     # Scroll speed multiplier
    }
    touchdevice {
        transform=0           # Touchscreen orientation
        output=DP-1           # Which monitor touch maps to
    }
    tablet {
        output=DP-1           # Graphics tablet output monitor
    }
}
```

**Common mistakes:**
- Not setting `kb_layout` if you use a non-US keyboard → keybindings won't match
- Setting `follow_mouse=0` then wondering why click-to-focus doesn't work everywhere

### `general`

Controls window sizing, borders, gaps, and layout algorithm.

```
general {
    gaps_in=5                # Space BETWEEN tiled windows (pixels)
    gaps_out=10              # Space between windows and screen edge (pixels)
    border_size=2            # Width of window borders (pixels)
    col.active_border=rgba(cba6f7ff)   # Border color of focused window
    col.inactive_border=rgba(45475aff) # Border color of unfocused windows
    cursor_inactive_timeout=3          # Seconds before cursor hides (0=always visible)
    layout=dwindle           # dwindle (spiral) or master (main+stack)
    no_border_on_floating=false        # Remove borders from floating windows?
    apply_sens_to_float=false          # Apply cursor sensitivity to floating resize?
    resize_corner=2          # Resize corner size
}
```

**What each part means:**
- `gaps_in` — Think of this as the gutter between tiles in a grid
- `gaps_out` — Margin around the entire screen area
- `layout=dwindle` — Windows split alternately left/right. `master` gives one big window on the side

### `decoration`

Controls visual effects: corner rounding, blur, shadows, and opacity.

```
decoration {
    rounding=10              # Window corner radius (0=square corners)
    active_opacity=1.0       # How visible focused window is (0.0-1.0)
    inactive_opacity=0.9     # How visible unfocused windows are
    fullscreen_opacity=1.0   # Fullscreen window opacity
    blur {
        enabled=true         # Background blur behind transparent windows
        size=3               # Blur strength (higher = smoother but slower)
        passes=1             # Quality passes (1=fast, 3=best but slow)
        new_optimizations=true   # Use faster blur rendering
        ignore_opacity=false  # Don't blur behind fully transparent windows
        xray=false           # X-ray mode (blur once, not per-window)
    }
    drop_shadow=true
    shadow_range=4           # How far shadow extends from window
    shadow_render_power=3    # Shadow smoothness (higher = smoother)
    col.shadow=rgba(11111b66) # Shadow color with alpha
}
```

**Performance tips:**
- Set `blur { passes=1, size=2 }` for good look + performance
- Disable blur entirely for gaming: `hyprctl keyword decoration:blur:enabled false`
- Shadows cost performance too — disable with `drop_shadow=false`

### `animations`

Controls motion effects when windows open, close, move, and when switching workspaces.

```
animations {
    enabled=true
    bezier=overshot,0.13,0.99,0.29,1.1  # Bouncy curve
    bezier=smooth,0.04,0.83,0.19,0.98   # Smooth ease-out
    bezier=linear,0.0,0.0,1.0,1.0       # No easing
    animation=global,1,10,default        # Master speed multiplier
    animation=fade,1,10,default          # Fade in/out
    animation=windows,1,6,smooth,popin   # Window open/close/move
    animation=windowsOut,1,6,smooth,popin# Window close (separate from open)
    animation=border,1,10,default        # Border color transitions
    animation=borderangle,1,8,default    # Rotating border animation
    animation=workspaces,1,6,default     # Workspace switching
}
```

**Format:** `animation=name, enabled(1/0), speed(1-20), curve, [style]`
- Speed: lower = faster animation (1 = instant, 10 = normal, 20 = very slow)
- Curve: name of a `bezier` you defined, or `default`
- Style (optional): `popin`, `slide`, `slidevert`

**Performance:** Set `enabled=false` globally to disable all animations. Or set individual animations to 0 speed.

### `misc`

Miscellaneous settings that don't fit elsewhere.

```
misc {
    disable_hyprland_logo=true            # Remove the "Hyprland" text at login
    disable_splash_rendering=true         # Remove random quotes at login
    mouse_move_enables_dpms=true          # Wake screen on mouse move
    key_press_enables_dpms=true           # Wake screen on key press
    enable_swallow=true                   # Terminal "swallowing" — when a GUI app launches from terminal, the terminal hides until the app closes
    swallow_regex=^(kitty|alacritty|foot)$  # Which terminals can swallow
    font_family=Sans                      # Default font for internal UI
    animate_mouse_windowdragging=false     # Animate window while dragging
    force_default_wallpaper=0             # 0=let wallpaper tool handle it
    vrr=0                                 # Variable Refresh Rate: 0=off, 1=always, 2=fifo (G-Sync/Freesync)
}
```

### `windowrule` / `windowrulev2`

Tell certain windows how to behave when they open. See full reference in `window-rules.md`.

```
windowrule=float,^(pavucontrol)$
windowrule=workspace 2 silent,^(firefox)$
windowrulev2=float,class:^(pavucontrol)$,title:^(Volume Control)$
windowrulev2=opacity 0.9 0.8,class:^(kitty)$
```

**v1 vs v2:**
- v1: `windowrule=effect,regex` — matches class OR title
- v2: `windowrulev2=effect,prop:regex,prop:regex,...` — matches specific props (class AND/OR title)

### `bind`

Maps keyboard and mouse shortcuts to actions. See full reference in `keybindings.md`.

```
bind=SUPER,Return,exec,kitty
bind=SUPER SHIFT,Q,killactive
bindl=,XF86AudioRaiseVolume,exec,wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+
bindl=,XF86AudioLowerVolume,exec,wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-
bindl=,XF86AudioMute,exec,wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle
bindl=,XF86AudioPlay,exec,playerctl play-pause
bindm=SUPER,mouse_down,workspace,e+1
bindm=SUPER,mouse_up,workspace,e-1
```

**Types:**
- `bind` — Normal keybinding (fires on press, blocked from apps)
- `bindl` — Fires on press but lets key reach the app too
- `bindr` — Fires on key release
- `bindm` — Mouse binding (drag, scroll, etc.)

### `env`

Sets environment variables that applications inherit.

```
env=XCURSOR_SIZE,24
env=HYPRCURSOR_SIZE,24
env=GDK_BACKEND,wayland,x11,*        # GTK apps prefer Wayland
env=QT_QPA_PLATFORM,wayland;xcb      # Qt apps prefer Wayland
env=SDL_VIDEODRIVER,wayland           # SDL2 apps use Wayland
env=CLUTTER_BACKEND,wayland          # Clutter toolkit uses Wayland
env=ELECTRON_OZONE_PLATFORM_HINT,auto # Electron apps use Wayland
env=AQ_DRM_DEVICES,/dev/dri/card0   # Multi-GPU (NVIDIA + Intel/AMD)
```

**Which env vars matter:**
- `GDK_BACKEND` — Makes Firefox, GIMP, and other GTK apps run as native Wayland (not XWayland)
- `QT_QPA_PLATFORM` — Makes Qt apps (KDE apps, Wireshark, etc.) use Wayland
- `ELECTRON_OZONE_PLATFORM_HINT` — Makes VSCode, Slack, Discord use Wayland

### `exec-once`

Runs commands once when Hyprland starts. Use for autostarting background services.

```
exec-once=waybar
exec-once=hyprpaper
exec-once=hypridle
exec-once=sleep 5; nm-applet
exec-once=sleep 5; blueman-applet
exec-once=~/.config/hypr/scripts/startup.sh
```

**Why `exec-once` instead of `exec`:**
- `exec` runs the command every time the config is reloaded
- `exec-once` only runs it when Hyprland first starts
- Use `sleep 5;` prefix for apps that need the system tray to be ready first

## Source Directive

Split config into modules:

```
source=~/.config/hypr/configs/monitors.conf
source=~/.config/hypr/configs/keybinds.conf
source=~/.config/hypr/configs/window_rules.conf
source=~/.config/hypr/configs/exec.conf
```

## NVIDIA-Specific Setup

Add to `hyprland.conf`:

```
env=LIBVA_DRIVER_NAME,nvidia
env=XDG_SESSION_TYPE,wayland
env=GBM_BACKEND,nvidia-drm
env=__GLX_VENDOR_LIBRARY_NAME,nvidia
env=WLR_NO_HARDWARE_CURSORS,1

cursor {
    no_hardware_cursors=true
}

dwindle {
    no_gaps_when_only=true
}
```

Kernel parameter: `nvidia_drm.modeset=1`

### Distro-Specific: NVIDIA Kernel Params

| Distro | Config File | Command |
|--------|-------------|---------|
| Arch | `/etc/default/grub` + `/etc/mkinitcpio.conf` | `sudo grub-mkconfig -o /boot/grub/grub.cfg && sudo mkinitcpio -P` |
| Fedora | `/etc/default/grub` | `sudo grubby --update-kernel=ALL --args="nvidia_drm.modeset=1"` |
| Debian | `/etc/default/grub` | `sudo update-grub` |
| NixOS | `configuration.nix` | `boot.kernelParams = [ "nvidia_drm.modeset=1" ];` |

## Distro-Specific Config Notes

### Arch
- NVIDIA modules: add `MODULES=(nvidia nvidia_modeset nvidia_uvm nvidia_drm)` to `/etc/mkinitcpio.conf`
- Config location: `~/.config/hypr/hyprland.conf`
- AUR packages: `hyprland-nvidia`, `hyprland-git`, `hyprshot`, `cliphist`

### Fedora
- NVIDIA: `sudo dnf install akmod-nvidia`, then `sudo grubby --update-kernel=ALL --args="nvidia_drm.modeset=1"`
- SELinux: generally no changes needed; check `sudo ausearch -m avc -ts recent` if issues arise
- COPR `solopasha/hyprland` for newer Hyprland versions
- Use `rofi` (XWayland) or build `rofi-lbonn-wayland` from source

### Debian / Ubuntu
- NVIDIA: `sudo apt install nvidia-driver firmware-misc-nonfree`, then `sudo update-grub`
- Backports needed for Hyprland on Debian stable: `sudo apt install -t bookworm-backports hyprland`
- Some companion tools (hyprshot, cliphist) not in repos; build from source
- Ubuntu 24.04+ has Hyprland in universe repos

### NixOS
- NVIDIA: set `hardware.nvidia.modesetting.enable = true;` and `boot.kernelParams = [ "nvidia_drm.modeset=1" ];`
- Env vars set via `environment.sessionVariables` in `configuration.nix`
- Use flakes for latest Hyprland: `hyprland.url = "github:hyprwm/Hyprland";`
- Home Manager: `wayland.windowManager.hyprland.enable = true;`
- Enable Polkit: `security.polkit.enable = true;`
