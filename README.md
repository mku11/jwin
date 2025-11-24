# jwin
A simple JavaScript window manager. Create virtual windows with custom HTML content. 
  
Published under MIT License  
   
[![License: MIT](https://img.shields.io/github/license/mku11/jwin.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/mku11/jwin/releases)
[![GitHub Releases](https://img.shields.io/github/downloads/mku11/jwin/latest/total?logo=github)](https://github.com/mku11/jwin/releases)
  
# Features:
* Multiple virtual windows
* Support loading custom HTML content or from URL
* Resizable, Movable, Maximizing, Modal windows supported
* Window icon and title
* Menubar with icon and title for items
* Context menu with icon and title for menu items
* Dialog with confirmation, prompt, single selection
* Password input is also supported.

## Window Examples

1. Include JWin css  
HTML:  
```
<head>
    <link rel="stylesheet" type="text/css" href="assets/js/lib/jwin/assets/css/window.css">
    <link rel="stylesheet" type="text/css" href="assets/js/lib/jwin/assets/css/menubar.css">
    <link rel="stylesheet" type="text/css" href="assets/js/lib/jwin/assets/css/dialog.css">
    <link rel="stylesheet" type="text/css" href="assets/js/lib/jwin/assets/css/context-menu.css">
    <link rel="stylesheet" type="text/css" href="assets/js/lib/jwin/assets/css/theme.css">
</head>
```
  
JS:  
  
1. Import the JWin modules  
```
import { JWindow } from "./jwin/assets/js/jwindow.js";
import { JContextMenu } from "./jwin/assets/js/jcontext_menu.js";
import { JMenuBar, JMenuItem, JMenuSubItem } from "./jwin/assets/js/jmenu_bar.js";
```
  
2. Create a window  
```
// With custom HTML content
let myWindow = await JWindow.createWindow("My Window", htmlContent, isModal);

// Or HTML content from a url
let myWindow = await JWindow.createWindowWithURL("My Window", this.contentURL);

// Or Modal with custom HTML content
let myWindow = await JWindow.createModal("My Modal Window", htmlContent);

// Or modal window with HTML content from a url
let myWindow = await JWindow.createModalWithURL("My Modal Window", this.contentURL);
```

3. Set the window properties  
```
myWindow.setIconPath("assets/images/app_icon.png");
myWindow.setResizable(true);
myWindow.setWidth(800);
myWindow.setHeight(600);
myWindow.enableDraggable(true); // movable window
myWindow.enableDismissable(true); // displays close button
myWindow.enableDismissableOutside(false); // set to true to close window if user clicks outside
```

4. Setup a menu bar  
```
let menuBar = new JMenuBar();
let fileMenuItem = new JMenuItem("fileMenu", "File"); // top level menu dropdown item
menuBar.addMenuItem(fileMenuItem);

// create a clickable sub item
let subItem = new JMenuSubItem(
	"OpenFile",  // unique name for the item if you want to style it with your own css
	"Open File", // label
	"assets/images/open.png", // url icon
	() => { 
		// fired when item clicked
	});
fileMenuItem.addMenuItem(subItem);
// set the menu bar to your window
myWindow.setMenuBar(menuBar);
```

5. Setup a context menu (optional)  
```
let contextMenu = {};
contextMenu["Copy"] = { 
	name: "Copy", 
	icon: "assets/images/copy.png", 
	callback: async () => onCopy() 
};
contextMenu["Delete"] = { 
	name: "Delete", 
	icon: "assets/images/delete.png", 
	callback: async () => onDelete() 
};
myElement.oncontextmenu = (event) => {
	JContextMenu.showContextMenu("Title", contextMenu, 
	event.clientX, event.clientY // coordinates to display the context menu
	);
});
```

6. Show the window  
```
myWindow.show();
```

## Dialog Examples
  
1. Simple notification dialog  
```
new JDialog("Error during initializing: " + e).show();
```

2. Prompt dialog for action with 2 buttons
```
JDialog.promptDialog(
	"Delete", "Delete file?",
	"Ok", () => { 
		// fired when pressed ok
	},
	"Cancel", () => { 
		// fired when pressed cancel 
	});
```

3. Prompt dialog for user input
```
boolean isFilename = true;
boolean readOnly = false;
boolean isPassword = false;
boolean option = "Remember my choice";
JDialog.promptEdit("Upload", "Enter filename:", async (filename, option) => {
		let rememberChecked = option;
	}, isFilename, readOnly, isPassword, option);
```
	
4. Prompt dialog with multple inputs
```
JDialog.promptCredentialsEdit("Login",
	"Enter your credentials",
	["Server name", "User name", "Password"],
	["myserver", "John Doe", ""], // initialvalues
	[false, false, true], // set true if password
	(values) => { // fired when confirmed
		
	});
```

5. Prompt dialog for a single value
```
let sortTypes = ["Name", "Size", "Date"];
JDialog.promptSingleValue("Sort By", sortTypes, 
	-1, // index of the default selection, use -1 for none
	(which) => { // fired when confirmed
	
	});
```
