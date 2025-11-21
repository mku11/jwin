/*
MIT License

Copyright (c) 2021 Max Kas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { Window } from "./window.js";

/**
 * Class used to display a context menu
 */
export class ContextMenu extends Window {
    static htmlURL = import.meta.resolve("../../context_menu.html");

    /**
     * Instantiate a context menu.
     * DO NOT USE this directly, instead use the static method ContextMenu.showContextMenu()
     * @param {} root The root element inside the window
     */
    constructor(root) {
        super(null, root);
        this.root = root;
        this.enableDraggable(false);
        this.enableDismissable(false);
        this.enableDismissableOutside(true);
    }

    /**
     * Display a context menu
     * @param {string} title 
     * @param {any[]} menu 
     * @param {number} x The x coordinate for the window to display
     * @param {number} y The y coordinate for the window to display
     */
    static showContextMenu(title, menu, x, y) {
        setTimeout(() => {
            fetch(ContextMenu.htmlURL).then(async (response) => {
                let docBody = document.getElementsByTagName("body")[0];
                var div = document.createElement('div');
                div.id = "modal-" + Math.floor(Math.random() * 1000000);
                div.innerHTML = await response.text();
                let contextMenuDiv = div.getElementsByClassName('context-menu-content')[0];
                for(let [k,v] of Object.entries(menu)) {
                    let menuItemDiv = document.createElement('a');
                    let menuItemImage = document.createElement("img");
                    let menuItemText = document.createTextNode(v.name);
                    menuItemImage.classList.add("menu-item-image");
                    menuItemImage.classList.add("context-menu-item-image");
                    menuItemImage.src = v.icon;
                    menuItemDiv.style.cursor = "pointer";
                    menuItemDiv.appendChild(menuItemImage);
                    menuItemDiv.onclick = () => {
                        dialog.hide();
                        v.callback();
                    };
                    menuItemDiv.append(menuItemText);
                    contextMenuDiv.appendChild(menuItemDiv);
                }
                docBody.appendChild(div);
                let dialog = new ContextMenu(div);

                dialog.setTitle(title);
                dialog.show();
                dialog.getModal().style.left = x + "px";
                dialog.getModal().style.top = y + "px";
            });
        });
    }

    setupControls() {
        super.setupControls();
        this.modal.style.resize = "none";
    }
}