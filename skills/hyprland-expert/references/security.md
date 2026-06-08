------
{% raw %}
---|-----|-------------------|
| Keylogging | Any app can listen to all keys | Apps only see their own keys |
| Screen capture | Any app can capture entire screen | Requires portal permission dialog |
| Window content | Any app can read window titles/content | Apps only see their own content |
| Input injection | Any app can send fake input | API-controlled, restrictive |
| Clipboard | Any app can read clipboard at any time | Requires focused window (with `wl-clipboard`) |

## Screen Lock Security

### hyprlock Best Practices

```conf
# ~/.config/hypr/hyprlock.conf
background {
    # Blur the background — prevents someone peeking at your screen
    blur_passes = 3
    color = rgba(000000ff)
}

input-field {
    # Hide password input
    dots_size = 0.2
    dots_center = true

    # Clear password if user switches away and back
    fade_on_empty = true

    # Change colors on fail (prevents timing attacks)
    fail_color = rgba(ff0000ff)
    fail_text = <i>$FAIL <b>($ATTEMPTS)</b></i>
    check_color = rgba(00ff00ff)
}
```

### Auto-Lock on Idle

```conf
# ~/.config/hypr/hypridle.conf
general {
    lock_cmd = pidof hyprlock || hyprlock
    before_sleep_cmd = loginctl lock-session
    after_sleep_cmd = hyprctl dispatch dpms on
}

# Lock after 5 minutes of inactivity
listener {
    timeout = 300
    on-timeout = loginctl lock-session
}

# Turn off display after 10 minutes
listener {
    timeout = 600
    on-timeout = hyprctl dispatch dpms off
    on-resume = hyprctl dispatch dpms on
}
```

### Lock on Lid Close

```bash
# /etc/systemd/logind.conf or ~/.config/systemd/user/
HandleLidSwitch=lock
HandleLidSwitchExternalPower=lock
```

```conf
# In hypridle.conf
listener {
    timeout = 0                     # Immediate
    on-timeout = loginctl lock-session
}
# Trigger via systemd: handle lid close → lock session
```

### Suspend on Lock

```conf
listener {
    timeout = 1800                  # 30 min after lock
    on-timeout = systemctl suspend
}
```

## Clipboard Security

`wl-clipboard` has a security advantage over X11: only the focused window can read the clipboard. But clipboard managers bypass this.

### cliphist Security

```conf
# Clear clipboard history on lock
bind = SUPER SHIFT, V, exec, cliphist wipe
```

```bash
# Add to hypridle.conf lock command to clear on lock
general {
    lock_cmd = cliphist wipe && pidof hyprlock || hyprlock
}
```

### Time-Based Clipboard Clear

```bash
# ~/.config/hypr/scripts/clipboard-auto-clear.sh
#!/bin/bash
sleep 30    # Clear clipboard after 30 seconds
echo "" | wl-copy
cliphist delete-query ""
```

```conf
exec-once = ~/.config/hypr/scripts/clipboard-auto-clear.sh &
```

## xdg-desktop-portal Security

### Permission Model

Applications request screen capture through `xdg-desktop-portal`. Hyprland uses `xdg-desktop-portal-hyprland` as the backend.

```bash
# Check which portal is active
systemctl --user status xdg-desktop-portal

# Portal logs (see which apps requested capture)
journalctl --user -u xdg-desktop-portal -f
```

### Revoke Portal Permissions

```bash
# Reset all portal permissions
rm -rf ~/.local/share/xdg-desktop-portal/
systemctl --user restart xdg-desktop-portal

# Or manage per-app permissions (if using flatpak)
flatpak permission-show org.freedesktop.portal.ScreenCast
```

## Polkit (Authorization Agent)

Polkit handles system-level authorization dialogs (mounting drives, installing packages, etc.).

### Install

```bash
# Arch
sudo pacman -S polkit-gnome

# Fedora
sudo dnf install policykit-1-gnome

# Debian
sudo apt install policykit-1-gnome

# NixOS
environment.systemPackages = with pkgs; [ polkit_gnome ];
security.polkit.enable = true;
```

### Start Automatically

```conf
exec-once = /usr/libexec/hyprpolkitagent         -- hyprpolkitagent preferred

exec-once = /usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1  -- fallback
```

### Verify it's running

```bash
ps aux | grep polkit
# Should show: /usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1
```

## SUID Alternatives

Avoid SUID binaries for common tasks. Use Polkit or systemd-logind instead.

```bash
# Instead of SUID for brightnessctl:
# Add Polkit rule for backlight control
```

```ini
# /etc/polkit-1/rules.d/10-backlight.rules
polkit.addRule(function(action, subject) {
    if (action.id == "org.freedesktop.upower.backlight" &&
        subject.local &&
        subject.active) {
        return polkit.Result.YES;
    }
});
```

```bash
# Instead of SUID for playerctl (media controls):
# Just run as user — playerctl works without SUID via D-Bus
```

## Locking Down Network (Firewall)

```bash
# Firewalld (Fedora default)
sudo firewall-cmd --permanent --add-service=dhcpv6-client
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload

# iptables/nftables (Arch/Debian)
# Use ufw for simple firewall
sudo ufw enable
sudo ufw default deny
sudo ufw allow ssh
```
{% endraw %}
