# Accessibility Reference

## Input Settings

### Sticky Keys

Hold modifier keys (like `SUPER`) without pressing them simultaneously.

```conf
# ~/.config/hypr/hyprland.conf
input {
    kb_options = sticky    # Makes modifiers sticky
}
```

Full `kb_options` value:
```conf
input {
    kb_options = compose:sclk, sticky
}
```

### Slow Keys

Delay before a key press registers (prevents accidental presses).

```conf
# Requires dedicated tool — not native in Hyprland
# Use wl-kbdd or similar
```

```bash
# Install wl-kbdd
# Arch: yay -S wl-kbdd
# Fedora/Debian: build from source

# Start with delay
wl-kbdd --delay 300    # 300ms delay before key registers

# In hyprland.conf:
exec-once = wl-kbdd --delay 300
```

### Bounce Keys

Ignore accidental double-presses of the same key.

Not native to Hyprland; use a compositor-level tool or DE accessibility daemon.

### Repeat Rate & Delay

```conf
input {
    repeat_rate = 25        # Characters per second when holding key
    repeat_delay = 300      # ms before repeat starts
}
```

### Touchpad Accessibility

```conf
input {
    touchpad {
        tap-to-click = true                # Tap to click (no pressing)
        drag_lock = true                   # Lock drag after tap+flick
        disable_while_typing = true        # Prevent palm taps while typing
        middle_button_emulation = true     # Tap 3 fingers = middle click
    }
}
```

## On-Screen Keyboard

### wvkbd (Recommended)

Lightweight, Wayland-native on-screen keyboard.

```
# Arch
sudo pacman -S wvkbd

# Fedora
sudo dnf install wvkbd

# Debian
sudo apt install wvkbd

# NixOS
environment.systemPackages = with pkgs; [ wvkbd ];
```

```bash
# Launch manually
wvkbd-mobintl        # Mobile-style keyboard
wvkbd-intl           # Desktop-style with international chars

# Toggle with keybind
bind = SUPER SHIFT, K, exec, pkill wvkbd-mobintl || wvkbd-mobintl

# Auto-launch
exec-once = wvkbd-mobintl
```

### squeekboard

GTK-based on-screen keyboard with word prediction. Works best on Phosh/GNOME but can run standalone.

```
# Arch
sudo pacman -S squeekboard

# Fedora
sudo dnf install squeekboard

# Debian
sudo apt install squeekboard

# NixOS
environment.systemPackages = with pkgs; [ squeekboard ];
```

```bash
# Launch
squeekboard

# For auto-show on text input field focus:
# (Requires squeekboard's daemon mode)
squeekboard --daemon
```

### Maliit

Pluggable input method framework with an on-screen keyboard.

```
# Arch
sudo pacman -S maliit-keyboard

# Fedora
sudo dnf install maliit-keyboard

# Debian
sudo apt install maliit-keyboard
```

```conf
env = QT_IM_MODULE,Maliit
env = GTK_IM_MODULE,Maliit
```

## Screen Reader

### Orca

Screen reader for the GNOME desktop. Works with Wayland but has limited support for tiling compositors.

```
# Arch
sudo pacman -S orca

# Fedora
sudo dnf install orca

# Debian
sudo apt install orca

# NixOS
environment.systemPackages = with pkgs; [ orca ];
```

```bash
# Launch orca
orca

# Preferences
orca -s

# Start automatically
exec-once = orca
```

**Limitations with Hyprland:**
- Orca is designed for GNOME; window management events may not be announced
- Better alternative: use `speech-dispatcher` directly with `spd-say` in scripts

### speech-dispatcher

Lower-level text-to-speech engine that works with any compositor.

```
# Arch
sudo pacman -S speech-dispatcher

# Fedora
sudo dnf install speech-dispatcher

# Debian
sudo apt install speech-dispatcher

# NixOS
environment.systemPackages = with pkgs; [ speech-dispatcher ];
```

```bash
# Speak text
spd-say "Workspace 1"

# Use in Hyprland scripts
# ~/.config/hypr/scripts/say-workspace.sh
#!/bin/bash
spd-say "Workspace $(hyprctl activeworkspace -j | jq -r '.id')"
```

### espeak-ng

Lightweight offline speech synthesizer (used by speech-dispatcher).

```
# Arch
sudo pacman -S espeak-ng

# Fedora
sudo dnf install espeak-ng

# Debian
sudo apt install espeak-ng

# NixOS
environment.systemPackages = with pkgs; [ espeak-ng ];
```

```bash
espeak-ng "Welcome to Hyprland"
```

## High Contrast Config

```conf
# ~/.config/hypr/hyprland.conf — High contrast mode
general {
    gaps_in = 2                     # Minimal gaps for less visual noise
    gaps_out = 4
    border_size = 4                 # Thick borders for visibility
    col.active_border = rgba(ffffffff)     # White border on active
    col.inactive_border = rgba(888888ff)   # Gray on inactive
}

decoration {
    rounding = 0                    # No rounded corners (accessibility)
    active_opacity = 1.0
    inactive_opacity = 1.0          # No transparency
    blur {
        enabled = false             # Disable blur (reduces visual load)
    }
    drop_shadow = false
}

animations {
    enabled = false                 # Disable all animations
}
```

### Window Rule: Disable Blur/Animations for Specific Apps

```conf
windowrulev2 = noanim, class:^(firefox)$
windowrulev2 = noblur, class:^(firefox)$
windowrulev2 = opacity 1.0 1.0, class:^(kitty)$    # Prevent transparency
```

## Font Scaling

### System-Wide Scaling

```conf
# Environment variables for HiDPI / visual impairment
env = GDK_DPI_SCALE,2              # Double-size GTK UI
env = QT_WAYLAND_FORCE_DPI,192     # 96 * 2 = 192
env = QT_FONT_DPI,192
env = ELECTRON_USE_ANGLE,1         # Better HiDPI for Electron
```

### Per-Monitor Scaling

```conf
monitor = eDP-1, 1920x1080@60, 0x0, 2       # 2x scale for built-in
monitor = HDMI-A-1, 1920x1080@60, 3840x0, 1  # 1x scale for external
```

### Terminal Font Sizes

```conf
# In terminal configs
# kitty
font_size 16

# alacritty
font:
  size: 16

# foot
font=JetBrainsMono Nerd Font:size=16
```

## Accessibility Scripts

### Workspace Announcer

```bash
# ~/.config/hypr/scripts/announce-workspace.sh
#!/bin/bash
workspace=$(hyprctl activeworkspace -j | jq -r '.id')
spd-say -t female2 "Workspace $workspace"

# Bind to workspace switching (trigger after switch)
bind = SUPER, 1, exec, hyprctl dispatch workspace 1 && ~/.config/hypr/scripts/announce-workspace.sh
```

### Focus Announcer

```bash
# ~/.config/hypr/scripts/announce-focus.sh
#!/bin/bash
window_class=$(hyprctl activewindow -j | jq -r '.class')
spd-say "Focused on $window_class"

# Trigger on window focus change (submap or script loop)
```

### Toggle High Contrast Mode

```bash
# ~/.config/hypr/scripts/toggle-high-contrast.sh
#!/bin/bash
if hyprctl getoption general:col.active_border | grep -q "ffffff"; then
    hyprctl keyword general:col.active_border "rgba(cba6f7ee)"
    hyprctl keyword general:col.inactive_border "rgba(45475aee)"
    hyprctl keyword decoration:rounding 10
    hyprctl keyword animations:enabled true
else
    hyprctl keyword general:col.active_border "rgba(ffffffff)"
    hyprctl keyword general:col.inactive_border "rgba(888888ff)"
    hyprctl keyword decoration:rounding 0
    hyprctl keyword animations:enabled false
fi
```

```conf
bind = SUPER SHIFT, H, exec, ~/.config/hypr/scripts/toggle-high-contrast.sh
```
