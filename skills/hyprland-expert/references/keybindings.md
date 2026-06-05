# Keybindings Reference

## Syntax

```
bind=MODS,key,dispatcher,params
bindl=MODS,key,dispatcher,params    # Exec on key press (no release filter)
bindr=MODS,key,dispatcher,params    # Exec on key release
bindm=MODS,key,dispatcher,params    # Mouse bind
```

### Modifiers

| Modifier | Description |
|----------|-------------|
| `SUPER` / `WIN` / `LOGO` | Windows/Command key |
| `SHIFT` | Shift key |
| `CTRL` / `CONTROL` | Control key |
| `ALT` | Alt key |
| `MOD2` - `MOD5` | Extra modifier groups |

Combine with space: `SUPER SHIFT`, `CTRL ALT`

### Key Names

Alphanumeric keys as-is: `a`, `1`, `Return`, `Space`, `Tab`, `Escape`, `Backspace`

Function keys: `F1`-`F24`

Media keys: `XF86AudioRaiseVolume`, `XF86AudioLowerVolume`, `XF86AudioMute`, `XF86AudioPlay`, `XF86AudioNext`, `XF86AudioPrev`, `XF86MonBrightnessUp`, `XF86MonBrightnessDown`

Mouse: `mouse:272` (left), `mouse:273` (right), `mouse_down`, `mouse_up`, `BTN_LEFT`, etc.

## Dispatchers

### Window Management

| Dispatcher | Params | Description |
|------------|--------|-------------|
| `killactive` | - | Close active window |
| `fullscreen` | `0`/`1` | Toggle fullscreen |
| `fullscreenstate` | `client` `internal` | Set fullscreen state |
| `togglefloating` | - | Toggle floating |
| `focuswindow` | `class`/`title`/`address` | Focus specific window |
| `movetoworkspace` | `id`/`name` | Move window to workspace |
| `movetoworkspacesilent` | `id`/`name` | Move window silently |
| `movewindow` | `l`/`r`/`u`/`d` | Move window in layout direction |
| `swapwindow` | `l`/`r`/`u`/`d` | Swap windows |
| `movewindoworgroup` | `l`/`r`/`u`/`d` | Move within group |
| `centerwindow` | - | Center floating window |
| `resizewindowpixel` | `x y` | Resize by pixels |
| `resizeactive` | `x% y%` | Resize active by percentage |
| `cyclenext` | `prev`/`next` | Cycle through windows |
| `focusurgent_or_last` | - | Focus urgent or last window |
| `toggleopaque` | - | Toggle window opacity override |
| `pin` | - | Pin/unpin window |
| `tagwindow` | `tag` | Apply tag to window |

### Workspace Management

| Dispatcher | Params | Description |
|------------|--------|-------------|
| `workspace` | `id`/`name`/`+n`/`-n`/`e+1`/`e-1`/`r`/`empty` | Switch workspace |
| `split:workspace` | Same as above | Switch workspace in split |
| `movetoworkspace` | `id`/`name` | Move + switch |
| `movetoworkspacesilent` | `id`/`name` | Move without switching |
| `togglespecialworkspace` | `name` | Toggle special workspace |
| `movetoworkspace` with `name:special` | `name:special` | Move to scratchpad |

### Groups (Tabs)

| Dispatcher | Description |
|------------|-------------|
| `togglegroup` | Toggle grouping of focused window |
| `changegroupactive` | Switch between grouped windows |
| `focuscurrentorlast` | Focus current or previous |
| `lockgroups` | Lock/unlock groups |
| `moveoutofgroup` | Move window out of group |
| `movewindoworgroup` | Move within group |

### Global

| Dispatcher | Description |
|------------|-------------|
| `exit` | Exit Hyprland |
| `exec` | Run command |
| `execr` | Run command on release |
| `pass` | Pass key through to active window |
| `sendshortcut` | Send shortcut to active window |
| `submap` | Enter/exit submap |
| `global` | Trigger global shortcut |
| `setignoregrouplock` | Temporarily bypass group lock |
| `toggleopaque` | Toggle forced opacity |
| `fakekillactive` | Send fake kill signal |
| `focusmonitor` | `l`/`r`/`u`/`d`/`name` | Focus adjacent monitor |
| `movecurrentworkspacetomonitor` | `l`/`r`/`name` | Move workspace to monitor |
| `moveactiveworkspacetomonitor` | `l`/`r`/`name` | Same (deprecated alias) |
| `renameworkspace` | `id` `name` | Rename workspace |

### Mouse Dispatchers

```
bindm=SUPER,mouse_down,workspace,e+1
bindm=SUPER,mouse_up,workspace,e-1
```

## Submaps

Group related keybindings:

```
bind=SUPER,S,submap,screenshot

submap=screenshot
bind=,1,exec,grim -g "$(slurp)" ~/Pictures/screenshot.png
bind=,2,exec,grim -g "$(slurp -o)" ~/Pictures/screenshot.png
bind=,escape,submap,reset
submap=reset
```

## Workflow-Focused Binding Groups

Organize your keybindings by workflow for easier customization:

### Development

```conf
bind=$mainMod,Return,exec,kitty              # Open terminal
bind=$mainMod,grave,focuswindow,class:^(Code)$          # Focus editor
bind=$mainMod SHIFT,grave,focuswindow,class:^(kitty)$   # Focus terminal
bind=$mainMod CTRL,B,exec,kitty -e make && notify-send "Build done"
bind=$mainMod CTRL,T,exec,kitty -e npm test
bind=$mainMod CTRL,grave,exec,~/.config/hypr/scripts/focus_or_launch.sh firefox firefox
```

### Media & Audio

```conf
bindl=,XF86AudioRaiseVolume,exec,wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+
bindl=,XF86AudioLowerVolume,exec,wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-
bindl=,XF86AudioMute,exec,wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle
bindl=,XF86AudioPlay,exec,playerctl play-pause
bindl=,XF86AudioNext,exec,playerctl next
bindl=,XF86AudioPrev,exec,playerctl previous
bind=$mainMod,Print,exec,playerctl play-pause
```

### Brightness & Power

```conf
bindl=,XF86MonBrightnessUp,exec,brightnessctl set +5%
bindl=,XF86MonBrightnessDown,exec,brightnessctl set 5%-
bindl=,XF86KbdBrightnessUp,exec,brightnessctl -d *::kbd_backlight set +10%
bindl=,XF86KbdBrightnessDown,exec,brightnessctl -d *::kbd_backlight set 10%-
```

### Screenshots & Recording

```conf
bind=$mainMod SHIFT,S,exec,grim -g "$(slurp)" - | wl-copy    # Region to clipboard
bind=$mainMod,Print,exec,grim ~/Pictures/$(date +%Y%m%d-%H%M%S).png     # Full screen
bind=,Print,exec,grim -g "$(slurp)" ~/Pictures/$(date +%Y%m%d-%H%M%S).png  # Region to file
bind=$mainMod CTRL,Print,exec,hyprshot -m output              # Current monitor
bind=$mainMod CTRL SHIFT,Print,exec,hyprshot -m window        # Active window
```

### Gaming

```conf
bind=$mainMod CTRL,G,exec,~/.config/hypr/scripts/gaming_mode.sh  # Toggle gaming mode
bind=,XF86Launch1,exec,steam                                    # Dedicated gaming key
bind=$mainMod CTRL,F,exec,hyprctl fullscreen 1                  # Force fullscreen
```

## Printable Keybinding Layout

```
┌──────────────────────────────────────────────────────────┐
│                    HYPRLAND KEYBINDINGS                   │
├──────────────────────────────────────────────────────────┤
│ Essential                                               │
│  SUPER + Q        Close window                          │
│  SUPER + Return   Open terminal                         │
│  SUPER + D        App launcher                          │
│  SUPER + Space    Toggle floating                        │
│  SUPER + F        Toggle fullscreen                      │
│  SUPER + M        Exit Hyprland                          │
├──────────────────────────────────────────────────────────┤
│ Window navigation                                       │
│  SUPER + h/j/k/l  Move focus (left/down/up/right)       │
│  SUPER SHIFT + h  Move window left                      │
│  SUPER SHIFT + j  Move window down                      │
│  SUPER SHIFT + k  Move window up                        │
│  SUPER SHIFT + l  Move window right                     │
├──────────────────────────────────────────────────────────┤
│ Workspaces                                              │
│  SUPER + 1..5     Switch to workspace N                 │
│  SUPER SHIFT + N  Move window to workspace N            │
│  SUPER + scroll   Previous/next workspace               │
│  SUPER + grave    Toggle scratchpad (special workspace)  │
├──────────────────────────────────────────────────────────┤
│ Groups (tabs)                                           │
│  SUPER + T        Toggle group                           │
│  SUPER + Tab      Cycle group tabs                      │
│  SUPER SHIFT + T  Move window out of group              │
└──────────────────────────────────────────────────────────┘
```

## Common Binding Patterns

```conf
$mainMod=SUPER

# Launch
bind=$mainMod,Return,exec,kitty
bind=$mainMod,D,exec,rofi -show drun
bind=$mainMod SHIFT,Return,exec,thunar

# Close
bind=$mainMod,Q,killactive
bind=$mainMod SHIFT,Q,exit

# Layout
bind=$mainMod,Space,togglefloating
bind=$mainMod,F,fullscreen
bind=$mainMod SHIFT,F,fullscreenstate,3,3

# Focus
bind=$mainMod,left,movefocus,l
bind=$mainMod,right,movefocus,r
bind=$mainMod,up,movefocus,u
bind=$mainMod,down,movefocus,d

# Move windows
bind=$mainMod SHIFT,left,movewindow,l
bind=$mainMod SHIFT,right,movewindow,r
bind=$mainMod SHIFT,up,movewindow,u
bind=$mainMod SHIFT,down,movewindow,d

# Workspaces
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

# Scroll through workspaces
bind=$mainMod,mouse_down,workspace,e+1
bind=$mainMod,mouse_up,workspace,e-1

# Groups
bind=$mainMod,T,togglegroup
bind=$mainMod,Tab,changegroupactive
bind=$mainMod SHIFT,Tab,changegroupactive,b

# Media keys
bindl=,XF86AudioRaiseVolume,exec,wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+
bindl=,XF86AudioLowerVolume,exec,wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-
bindl=,XF86AudioMute,exec,wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle
bindl=,XF86AudioPlay,exec,playerctl play-pause
bindl=,XF86AudioNext,exec,playerctl next
bindl=,XF86AudioPrev,exec,playerctl previous

# Brightness
bindl=,XF86MonBrightnessUp,exec,brightnessctl set +5%
bindl=,XF86MonBrightnessDown,exec,brightnessctl set 5%-

# Screenshots
bind=$mainMod SHIFT,S,exec,grim -g "$(slurp)" - | wl-copy
bind=$mainMod,Print,exec,grim ~/Pictures/$(date +%Y%m%d-%H%M%S).png
bind=,Print,exec,grim -g "$(slurp)" ~/Pictures/$(date +%Y%m%d-%H%M%S).png
```
