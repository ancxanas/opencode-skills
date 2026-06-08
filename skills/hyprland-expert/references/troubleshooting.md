------
{% raw %}
-|-----|
| No Polkit agent | Install hyprpolkitagent: `sudo pacman -S hyprpolkitagent` (Arch), or polkit-gnome: `sudo pacman -S polkit-gnome` (Arch), `sudo dnf install policykit-1-gnome` (Fedora), `sudo apt install policykit-1-gnome` (Debian) |
| No `seatd` running | `sudo systemctl enable --now seatd` (if not using elogind) |
| NVIDIA mode not set | Ensure `nvidia_drm.modeset=1` kernel parameter is set (see `distro-notes.md`) |
| Config has errors | Comment out `source=` lines, test with minimal config, run `hyprctl reload` |
| Missing display manager | Start Hyprland from TTY: `Hyprland` (not `hyprland`) |

## Keybindings Not Working

**Symptoms:** SUPER+Q doesn't close windows, SUPER+D doesn't open launcher.

**Fixes:**
- Check your keyboard layout: `input { kb_layout=us }` — if you use a non-US layout, set it explicitly
- Verify `$mainMod` is defined: `$mainMod=SUPER`
- Check for conflicting binds (same key, different mods)
- Test with a fresh config to rule out syntax errors
- `hyprctl reload` after config changes

## Waybar Not Showing

**Why:** Waybar uses Sway's `button.focused` selector by default; Hyprland needs `button.active`.

**Fix:** In your `style.css`, replace:
```css
#workspaces button.focused { ... }
```
with:
```css
#workspaces button.active { ... }
```

Also check:
- `exec-once=waybar` is in your config
- Waybar is installed: `which waybar`
- Config path: `~/.config/waybar/config.jsonc`

## Screen Sharing Broken

**Symptoms:** Zoom/Teams/Meet can't share screen, or shows black/empty screen.

**Fix:**

```bash
# Install the portal
sudo pacman -S xdg-desktop-portal-hyprland   # Arch
sudo dnf install xdg-desktop-portal-hyprland # Fedora
sudo apt install xdg-desktop-portal-hyprland # Debian

# Enable and restart
systemctl --user enable --now xdg-desktop-portal-hyprland
systemctl --user restart xdg-desktop-portal-hyprland
systemctl --user restart pipewire
```

If still broken, check which portal is active:
```bash
systemctl --user status xdg-desktop-portal
```

## NVIDIA Issues

### Black screen or flickering

```
Kernel parameter: nvidia_drm.modeset=1
```

Add to GRUB (`/etc/default/grub`), then regenerate:
- **Arch:** `sudo grub-mkconfig -o /boot/grub/grub.cfg && sudo mkinitcpio -P`
- **Fedora:** `sudo grubby --update-kernel=ALL --args="nvidia_drm.modeset=1"`
- **Debian:** `sudo update-grub`
- **NixOS:** `boot.kernelParams = [ "nvidia_drm.modeset=1" ];`

### Environment variables

Add to `hyprland.conf`:
```conf
env=LIBVA_DRIVER_NAME,nvidia
env=XDG_SESSION_TYPE,wayland
env=GBM_BACKEND,nvidia-drm
env=__GLX_VENDOR_LIBRARY_NAME,nvidia
env=WLR_NO_HARDWARE_CURSORS,1
```

### High CPU usage

Disable hardware cursors: `cursor { no_hardware_cursors=true }`

## Performance Issues

| Problem | Fix |
|---------|-----|
| Animations lag | Reduce `speed` values or disable: `animations { enabled=false }` |
| Blur slow | `blur { size=2 passes=1 new_optimizations=true }` |
| Shadows impact FPS | Disable: `decoration { drop_shadow=false }` |
| General sluggishness | Disable compositor effects while gaming: `hyprctl keyword animations:enabled false` |
| Screen tearing | `misc { vrr=2 }` (requires Freesync/G-Sync monitor) |

## Application-Specific Issues

### 1password

1password may crash or not open windows when forced into Wayland.

**Fix:** Remove `ELECTRON_OZONE_PLATFORM_HINT=auto` from env, start 1password, enable "Use Hardware Acceleration" in Settings, then re-add the env var.

### Electron apps (Slack, Discord, VSCode)

Add environment variable:
```conf
env=ELECTRON_OZONE_PLATFORM_HINT,auto
```

### Java apps

Some Java apps (like IntelliJ) need:
```conf
env=_JAVA_AWT_WM_NONREPARENTING,1
```

### Qt apps

Ensure Qt Wayland plugin is installed:
```bash
sudo pacman -S qt5-wayland qt6-wayland   # Arch
sudo dnf install qt5-qtwayland qt6-qtwayland   # Fedora
sudo apt install qt5-wayland qt6-wayland   # Debian
```

## Logs Reference

```bash
journalctl -f -u hyprland              # Hyprland compositor logs
journalctl --user -f                   # User services (waybar, etc.)
journalctl --user -u xdg-desktop-portal # Portal logs
journalctl -b -p err                    # All errors in current boot
```

## Screen Recording / Screenshot Not Working

**Symptoms:** OBS shows black screen, `wf-recorder` records nothing, `grim` output is blank.

**Causes & fixes:**

```bash
# 1. Ensure xdg-desktop-portal is running
systemctl --user status xdg-desktop-portal-hyprland
systemctl --user restart xdg-desktop-portal-hyprland

# 2. Check which portal implementation is active
systemctl --user status xdg-desktop-portal

# 3. If using OBS, verify PipeWire capture source is added
# Tools → Auto-Configuration Wizard → "Use PipeWire"

# 4. For wf-recorder with audio, ensure correct backend
wf-recorder -f test.mp4 --audio=pipewire    # PipeWire
wf-recorder -f test.mp4 -a                  # PulseAudio

# 5. Check if XWayland apps can record (they can't use PipeWire)
# Run recording apps as native Wayland:
env = GDK_BACKEND,wayland
```

## Wayland Debugging

### Check Wayland Protocol Support

```bash
wayland-info                    # Full protocol dump
wayland-info | grep -i xdg     # Check xdg-shell support
wayland-info | grep -i wlr     # Check wlr-layer-shell, etc.
wayland-info | grep -i color   # Check color management protocols
```

### Enable WAYLAND_DEBUG

```bash
# Verbose Wayland protocol logging (huge output, pipe to file)
WAYLAND_DEBUG=1 glxgears 2> wayland-debug.log
WAYLAND_DEBUG=1 kitty 2> kitty-wayland.log

# Use wlmon for structured debugging
# (Wireshark dissector for Wayland)
```

### Check XWayland vs Native

```bash
# List all windows with their protocol
hyprctl clients | grep -E "(class:|xwayland:)"

# Count XWayland vs native
hyprctl clients | grep xwayland | wc -l
hyprctl clients | grep "xwayland: 0" | wc -l
```

## Fractional Scaling Issues

**Symptoms:** Blurry text, wrong size, UI too small or too large.

### Per-App Fixes

```conf
# GTK apps
env = GDK_DPI_SCALE,1.5
env = GDK_BACKEND,wayland,x11,*

# Qt apps
env = QT_WAYLAND_FORCE_DPI,144    # 96 * 1.5
env = QT_AUTO_SCREEN_SCALE_FACTOR,1
env = QT_ENABLE_HIGHDPI_SCALING,1

# Electron apps
env = ELECTRON_OZONE_PLATFORM_HINT,auto
env = ELECTRON_DISABLE_GPU,0

# Java apps
env = _JAVA_AWT_WM_NONREPARENTING,1
env = _JAVA_OPTIONS,-Dawt.toolkit.name=WToolkit
```

### Monitor-Specific Scaling

```conf
# Per-monitor scaling
monitor = DP-1, 2560x1440@144, 0x0, 1.5      # 1.5x scale
monitor = HDMI-A-1, 1920x1080@60, 3840x0, 1   # 1x scale
```

### Font Rendering

```bash
# Install better font rendering
# Arch: sudo pacman -S freetype2-infinality
# Fedora: sudo dnf install freetype-freeworld
# Debian: apt install fontconfig-infinality
```

## HDR Troubleshooting

**Requirements:**
- Hyprland v0.47+ (check with `hyprctl version`)
- Monitor supports HDR
- Supported protocols: `xx-color-management-v4` and `frog-color-management-v1`

**Enable:**
```conf
misc {
    hdr=true
}
```

**Washed out colors after enabling HDR:**
```bash
# Check if tone mapping is working
hyprctl getoption misc:hdr

# Try disabling HDR and using ICC profile instead
# See references/color-management.md for ICC approach
```

**Monitor not detected as HDR:**
```bash
# Check EDID
hyprctl monitors | grep -i hdr

# Force HDR on a specific monitor (experimental)
env = AQ_HDR_ENABLED,1
```

## Performance Profiling

### Measure FPS

```bash
# MangoHud overlay (gaming-focused)
# Install: sudo pacman -S mangohud
mangohud glxgears
# Or for any app:
mangohud kitty

# Nvtop for GPU monitoring (NVIDIA only)
nvtop

# Hyprctl polling
watch -n1 "hyprctl getoption animations:enabled"
```

### Animation Performance

```bash
# Check if animations are causing lag
hyprctl getoption animations:enabled

# Temporarily disable
hyprctl keyword animations:enabled false

# Enable only for specific things
hyprctl keyword animation windows,0,0,default
```

### Battery Impact

```bash
# Powertop for power analysis
sudo powertop

# Check Hyprland's CPU usage
top -p $(pidof Hyprland)

# Disable eye candy on battery (use a script)
# See scripts-and-ipc.md for performance profile toggle
```

### Compositor Profiling

```bash
# Debug rendering
hyprctl setprop debug:damage_tracking 1

# Log rendering timings
journalctl -f -u hyprland | grep "render"
{% endraw %}
