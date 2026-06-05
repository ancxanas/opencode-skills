# Getting Started with Hyprland

## What is Hyprland?

Hyprland is a **dynamic tiling Wayland compositor** — a modern replacement for traditional X11 window managers and desktop environments. Unlike floating desktops (GNOME, KDE, Windows) where windows overlap, a tiling compositor automatically arranges windows in a non-overlapping grid. You control everything with the keyboard instead of the mouse.

**Key concepts:**
- **Wayland** — Modern display protocol (replaces X11). Faster, more secure, no screen tearing
- **Tiling** — Windows automatically fill available space without overlapping
- **Dynamic** — Hyprland supports multiple layouts: dwindle (spiral), master-stack (main + side), floating, and tabbed groups
- **Compositor** — Hyprland is both the window manager and the compositor (handles rendering, animations, vsync)

## Before You Start

### Check your GPU

```bash
lspci -k | grep -E "(VGA|3D|Display)"
```

- **AMD** — Best experience, works out of the box
- **Intel** — Good experience, works out of the box
- **NVIDIA** — Works but requires extra setup (see `references/distro-notes.md`)

### Check your distro

- **Arch** — `sudo pacman -S hyprland`
- **Fedora** — `sudo dnf install hyprland`
- **Debian 12+** — `sudo apt install -t bookworm-backports hyprland`
- **Ubuntu 24.04+** — `sudo apt install hyprland`
- **NixOS** — `programs.hyprland.enable = true;`

### Backup your existing config

```bash
mv ~/.config/hypr ~/.config/hypr.bak
```

## First Launch

1. Install Hyprland (see distro-specific instructions in `distro-notes.md`)
2. Log out of your current session
3. On the login screen, select **Hyprland** (may be listed as "Hyprland" or "Hyprland Session")
4. Log in

**What you'll see:** A blank screen with a cursor. That's normal — Hyprland ships with no bar, no wallpaper, just the compositor.

**Default keybindings that always work:**
- `SUPER + Q` — Close focused window
- `SUPER + mouse_down` — Next workspace
- `SUPER + mouse_up` — Previous workspace
- `SUPER + click/drag` — Move/resize floating window

Open a terminal: `SUPER + Return` (if kitty is installed) or use `SUPER + F2` to run a command.

## Your First Config

Put this in `~/.config/hypr/hyprland.conf`. Each line explains what it does:

```conf
# ===== MONITOR =====
monitor=,preferred,auto,1
#                │       │  └─ 1x scale (2 for HiDPI)
#                │       └──── auto-position relative to other monitors
#                └──────────── use best available resolution and refresh rate

# ===== INPUT (keyboard & mouse) =====
input {
    kb_layout=us             # Keyboard layout: us, de, fr, etc.
    follow_mouse=1           # 1=focus follows mouse, 0=click to focus
    touchpad {
        natural_scroll=true  # Touchpad scroll direction (like macOS)
        tap-to-click=true    # Tap to click instead of press
    }
}

# ===== GENERAL (window appearance) =====
general {
    gaps_in=5                # Pixels between windows
    gaps_out=10              # Pixels between windows and screen edge
    border_size=2            # Border width in pixels
    layout=dwindle           # Layout: dwindle or master
}

# ===== DECORATION (visual effects) =====
decoration {
    rounding=10              # Corner radius of windows
    active_opacity=1.0       # Opacity of focused window
    inactive_opacity=0.9     # Opacity of unfocused windows
    blur {
        enabled=true         # Background blur
        size=3               # Blur strength
        passes=1             # Blur quality (higher = better but slower)
    }
    drop_shadow=true
    shadow_range=4
}

# ===== ANIMATIONS =====
animations {
    enabled=true
    bezier=myBezier,0.05,0.9,0.1,1.05  # Custom smooth curve
    animation=windows,1,7,myBezier     # Open/close/move windows
    animation=fade,1,7,default          # Fade effects
    animation=workspaces,1,6,default    # Workspace switching
}

# ===== WINDOW RULES (override behavior per app) =====
windowrule=float,^(pavucontrol)$            # Keep volume control floating
windowrule=float,^(blueman-manager)$        # Keep bluetooth floating
windowrule=workspace 1,^(firefox)$          # Firefox always on workspace 1
windowrule=workspace 2,^(code|Alacritty)$   # Code + terminal on workspace 2

# ===== KEYBINDINGS =====
$mainMod=SUPER                              # Shortcut for the SUPER key

# Launch applications
bind=$mainMod,Return,exec,kitty             # Open terminal
bind=$mainMod,D,exec,wofi --show drun       # Open app launcher

# Close and exit
bind=$mainMod,Q,killactive                  # Close focused window
bind=$mainMod,M,exit                        # Exit Hyprland

# Window management
bind=$mainMod,Space,togglefloating          # Float/unfloat window
bind=$mainMod,F,fullscreen                  # Toggle fullscreen

# Focus: move between windows
bind=$mainMod,left,movefocus,l
bind=$mainMod,right,movefocus,r
bind=$mainMod,up,movefocus,u
bind=$mainMod,down,movefocus,d

# Move: move window in layout
bind=$mainMod SHIFT,left,movewindow,l
bind=$mainMod SHIFT,right,movewindow,r
bind=$mainMod SHIFT,up,movewindow,u
bind=$mainMod SHIFT,down,movewindow,d

# Workspaces: switch and move
bind=$mainMod,1,workspace,1
bind=$mainMod,2,workspace,2
bind=$mainMod,3,workspace,3
bind=$mainMod,4,workspace,4
bind=$mainMod SHIFT,1,movetoworkspace,1
bind=$mainMod SHIFT,2,movetoworkspace,2
bind=$mainMod SHIFT,3,movetoworkspace,3
bind=$mainMod SHIFT,4,movetoworkspace,4

# Scroll workspaces with mouse
bind=$mainMod,mouse_down,workspace,e+1
bind=$mainMod,mouse_up,workspace,e-1

# ===== ENVIRONMENT =====
env=XCURSOR_SIZE,24                          # Cursor size
env=HYPRCURSOR_SIZE,24

# Force apps to use Wayland when possible
env=GDK_BACKEND,wayland,x11,*
env=QT_QPA_PLATFORM,wayland;xcb
env=SDL_VIDEODRIVER,wayland

# ===== AUTOSTART =====
exec-once=waybar                             # Status bar
exec-once=hyprpaper                          # Wallpaper daemon
exec-once=hypridle                           # Idle management
exec-once=/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1  # Auth dialogs
exec-once=sleep 5; nm-applet                 # Network manager tray
```

## Choosing Your Stack

| Purpose | Terminal | Bar | App Launcher | Notifications | Wallpaper |
|---------|----------|-----|-------------|---------------|-----------|
| Minimal | `foot` | `waybar` | `wofi` | `dunst` | `hyprpaper` |
| Full-featured | `kitty` | `waybar` | `rofi` | `swaync` | `swww` |
| Eye candy | `alacritty` | `waybar` | `rofi` | `swaync` | `swww` |

**Terminal** — Your primary tool. `kitty` is GPU-accelerated, `foot` is minimal and fast, `alacritty` is fast and configurable.

**Bar** — Shows workspaces, clock, system tray. `waybar` is the most popular choice.

**Launcher** — Opens apps by typing. `wofi` is simple Wayland-native, `rofi` is more powerful.

**Notifications** — Shows alerts from apps. `dunst` is minimal, `swaync` has more features.

**Wallpaper** — Sets desktop background. `hyprpaper` is simple, `swww` has animated transitions.

## Next Steps Roadmap

```
Beginner ──────────────────────────────────────────────────►
                                                           
  1. Getting Started (this guide)       ◄── You are here
  2. Print the Cheatsheet
  3. Customize Keybindings
  4. Add Window Rules
  5. Tweak Animations
  6. Set up Companion Tools
       │
       ▼
Intermediate ──────────────────────────────────────────────►
                                                           
  7. Organize Config into Modules
  8. Explore Workflow Patterns
  9. Add Custom Scripts
  10. Set up Gaming Mode
       │
       ▼
Expert ────────────────────────────────────────────────────►
                                                           
  11. Migrate to Lua Config (v0.55+)
  12. Write IPC Scripts with hyprctl
  13. Build from Source
  14. Contribute to Hyprland
```

## Dotfiles Management

Version-control your Hyprland config so you can roll back changes and sync across machines.

### Option 1: Git Bare Repo (Simple, No Symlinks)

```bash
# Initialize a bare repo in a hidden directory
git init --bare ~/.config/hypr/.dotfiles

# Create an alias to use it
alias dotgit='git --git-dir=$HOME/.config/hypr/.dotfiles --work-tree=$HOME'
echo 'alias dotgit="git --git-dir=$HOME/.config/hypr/.dotfiles --work-tree=$HOME"' >> ~/.bashrc

# Track your config
dotgit add ~/.config/hypr/hyprland.conf
dotgit commit -m "Initial Hyprland config"
dotgit remote add origin <your-repo-url>
dotgit push -u origin main

# On a new machine:
git clone --bare <your-repo-url> $HOME/.config/hypr/.dotfiles
alias dotgit='git --git-dir=$HOME/.config/hypr/.dotfiles --work-tree=$HOME'
dotgit checkout
```

### Option 2: GNU Stow (Symlink Farm)

```bash
# Install stow
# Arch: sudo pacman -S stow
# Fedora: sudo dnf install stow
# Debian: sudo apt install stow
# NixOS: environment.systemPackages = with pkgs; [ stow ];

# Structure your repo
mkdir -p ~/dotfiles/hypr/.config/hypr
mkdir -p ~/dotfiles/waybar/.config/waybar
mkdir -p ~/dotfiles/kitty/.config/kitty

# Move configs into the repo
mv ~/.config/hypr/hyprland.conf ~/dotfiles/hypr/.config/hypr/hyprland.conf
mv ~/.config/waybar/config.jsonc ~/dotfiles/waybar/.config/waybar/config.jsonc

# Stow creates symlinks
cd ~/dotfiles
stow hypr
stow waybar
stow kitty

# ~/.config/hypr/hyprland.conf → ~/dotfiles/hypr/.config/hypr/hyprland.conf (symlink)

# Git repo at ~/dotfiles/
cd ~/dotfiles
git init && git add . && git commit -m "Initial dotfiles"
```

### Option 3: chezmoi (Single Binary, Template Support)

```bash
# Install chezmoi
# Arch: sudo pacman -S chezmoi
# Fedora: sudo dnf install chezmoi
# Debian: sudo apt install chezmoi

# Initialize
chezmoi init

# Add a file
chezmoi add ~/.config/hypr/hyprland.conf

# Edit and apply
chezmoi edit ~/.config/hypr/hyprland.conf
chezmoi apply

# Use templates for per-machine configs
# ~/.local/share/chezmoi/.config/hypr/hyprland.conf.tmpl
# {{- if eq .hostname "desktop" }}
monitor = DP-1, 2560x1440@144, 0x0, 1
# {{- else if eq .hostname "laptop" }}
monitor = eDP-1, 1920x1080@60, 0x0, 1.25
# {{- end }}
```

### Option 4: Nix Home Manager (NixOS Only)

```nix
# ~/.config/home-manager/home.nix
{ pkgs, ... }: {
  wayland.windowManager.hyprland = {
    enable = true;
    package = pkgs.hyprland;
    settings = {
      monitor = ",preferred,auto,1";
      input = {
        kb_layout = "us";
        follow_mouse = 1;
      };
      general = {
        gaps_in = 5;
        gaps_out = 10;
        border_size = 2;
      };
    };
  };
}
```

## First 10 Things to Customize

After your Hyprland desktop is running, customize in this order:

1. **Keybindings** — Change `$mainMod`, add your most-used app shortcuts (browser, file manager, terminal)
2. **Terminal** — Pick and theme your terminal (`kitty`, `alacritty`, `foot`, `wezterm`)
3. **Wallpaper** — Set a wallpaper with `hyprpaper` or `swww`
4. **Bar** — Tweak Waybar modules: add weather, remove CPU if not needed
5. **Window rules** — Send your browser to workspace 2, terminal to workspace 1
6. **Animations** — Start with the "Balanced" preset from `references/animations.md`
7. **Notification daemon** — Set up `swaync` or `dunst`
8. **Lock screen** — Configure `hyprlock` with a nice background
9. **Theme coordination** — Match GTK, Qt, cursor, and icon themes (see `references/theming.md`)
10. **Autostart** — Add your startup apps: `nm-applet`, `blueman-applet`, `polkit-agent`

## Inspiration: Popular Dotfiles

Study these to see what's possible and borrow ideas:

- **End-4's Illogical Impulse** — https://github.com/end-4/dots-hyprland — Material Design 3, uses Quickshell bar (Qt6/QML), highly polished
- **HyDE** — https://github.com/HyDE-Project/HyDE — Very popular, includes theme patcher (`Super+Shift+T`), batteries-included
- **JaKooLit's Hyprland-Dots** — https://github.com/JaKooLit/Hyprland-Dots — Beginner-friendly, well-documented, Arch/Fedora support
- **PrasanthRangan's dotfiles** — https://github.com/prasanthrangan/hyprdots — Extensive ecosystem with theme switching

## Where to Get Help

- **Hyprland Wiki** — https://wiki.hypr.land
- **ArchWiki Hyprland** — https://wiki.archlinux.org/title/Hyprland
- **GitHub Issues** — https://github.com/hyprwm/Hyprland/issues
- **Discord** — Hyprland server (link on GitHub)
- **Reddit** — r/hyprland
