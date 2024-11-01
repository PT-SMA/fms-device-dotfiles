#!/bin/bash

echo "Installing necessary packages"

sudo pacman -Sy stow eza bat git starship curl vim gtk3 xorg-xwayland sway swaybg wmenu foot

echo "Deleting dotfiles"
rm ~/.bashrc
rm -rf ~/.config
rm .vimrc

stow bash
stow config
stow vim 

echo "Completed!"
