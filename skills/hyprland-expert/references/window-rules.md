------
{% raw %}
|-------------|---------|
| `class` | Window class (regex) | `class:^(kitty)$` |
| `title` | Window title (regex) | `title:^(Firefox)$` |
| `initialClass` | Initial class before mapping | `initialClass:^(Alacritty)$` |
| `initialTitle` | Initial title before mapping | `initialTitle:^(Alacritty)$` |
| `tag` | Window tag | `tag:myapp` |
| `xwayland` | XWayland window | `xwayland:0` or `xwayland:1` |
| `float` | Floating state | `float:0` or `float:1` |
| `fullscreen` | Fullscreen state | `fullscreen:0` or `fullscreen:1` |
| `pin` | Pinned state | `pin:0` or `pin:1` |
| `focus` | Currently focused | `focus:0` or `focus:1` |
| `group` | Grouped windows | `group:0` or `group:1` |
| `workspace` | Workspace ID or name | `workspace:1` or `workspace:special` |
| `fullscreenState_client` | Client fullscreen state | `fullscreenState_client:0` (0=none, 1=maximize, 2=fullscreen, 3=both) |
| `fullscreenState_internal` | Internal fullscreen state | Same as above |

## Effects

| Effect | Description |
|--------|-------------|
| `float` | Force floating |
| `tile` | Force tiling |
| `fullscreen` | Force fullscreen |
| `maximize` | Force maximize |
| `pin` | Pin (visible on all workspaces) |
| `nofocus` | Skip focusing |
| `noblur` | Disable blur |
| `noborder` | Disable border |
| `nodim` | Disable dim around |
| `noshadow` | Disable shadows |
| `noanim` | Disable animations |
| `nomaxsize` | Disable max size limit |
| `dimaround` | Dim everything around |
| `workspace w` | Move to workspace `w` |
| `monitor m` | Move to monitor `m` |
| `opacity a b` | Active/inactive opacity |
| `border_size i` | Override border size |
| `border_color c` | Override border color |
| `suppressevent e` | Suppress events (e.g. `fullscreen`) |
| `group` | Set window group |
| `groupbar` | Enable/disable group bar |
| `keepaspectratio` | Force aspect ratio |
| `mousexdg` | Forward mouse events to XDG |
| `idleinhibit` | Inhibit idle (fullscreen) |
| `minsize w h` | Minimum size |
| `maxsize w h` | Maximum size |
| `renderdetached` | Render in separate data structure |
| `immediate` | Force immediate rendering (no delay) |
| `nearestneighbor` | Nearest-neighbor filtering |
| `fakefullscreen` | Fake fullscreen |

## Rules by Application Category

### Browsers (Firefox, Chrome, Chromium, Brave)

```conf
windowrulev2=workspace 1,class:^(firefox|chromium|brave)$   # Always on workspace 1
windowrulev2=float,title:^(Picture-in-Picture)$             # Float PiP windows
windowrulev2=pin,title:^(Picture-in-Picture)$               # Pin PiP across workspaces
windowrulev2=noblur,title:^(Picture-in-Picture)$            # No blur on PiP (performance)
windowrulev2=opacity 1.0 1.0,class:^(firefox)$              # Full opacity for browser
```

### Terminals (kitty, Alacritty, foot, wezterm)

```conf
windowrulev2=opacity 0.90 0.80,class:^(kitty)$             # Semi-transparent
windowrulev2=opacity 0.85 0.75,class:^(Alacritty)$         # Semi-transparent
windowrulev2=group,class:^(kitty)$                          # Auto-group terminals
windowrulev2=group,class:^(Alacritty)$                      # Auto-group terminals
windowrulev2=noborder,class:^(kitty)$                       # Clean borderless look
windowrulev2=nomaxsize,class:^(kitty)$                      # Allow fullscreen terminal
windowrulev2=workspace 3,initialClass:^(kitty)$             # Build terminals on ws 3
```

### IDEs & Editors (VSCode, IntelliJ, Neovim GUI)

```conf
windowrulev2=workspace 2,class:^(Code)$                     # VSCode on workspace 2
windowrulev2=workspace 2,class:^(jetbrains-idea)$           # IntelliJ on workspace 2
windowrulev2=workspace 2,class:^(jetbrains-studio)$         # Android Studio on ws 2
windowrulev2=fullscreen,class:^(jetbrains-idea)$            # IntelliJ in fullscreen
windowrulev2=noborder,class:^(Code)$                        # Borderless VSCode
windowrulev2=noanim,class:^(jetbrains-idea)$                # No animations for IDEs
```

### Media (Spotify, VLC, MPV)

```conf
windowrulev2=workspace 5,class:^(Spotify|vlc|mpv)$         # Media on workspace 5
windowrulev2=noblur,class:^(Spotify)$                       # Save resources
windowrulev2=noanim,class:^(Spotify)$
windowrulev2=float,class:^(mpv)$                            # Float video player
windowrulev2=pin,class:^(Spotify)$                          # Keep pinned if desired
windowrulev2=opacity 1.0 1.0,class:^(vlc|mpv)$             # Full opacity for video
```

### Communication (Discord, Slack, Teams, Zoom)

```conf
windowrulev2=workspace 6,class:^(discord|Slack|Teams|zoom)$
windowrulev2=float,class:^(discord)$,title:^(Quick Switcher)$    # Float popup dialogs
windowrulev2=float,class:^(discord)$,title:^(Settings)$
windowrulev2=float,class:^(discord)$,title:^(User)$
windowrulev2=noblur,class:^(discord)$                       # Performance
windowrulev2=float,class:^(zoom)$,title:^(Zoom)$
```

### Games (Steam, Lutris, Wine)

```conf
windowrulev2=workspace 9,class:^(steam)$                    # Steam on workspace 9
windowrulev2=workspace 9,class:^(steam_app)$                # Games on workspace 9
windowrulev2=suppressevent fullscreen,class:^(steam)$       # Prevent Steam fullscreen
windowrulev2=immediate,class:^(steam_app)$                  # No compositor delay
windowrulev2=noanim,class:^(steam_app)$                     # No animations while gaming
windowrulev2=noblur,class:^(steam_app)$
windowrulev2=noshadow,class:^(steam_app)$
windowrulev2=nomaxsize,class:^(steam_app)$
windowrulev2=fullscreen,class:^(steam_app)$                 # Games start fullscreen
```

### System Dialogs (float these always)

```conf
windowrulev2=float,class:^(pavucontrol)$                    # Volume control
windowrulev2=float,class:^(blueman-manager)$                # Bluetooth manager
windowrulev2=float,class:^(gnome-calculator)$               # Calculator
windowrulev2=float,class:^(file-roller)$                    # Archive manager
windowrulev2=float,class:^(pamac-manager)$                  # Package manager
windowrulev2=float,class:^(Nm-connection-editor)$           # Network settings
windowrulev2=float,title:^(Volume Control)$                 # Volume OSD
windowrulev2=float,title:^(Save As)$                         # Save dialogs
windowrulev2=float,title:^(Open File)$                       # Open dialogs
windowrulev2=float,title:^(Library)$                         # File picker dialogs
```

## Common One-Liners (Copy-Paste Ready)

```
windowrulev2=float,class:^(pavucontrol|blueman-manager|gnome-calculator|file-roller)$
windowrulev2=workspace 1,class:^(firefox|chromium)$
windowrulev2=workspace 2,class:^(Code|Alacritty)$
windowrulev2=workspace 5,class:^(Spotify|vlc)$
windowrulev2=workspace 9,class:^(steam|steam_app)$
windowrulev2=opacity 0.9 0.8,class:^(kitty|Alacritty)$
windowrulev2=noanim,class:^(waybar|eww|Spotify)$
windowrulev2=noborder,class:^(waybar|eww)$
windowrulev2=group,class:^(kitty|Alacritty|foot)$
```

## Layer Rules

```
layerrule=blur,waybar
layerrule=blur,rofi
layerrule=ignorezero,waybar
layerrule=ignorezero,rofi
layerrule=noanim,waybar
layerrule=noanim,eww
```

{% endraw %}
