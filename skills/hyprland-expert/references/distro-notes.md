---
render_with_liquid: false
---
{% raw %}
---

## Fedora

### Install Hyprland

```bash
sudo dnf install hyprland                   # Stock Fedora repos
sudo dnf copr enable solopasha/hyprland     # COPR for newer versions
sudo dnf install hyprland
```

### Install Companion Tools

```bash
sudo dnf install waybar hyprlock hypridle hyprpaper grim slurp wl-clipboard \
  swaync wofi xdg-desktop-portal-hyprland policykit-1-gnome \
  brightnessctl playerctl jq rofi
```

hyprshot and cliphist are not in Fedora repos; build from source or use COPR.

### NVIDIA Setup

```bash
sudo dnf install akmod-nvidia xorg-x11-drv-nvidia-cuda
sudo grubby --update-kernel=ALL --args="nvidia_drm.modeset=1"
```

### SELinux Notes

If you see AVC denials for `xdg-desktop-portal-hyprland`:

```bash
sudo ausearch -m avc -ts recent
```

Generally no SELinux changes are needed for standard Hyprland usage.

### Hyprland Version

Stock Fedora repos may lag behind upstream. The `solopasha/hyprland` COPR tracks latest stable releases. For v0.55+ Lua support, use the COPR.

---



## Debian / Ubuntu

### Install Hyprland

**Debian 12 (Bookworm)** — use backports:

```bash
echo "deb http://deb.debian.org/debian bookworm-backports main" | sudo tee /etc/apt/sources.list.d/backports.list
sudo apt update
sudo apt install -t bookworm-backports hyprland
```

**Ubuntu 24.04+** — available in universe:

```bash
sudo apt install hyprland
```

If unavailable or outdated, [build from source](https://wiki.hypr.land/Building-from-source).

### Install Companion Tools

```bash
sudo apt install waybar hyprlock hypridle hyprpaper grim slurp wl-clipboard \
  swaync wofi xdg-desktop-portal-hyprland policykit-1-gnome \
  brightnessctl playerctl jq rofi
```

Tools not in repos (hyprshot, cliphist):

```bash
# hyprshot
git clone https://github.com/Gustash/hyprshot.git ~/.local/share/hyprshot
sudo ln -s ~/.local/share/hyprshot/hyprshot /usr/local/bin/

# cliphist
go install github.com/sentriz/cliphist@latest
```

### NVIDIA Setup

```bash
sudo apt install nvidia-driver firmware-misc-nonfree
```

Add `nvidia_drm.modeset=1` to `GRUB_CMDLINE_LINUX_DEFAULT` in `/etc/default/grub`:

```bash
sudo update-grub
```

### Hyprland Version

Debian stable ships an older Hyprland. Use backports or build from source for v0.55+ Lua support. Ubuntu 24.04+ has newer packages in universe.

---

## NixOS

### Install Hyprland

**Flake-based approach (recommended):**

```nix
# flake.nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    hyprland.url = "github:hyprwm/Hyprland";
    hyprland.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, hyprland, ... }: {
    nixosConfigurations.myhost = nixpkgs.lib.nixosSystem {
      modules = [
        hyprland.nixosModules.default
        {
          programs.hyprland = {
            enable = true;
            package = hyprland.packages.${pkgs.system}.hyprland;
            xwayland.enable = true;
          };
        }
      ];
    };
  };
}
```

**Non-flake:**

```nix
# configuration.nix
{ pkgs, ... }: {
  programs.hyprland = {
    enable = true;
    xwayland.enable = true;
  };
  nixpkgs.config.allowUnfree = true;
}
```

### Install Companion Tools

```nix
{ pkgs, ... }: {
  environment.systemPackages = with pkgs; [
    waybar
    hyprlock
    hypridle
    hyprpaper
    grim
    slurp
    wl-clipboard
    swaync
    wofi
    xdg-desktop-portal-hyprland
    brightnessctl
    playerctl
    jq
    rofi-wayland
    hyprshot
    cliphist
    polkit_gnome
  ];

  programs.waybar.enable = true;
  security.polkit.enable = true;
}
```

### NVIDIA Setup

```nix
{ pkgs, ... }: {
  hardware.nvidia = {
    modesetting.enable = true;
    open = false;
    nvidiaSettings = true;
    package = config.boot.kernelPackages.nvidiaPackages.stable;
  };

  hardware.opengl = {
    enable = true;
    driSupport = true;
    driSupport32Bit = true;
  };

  boot.kernelParams = [ "nvidia_drm.modeset=1" ];

  environment.sessionVariables = {
    LIBVA_DRIVER_NAME = "nvidia";
    __GLX_VENDOR_LIBRARY_NAME = "nvidia";
    GBM_BACKEND = "nvidia-drm";
    WLR_NO_HARDWARE_CURSORS = "1";
  };
}
```

### Home Manager Integration

```nix
{ pkgs, ... }: {
  wayland.windowManager.hyprland = {
    enable = true;
    package = pkgs.hyprland;
    xwayland.enable = true;
    systemd.enable = true;
  };
}
```

### Hyprland Version

Use `nixos-unstable` or the Hyprland flake input to track latest releases. Pin the flake input to a specific tag for stable releases.

---

## Testing Hyprland in a VM

### Using virt-manager (QEMU/KVM)

**Host requirements:**
- KVM-enabled CPU
- `libvirt` + `virt-manager` installed
- User in `libvirt` group

**VM creation tips:**
- **Video:** Choose `virtio` GPU (best performance) or `QXL` (fallback)
- **3D acceleration:** Enable "OpenGL" in Video settings (requires `virgl` support)
- **Display:** Set `spice` or `VNC` for the display server
- **UEFI:** Enable OVMF UEFI firmware for better compatibility

```bash
# Host setup for VM 3D acceleration
# Arch
sudo pacman -S virt-manager qemu-desktop libvirt ovmf virglrenderer

# Fedora
sudo dnf install @virtualization
sudo dnf install virt-manager qemu libvirt edk2-ovmf virglrenderer

# Debian
sudo apt install virt-manager qemu-system-x86 libvirt-daemon-system ovmf virglrenderer

# Start libvirt
sudo systemctl enable --now libvirtd
sudo usermod -aG libvirt $USER
```

**Inside the VM:**
```bash
# Install Hyprland normally per distro instructions above
# Use virtio GPU driver — it supports Wayland natively
# If screen remains blank, switch to software rendering:
env = WLR_RENDERER,pixman
```

### Distro-Specific VM Notes

| Distro | VM Image Source | Notes |
|--------|----------------|-------|
| Arch | `archlinux.org/download` | ISO install; use `archinstall` for speed |
| Fedora | `fedoraproject.org/workstation` | Fedora Workstation ISO works out of box |
| Debian | `debian.org/distrib` | Use Bookworm ISO; install hyprland via backports |
| NixOS | `nixos.org/download` | Use minimal ISO; config-driven install |

### Distrobox / Toolbox (Container Testing)

For a lightweight test without a full VM:

```bash
# Install distrobox
# Arch: sudo pacman -S distrobox
# Fedora: sudo dnf install distrobox
# Debian: sudo apt install distrobox

# Create a container with Hyprland (limited — no GPU acceleration)
distrobox create --image archlinux:latest --name hypr-test
distrobox enter hypr-test
sudo pacman -S hyprland

# Note: hyprctl will work, but running Hyprland inside a container
# has limited GPU support. Use for config testing only.
```

### Known VM Limitations

- GPU acceleration is limited — expect lower FPS
- Some effects (blur, animations) may be slow
- `hyprctl monitors` may show virtual display names
- NVIDIA GPU passthrough is complex (requires VFIO)
- Fractional scaling may not work correctly

## Beginner FAQ

### Arch

**Q: "pacman says hyprland package not found!"**
A: Make sure you've updated: `sudo pacman -Syu`. If still missing, the package might be in the `extra` repo — check `/etc/pacman.conf` has `[extra]` enabled.

**Q: "Should I use the normal or NVIDIA version?"**
A: Use `hyprland` (normal). Only use `hyprland-nvidia` if you have NVIDIA GPU issues with the standard package.

**Q: "What's the difference between `hyprland` and `hyprland-git`?"**
A: `hyprland` is the latest stable release. `hyprland-git` is built from the latest source code — it has new features (like v0.55+ Lua) but may have bugs.

### Fedora

**Q: "Why is my Hyprland version old?"**
A: Fedora's stable repos ship the version that was current at release time. Use the `solopasha/hyprland` COPR for newer versions: `sudo dnf copr enable solopasha/hyprland`.

**Q: "COPR sounds risky — is it safe?"**
A: COPR is Fedora's community build service, similar to Arch's AUR. The `solopasha/hyprland` COPR is well-maintained and widely used. You can always `sudo dnf copr remove solopasha/hyprland` to go back.

**Q: "Do I need to worry about SELinux?"**
A: Usually not. Hyprland and its tools work within standard SELinux policies. If something breaks, check `sudo ausearch -m avc -ts recent` for denials.

### Debian / Ubuntu

**Q: "Why is Hyprland so old or missing?"**
A: Debian stable prioritizes stability over new versions. Hyprland moves fast. Use backports (`-t bookworm-backports`) for a newer version. For the absolute latest, [build from source](https://wiki.hypr.land/Building-from-source).

**Q: "apt says 'package not found' for some tools"**
A: `hyprshot` and `cliphist` aren't in Debian repos. See the Install section above for manual install steps.

**Q: "Can I run Hyprland on an older kernel?"**
A: You need kernel 6.2+ for proper Wayland support. `uname -r` to check. Debian 12 ships with 6.1 LTS — backports have newer kernels.

### NixOS

**Q: "Flakes vs non-flakes — which should I use?"**
A: Flakes are the modern Nix approach and give you the latest Hyprland. If you're new to Nix, start with the non-flake approach in `configuration.nix`. Learn flakes later.

**Q: "How do I know which version of Hyprland I'm getting?"**
A: The version depends on your nixpkgs channel. `nixos-unstable` tracks recent releases. `nixos-24.11` (stable) has an older Hyprland. Pin the Hyprland flake input for precise version control.

**Q: "My NixOS build takes forever — what's happening?"**
A: First build can compile Hyprland from source (C++ takes a while). Add `package = pkgs.hyprland;` to use a pre-built binary when available. Subsequent builds are cached.
{% endraw %}
