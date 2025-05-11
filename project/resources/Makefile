# Directories
ICONS_DIR := "$(HOME)/.local/share/org-whiskersapps-tigris/assets/icons"

uninstall:
	sudo rm -f /usr/bin/tigris-launcher
	sudo rm -f /usr/bin/tigris-show
	sudo rm -f /usr/share/pixmaps/tigris.png
	rm -rf ~/.local/share/org-whiskersapps-tigris
	rm -rf ~/.cache/tigris-launcher
	rm -rf ~/.cache/tigris-show

install:
	sudo cp tigris-launcher tigris-show /usr/bin/
	chmod +x tigris-launcher.desktop
	sudo desktop-file-install tigris-launcher.desktop
	sudo cp tigris.png /usr/share/pixmaps
	mkdir -p $(ICONS_DIR)
	cp web.svg settings.svg file.svg $(ICONS_DIR)
