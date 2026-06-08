------
{% raw %}
-|---------|---------------|
| `workspace>>` | `workspaceID` | Workspace switch |
| `focusedmon>>` | `monitorName,workspaceID` | Monitor focus change |
| `activewindow>>` | `class,title` | Focused window changed |
| `activewindowv2>>` | `windowAddress` | Focus change (by address) |
| `openwindow>>` | `windowAddress,workspaceID,class,title` | New window created |
| `closewindow>>` | `windowAddress` | Window closed |
| `movewindow>>` | `windowAddress,workspaceID` | Window moved to workspace |
| `windowtitle>>` | `windowAddress` | Window title changed |
| `fullscreen>>` | `windowAddress,fullscreenClient,fullscreenInternal` | Fullscreen toggled |
| `monitoradded>>` | `monitorName` | Monitor plugged in |
| `monitorremoved>>` | `monitorName` | Monitor unplugged |
| `layertitle>>` | `namespace,title` | Layer surface title change |
| `urgent>>` | `windowAddress` | Window requests urgent attention |

## Essential Scripts

### Focus or Launch

```bash
#!/bin/bash
# ~/.config/hypr/scripts/focus_or_launch.sh
# Usage: focus_or_launch.sh <class> <command>

class="$1"
command="$2"

if hyprctl clients -j | jq -e ".[] | select(.class == \"$class\")" > /dev/null; then
    hyprctl dispatch focuswindow "class:^($class)$"
else
    hyprctl dispatch exec "$command"
fi
```

```conf
bind=$mainMod,Return,exec,~/.config/hypr/scripts/focus_or_launch.sh kitty kitty
bind=$mainMod CTRL,Return,exec,~/.config/hypr/scripts/focus_or_launch.sh firefox firefox
```

### Move Window to Next Monitor

```bash
#!/bin/bash
# ~/.config/hypr/scripts/move_to_next_monitor.sh

current_monitor=$(hyprctl -j activewindow | jq -r '.monitor')
monitors=$(hyprctl -j monitors | jq -r '.[].name')
next_monitor=$(echo "$monitors" | grep -A1 "$current_monitor" | tail -1)

if [ "$next_monitor" = "$current_monitor" ]; then
    next_monitor=$(echo "$monitors" | head -1)
fi

hyprctl dispatch movewindow mon:"$next_monitor"
```

### Dynamic Wallpaper (By Time)

```bash
#!/bin/bash
# ~/.config/hypr/scripts/dynamic_wallpaper.sh

hour=$(date +%H)
if [ "$hour" -lt 6 ] || [ "$hour" -ge 20 ]; then
    wallpaper="$HOME/.config/hypr/wallpapers/night.png"
elif [ "$hour" -lt 12 ]; then
    wallpaper="$HOME/.config/hypr/wallpapers/morning.png"
elif [ "$hour" -lt 17 ]; then
    wallpaper="$HOME/.config/hypr/wallpapers/afternoon.png"
else
    wallpaper="$HOME/.config/hypr/wallpapers/evening.png"
fi

hyprctl hyprpaper wallpaper ",$wallpaper"
```

### Screenshot Menu with rofi

```bash
#!/bin/bash
# ~/.config/hypr/scripts/screenshot.sh

choice=$(printf "Full Screen\nActive Window\nRegion\nCopy Region" | rofi -dmenu -p "Screenshot")

case "$choice" in
    "Full Screen")
        grim ~/Pictures/$(date +%Y%m%d-%H%M%S).png
        notify-send "Screenshot saved" ;;
    "Active Window")
        grim -g "$(hyprctl -j activewindow | jq -r '"\(.at[0]),\(.at[1]) \(.size[0])x\(.size[1])"')" ~/Pictures/$(date +%Y%m%d-%H%M%S).png
        notify-send "Screenshot saved" ;;
    "Region")
        grim -g "$(slurp)" ~/Pictures/$(date +%Y%m%d-%H%M%S).png
        notify-send "Screenshot saved" ;;
    "Copy Region")
        grim -g "$(slurp)" - | wl-copy
        notify-send "Screenshot copied to clipboard" ;;
esac
```

### Workspace Overview with rofi

```bash
#!/bin/bash
# ~/.config/hypr/scripts/workspace_overview.sh

windows=$(hyprctl -j clients | jq -r '.[] | "\(.workspace.id) │ \(.class) │ \(.title)"')
choice=$(echo "$windows" | rofi -dmenu -p "Windows")
if [ -n "$choice" ]; then
    class=$(echo "$choice" | awk -F ' │ ' '{print $2}')
    hyprctl dispatch focuswindow "class:^($class)$"
fi
```

## IPC Patterns

### Dynamic Workspace per Monitor (Hotplug)

```bash
#!/bin/bash
# ~/.config/hypr/scripts/monitor_hotplug.sh
# Call on monitoradded event

connected=$(hyprctl -j monitors | jq length)
if [ "$connected" -gt 1 ]; then
    hyprctl keyword workspace "1,monitor:DP-1,default:true"
    hyprctl keyword workspace "2,monitor:DP-1"
    hyprctl keyword workspace "3,monitor:DP-1"
    hyprctl keyword workspace "4,monitor:eDP-1,default:true"
    hyprctl keyword workspace "5,monitor:eDP-1"
fi
```

### Performance Profile Toggle

```bash
#!/bin/bash
# ~/.config/hypr/scripts/performance_profile.sh

profile=$(hyprctl getoption misc:vrr | grep "int:" | awk '{print $2}')

case "$profile" in
    "0")
        hyprctl keyword misc:vrr 2
        hyprctl keyword decoration:blur:enabled false
        notify-send "Profile: Performance" ;;
    "2")
        hyprctl keyword misc:vrr 0
        hyprctl keyword decoration:blur:enabled true
        notify-send "Profile: Quality" ;;
esac
```

## Integration with External Tools

### Notifications

```bash
notify-send "Title" "Message"                    # Basic notification
notify-send -u critical "Low battery" "10%"      # Urgency levels
notify-send -t 5000 "Disappears in 5 seconds"    # Custom timeout
```

### Audio (PipeWire)

```bash
wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+        # Volume up
wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-        # Volume down
wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle       # Mute toggle
```

### Media (playerctl)

```bash
playerctl play-pause                              # Play/Pause
playerctl next                                    # Next track
playerctl previous                                # Previous track
playerctl metadata title                          # Current track title
```

### Brightness

```bash
brightnessctl set +5%                             # Brightness up
brightnessctl set 5%-                             # Brightness down
brightnessctl set 50%                             # Set to 50%
brightnessctl -s set 10%                          # Save current, set to 10%
brightnessctl -r                                  # Restore saved brightness
```

## Performance Notes

- Avoid polling loops (e.g., `while true; do hyprctl clients; sleep 1; done`) — use the socket instead
- Batch multiple `hyprctl keyword` calls into a single script rather than separate keybindings
- `jq` is fast but for high-frequency operations, consider `hyprctl -j clients | jq -c '.[] | select(.focusHistoryID == 0)'` (filter server-side as much as possible)
{% endraw %}
