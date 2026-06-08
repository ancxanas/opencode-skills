------
{% raw %}
-|-----|----------|---------------|-------------|-----------|-----------|-------------|
| Minimal | waybar | wofi | dunst / swaync | hyprlock / loginctl | wl-clipboard | hyprpaper | grim+slurp |
| Balanced | waybar | rofi | swaync | hyprlock / loginctl | cliphist | hyprpaper | hyprshot |
| Full-featured | waybar | rofi | swaync | hyprlock / loginctl | cliphist | hyprpaper | hyprshot |

**Minimal** — Fewest dependencies, lowest resource usage, gets the job done
**Balanced** — Good feature set with moderate resource usage
**Full-featured** — Maximum features, animations, history, and eye candy

## Status Bar: Waybar

Waybar is a customizable status bar for Wayland.

### Install

```
# Arch
sudo pacman -S waybar

# Fedora
sudo dnf install waybar

# Debian
sudo apt install waybar

# NixOS
programs.waybar.enable = true;
```

### Config Location

```
~/.config/waybar/
├── config.jsonc      # Layout and modules
├── style.css         # Styling
└── scripts/          # Custom modules
```

### Minimal Config

```jsonc
// ~/.config/waybar/config.jsonc
{
    "layer": "top",
    "position": "top",
    "height": 30,
    "modules-left": ["hyprland/workspaces"],
    "modules-center": ["hyprland/window"],
    "modules-right": ["pulseaudio", "bluetooth", "network", "cpu", "memory", "clock", "tray"],
    "hyprland/workspaces": {
        "disable-scroll": false,
        "all-outputs": true
    },
    "clock": {
        "format": "{:%H:%M}",
        "tooltip-format": "{:%A, %B %d %Y}"
    },
    "pulseaudio": {
        "format": "{icon} {volume}%",
        "format-icons": ["🔇", "🔈", "🔉", "🔊"]
    },
    "tray": {
        "spacing": 10
    }
}
```

### Important: Sway → Hyprland Selector Change

In Waybar, use `button.active` instead of `button.focused` (which is for Sway):

```css
/* ~/.config/waybar/style.css */
* {
    font-family: "JetBrainsMono Nerd Font", sans-serif;
    font-size: 13px;
}

window#waybar {
    background: rgba(30, 30, 46, 0.85);
    color: #cdd6f4;
}

#workspaces button {
    padding: 0 5px;
    background: transparent;
    color: #585b70;
}

#workspaces button.active {
    color: #cba6f7;
    background: rgba(203, 166, 247, 0.1);
}

#workspaces button.urgent {
    color: #f38ba8;
}
```

## Bar Alternatives (Beyond Waybar)

### Quickshell (Qt6/QML)

A modern, Qt6/QML-based bar and widget system with hardware-accelerated QML rendering.

```
# Arch
yay -S quickshell

# Fedora / Debian — build from source
# https://github.com/Quickshell/Quickshell

# NixOS — not yet in nixpkgs stable
```

**Minimal bar:**

```qml
// ~/.config/quickshell/bar.qml
import QtQuick
import Quickshell

ShellRoot {
    PanelWindow {
        anchors {
            top: true
            left: true
            right: true
        }
        height: 32
        color: "#1e1e2e"

        Row {
            anchors {
                left: parent.left
                verticalCenter: parent.verticalCenter
            }
            Text { color: "#cdd6f4"; text: " [1]  [2]  [3]  [4]  [5] "; }
            Text { color: "#cba6f7"; text: " ◆ "; }
        }
    }
}
```

```bash
# Start
quickshell ~/.config/quickshell/bar.qml

# Keybind
bind = $mainMod, Q, exec, quickshell ~/.config/quickshell/bar.qml
```

**Why Quickshell:** Best animation engine (QML native), Qt6 widgets, used by End-4's popular dotfiles. Steeper learning curve (QML) but most powerful.

### AGS (Aylur's GTK Shell)

A widget system using TypeScript/JSX + GTK3, now built on the Astal library ecosystem.

```
# Arch
yay -S ags

# Fedora / Debian — build from source
# https://github.com/Aylur/ags

# NixOS
environment.systemPackages = with pkgs; [ ags ];
```

**Minimal bar:**

```ts
// ~/.config/ags/config.ts
import Bar from './bar';

App.config({
    windows: [Bar()],
});
```

```ts
// ~/.config/ags/bar.ts
import Widget from 'gi://Gtk?version=3.0';

export default () => Widget.Window({
    name: 'bar',
    anchor: ['top', 'left', 'right'],
    exclusivity: 'exclusive',
    child: Widget.CenterBox({
        startWidget: Widget.Label({ label: 'Waybar alternative' }),
        centerWidget: Widget.Label({ label: 'AGS' }),
        endWidget: Widget.Label({ label: 'Hyprland' }),
    }),
});
```

**Why AGS:** TypeScript/JSX is familiar, large community (used by HyDE and others), good Waybar alternative. Requires GTK3 libraries.

### HyprPanel (Astal/TypeScript) — Archived

A feature-packed, pre-configured bar built on Astal (the GTK widget library that powers AGS v2). Ships with workspaces, system tray, clock, notifications, media controls, Bluetooth, network, and more — all working out of the box.

```
# Arch
yay -S hyprpanel

# Fedora / Debian — build from source
# https://github.com/Jas-SinghFSU/HyprPanel

# NixOS
# flake-based, see README
```

```bash
# Start
hyprpanel

# Keybind (hyprland.conf)
bind = $mainMod, P, exec, hyprpanel
```

**⚠ Archived (April 2026).** No new features. Active development moved to [Wayle](https://github.com/wayle-rs/wayle) (Rust/GTK4 successor).

**Why HyprPanel:** Polished defaults, GUI settings app, built-in notification center, minimal config needed. Best for users who want a beautiful bar without hand-crafting every widget. Successor Wayle (Rust/GTK4) is in early development.

### EWW (Elkowar's Wacky Widgets)

A widget system using Lisp-like YAML configs + CSS styling with native Wayland support.

```
# Arch
yay -S eww-wayland

# Fedora / Debian — build from source
# https://github.com/elkowar/eww

# NixOS
environment.systemPackages = with pkgs; [ eww ];
```

**Minimal bar:**

```yaml
# ~/.config/eww/bar.yuck
(defwindow bar
  :monitor 0
  :geometry (width: 100% height: 32)
  :windowtype "dock"
  :stacking "fg"
  :anchor "top center"
  (box
    :class "bar"
    :orientation "h"
    :spacing 10
    (label :text "Hyprland")))
```

```scss
/* ~/.config/eww/bar.scss */
.bar {
    background-color: #1e1e2e;
    color: #cdd6f4;
    font-family: "JetBrainsMono Nerd Font";
    font-size: 13px;
    padding: 0 10px;
}
```

```bash
# Start
eww daemon
eww open bar

# Keybind
bind = $mainMod, B, exec, eww open bar
```

**Why EWW:** Simple config (YAML + CSS), good for basics. Slower than Quickshell/AGS for complex UIs (polling-based).

### Choosing a Bar Framework

| Framework | Language | Rendering | Performance | Complexity | Community |
|-----------|----------|-----------|-------------|------------|-----------|
| **Waybar** | JSON + CSS | GTK3 | Excellent | Low | Largest |
| **Quickshell** | QML | Qt6/QML | Excellent | High | Growing |
| **AGS** | TypeScript/JSX | GTK3 | Good | Medium | Large |
| **HyprPanel** | TypeScript/JSX | GTK3 (Astal) | Good | Low | Large |
| **EWW** | YAML + CSS | GTK3 | Fair | Low | Established |

**Recommendation:** Start with Waybar. Try HyprPanel if you want polished defaults with minimal config. Try AGS if you want JS/TS and full control. Try Quickshell if you want the best animations. Try EWW for simple, CSS-only widgets.

---

## Lock Screen: hyprlock / loginctl

### Install

```
# Arch
sudo pacman -S hyprlock

# Fedora
sudo dnf install hyprlock

# Debian
sudo apt install hyprlock

# NixOS
environment.systemPackages = with pkgs; [ hyprlock ];
```

### Config

```conf
# ~/.config/hypr/hyprlock.conf
background {
    monitor =
    path = ~/.config/hypr/wallpaper.png
    blur_passes = 3
    color = rgba(1e1e2eff)
}

input-field {
    monitor =
    size = 300, 50
    outline_thickness = 2
    dots_size = 0.2
    dots_spacing = 0.2
    dots_center = true
    outer_color = rgba(45475aff)
    inner_color = rgba(1e1e2eff)
    font_color = rgba(cba6f7ff)
    fade_on_empty = true
    placeholder_text = <i>Password...</i>
    check_color = rgba(a6e3a1ff)
    fail_color = rgba(f38ba8ff)
}

label {
    monitor =
    text = $TIME
    font_size = 80
    color = rgba(cdd6f4ff)
    position = 0, 150
    halign = center
    valign = center
}
```

### Alternative: loginctl (lightweight, reuses SDDM/login manager lock)

If you don't need a custom lock screen UI, use `loginctl lock-session`:

```bash
# Included with systemd — no install needed
loginctl lock-session
```

In hypridle.conf:
```conf
lock_cmd = loginctl lock-session
```

In hyprland.lua:
```lua
hl.bind("SUPER + Escape", hl.dsp.exec_cmd("loginctl lock-session"))
```

**Pros:** Zero dependencies, uses your login manager's lock (SDDM, GDM, etc.)
**Cons:** No custom background/blur/time display

---

## Idle Daemon: hypridle

### Install

```
# Arch
sudo pacman -S hypridle

# Fedora
sudo dnf install hypridle

# Debian
sudo apt install hypridle

# NixOS
environment.systemPackages = with pkgs; [ hypridle ];
```

### Config

```conf
# ~/.config/hypr/hypridle.conf
general {
    lock_cmd = pidof hyprlock || hyprlock   # or: loginctl lock-session
    before_sleep_cmd = loginctl lock-session
    after_sleep_cmd = hyprctl dispatch dpms on
}

listener {
    timeout = 300                # 5 min
    on-timeout = brightnessctl -s set 10
    on-resume = brightnessctl -r
}

listener {
    timeout = 600                # 10 min
    on-timeout = loginctl lock-session
}

listener {
    timeout = 900                # 15 min
    on-timeout = hyprctl dispatch dpms off
    on-resume = hyprctl dispatch dpms on
}

listener {
    timeout = 1800               # 30 min
    on-timeout = systemctl suspend
}
```

## Wallpaper: hyprpaper

### Install

```
# Arch
sudo pacman -S hyprpaper

# Fedora
sudo dnf install hyprpaper

# Debian
sudo apt install hyprpaper

# NixOS
environment.systemPackages = with pkgs; [ hyprpaper ];
```

### Config (v0.8.0+)

**⚠ hyprpaper v0.8.0+ uses block syntax.** The old `preload =` and `wallpaper = monitor,path` format is gone.

```conf
# ~/.config/hypr/hyprpaper.conf

# Specific monitor
wallpaper {
    monitor = DP-1
    path = ~/.config/hypr/wallpaper1.png
    fit_mode = cover     # cover, contain, tile, fill
}

# Another monitor
wallpaper {
    monitor = HDMI-A-1
    path = ~/.config/hypr/wallpaper2.png
    fit_mode = cover
}

# Fallback (empty monitor) — only for monitors without a specific wallpaper
wallpaper {
    monitor =
    path = ~/.config/hypr/wallpaper.png
    fit_mode = cover
}

# Splash overlay
splash = false           # Show/hide Hyprland splash over wallpaper
splash_offset = 20
splash_opacity = 0.8
```

### Slideshow (directory path + timeout)

```conf
wallpaper {
    monitor = DP-1
    path = ~/Pictures/wallpapers/   # Directory enables slideshow
    timeout = 60                     # Seconds between images
    order = random                   # Currently only "random"
    recursive = false                # Scan subdirectories
}
```

### CLI

```bash
hyprpaper &                                                    # Start
hyprctl hyprpaper wallpaper "DP-1,~/.config/hypr/new_wall.png" # Change wallpaper
killall hyprpaper && hyprpaper &                               # Reload
```

### Alternative: swww (animated transitions)

If you prefer animated wallpaper transitions, `swww` offers fade/slide/wave effects.

```
# Arch
sudo pacman -S swww

# Fedora
sudo dnf install swww

# Debian
sudo apt install swww

# NixOS
environment.systemPackages = with pkgs; [ swww ];
```

```bash
swww-daemon                                                    # Start
swww img ~/.config/hypr/wallpaper.png                          # Set with transition
swww img ~/.config/hypr/wallpaper.png --transition-type wave   # Custom transition
```

**Note:** `hyprpaper` (above) is the recommended default — simpler, no flicker, and first-party Hyprland integration. Use `swww` only if you specifically want animated transitions.

## Screen Sharing: xdg-desktop-portal-hyprland

### Install

```
# Arch
sudo pacman -S xdg-desktop-portal-hyprland

# Fedora
sudo dnf install xdg-desktop-portal-hyprland

# Debian
sudo apt install xdg-desktop-portal-hyprland

# NixOS
environment.systemPackages = with pkgs; [ xdg-desktop-portal-hyprland ];
```

### Config

```conf
# ~/.config/hypr/hyprland.conf
exec-once = /usr/lib/xdg-desktop-portal-hyprland
```

Should auto-start via D-Bus; if not working:

```bash
systemctl --user enable --now xdg-desktop-portal-hyprland
systemctl --user restart xdg-desktop-portal-hyprland
```

## Launchers

### wofi (native Wayland)

```
# Arch
sudo pacman -S wofi

# Fedora
sudo dnf install wofi

# Debian
sudo apt install wofi

# NixOS
environment.systemPackages = with pkgs; [ wofi ];
```

```bash
bind=$mainMod,D,exec,wofi --show drun
```

### rofi

```
# Arch
sudo pacman -S rofi-lbonn-wayland   # Wayland fork
sudo pacman -S rofi                 # XWayland

# Fedora
sudo dnf install rofi

# Debian
sudo apt install rofi

# NixOS
environment.systemPackages = with pkgs; [ rofi-wayland ];
```

```bash
bind=$mainMod,D,exec,rofi -show drun
```

## Notification Daemon

### swaync (recommended)

```
# Arch
sudo pacman -S swaync

# Fedora
sudo dnf install swaync

# Debian
sudo apt install swaync

# NixOS
environment.systemPackages = with pkgs; [ swaync ];
```

```bash
exec-once=swaync
```

### dunst (simple)

```
# Arch
sudo pacman -S dunst

# Fedora
sudo dnf install dunst

# Debian
sudo apt install dunst

# NixOS
environment.systemPackages = with pkgs; [ dunst ];
```

```bash
exec-once=dunst
```

## Screenshots

### grim + slurp (native Wayland)

```
# Arch
sudo pacman -S grim slurp

# Fedora
sudo dnf install grim slurp

# Debian
sudo apt install grim slurp

# NixOS
environment.systemPackages = with pkgs; [ grim slurp ];
```

```bash
# Entire screen
grim ~/Pictures/$(date +%Y%m%d-%H%M%S).png

# Region
grim -g "$(slurp)" ~/Pictures/$(date +%Y%m%d-%H%M%S).png

# Active window
grim -g "$(hyprctl -j activewindow | jq -r '.at[0]|tostring + "," + (.at[1]|tostring) + " " + (.size[0]|tostring) + "x" + (.size[1]|tostring)')" ~/Pictures/$(date +%Y%m%d-%H%M%S).png

# Copy to clipboard
grim -g "$(slurp)" - | wl-copy
```

### hyprshot (wrapper)

```
# Arch
yay -S hyprshot

# Fedora / Debian
# Build from source:
git clone https://github.com/Gustash/hyprshot.git ~/.local/share/hyprshot
sudo ln -s ~/.local/share/hyprshot/hyprshot /usr/local/bin/

# NixOS
environment.systemPackages = with pkgs; [ hyprshot ];
```

```bash
hyprshot -m window                          # Active window
hyprshot -m output                          # Active monitor
hyprshot -m region                          # Region select
```

## Clipboard Manager

### CLI: cliphist + wl-clipboard

```
# Arch
sudo pacman -S wl-clipboard
yay -S cliphist

# Fedora
sudo dnf install wl-clipboard

# Debian
sudo apt install wl-clipboard

# NixOS
environment.systemPackages = with pkgs; [ wl-clipboard cliphist ];
```

```bash
# Keybind for history picker (rofi/wofi)
bind=$mainMod,V,exec,cliphist list | rofi -dmenu | cliphist decode | wl-copy

# Start clipboard listener
exec-once = wl-paste --watch cliphist store
```

### GUI: nwg-clipman

GTK3-based GUI for cliphist — browse, search, and manage clipboard history in a GTK window on gtk-layer-shell. Part of the nwg-shell project.

```
# Arch
sudo pacman -S nwg-clipman

# Fedora
sudo dnf install nwg-clipman

# Debian (Trixie+)
sudo apt install nwg-clipman

# NixOS
environment.systemPackages = with pkgs; [ nwg-clipman ];
```

```bash
# Start
nwg-clipman

# Auto-start with tray
exec-once = nwg-clipman -d
```

**Note:** Requires `cliphist` and `wl-clipboard` installed separately. The `-d` flag starts it as a daemon with tray icon (requires a tray-capable bar like Waybar).

## Ecosystem Tools

### hyprpicker — Color Picker

Identify any color on screen (hex, RGB, HSV).

```
# Arch
sudo pacman -S hyprpicker

# Fedora
sudo dnf install hyprpicker

# Debian
sudo apt install hyprpicker

# NixOS
environment.systemPackages = with pkgs; [ hyprpicker ];
```

```bash
# Pick a color and copy hex to clipboard
hyprpicker -a

# Pick and format output
hyprpicker --format=rgb        # rgb(r, g, b)
hyprpicker --format=hsv        # hsv(h, s, v)
hyprpicker --no-fade           # Don't fade other windows

# Keybind
bind = $mainMod SHIFT, P, exec, hyprpicker -a
```

### hyprsunset — Blue Light Filter

Screen temperature adjustment (blue light reduction).

```
# Arch
sudo pacman -S hyprsunset

# Fedora
sudo dnf install hyprsunset

# Debian
sudo apt install hyprsunset

# NixOS
environment.systemPackages = with pkgs; [ hyprsunset ];
```

```bash
# Set temperature (lower = warmer, 1000-12000)
hyprsunset --temperature 3500    # Warm setting for night
hyprsunset -t 6500               # Default daylight

# Toggle on/off with keybind
bind = $mainMod, N, exec, pkill hyprsunset; hyprsunset -t 3500
bind = $mainMod SHIFT, N, exec, pkill hyprsunset
```

### hyprctl runtime color tools

```bash
# Get color at cursor position (no picker, just shell)
hyprctl cursorswap gdk

# List available Hyprland cursor themes
hyprctl setcursor --help
```

### hyprpolkitagent — Official Polkit Agent

QT/QML-based Polkit authentication agent for Hyprland. Replaces `polkit-gnome-authentication-agent-1`. Available in Arch Linux (extra) repos since late 2025.

**Install:**
```bash
sudo pacman -S hyprpolkitagent
```

**Autostart:**
```bash
exec-once=/usr/libexec/hyprpolkitagent
```
# Arch
yay -S hyprpolkitagent

# Fedora / Debian / NixOS — not yet in official repos
# Build from source: https://github.com/hyprwm/hyprpolkitagent
```

```bash
# Start (replaces polkit-gnome)
exec-once=/usr/libexec/hyprpolkitagent
```

**Why:** Native Hyprland look (QT/QML), no GNOME dependency, handles auth dialogs with proper Wayland integration.

### hyprsysteminfo — System Information Tool

GUI for viewing Hyprland system info, GPU details, and debug information.

```
# Arch
yay -S hyprsysteminfo

# Fedora / Debian / NixOS — build from source
# https://github.com/hyprwm/hyprsysteminfo
```

```bash
# Launch
hyprsysteminfo

# Keybind
bind = $mainMod, I, exec, hyprsysteminfo
```

### hyprland-autoname-workspaces

Auto-rename workspaces based on the window class of their contents.

```
# Arch
yay -S hyprland-autoname-workspaces

# Other distros — build from source
# https://github.com/hyprwm/hyprland-autoname-workspaces
```

```bash
# Start (runs as daemon)
exec-once = hyprland-autoname-workspaces

# Example: workspace with Firefox shows "󰈹 firefox"
# Workspace with kitty shows " kitty"
```

## Polkit Authentication Agent

```
# Arch
sudo pacman -S hyprpolkitagent
```

then autostart it:
```bash
exec-once=/usr/libexec/hyprpolkitagent

# Fallback: polkit-gnome
# sudo pacman -S polkit-gnome
# exec-once=/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1
```

## Network Manager Applet

```bash
exec-once=sleep 5; nm-applet
```

Available on all distros via: `network-manager-applet` (Arch), `nm-connection-editor` (Fedora), `network-manager-gnome` (Debian), `pkgs.networkmanagerapplet` (NixOS).

## Bluetooth

```bash
exec-once=sleep 5; blueman-applet
```

Available on all distros via: `blueman` (Arch), `blueman` (Fedora/Debian), `pkgs.blueman` (NixOS).

## GTK / Qt Theme Coordination

### GTK Theme Selection

```bash
# Set GTK theme, icons, and fonts
gsettings set org.gnome.desktop.interface gtk-theme 'catppuccin-mocha'
gsettings set org.gnome.desktop.interface icon-theme 'Papirus'
gsettings set org.gnome.desktop.interface cursor-theme 'Bibata-Modern-Classic'
gsettings set org.gnome.desktop.interface cursor-size 24
gsettings set org.gnome.desktop.interface font-name 'Noto Sans 10'
gsettings set org.gnome.desktop.interface document-font-name 'Noto Sans 10'
gsettings set org.gnome.desktop.interface monospace-font-name 'JetBrainsMono Nerd Font 10'
gsettings set org.gnome.desktop.wm.preferences button-layout ':minimize,maximize,close'

# Interactive theme browser
nwg-look
```

### Qt Theme Selection

```bash
# Install theme managers
# Arch: sudo pacman -S qt5ct qt6ct kvantum
# Fedora: sudo dnf install qt5ct qt6ct kvantum
# Debian: sudo apt install qt5ct qt6ct kvantum

# Set Qt platform to use qt5ct/qt6ct
env = QT_QPA_PLATFORM,wayland;xcb
env = QT_QPA_PLATFORMTHEME,qt5ct
env = QT_STYLE_OVERRIDE,kvantum
```

Open `qt5ct` (or `qt6ct`), select Kvantum as the style. Open Kvantum Manager, install a Catppuccin Kvantum theme, and apply it.

### GTK/QT Environment Variables (complete block)

```conf
# Add to hyprland.conf
env = GDK_BACKEND,wayland,x11,*
env = QT_QPA_PLATFORM,wayland;xcb
env = QT_QPA_PLATFORMTHEME,qt5ct
env = QT_STYLE_OVERRIDE,kvantum
env = QT_AUTO_SCREEN_SCALE_FACTOR,1
env = QT_WAYLAND_FORCE_DPI,96
env = SDL_VIDEODRIVER,wayland
env = XCURSOR_THEME,Bibata-Modern-Classic
env = XCURSOR_SIZE,24
env = HYPRCURSOR_THEME,Bibata-Modern-Classic
env = HYPRCURSOR_SIZE,24
```

## Font Management

### Installing Fonts

```bash
# Arch
sudo pacman -S ttf-jetbrains-mono-nerd noto-fonts noto-fonts-cjk noto-fonts-emoji ttf-firacode-nerd ttf-nerd-fonts-symbols

# Fedora
sudo dnf install jetbrains-mono-fonts fira-code-fonts google-noto-fonts-common google-noto-emoji-fonts

# Debian
sudo apt install fonts-jetbrains-mono fonts-noto fonts-noto-cjk fonts-noto-color-emoji fonts-firacode

# NixOS
environment.systemPackages = with pkgs; [ jetbrains-mono noto-fonts noto-fonts-cjk noto-fonts-emoji fira-code-nerdfont ];
fonts.fontconfig.enable = true;
```

### Font Fallback Config

```xml
<!-- ~/.config/fontconfig/conf.d/99-fallback.conf -->
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "urn:fontconfig:files:fonts.dtd">
<fontconfig>
  <alias>
    <family>sans-serif</family>
    <prefer><family>Noto Sans</family><family>Noto Color Emoji</family></prefer>
  </alias>
  <alias>
    <family>serif</family>
    <prefer><family>Noto Serif</family><family>Noto Color Emoji</family></prefer>
  </alias>
  <alias>
    <family>monospace</family>
    <prefer><family>JetBrainsMono Nerd Font</family><family>Noto Color Emoji</family></prefer>
  </alias>
</fontconfig>
```

### Font Debug Commands

```bash
fc-list :spacing=mono family | sort -u    # All monospace fonts
fc-match "JetBrainsMono Nerd Font"        # Check font resolution
fc-cache -fv                               # Rebuild font cache
pango-view --font="Noto Color Emoji 24"   # Test emoji rendering
```

## Screen Recording

### wf-recorder (CLI screen recording)

```
# Arch
sudo pacman -S wf-recorder

# Fedora
sudo dnf install wf-recorder

# Debian
sudo apt install wf-recorder

# NixOS
environment.systemPackages = with pkgs; [ wf-recorder ];
```

```bash
# Record entire screen
wf-recorder ~/Videos/recording.mp4

# Record region
wf-recorder -g "$(slurp)" ~/Videos/recording.mp4

# Record with audio (pulseaudio)
wf-recorder -f ~/Videos/recording.mp4 -a

# Record with audio (pipewire)
wf-recorder -f ~/Videos/recording.mp4 --audio=pipewire

# Stop recording
pkill -INT wf-recorder
```

### OBS Studio

```bash
# Install (all distros)
sudo pacman -S obs-studio    # Arch
sudo dnf install obs-studio  # Fedora
sudo apt install obs-studio  # Debian

# Enable PipeWire capture:
# In OBS: Tools → Auto-Configuration Wizard → "Use PipeWire"
# Or add "PipeWire Display Capture" source manually
```

Requires `xdg-desktop-portal-hyprland` to be running for screen capture.
{% endraw %}
