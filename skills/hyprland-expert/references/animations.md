------
{% raw %}
|----------|
| `global` | Global multiplier for all animations |
| `fade` | Fade in/out of windows |
| `windows` | Window open/move/resize |
| `windowsOut` | Window close |
| `border` | Border color transitions |
| `borderangle` | Rotating border angle |
| `workspaces` | Workspace swipe |
| `fadeIn`/`fadeOut` | Sub-animations for fade |
| `fadeSwitch` | Fade on workspace switch |
| `fadeShadow` | Shadow fade |
| `fadeDim` | Dim layer fade |

## Parameters

- `enabled`: `1` or `0`
- `speed`: 1-20 (lower = faster, default ~8-10 for most)
- `curve`: `default`, name of a `bezier`, or `linear`
- `style` (optional): `popin`, `slide`, `slidevert`

## Bezier Curves

Standard cubic bezier: `bezier=name,x1,y1,x2,y2`

### Common Presets

```
# Smooth ease-out
bezier=smooth,0.04,0.83,0.19,0.98

# Overshoot (bouncy)
bezier=overshot,0.13,0.99,0.29,1.1

# Bounce
bezier=bounce,0.05,0.9,0.1,1.05

# Ease in-out
bezier=easeInOut,0.42,0.0,0.58,1.0

# Ease out expo (smooth deceleration)
bezier=easeOutExpo,0.19,1.0,0.22,1.0

# Linear
bezier=linear,0.0,0.0,1.0,1.0

# Snappy
bezier=snappy,0.4,0.0,0.2,1.0
```

## Styles

| Style | Animation Behavior |
|-------|-------------------|
| (none) | Default fade/slide |
| `popin` | Window scales in from center |
| `slide` | Slides from direction |
| `slidevert` | Slides vertically |

## Performance Tuning

```conf
# Max performance (disable animations)
animations {
    enabled=false
}

# Balanced
animations {
    enabled=true
    bezier=smooth,0.04,0.83,0.19,0.98
    animation=global,1,10,default
    animation=fade,1,7,default
    animation=windows,1,7,smooth,popin
    animation=windowsOut,1,7,smooth,popin
    animation=workspaces,1,6,smooth
    animation=border,1,10,default
}

# Eye candy
animations {
    enabled=true
    bezier=overshot,0.13,0.99,0.29,1.1
    bezier=bounce,0.05,0.9,0.1,1.05
    animation=global,1,10,default
    animation=fade,1,10,default
    animation=windows,1,6,overshot,popin
    animation=windowsOut,1,4,overshot,popin
    animation=workspaces,1,8,bounce
    animation=border,1,15,default
    animation=borderangle,1,15,default
}
```

## Disable Animations Per-Window

```conf
windowrulev2=noanim,class:^(waybar)$
windowrulev2=noanim,class:^(eww)$
windowrulev2=noanim,class:^(steam)$
windowrulev2=noanim,class:^(gamescope)$
```

## Performance Tuning

### Measure Current FPS

```bash
# Hyprctl-based FPS estimate (poll every second)
watch -n1 hyprctl getoption animations:enabled

# MangoHud overlay (for any application)
mangohud <app>
```

### Animation Profiles

```bash
# Switch between profiles at runtime
# Gaming mode (no animations)
hyprctl keyword animations:enabled false

# Normal mode
hyprctl keyword animations:enabled true

# Low power mode (reduce animation speed)
hyprctl keyword animation windows,1,15,default
hyprctl keyword animation fade,1,15,default
```

### Per-App Animation Override

```lua
-- hyprland.lua — auto-disable animations for games
hyprland.windowrule("noanim", { class = "^steam_app_" })
hyprland.windowrule("noanim", { class = "^gamescope$" })
hyprland.windowrule("noanim", { class = "^lutris$" })
```

### CPU vs GPU Rendering

```conf
# Prefer GPU rendering for animations (default)
decoration {
    blur {
        enabled = true
        new_optimizations = true  # GPU-accelerated blur
    }
}

# Fall back to CPU if GPU is slow
env = WLR_RENDERER,vulkan    # Use Vulkan renderer
env = WLR_RENDERER,pixman    # CPU fallback (slow but works everywhere)
```

### Battery Impact

| Animation | Battery Cost | Notes |
|-----------|-------------|-------|
| `blur` | Medium-High | Most expensive effect |
| `animations enabled` | Low-Medium | Only active during transitions |
| `drop_shadow` | Low | Relatively cheap |
| `borderangle` | Low | Only renders border |
| `workspaces swipe` | Low | Brief transition |

**Laptop battery-saving config:**
```conf
decoration {
    blur {
        enabled = false
    }
    drop_shadow = false
}
animations {
    enabled = true
    animation = global, 1, 15, default    # Slower = less frequent redraws
    bezier = smooth, 0.04, 0.83, 0.19, 0.98
    animation = windows, 1, 12, smooth
    animation = fade, 1, 12, default
    animation = workspaces, 1, 10, default
}
```
{% endraw %}
