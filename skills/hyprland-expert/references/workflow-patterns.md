# Workflow Patterns

## Development Workflow

### Workspace Layout

| Workspace | Content | Rationale |
|-----------|---------|-----------|
| 1 | Editor (VSCode, IntelliJ, Neovim) | Primary workspace on login |
| 2 | Browser (Firefox, Chrome) + DevTools | Split with devtools on right |
| 3 | Terminal (builds, git, server) | Keep running processes visible |
| 4 | Documentation (browser/docs) | Reference material |
| 5 | Communication (Slack, Discord, Teams) | Keep out of focus until needed |

### Window Rules

```conf
windowrulev2=workspace 1,class:^(Code|jetbrains-)$
windowrulev2=workspace 2,class:^(firefox|chromium)$
windowrulev2=workspace 3,class:^(kitty|Alacritty)$
windowrulev2=workspace 5,class:^(discord|Slack|teams)$
windowrulev2=opacity 0.85 0.75,class:^(kitty)$              # See-through terminals
windowrulev2=tile,class:^(Code)$                             # Keep editor in tiling
windowrulev2=group,class:^(kitty|Alacritty)$                 # Group terminals
```

### Layout Choice

- **Dwindle**: Good for split-view coding (editor left, terminal right)
- **Master-stack**: Better when you want a large main window with side panels

### Keybindings

```conf
# Quick build
bind=$mainMod CTRL,B,exec,kitty -e make && notify-send "Build done"
bind=$mainMod CTRL,T,exec,kitty -e npm test

# Switch between editor and terminal
bind=$mainMod,grave,focuswindow,class:^(Code)$
bind=$mainMod SHIFT,grave,focuswindow,class:^(kitty)$
```

## Design Workflow

### Workspace Layout

| Workspace | Content |
|-----------|---------|
| 1 | Design tools (Figma, GIMP, Inkscape) — floating |
| 2 | Browser (inspiration, references, Dribbble) |
| 3 | File manager (assets, exports) — tiled |
| 4 | Terminal (builds, git) |
| 5 | Communication |

### Window Rules

```conf
windowrulev2=float,class:^(Gimp|inkscape)$                  # Float design tools
windowrulev2=pin,class:^(Gimp)$,title:^(Toolbox)$           # Pin floating palettes
windowrulev2=dimaround,class:^(Gimp)$                       # Dim background
windowrulev2=size 1400 900,class:^(Gimp)$                   # Default size
windowrulev2=centerwindow,class:^(Gimp)$                    # Center on launch
```

## General Productivity

### Workspace Layout

| Workspace | Content |
|-----------|---------|
| 1 | Browser |
| 2 | Office/Email |
| 3 | Communication |
| 4 | File manager |
| 5 | Media/Music |
| 6-9 | Per-project workspaces |
| 0 / special | Scratchpad (temporary notes) |

### Window Rules

```conf
windowrulev2=workspace 1,class:^(firefox|chromium)$
windowrulev2=workspace 2,class:^(thunderbird|Evolution|libreoffice)$
windowrulev2=workspace 5,class:^(Spotify|ncmpcpp)$
windowrulev2=workspace special silent,class:^(firefox)$,title:^(Picture-in-Picture)$
```

### Scratchpad

```conf
# Toggle scratchpad terminal
bind=$mainMod,Scroll_Lock,exec,~/.config/hypr/scripts/toggle_scratchpad.sh

# toggle_scratchpad.sh:
#   if ! hyprctl clients -j | jq -e '.[] | select(.class == "scratchpad")' > /dev/null; then
#     kitty --class scratchpad
#   else
#     hyprctl dispatch togglespecialworkspace scratchpad
#   fi
```

## Multi-Monitor

### Common Layouts

```conf
# Laptop + external monitor (extend)
monitor=eDP-1,1920x1080@60,0x0,1
monitor=DP-1,2560x1440@144,1920x0,1

workspace=1,monitor:DP-1,default:true
workspace=2,monitor:DP-1
workspace=3,monitor:DP-1
workspace=4,monitor:eDP-1,default:true
workspace=5,monitor:eDP-1
```

### Focus and Movement

```conf
# Jump between monitors
bind=$mainMod,period,focusmonitor,r
bind=$mainMod,comma,focusmonitor,l

# Move workspace to other monitor
bind=$mainMod SHIFT,period,movecurrentworkspacetomonitor,r
bind=$mainMod SHIFT,comma,movecurrentworkspacetomonitor,l
```

### Per-Monitor Workspace Scroll

```conf
bind=$mainMod CTRL,mouse_down,split:workspace,e+1
bind=$mainMod CTRL,mouse_up,split:workspace,e-1
```

## Gaming Mode

### Toggle Script

Save as `~/.config/hypr/scripts/gaming_mode.sh`:

```bash
#!/bin/bash
if hyprctl getoption animations:enabled | grep -q "bool: true"; then
    hyprctl keyword animations:enabled false
    hyprctl keyword decoration:blur:enabled false
    hyprctl keyword decoration:drop_shadow false
    hyprctl keyword general:gaps_in 0
    hyprctl keyword general:gaps_out 0
    hyprctl keyword misc:vrr 2
    notify-send "Gaming Mode ON"
else
    hyprctl keyword animations:enabled true
    hyprctl keyword decoration:blur:enabled true
    hyprctl keyword decoration:drop_shadow true
    hyprctl keyword general:gaps_in 5
    hyprctl keyword general:gaps_out 10
    hyprctl keyword misc:vrr 0
    notify-send "Gaming Mode OFF"
fi
```

### Keybinding

```conf
bind=$mainMod CTRL,G,exec,~/.config/hypr/scripts/gaming_mode.sh
```

### Game-Specific Rules

```conf
windowrulev2=workspace 9,class:^(steam)$
windowrulev2=workspace 9,class:^(steam_app)$               # Launch games on workspace 9
windowrulev2=suppressevent fullscreen,class:^(steam)$      # Prevent steam from going fullscreen
windowrulev2=immediate,class:^(steam_app)$                  # No compositor delay for games
```

## Per-Application Config Patterns

### Browsers (Firefox, Chrome, Chromium)

```conf
windowrulev2=workspace 1,class:^(firefox|chromium|brave)$
windowrulev2=opacity 1.0 1.0,class:^(firefox)$              # Full opacity for browser
windowrulev2=float,title:^(Picture-in-Picture)$              # Float PiP windows
windowrulev2=pin,title:^(Picture-in-Picture)$                # Pin PiP across workspaces
```

### Terminals (kitty, Alacritty, foot)

```conf
windowrulev2=opacity 0.90 0.80,class:^(kitty)$              # Semi-transparent
windowrulev2=group,class:^(kitty)$                           # Auto-group terminals
windowrulev2=noborder,class:^(kitty)$                        # Clean look without borders
```

### Music Players (Spotify, ncspot)

```conf
windowrulev2=workspace 5,class:^(Spotify|ncspot)$
windowrulev2=noblur,class:^(Spotify)$                        # Disable blur for performance
windowrulev2=noanim,class:^(Spotify)$
```

### IDEs (VSCode, IntelliJ, Neovim GUI)

```conf
windowrulev2=workspace 1,class:^(Code|jetbrains-idea)$
windowrulev2=fullscreen,class:^(jetbrains-idea)$              # IntelliJ works best fullscreen
windowrulev2=noborder,class:^(Code)$                          # Borderless VSCode
```

### Communication (Discord, Slack, Teams)

```conf
windowrulev2=workspace 5,class:^(discord|Slack|Teams)$
windowrulev2=float,class:^(discord)$,title:^(Quick Switcher)$ # Float Discord's Ctrl+K
windowrulev2=float,class:^(discord)$,title:^(Settings)$
windowrulev2=noblur,class:^(discord)$                         # Better performance
```

## Workspace Management

### Named Workspaces

```conf
bind=$mainMod,1,workspace,1
bind=$mainMod,F1,exec,hyprctl dispatch workspace name:dev     # Named workspace
bind=$mainMod,F2,exec,hyprctl dispatch workspace name:media
```

```bash
hyprctl renameworkspace 1 dev
hyprctl renameworkspace 5 media
```

## Scrolling Layout (v0.55+)

Windows are arranged in a horizontal or vertical "tape" that you scroll through — ideal for tall monitors, code review, or reading workflows.

### Enable

```conf
general {
    layout = scrolling
}

# Or switch at runtime
bind = $mainMod, F6, exec, hyprctl keyword general:layout scrolling
```

### Scrolling Config

```conf
scrolling {
    # Direction of the scroll tape: "horizontal" or "vertical"
    direction = vertical

    # Number of window rows/columns visible at once
    window_count = 3

    # Keep full-screen windows in the scroll stack
    fullscreen_always_show = true
}
```

**Default:** vertical direction, 3 windows visible, full-screen windows scroll normally.

### Use Cases

- **Code review** — 3+ files open vertically, scroll through with mouse wheel
- **Reading/research** — Tall documents side-by-side
- **Monitoring** — Terminals with logs stacked vertically, scroll between them
- **Music production** — Timeline-style horizontal tape for DAW UIs

### Keybindings

```conf
# Scroll through windows in the tape
bind = $mainMod, mouse_down, layoutmsg, scrollup
bind = $mainMod, mouse_up, layoutmsg, scrolldown

# Or use keyboard
bind = $mainMod CTRL, right, layoutmsg, scrolldown
bind = $mainMod CTRL, left, layoutmsg, scrollup
```

### Scrolling + Full-Screen

In the scrolling layout, full-screen windows stay in the scroll stack by default (since v0.55). Keep scrolling to reveal them:

```conf
scrolling {
    fullscreen_always_show = true
}
```

---

### Special Workspace (Scratchpad)

```conf
bind=$mainMod,grave,togglespecialworkspace                   # Toggle scratchpad
bind=$mainMod SHIFT,grave,movetoworkspace,special:scratchpad  # Send to scratchpad
```
