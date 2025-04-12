# Directories
LAUNCHER_DIR := "$(CURDIR)/project/launcher"
SHOW_DIR := "$(CURDIR)/project/show"
RESOURCES_DIR := "$(CURDIR)/project/resources"
LAUNCHER_TARGET_DIR := $(shell cargo metadata --format-version 1 --no-deps --manifest-path project/launcher/src-tauri/Cargo.toml | jq -r '.target_directory')
SHOW_TARGET_DIR := $(shell cargo metadata --format-version 1 --no-deps --manifest-path project/show/Cargo.toml | jq -r '.target_directory')

# Files
LAUNCHER_BIN := "$(LAUNCHER_TARGET_DIR)/release/tigris-launcher"
SHOW_BIN := "$(LAUNCHER_TARGET_DIR)/release/tigris-show"

# Release
VERSION := $(shell grep -E '^version = ' project/launcher/src-tauri/Cargo.toml | sed 's/version = "\(.*\)"/\1/')
RELEASE_DIR := "tigris-launcher-$(VERSION)-linux-x86_64"

default:
	mkdir -p $(RELEASE_DIR)
	cd $(LAUNCHER_DIR) && yarn install
	cd $(LAUNCHER_DIR) && cargo tauri build
	cd $(SHOW_DIR) && cargo build --release
	cp $(LAUNCHER_BIN) $(SHOW_BIN) $(RELEASE_DIR)
	cp $(RESOURCES_DIR)/icons/logo.png $(RELEASE_DIR)/tigris.png
	cp $(RESOURCES_DIR)/tigris-launcher.desktop $(RELEASE_DIR)
	cp $(RESOURCES_DIR)/Makefile $(RELEASE_DIR)
	cp $(RESOURCES_DIR)/README $(RELEASE_DIR)
	tar -caf "$(RELEASE_DIR).tar.xz" $(RELEASE_DIR)
	rm -rf $(RELEASE_DIR)
