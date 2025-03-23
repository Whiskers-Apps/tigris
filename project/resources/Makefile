uninstall:
	sudo rm -f /usr/bin/tigris-launcher
	sudo rm -f /usr/bin/tigris-show
	sudo rm -f /usr/share/pixmaps/tigris.png
	rm -rf ~/.local/share/com-whiskersapps-launcher/
	rm -rf ~/.cache/tigris-launcher
	rm -rf ~/.cache/tigris-show

install:
	sudo cp tigris-launcher tigris-show /usr/bin/
	chmod +x tigris-launcher.desktop
	sudo desktop-file-install tigris-launcher.desktop
	sudo cp tigris.png /usr/share/pixmaps