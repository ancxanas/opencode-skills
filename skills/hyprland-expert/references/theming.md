# Theming Reference

## 5 Popular Themes

### Catppuccin Mocha

```conf
# Catppuccin Mocha palette
$rosewater = f5e0dc
$flamingo = f2cdcd
$pink = f5c2e7
$mauve = cba6f7
$red = f38ba8
$maroon = eba0ac
$peach = fab387
$yellow = f9e2af
$green = a6e3a1
$teal = 94e2d5
$sky = 89dceb
$sapphire = 74c7ec
$blue = 89b4fa
$lavender = b4befe
$text = cdd6f4
$subtext1 = bac2de
$subtext0 = a6adc8
$overlay2 = 9399b2
$overlay1 = 7f849c
$overlay0 = 6c7086
$surface2 = 585b70
$surface1 = 45475a
$surface0 = 313244
$base = 1e1e2e
$mantle = 181825
$crust = 11111b
```

### Catppuccin Latte (light)

```conf
$rosewater = dc8a78
$flamingo = dd7878
$pink = ea76cb
$mauve = 8839ef
$red = d20f39
$maroon = e64553
$peach = fe640b
$yellow = df8e1d
$green = 40a02b
$teal = 179299
$sky = 04a5e5
$sapphire = 209fb5
$blue = 1e66f5
$lavender = 7287fd
$text = 4c4f69
$subtext1 = 5c5f77
$subtext0 = 6c6f85
$overlay2 = 7c7f93
$overlay1 = 8c8fa1
$overlay0 = 9ca0b0
$surface2 = acb0be
$surface1 = bcc0cc
$surface0 = ccd0da
$base = eff1f5
$mantle = e6e9ef
$crust = dce0e8
```

### Tokyo Night

```conf
$bg = 1a1b26
$bg_dark = 16161e
$fg = a9b1d6
$blue = 3d59a1
$cyan = 7dcfff
$green = 9ece6a
$orange = ff9e64
$pink = f7768e
$purple = 9aa5ce
$red = db4b4b
$yellow = e0af68
$teal = 1abc9c
$comment = 565f89
```

### Nord

```conf
$polar_night_1 = 2e3440
$polar_night_2 = 3b4252
$polar_night_3 = 434c5e
$polar_night_4 = 4c566a
$snow_storm_1 = d8dee9
$snow_storm_2 = e5e9f0
$snow_storm_3 = eceff4
$frost_1 = 8fbcbb
$frost_2 = 88c0d0
$frost_3 = 81a1c1
$frost_4 = 5e81ac
$red = bf616a
$orange = d08770
$yellow = ebcb8b
$green = a3be8c
$purple = b48ead
```

### Dracula

```conf
$bg = 282a36
$current_line = 44475a
$fg = f8f8f2
$comment = 6272a4
$cyan = 8be9fd
$green = 50fa7b
$orange = ffb86c
$pink = ff79c6
$purple = bd93f9
$red = ff5555
$yellow = f1fa8c
```

---

## Apply Theme Across the Ecosystem

### Hyprland

```conf
# Use Catppuccin colors in decorations
decoration {
    rounding = 10
    active_opacity = 1.0
    inactive_opacity = 0.9
    blur {
        enabled = true
        size = 3
        passes = 1
    }
    col.shadow = rgba(1e1e2eee)
}

general {
    col.active_border = rgba(cba6f7ee) rgba(89b4faee) 45deg
    col.inactive_border = rgba(45475aee)
}

# Transparent group borders
group {
    col.border_active = rgba(cba6f7ee)
    col.border_inactive = rgba(45475aee)
}
```

### Waybar

```css
/* ~/.config/waybar/style.css — Catppuccin Mocha */
@define-color rosewater #f5e0dc;
@define-color flamingo #f2cdcd;
@define-color pink #f5c2e7;
@define-color mauve #cba6f7;
@define-color red #f38ba8;
@define-color maroon #eba0ac;
@define-color peach #fab387;
@define-color yellow #f9e2af;
@define-color green #a6e3a1;
@define-color teal #94e2d5;
@define-color sky #89dceb;
@define-color sapphire #74c7ec;
@define-color blue #89b4fa;
@define-color lavender #b4befe;
@define-color text #cdd6f4;
@define-color subtext1 #bac2de;
@define-color subtext0 #a6adc8;
@define-color overlay2 #9399b2;
@define-color overlay1 #7f849c;
@define-color overlay0 #6c7086;
@define-color surface2 #585b70;
@define-color surface1 #45475a;
@define-color surface0 #313244;
@define-color base #1e1e2e;
@define-color mantle #181825;
@define-color crust #11111b;

* {
    font-family: "JetBrainsMono Nerd Font", "Noto Sans", sans-serif;
    font-size: 13px;
    min-height: 0;
}

window#waybar {
    background: @base;
    color: @text;
    border-bottom: 1px solid @surface0;
}

#workspaces button {
    padding: 0 5px;
    background: transparent;
    color: @surface2;
    border-radius: 0;
}

#workspaces button.active {
    color: @mauve;
    background: @surface0;
}

#workspaces button.urgent {
    color: @red;
}

#clock, #pulseaudio, #cpu, #memory, #network, #bluetooth, #tray {
    padding: 0 8px;
    color: @text;
}

#clock { color: @blue; }
#pulseaudio { color: @green; }
#network { color: @teal; }
#cpu { color: @peach; }
#memory { color: @yellow; }
#bluetooth { color: @blue; }
```

### Rofi

```rasi
/* ~/.config/rofi/config.rasi — Catppuccin Mocha */
* {
    font: "JetBrainsMono Nerd Font 12";
    background: #1e1e2e;
    background-alt: #181825;
    foreground: #cdd6f4;
    selected: #cba6f7;
    active: #a6e3a1;
    urgent: #f38ba8;
}

window {
    transparency: "real";
    background-color: @background;
    border: 1px solid #313244;
    border-radius: 10;
    width: 600;
}

inputbar {
    children: [prompt,entry];
    background-color: @background-alt;
    border-radius: 8;
    padding: 4;
}

listview {
    lines: 8;
    columns: 1;
    spacing: 4;
}

element {
    padding: 4 8;
    border-radius: 6;
}

element selected {
    background-color: @selected;
    foreground-color: #1e1e2e;
}
```

### Ghostty

```conf
# ~/.config/ghostty/config — Catppuccin Mocha
theme = catppuccin-mocha
```

### Alacritty

```yaml
# ~/.config/alacritty/alacritty.toml — Catppuccin Mocha
[colors.primary]
background = "#1e1e2e"
foreground = "#cdd6f4"

[colors.cursor]
text = "#1e1e2e"
cursor = "#f5e0dc"

[colors.normal]
black = "#45475a"
red = "#f38ba8"
green = "#a6e3a1"
yellow = "#f9e2af"
blue = "#89b4fa"
magenta = "#cba6f7"
cyan = "#94e2d5"
white = "#bac2de"

[colors.bright]
black = "#585b70"
red = "#f38ba8"
green = "#a6e3a1"
yellow = "#f9e2af"
blue = "#89b4fa"
magenta = "#cba6f7"
cyan = "#94e2d5"
white = "#a6adc8"

[font]
size = 12.0

[font.normal]
family = "JetBrainsMono Nerd Font"
style = "Regular"

[font.bold]
family = "JetBrainsMono Nerd Font"
style = "Bold"

[font.italic]
family = "JetBrainsMono Nerd Font"
style = "Italic"
```

### Swaync

```json
// ~/.config/swaync/style.css — Catppuccin Mocha
@define-color cc-bg #1e1e2e;
@define-color noti-bg #181825;
@define-color noti-border #313244;
@define-color text #cdd6f4;
@define-color subtext #a6adc8;
@define-color urgent #f38ba8;
@define-color primary #cba6f7;

* {
    font-family: "JetBrainsMono Nerd Font", sans-serif;
}

.notification-row {
    outline: none;
}

.notification-row:focus,
.notification-row:hover {
    background: @cc-bg;
}

.notification {
    background: @noti-bg;
    border: 1px solid @noti-border;
    border-radius: 10px;
    margin: 6px;
    padding: 0;
}

.notification-content { padding: 10px; }

.title { color: @primary; }
.summary { color: @text; }
.body { color: @subtext; }

.control-center {
    background: @cc-bg;
    border: 1px solid @noti-border;
    border-radius: 10px;
}

.control-center-dnd { color: @primary; }
```

### Dunst

```ini
# ~/.config/dunst/dunstrc — Catppuccin Mocha
[global]
    font = JetBrainsMono Nerd Font 12
    frame_color = #313244
    background = "#1e1e2e"
    foreground = "#cdd6f4"
    corner_radius = 8

[urgency_low]
    background = "#1e1e2e"
    foreground = "#cdd6f4"
    frame_color = "#a6e3a1"
    timeout = 5

[urgency_normal]
    background = "#1e1e2e"
    foreground = "#cdd6f4"
    frame_color = "#89b4fa"
    timeout = 8

[urgency_critical]
    background = "#1e1e2e"
    foreground = "#f38ba8"
    frame_color = "#f38ba8"
    timeout = 0
```

### GTK4 / Libadwaita

```bash
# Force libadwaita dark theme
gsettings set org.gnome.desktop.interface color-scheme 'prefer-dark'

# Install and apply a Catppuccin GTK theme
# Download from: https://github.com/catppuccin/gtk
# Or use nwg-look to pick themes interactively
nwg-look
```

### QT

```bash
# Install theme managers
# Arch
sudo pacman -S qt5ct qt6ct kvantum

# Fedora
sudo dnf install qt5ct qt6ct kvantum

# Debian
sudo apt install qt5ct qt6ct kvantum

# NixOS
environment.systemPackages = with pkgs; [ qt5ct qt6ct kvantum ];
```

```conf
# ~/.config/hypr/hyprland.conf
env = QT_QPA_PLATFORM,wayland;xcb
env = QT_QPA_PLATFORMTHEME,qt5ct
env = QT_STYLE_OVERRIDE,kvantum
```

Then open `qt5ct` or `qt6ct` and select Kvantum as the style. Open Kvantum Manager to install and apply a theme.

---

## Icon & Cursor Themes

### Popular Icon Themes

| Theme | Install (Arch) | Notes |
|-------|---------------|-------|
| Papirus | `sudo pacman -S papirus-icon-theme` | Most popular, covers almost all apps |
| Tela | `yay -S tela-icon-theme` | Modern rounded style |
| Colloid | `yay -S colloid-icon-theme` | Glassmorphism style |
| Adwaita | `pacman -S adwaita-icon-theme` | GNOME default, consistent |

```bash
# Set icon theme
gsettings set org.gnome.desktop.interface icon-theme 'Papirus'
# OR set via environment variable
env = XCURSOR_THEME,Papirus
```

### Popular Cursor Themes

| Theme | Install (Arch) | Notes |
|-------|---------------|-------|
| Bibata Modern | `yay -S bibata-cursor-theme` | Smooth animated cursors |
| Catppuccin | `yay -S catppuccin-cursors-mocha` | Matches Catppuccin theme |
| Nordzy | `yay -S nordzy-cursor-theme` | Matches Nord theme |

```bash
# Set cursor theme system-wide
gsettings set org.gnome.desktop.interface cursor-theme 'Bibata-Modern-Classic'
gsettings set org.gnome.desktop.interface cursor-size 24

# Hyprland cursor settings
env = XCURSOR_THEME,Bibata-Modern-Classic
env = XCURSOR_SIZE,24
env = HYPRCURSOR_THEME,Bibata-Modern-Classic
env = HYPRCURSOR_SIZE,24
```

### Runtime Cursor Switching

```bash
# Switch cursor theme without restart
hyprctl setcursor Bibata-Modern-Classic 24
```

---

## Fonts

### Recommended Fonts

| Font | Use | Install (Arch) |
|------|-----|----------------|
| JetBrainsMono Nerd Font | Terminal, code | `sudo pacman -S ttf-jetbrains-mono-nerd` |
| Noto Sans | UI, general text | `sudo pacman -S noto-fonts` |
| Noto Sans CJK | Chinese/Japanese/Korean | `sudo pacman -S noto-fonts-cjk` |
| Noto Color Emoji | Emoji | `sudo pacman -S noto-fonts-emoji` |
| SF Pro | macOS-like UI | `yay -S ttf-sf-pro` |

### Complete Font Config

```xml
<!-- ~/.config/fontconfig/conf.d/99-hyprland-fonts.conf -->
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "urn:fontconfig:files:fonts.dtd">
<fontconfig>
  <!-- Prefer JetBrainsMono for monospace -->
  <match target="pattern">
    <test name="family"><string>monospace</string></test>
    <edit name="family" mode="prefer" binding="strong">
      <string>JetBrainsMono Nerd Font</string>
    </edit>
  </match>

  <!-- Emoji fallback -->
  <alias>
    <family>sans-serif</family>
    <prefer>
      <family>Noto Sans</family>
      <family>Noto Color Emoji</family>
    </prefer>
  </alias>

  <alias>
    <family>serif</family>
    <prefer>
      <family>Noto Serif</family>
      <family>Noto Color Emoji</family>
    </prefer>
  </alias>
</fontconfig>
```

### Debug Fonts

```bash
# List all available monospace fonts
fc-list :spacing=mono family

# Check which font is selected for a pattern
fc-match "JetBrainsMono Nerd Font"

# Verify emoji font loads
echo -e "\xf0\x9f\x98\x80" | pango-view --font="Noto Color Emoji" /dev/stdin
```

---

## Hyprland-Specific Theme Tricks

### Animated Gradient Borders

```conf
general {
    col.active_border = rgba(cba6f7ee) rgba(89b4faee) rgba(f5c2e7ee) 45deg
    col.inactive_border = rgba(45475aee)
}

# Enable border angle animation
animations {
    enabled = true
    animation = borderangle, 1, 100, default, once
}
```

### Per-Workspace Border Colors

```lua
-- hyprland.lua
local workspace_colors = {
    [1] = "rgba(f38ba8ee)",
    [2] = "rgba(f9e2afee)",
    [3] = "rgba(a6e3a1ee)",
    [4] = "rgba(89b4faee)",
    [5] = "rgba(cba6f7ee)",
}

hyprland.config_changed = function()
    local active = hyprland.active_workspace()
    if workspace_colors[active] then
        hyprland.set("general:col.active_border", workspace_colors[active])
    end
end
```

### Per-Monitor Wallpaper Style

**⚠ hyprpaper v0.8.0+ uses block syntax** (old `preload=` / `wallpaper=` format removed)

```conf
# Different wallpaper for each monitor
wallpaper {
    monitor = DP-1
    path = ~/Pictures/wallpapers/catppuccin-forest.png
    fit_mode = cover
}

wallpaper {
    monitor = HDMI-A-1
    path = ~/Pictures/wallpapers/catppuccin-lake.png
    fit_mode = cover
}
```

---

## Drop-In Catppuccin Mocha Config Pack

Copy all files below into `~/.config/`, adjust wallpaper path, and reload.

### hyprland.conf

```conf
# ~/.config/hypr/hyprland.conf — Catppuccin Mocha
monitor=,preferred,auto,1

input {
    kb_layout=us
    follow_mouse=1
    touchpad {
        natural_scroll=true
        tap-to-click=true
    }
}

general {
    gaps_in=5
    gaps_out=10
    border_size=2
    layout=dwindle
    col.active_border = rgba(cba6f7ee) rgba(89b4faee) 45deg
    col.inactive_border = rgba(45475aee)
}

decoration {
    rounding=10
    active_opacity=1.0
    inactive_opacity=0.9
    blur {
        enabled=true
        size=3
        passes=1
        new_optimizations=true
    }
    drop_shadow=true
    shadow_range=4
    shadow_offset=0 2
    col.shadow=rgba(1e1e2eee)
}

animations {
    enabled=true
    bezier=smooth,0.04,0.83,0.19,0.98
    animation=global,1,10,default
    animation=fade,1,7,default
    animation=windows,1,7,smooth,popin
    animation=windowsOut,1,7,smooth,popin
    animation=workspaces,1,6,smooth
    animation=borderangle,1,100,default,once
}

windowrule=float,^(pavucontrol|blueman-manager|gnome-calculator|org.gnome.Nautilus)$
windowrule=workspace 2 silent,^(firefox)$
windowrule=workspace 3 silent,^(code|Code)$
windowrule=opacity 0.9 0.8,^(com\\.mitchellh\\.ghostty|Alacritty|foot)$

$mainMod=SUPER
bind=$mainMod,Return,exec,ghostty
bind=$mainMod,D,exec,rofi -show drun
bind=$mainMod,Q,killactive
bind=$mainMod,M,exit
bind=$mainMod,Space,togglefloating
bind=$mainMod,F,fullscreen
bind=$mainMod,left,movefocus,l
bind=$mainMod,right,movefocus,r
bind=$mainMod,up,movefocus,u
bind=$mainMod,down,movefocus,d
bind=$mainMod SHIFT,left,movewindow,l
bind=$mainMod SHIFT,right,movewindow,r
bind=$mainMod SHIFT,up,movewindow,u
bind=$mainMod SHIFT,down,movewindow,d
bind=$mainMod,1,workspace,1
bind=$mainMod,2,workspace,2
bind=$mainMod,3,workspace,3
bind=$mainMod,4,workspace,4
bind=$mainMod,5,workspace,5
bind=$mainMod SHIFT,1,movetoworkspace,1
bind=$mainMod SHIFT,2,movetoworkspace,2
bind=$mainMod SHIFT,3,movetoworkspace,3
bind=$mainMod SHIFT,4,movetoworkspace,4
bind=$mainMod SHIFT,5,movetoworkspace,5
bind=$mainMod,T,togglegroup
bind=$mainMod,tab,changegroupactive
bind=$mainMod,mouse_down,workspace,e+1
bind=$mainMod,mouse_up,workspace,e-1

env=XCURSOR_SIZE,24
env=HYPRCURSOR_SIZE,24
env=XCURSOR_THEME,Bibata-Modern-Classic
env=HYPRCURSOR_THEME,Bibata-Modern-Classic
env=GDK_BACKEND,wayland,x11,*
env=QT_QPA_PLATFORM,wayland;xcb
env=SDL_VIDEODRIVER,wayland

exec-once=waybar
exec-once=hyprpaper
exec-once=hypridle
exec-once=swaync
exec-once=/usr/libexec/hyprpolkitagent            -- hyprpolkitagent preferred; fallback: /usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1
```

### hyprpaper.conf

```conf
# ~/.config/hypr/hyprpaper.conf — v0.8.0+ block syntax
wallpaper {
    monitor =
    path = ~/Pictures/wallpapers/catppuccin-mocha.png
    fit_mode = cover
}

splash = false
```

### hyprlock.conf — or use loginctl

For a lightweight alternative that uses your login manager's lock screen (SDDM, GDM), use `loginctl lock-session` instead — no extra config needed.

```conf
# ~/.config/hypr/hyprlock.conf — Catppuccin Mocha
background {
    monitor =
    path = ~/Pictures/wallpapers/catppuccin-mocha-blur.png
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
    outer_color = rgba(cba6f7ff)
    inner_color = rgba(1e1e2eff)
    font_color = rgba(cdd6f4ff)
    fade_on_empty = true
    placeholder_text = <i>Password...</i>
    check_color = rgba(a6e3a1ff)
    fail_color = rgba(f38ba8ff)
    fail_text = <i>$FAIL <b>($ATTEMPTS)</b></i>
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

label {
    monitor =
    text = $USER
    font_size = 20
    color = rgba(bac2deff)
    position = 0, 80
    halign = center
    valign = center
}
```

