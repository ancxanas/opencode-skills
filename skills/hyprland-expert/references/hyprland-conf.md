------
{% raw %}
--|-------------|---------|
| Arch | `/etc/default/grub` + `/etc/mkinitcpio.conf` | `sudo grub-mkconfig -o /boot/grub/grub.cfg && sudo mkinitcpio -P` |
| Fedora | `/etc/default/grub` | `sudo grubby --update-kernel=ALL --args="nvidia_drm.modeset=1"` |
| Debian | `/etc/default/grub` | `sudo update-grub` |
| NixOS | `configuration.nix` | `boot.kernelParams = [ "nvidia_drm.modeset=1" ];` |

## Distro-Specific Config Notes

### Arch
- NVIDIA modules: add `MODULES=(nvidia nvidia_modeset nvidia_uvm nvidia_drm)` to `/etc/mkinitcpio.conf`
- Config location: `~/.config/hypr/hyprland.conf`
- AUR packages: `hyprland-nvidia`, `hyprland-git`, `hyprshot`, `cliphist`

### Fedora
- NVIDIA: `sudo dnf install akmod-nvidia`, then `sudo grubby --update-kernel=ALL --args="nvidia_drm.modeset=1"`
- SELinux: generally no changes needed; check `sudo ausearch -m avc -ts recent` if issues arise
- COPR `solopasha/hyprland` for newer Hyprland versions
- Use `rofi` (XWayland) or build `rofi-lbonn-wayland` from source

### Debian / Ubuntu
- NVIDIA: `sudo apt install nvidia-driver firmware-misc-nonfree`, then `sudo update-grub`
- Backports needed for Hyprland on Debian stable: `sudo apt install -t bookworm-backports hyprland`
- Some companion tools (hyprshot, cliphist) not in repos; build from source
- Ubuntu 24.04+ has Hyprland in universe repos

### NixOS
- NVIDIA: set `hardware.nvidia.modesetting.enable = true;` and `boot.kernelParams = [ "nvidia_drm.modeset=1" ];`
- Env vars set via `environment.sessionVariables` in `configuration.nix`
- Use flakes for latest Hyprland: `hyprland.url = "github:hyprwm/Hyprland";`
- Home Manager: `wayland.windowManager.hyprland.enable = true;`
- Enable Polkit: `security.polkit.enable = true;`
{% endraw %}
