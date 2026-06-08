---
render_with_liquid: false
---
{% raw %}
---

## FP16 Precision (v0.55+)

Hyprland v0.55+ uses **FP16 (16-bit floating point)** precision by default for color-managed displays. This provides higher color accuracy and smoother gradients, especially in HDR mode.

```conf
# FP16 is enabled by default in v0.55+
# No config change needed — verify with:
# hyprctl monitors | grep -i fp16
```

**Impact:** Slightly higher GPU memory bandwidth usage, but no meaningful performance difference on modern GPUs (2020+).

---



## HDR

### Enable HDR

```conf
misc {
    hdr = true
}
```

**Requirements:**
- Hyprland v0.47+
- Monitor supports HDR
- DisplayPort or HDMI 2.0+ connection
- Protocols: `xx-color-management-v4` and `frog-color-management-v1`

### Verify HDR

```bash
# Check HDR status
hyprctl monitors | grep -i hdr

# Force enable
env = AQ_HDR_ENABLED,1
```

### HDR Environment Variables

```conf
env = AQ_HDR_ENABLED,1
env = AQ_TONE_MAPPING,aces    # Tone mapping: aces, hable, reinhard, none
env = AQ_HDR_METADATA,1       # Send HDR metadata to display
```

### HDR + SDR Mixed Content

When HDR is enabled, SDR content looks washed out without tone mapping:

```conf
# Try different tone mapping operators
env = AQ_TONE_MAPPING,aces         # Most natural for mixed content
# env = AQ_TONE_MAPPING,hable      # Slightly more saturated (Uncharted 2 style)
# env = AQ_TONE_MAPPING,reinhard   # Simple global tone mapping
```

### HDR Gaming

```bash
# Gamescope with HDR support
gamescope --hdr-enabled -- game

# In gamescope launch wrapper:
#!/bin/bash
hyprctl keyword misc:hdr true
gamescope --hdr-enabled -W 2560 -H 1440 -- "$@"
hyprctl keyword misc:hdr false
```

---

## Night Light

### hyprsunset (Hyprland Native)

```bash
# Install
sudo pacman -S hyprsunset

# Set temperature (1000K = very warm, 12000K = very cool)
hyprsunset -t 3500    # Warm evening light
hyprsunset -t 6500    # Default daylight

# Schedule (using systemd timers or cron)
# Morning: reset to neutral
hyprsunset -t 6500
# Evening: warm
hyprsunset -t 3500
```

### Auto-Schedule Script

```bash
# ~/.config/hypr/scripts/night-light.sh
#!/bin/bash

# Get current hour
hour=$(date +%H)

if [ "$hour" -ge 20 ] || [ "$hour" -lt 6 ]; then
    # Night (8 PM - 6 AM): warm
    hyprsunset -t 3500
elif [ "$hour" -ge 17 ]; then
    # Evening (5 PM - 8 PM): slightly warm
    hyprsunset -t 4500
else
    # Day: neutral
    hyprsunset -t 6500
fi
```

```conf
exec-once = ~/.config/hypr/scripts/night-light.sh
```

```ini
# systemd timer (every 30 minutes)
# ~/.config/systemd/user/night-light.service
[Unit]
Description=Update night light

[Service]
Type=oneshot
ExecStart=%h/.config/hypr/scripts/night-light.sh

[Install]
WantedBy=default.target
```

```ini
# ~/.config/systemd/user/night-light.timer
[Unit]
Description=Update night light every 30 minutes

[Timer]
OnCalendar=*:0/30
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
systemctl --user enable --now night-light.timer
```

### wlsunset (Alternative)

Lightweight sunset/temperature adjuster for Wayland.

```
# Arch
sudo pacman -S wlsunset

# Fedora
sudo dnf install wlsunset

# Debian
sudo apt install wlsunset

# NixOS
environment.systemPackages = with pkgs; [ wlsunset ];
```

```bash
# wlsunset uses lat/lon for sunset/sunrise timing
wlsunset -l 40.7 -L -74.0    # New York City

# Or manual schedule
wlsunset -T 6500 -t 3500      # 6500K day, 3500K night
```

---

## Color-Accurate Workflow

### Tools Needed

```bash
# Install color management tools
# Arch
sudo pacman -S colord colord-gtk argyllcms displaycal

# Fedora
sudo dnf install colord colord-gtk argyllcms

# Debian
sudo apt install colord colord-gtk argyllcms displaycal
```

### Setup Step-by-Step

1. **Calibrate with a colorimeter** (i1Display Pro, SpyderX, etc.)
   - Use `displaycal` (GUI) or `dispcal` (CLI from Argyll)
   - Creates an ICC profile in `~/.local/share/icc/`

2. **Load the profile**:
   ```bash
   colormgr device-add-profile <device-id> <profile-id>
   ```

3. **Make it default**:
   ```bash
   colormgr device-make-profile-default <device-id> <profile-id>
   ```

4. **Verify**:
   ```bash
   # Hyprland will use the default system profile
   hyprctl monitors
   ```

### Color-Critical App Settings

```conf
# Web browser (Firefox)
# about:config → gfx.color_management.mode = 1

# Image viewer
# gthumb: Color managed by default
# darktable: Has its own color management — uses ICC for editing area

# Video playback
# mpv: --icc-profile=auto
# VLC: Tools → Preferences → Input/Codecs → ICC profile
```

### Display Profiling Comparison

| Tool | Cost | Accuracy | Ease of Use |
|------|------|----------|-------------|
| `displaycal` + colorimeter | $150-300 (hardware) | Excellent | Medium (GUI) |
| `dispcal` (Argyll) | Free + hardware | Excellent | Hard (CLI) |
| `colord` (system sensor) | Free | Good | Easy |
| Manual sRGB profile | Free | Poor | Very easy |

---

## Environment Variables Summary

```conf
# Complete color management environment block
env = AQ_HDR_ENABLED,1                  # Enable HDR support
env = AQ_TONE_MAPPING,aces              # Tone mapping operator
env = AQ_HDR_METADATA,1                 # Send HDR metadata
env = ICC_PROFILE,/path/to/profile.icc  # Load ICC profile
env = GDK_DPI_SCALE,1                   # GTK scaling
env = QT_WAYLAND_FORCE_DPI,96           # Qt DPI
```
{% endraw %}
