DesignBlocksJS
Evelyn Eastmond
evelyn@media.mit.edu

The DesignBlocksJS website code relies on a sample set of projects and users on a database stored in GoogleAppEngine.  To connect it to another set of users, you need to change which server this is connected to.  The server protocol is not currently documented.

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











