---
render_with_liquid: false
---

----|---
{% raw %}
-------|-------|
| `modifier Mod4` | `$mainMod = SUPER` | Same key, different syntax |
| `bindsym $mod+Return exec kitty` | `bind=$mainMod,Return,exec,kitty` | Commas instead of spaces |
| `workspace 1` | `workspace 1` (or `bind=$mainMod,1,workspace,1`) | Same concept |
| `assign [class="Firefox"] workspace 2` | `windowrulev2=workspace 2,class:^(firefox)$` | Regex matching |
| `for_window [class="X"] floating enable` | `windowrule=float,^(X)$` | Simpler syntax |
| `exec_always --no-startup-id` | `exec-once=` | No startup notification concept |
| `gaps inner 5` | `general { gaps_in=5 }` | Section-based config |
| `bar { ... }` | Waybar (separate tool) | Hyprland has no built-in bar |
| `i3-msg` | `hyprctl dispatch` | IPC command |
| `i3lock` | `hyprlock` | Wayland-native lock screen |
| `feh --bg-scale` | `hyprpaper` / `swww` | Wayland-native wallpaper |

### Side-by-Side Config Comparison

```conf
# ===== i3 =====
set $mod Mod4
bindsym $mod+Return exec kitty
bindsym $mod+d exec rofi -show drun
bindsym $mod+q kill
bindsym $mod+Shift+q exit
bindsym $mod+h focus left
bindsym $mod+l focus right
bindsym $mod+j focus down
bindsym $mod+k focus up
bindsym $mod+Shift+h move left
bindsym $mod+Shift+l move right
bindsym $mod+Shift+j move down
bindsym $mod+Shift+k move up
bindsym $mod+1 workspace 1
bindsym $mod+Shift+1 move container to workspace 1
bindsym $mod+space floating toggle
bindsym $mod+f fullscreen toggle
bindsym $mod+Control+Right workspace next
bindsym $mod+Control+Left workspace prev

assign [class="Firefox"] workspace 2
assign [class="Code"] workspace 3
assign [class="Pavucontrol"] floating enable

gaps inner 5
gaps outer 10
smart_gaps on
smart_borders on

exec_always --no-startup-id kitty
exec_always --no-startup-id feh --bg-scale ~/wallpaper.png
exec_always --no-startup-id picom -b
```

```conf
# ===== Hyprland =====
$mainMod = SUPER

bind = $mainMod, Return, exec, kitty
bind = $mainMod, D, exec, rofi -show drun
bind = $mainMod, Q, killactive
bind = $mainMod SHIFT, Q, exit
bind = $mainMod, left, movefocus, l
bind = $mainMod, right, movefocus, r
bind = $mainMod, down, movefocus, d
bind = $mainMod, up, movefocus, u
bind = $mainMod SHIFT, left, movewindow, l
bind = $mainMod SHIFT, right, movewindow, r
bind = $mainMod SHIFT, down, movewindow, d
bind = $mainMod SHIFT, up, movewindow, u
bind = $mainMod, 1, workspace, 1
bind = $mainMod SHIFT, 1, movetoworkspace, 1
bind = $mainMod, Space, togglefloating
bind = $mainMod, F, fullscreen
bind = $mainMod, mouse_down, workspace, e+1
bind = $mainMod, mouse_up, workspace, e-1

windowrulev2 = workspace 2, class:^(firefox)$
windowrulev2 = workspace 3, class:^(code|Code)$
windowrule = float, ^(pavucontrol)$

general {
    gaps_in = 5
    gaps_out = 10
}

misc {
    enable_swallow = true
}

exec-once = kitty
exec-once = hyprpaper
exec-once = hypridle
# No compositor needed — Hyprland has built-in blur/shadows
```

### Key Behavioral Differences

| Behavior | i3 | Hyprland |
|----------|----|----------|
| Focus follows mouse | `focus_follows_mouse yes` | `input { follow_mouse=1 }` |
| Layouts | `layout toggle split` | `general { layout=dwindle }` or `layout=master` |
| Tabbed mode | `layout tabbed` | `togglegroup` (grouped windows) |
| Sticky windows | `sticky enable` | `windowrule=pin,^(X)$` |
| Scratchpad | `scratchpad show` | `movetoworkspace,silent,special` + `togglespecialworkspace` |
| Multi-monitor | Workspaces per output | Same, but with `monitor=` config |
| Border colors | `client.focused` | `general { col.active_border }` |

### i3 to Hyprland Config Checklist

- [ ] `set $mod` → `$mainMod = SUPER`
- [ ] `bindsym` → `bind = $mod, key, command, arg`
- [ ] `assign` → `windowrulev2` with regex class matching
- [ ] `for_window` → `windowrule`
- [ ] `gaps inner/outer` → `general { gaps_in, gaps_out }`
- [ ] `bar` → Waybar config in `~/.config/waybar/`
- [ ] `exec_always` → `exec-once`
- [ ] `feh` → `hyprpaper` or `swww`
- [ ] `picom` → Remove entirely (Hyprland has built-in compositing)
- [ ] `i3lock` → `hyprlock`
- [ ] `i3status` → Waybar or custom status script

---

## Sway → Hyprland

### Concept Map

| Sway | Hyprland | Notes |
|------|----------|-------|
| `set $mod Mod4` | `$mainMod = SUPER` | Same |
| `bindsym $mod+Return exec kitty` | `bind=$mainMod,Return,exec,kitty` | Comma syntax |
| `output DP-1 res 2560x1440 pos 0 0` | `monitor=DP-1,2560x1440@144,0x0,1` | `@` for refresh rate, scale appended |
| `input type:keyboard xkb_layout us` | `input { kb_layout=us }` | Section-based config |
| `for_window [app_id="firefox"] move to workspace 2` | `windowrulev2=workspace 2,class:^(firefox)$` | Uses class, not app_id |
| `floating enable` | `float` window rule | Same concept |
| `gaps inner 5` | `general { gaps_in=5 }` | Same |
| `smart_gaps on` | `misc { smart_gaps=true }` | Different section |
| `smart_borders on` | `windowrulev2=noborder,fullscreen:1` | No direct equivalent |
| `swaymsg` | `hyprctl dispatch` | IPC |
| `swaylock` | `hyprlock` | Wayland-native |
| `swaybg` | `hyprpaper` / `swww` | More features |
| `swaybar` | Waybar | More features |

### Side-by-Side Config Comparison

```conf
# ===== Sway =====
set $mod Mod4
bindsym $mod+Return exec kitty
bindsym $mod+d exec rofi -show drun
bindsym $mod+q kill
bindsym $mod+Shift+q exit
bindsym $mod+Shift+c reload
bindsym $mod+h focus left
bindsym $mod+j focus down
bindsym $mod+k focus up
bindsym $mod+l focus right

output DP-1 resolution 2560x1440 position 0 0
output HDMI-A-1 resolution 1920x1080 position 2560 0

input type:keyboard {
    xkb_layout us
}
input type:touchpad {
    tap enabled
    natural_scroll enabled
}

for_window [app_id="firefox"] workspace 2
for_window [app_id="pavucontrol"] floating enable

gaps inner 5
gaps outer 10

bar {
    position top
    status_command i3status
    colors {
        background #1e1e2e
        statusline #cdd6f4
        focused_workspace #cba6f7
    }
}

exec_always kitty
exec_always swaybg -i ~/wallpaper.png
```

```conf
# ===== Hyprland =====
$mainMod = SUPER

bind = $mainMod, Return, exec, kitty
bind = $mainMod, D, exec, rofi -show drun
bind = $mainMod, Q, killactive
bind = $mainMod SHIFT, Q, exit
bind = $mainMod SHIFT, R, reload
bind = $mainMod, left, movefocus, l
bind = $mainMod, down, movefocus, d
bind = $mainMod, up, movefocus, u
bind = $mainMod, right, movefocus, r

monitor = DP-1, 2560x1440@144, 0x0, 1
monitor = HDMI-A-1, 1920x1080@60, 2560x0, 1

input {
    kb_layout = us
    touchpad {
        tap-to-click = true
        natural_scroll = true
    }
}

windowrulev2 = workspace 2, class:^(firefox)$
windowrule = float, ^(pavucontrol)$

general {
    gaps_in = 5
    gaps_out = 10
}

# Waybar handles bar functionality
exec-once = kitty
exec-once = hyprpaper
```

### Priority: Sway Button Selectors

Waybar has a key difference:

```css
/* Sway */
#workspaces button.focused { color: #cba6f7; }

/* Hyprland */
#workspaces button.active { color: #cba6f7; }
```

### Sway to Hyprland Config Checklist

- [ ] `output` → `monitor=` (note `@` refresh syntax and trailing scale)
- [ ] `input type:keyboard` → `input { kb_layout }`
- [ ] `input type:touchpad` → `input { touchpad { ... } }`
- [ ] `for_window` → `windowrule` or `windowrulev2`
- [ ] `swaybg` → `hyprpaper` or `swww`
- [ ] `swaylock` → `hyprlock`
- [ ] `swayidle` → `hypridle`
- [ ] `swaybar` → Waybar
- [ ] `swaymsg` → `hyprctl`
- [ ] `bar` section → separate Waybar config
- [ ] `smart_borders` → `windowrulev2=noborder,...`
- [ ] `smart_gaps` → `misc { smart_gaps=true }`
- [ ] Waybar `button.focused` → `button.active`

---

## bspwm → Hyprland

### Concept Map

| bspwm | Hyprland | Notes |
|-------|----------|-------|
| `super + Return` | `bind=$mainMod,Return,exec,kitty` | Similar |
| `bspc node -d ^1` | `movetoworkspace 1` | Different IPC |
| `bspc desktop -f 1` | `workspace 1` | Same concept |
| `bspc rule -a Firefox desktop=2` | `windowrulev2=workspace 2,class:^(firefox)$` | Regex matching |
| `bspc config border_width 2` | `general { border_size=2 }` | Section-based |
| `bspc config window_gap 5` | `general { gaps_in=5 gaps_out=10 }` | Inner + outer gap split |
| Monocle layout | `general { layout=master }` | Master-stack as analog |
| `picom` | Built-in compositor | Remove picom, use Hyprland `decoration` |
| `sxhkd` | `bind=` in hyprland.conf | No external hotkey daemon needed |
| `polybar` | Waybar | Separate tool |
| `lemonbar` | Waybar or custom | Waybar has more features |

### Side-by-Side Config Comparison

```bash
# ===== bspwm (bspwmrc) =====
super + Return
    kitty

super + d
    rofi -show drun

super + q
    bspc node -c

super + space
    bspc node -t floating

super + f
    bspc node -t fullscreen

super + {h,j,k,l}
    bspc node -f {west,south,north,east}

super + Shift + {h,j,k,l}
    bspc node -p {west,south,north,east}

super + {1-5}
    bspc desktop -f '{1-5}'

super + Shift + {1-5}
    bspc node -d '{1-5}'

bspc config border_width 2
bspc config window_gap 5
bspc config active_border_color #cba6f7
bspc config normal_border_color #45475a
bspc config focused_border_color #cba6f7

bspc rule -a Firefox desktop=2
bspc rule -a pavucontrol state=floating
```

```conf
# ===== Hyprland =====
$mainMod = SUPER

bind = $mainMod, Return, exec, kitty
bind = $mainMod, D, exec, rofi -show drun
bind = $mainMod, Q, killactive
bind = $mainMod, Space, togglefloating
bind = $mainMod, F, fullscreen
bind = $mainMod, left, movefocus, l
bind = $mainMod, right, movefocus, r
bind = $mainMod, up, movefocus, u
bind = $mainMod, down, movefocus, d
bind = $mainMod SHIFT, left, movewindow, l
bind = $mainMod SHIFT, right, movewindow, r
bind = $mainMod SHIFT, up, movewindow, u
bind = $mainMod SHIFT, down, movewindow, d
bind = $mainMod, 1, workspace, 1
bind = $mainMod, 2, workspace, 2
bind = $mainMod, 3, workspace, 3
bind = $mainMod, 4, workspace, 4
bind = $mainMod, 5, workspace, 5
bind = $mainMod SHIFT, 1, movetoworkspace, 1
bind = $mainMod SHIFT, 2, movetoworkspace, 2
bind = $mainMod SHIFT, 3, movetoworkspace, 3
bind = $mainMod SHIFT, 4, movetoworkspace, 4
bind = $mainMod SHIFT, 5, movetoworkspace, 5

general {
    border_size = 2
    gaps_in = 5
    gaps_out = 10
    col.active_border = rgba(cba6f7ee)
    col.inactive_border = rgba(45475aee)
}

windowrulev2 = workspace 2, class:^(firefox)$
windowrule = float, ^(pavucontrol)$
```

### Key Differences from a Floating-WM Mindset

| bspwm | Hyprland |
|-------|----------|
| All windows start tiled; manual floating toggle | All windows start tiled; floating window rules for specific apps |
| `bspc config` commands are runtime | Config is file-based; use `hyprctl keyword` for runtime |
| `sxhkd` is external; reload `pkill -USR1 sxhkd` | Keybinds in `hyprland.conf`; reload with `hyprctl reload` |
| Desktops are per-monitor | Workspaces can be per-monitor or global |
| Preselect with `bspc node -p` | No preselection concept; use groups (`togglegroup`) |
| Single border per window | Multi-layer borders with gradient support |
| Compositor (picom) is optional third-party | Built-in compositor with blur, shadows, animations |

### bspwm to Hyprland Config Checklist

- [ ] `sxhkdrc` keybinds → `hyprland.conf` `bind=` entries
- [ ] `bspc rule` → `windowrule` / `windowrulev2`
- [ ] `bspc config border_width` → `general { border_size }`
- [ ] `bspc config window_gap` → `general { gaps_in, gaps_out }`
- [ ] `bspc config border colors` → `general { col.active_border, col.inactive_border }`
- [ ] `picom` → Remove; configure `decoration { blur, drop_shadow }`
- [ ] `polybar` → Waybar

---

## Tool Replacements Summary

| X11 Tool | Wayland Replacement | Hyprland-Specific |
|----------|-------------------|-------------------|
| `i3` / `sway` | `Hyprland` | — |
| `i3lock` / `swaylock` | `hyprlock` | `hyprlock` |
| `i3status` / `swaybar` | `waybar` | `waybar` |
| `feh` / `azote` / `swaybg` | `hyprpaper` / `swww` | `hyprpaper` |
| `picom` / `compton` | Built-in | `decoration` section |
| `polybar` / `lemonbar` | `waybar` | `waybar` |
| `dmenu` | `wofi` / `rofi` | `wofi` (native Wayland) |
| `sxhkd` | `bind=` in config | Built-in |
| `xdotool` / `xprop` | `hyprctl` | `hyprctl` |
| `wmctrl` | `hyprctl` | `hyprctl` |
| `xclip` / `xsel` | `wl-clipboard` | `wl-clipboard` + `cliphist` |
| `maim` / `scrot` | `grim` + `slurp` | `hyprshot` |
| `arandr` | `kanshi` / `hyprctl` | `hyprctl monitors` |
| `nm-applet` (X11) | `nm-applet` (Wayland) | Same app, works in Wayland |
| `blueman-applet` (X11) | `blueman-applet` (Wayland) | Same app, works in Wayland |
| `pasystray` / `volumeicon` | `pavucontrol` + waybar | waybar pulseaudio module |
| `udiskie` | `udiskie` | Works on Wayland |
| `polkit-gnome-auth` | Same (or use hyprpolkitagent) | hyprpolkitagent preferred on Arch |
| `dunst` | `swaync` / `dunst` | `swaync` recommended |
| `rofi` (X11) | `rofi-lbonn-wayland` | Wayland fork needed |
| `redshift` | `hyprsunset` / `wlsunset` | `hyprsunset` |
| `picom` (transparency/shadow) | Built-in `decoration` | `decoration` section |
| `compton` | Built-in compositor | Hyprland is the compositor |

{% endraw %}
