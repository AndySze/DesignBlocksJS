DesignBlocksJS
Evelyn Eastmond (c) 2010
evhan55@gmail.com
evelyneastmond.com

This is the code for the http://designblocksjs.appspot.com website.
DesignBlocks is a Scratch-like (scratch.mit.edu) interface for a Processing-like (processing.org) environment.

This code is meant to be run in Eclipse with the Google Web Toolkit (GWT) and Google App Engine (GAE) plugins.  The code has not been updated since 2010 so the dependencies are out of date.

The DesignBlocksJS website code relies on a sample set of projects and users on a database stored in Google App Engine (GAE).  To connect it to another set of users, you need to change which server this is connected to.  The server protocol is not currently documented.

The /src directory just points to a servlet for GAE to serve the HTML5 code.
The bulk of the HTML5 code is in the /war folder.

Disclaimers:
- There are bugs in some of the blocks
- Unknown support for all IE browsers (relies on <canvas>)
- Blocks in red, variable setters/getters and procedure blocks are all mostly broken
- Ctrl + and Ctrl - work nicely in Chrome and Safari but not the most recent Firefox
- You can't yet save or login, or create new variables or procedures
- You might see a small Flash app in the source, it's only invoked through the camera/loudness blocks


***********
app.js
***********
This is the main code for the application.

***********
block.js
***********
This is the main block drawing and rendering code.

***********
canvas.js
***********
This is the main code for the drawing pane, containing the low level drawing primitives.

***********
icons.js
***********
Loads icon files.

***********
runtime.js
***********
This is the main runtime code for the blocks, relying heavily on a 'connections' array.

***********
site.js
***********
This is the main layout code for the website layout.

***********
specs.js
***********
Main specification/definition file for the blocks in the system.











