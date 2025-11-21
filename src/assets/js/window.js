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

let visibleWindows = new Set();

/**
 * Class used to display a window
 */
export class Window {
    static modalUrl = import.meta.resolve("../../modal.html");
    static zIndex = 0;
    static #defaultIconPath;

    root;
    icon;
    modal;
    closeButton;
	titleBar;
    title;
    content;
    onClose;
    onShow;
    isDraggable;
    isDismissable;
    isDismissableOutside;
	isModal = false;
	
    /**
     * Instantiate a window
     * DO NOT USE this directly, instead use the static methods like Window.createWindow()
     * @param {string} content The html content of the window
     * @param {any} root The root element inside the window
     */
    constructor(content, root) {
        this.root = root;
        this.setupControls();
        this.setupIcon();
        this.setupEventListeners();
        this.setContent(content);
        this.enableDraggable(true);
        this.enableDismissable(true);
        this.enableDismissableOutside(false);
    }
    
    getRoot() {
        return this.root;
    }

    getModal() {
        return this.modal;
    }
    
    static setDefaultIconPath(iconPath) {
        Window.#defaultIconPath = iconPath;
    }

    static getDefaultIcon() {
        return Window.#defaultIconPath;
    }

    
    setIconPath(iconPath) {
        this.icon.src = iconPath;
    }

    getIconPath() {
        return this.icon.src;
    }

    setupIcon() {
        this.icon.src = Window.#defaultIconPath;
    }

    /**
     * 
     * @param {string} title The title of the window
     * @param {string} url The url that contains the html content in the window
     * @returns The window
     */
    static async createModalWithURL(title, url) {
		return Window.createWindowWithURL(title, url, true);
    }

    /**
     * 
     * @param {string} title The title of the window
     * @param {string} content The html content of the window
     * @returns The window
     */
    static async createModal(title, content) {
		return Window.createWindow(title, content, true);
    }

    /**
     * 
     * @param {string} title 
     * @param {string} url The url that contains the html content in the window
     * @returns The window
     */
    static async createWindowWithURL(title, url) {
        return new Promise((resolve, reject) => {
            fetch(url).then(async (response) => {
                let content = await response.text();
		        let window = Window.createWindow(title, content, true);
                resolve(window);
            });
        });
    }

    /**
     * 
     * @param {string} title The title of the window
     * @param {*} content The html content of the window
     * @param {boolean} isModal True if window should be modal
     * @returns 
     */
	static async createWindow(title, content, isModal = false) {
        return new Promise((resolve, reject) => {
            fetch(Window.modalUrl).then(async (response) => {
                let docBody = document.getElementsByTagName("body")[0];
                var div = document.createElement('div');
                div.id = "modal-" + Math.floor(Math.random() * 1000000);
                div.innerHTML = await response.text();
                docBody.appendChild(div);
                let window = new Window(content, div);
				window.isModal = isModal;
                window.setTitle(title);
                resolve(window);
            });
        });
    }

    setupControls() {
        this.modal = this.root.getElementsByClassName("modal")[0];
        this.icon = this.root.getElementsByClassName("modal-icon")[0];
		this.titleBar = this.root.getElementsByClassName("modal-title-bar")[0];
        this.title = this.root.getElementsByClassName("modal-title")[0];
        this.closeButton = this.root.getElementsByClassName("modal-close")[0];
        this.content = this.root.getElementsByClassName("modal-window-content")[0];
    }

    setupEventListeners() {
        let dialog = this;
        this.closeButton.onclick = function () {
            dialog.hide();
        }
		this.setDraggable(this.titleBar);
	}

	setDraggable(el) {
		let down;
		let dx,dy;
		let modalWindow = this;
	
		el.addEventListener('mousedown', function(e) {
            if(!modalWindow.isDraggable)
                return;
			event.preventDefault();
			down = true;
			dx = modalWindow.modal.offsetLeft - e.clientX;
			dy = modalWindow.modal.offsetTop - e.clientY;
			// set the global listener to prevent interruptions
			document.onmouseup = stopMoveElement;
			document.onmousemove = moveElement;
		}, true);

		function moveElement(event) {
            if(!modalWindow.isDraggable)
                return;
			if (down) {
				modalWindow.modal.style.left = (event.clientX + dx) + 'px';
				modalWindow.modal.style.top  = (event.clientY + dy) + 'px';
			}
			event.preventDefault();
		}
		
		function stopMoveElement(event) {
            if(!modalWindow.isDraggable)
                return;
			event.preventDefault();
			down = false;
			// reset the global listener
			document.onmouseup = null;
			document.onmousemove = null;			
		}
    }

    /**
     * Allow the windows to be dragged
     * @param {boolean} value True to be able to drag the window
     */
    enableDraggable(value) {
        this.isDraggable = value;
        if(value === true)
            this.titleBar.style.cursor = "move";
        else
            this.titleBar.style.cursor = "auto";
    }

    /**
     * Allow the windows to be closed
     * @param {boolean} value True to be dismissed
     */
    enableDismissable(value) {
        this.isDismissable = value;
        if(value === true)
            this.closeButton.style.display = "block";
        else
            this.closeButton.style.display = "none";
    }

    /**
     * Allow the window to be closed when a click outside is detected
     * @param {boolean} value True to be dismissed
     */
    enableDismissableOutside(value) {
        this.isDismissableOutside = value;
    }

    setContent(content) {
        if(content != null) {
            var div = document.createElement('div');
            div.innerHTML = content;
            this.content.appendChild(div);
        }
    }

    /**
     * Set the title
     * @param {string} title The title
     */
    setTitle(title) {
        this.title.innerText = title;
    }

    /**
     * Display the window
     */
    show() {
        this.modal.style.display = "block";
        Window.zIndex += 2;
        this.modal.style.zIndex = Window.zIndex;
		if(this.isModal)
	        this.disableSiblings(true);
        visibleWindows.add(this);
        if(this.onShow != null)
            this.onShow();
    }

    /**
     * Close the window
     */
    hide() {
        this.modal.style.display = "none";
		if(this.isModal)
	        this.disableSiblings(false);
        this.modal.parentElement.parentElement.removeChild(this.modal.parentElement);
        Window.zIndex -= 2;
        visibleWindows.delete(this);
        if(this.onClose != null)
            this.onClose();
    }

    disableSiblings(value) {
        let parent = this.modal.parentElement.parentElement;
        for(let i = parent.childNodes.length - 1; i >= 0; i--) {
            let element = parent.childNodes[i];
            if(element.style && element != this.modal.parentElement) {
                if(value) {
                    element.classList.add("is-disabled");
                } else {
                    element.classList.remove("is-disabled");
                }
                break;
            }
        }
    }
}

window.addEventListener("click", function(event) {
    for(let modalWindow of visibleWindows) {
		if(!modalWindow.isDismissableOutside)
			continue;
        if(!contains(modalWindow.getRoot(), event.target)) {
            modalWindow.hide.call(modalWindow);
        }
    }
});

function contains(parent, el) {
    while(el) {
        if(parent == el)
            return true;
        el = el.parentElement;
    }
    return false;
}