------
{% raw %}
---|----------|-----|-------------|---------------|-----------|
| Minimal | `foot` | `waybar` | `wofi` | `dunst` | `hyprpaper` |
| Full-featured | `ghostty` | `waybar` | `rofi` | `swaync` | `hyprpaper` |
| Eye candy | `alacritty` | `waybar` | `rofi` | `swaync` | `hyprpaper` |

**Terminal** — Your primary tool. `ghostty` is GPU-accelerated with modern features, `foot` is minimal and fast, `alacritty` is fast and configurable.

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
mkdir -p ~/dotfiles/ghostty/.config/ghostty

# Move configs into the repo
mv ~/.config/hypr/hyprland.conf ~/dotfiles/hypr/.config/hypr/hyprland.conf
mv ~/.config/waybar/config.jsonc ~/dotfiles/waybar/.config/waybar/config.jsonc

# Stow creates symlinks
cd ~/dotfiles
stow hypr
stow waybar
stow ghostty

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
2. **Terminal** — Pick and theme your terminal (`ghostty`, `alacritty`, `foot`, `wezterm`)
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
{% endraw %}
