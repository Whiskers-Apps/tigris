uninstall:
	sudo rm -f /usr/bin/tigris-launcher
	sudo rm -f /usr/bin/tigris-tray
	sudo rm -f /usr/share/pixmaps/tigris.png
	rm -rf ~/.local/share/com-whiskersapps-launcher/
	rm -rf ~/.cache/tigris-launcher
	rm -rf ~/.cache/tigris-tray

install:
	sudo cp tigris-launcher tigris-tray /usr/bin/
	chmod +x tigris-launcher.desktop
	sudo desktop-file-install tigris-launcher.desktop
	sudo cp tigris.png /usr/share/pixmaps