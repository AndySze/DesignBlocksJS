// runtime.js
// Blocks runtime, cued from the block stacks
//
// Copyright (c) 2010 Playful Invention Company, Evelyn Eastmond <evelyn@media.mit.edu>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var thisBlock;
var stack;
var stacktoloop;
var procs = new Object();
var boxes = new Object();
var wait = false;
var setupstacks;
var playstack;
var cursetupstack;

/////////////////////////
// CONNECTIONS
/////////////////////////

function setupConnections(b){
	if(b == undefined) {return;}
	var blockArray = [];
	if(b.attr('class') == 'stack'){
		b.children('.block').each(function(i) {
			blockArray[i] = this;
		});
	}else{
		blockArray[0] = b[0];
	}
	$(blockArray).each(function(i) {
		var curArg = 1;
		var block = this;
		block.connections = [];
		
		// previous block
		block.connections[0] = $(this).prev()[0];
		
		// arg connections
		if($(block).children('.arg, .block').length > 0){
			$(block).children('.arg, .block').each(function(i) {
				var arg = this;
				block.connections[curArg] = arg;
				if($(this).hasClass('arg')){
					arg.connections = [];
				}
				if($(this).hasClass('block')){
					setupConnections($(arg));
				}
				curArg++;
			});
		}
		
		
		// sub stack connections
		if($(block).children('.substack').length > 0){
			$(block).children('.substack').each(function(i){
				var substack = this;
				block.connections[curArg] = $(substack).children()[0];
				setupConnections($(substack));
				curArg++;
			});
		}
		
		// next block
		if($(block).next().attr('class') == 'block'){
			block.connections[curArg] = $(block).next()[0];
		}else{
			block.connections[curArg] = undefined;
		}
	});
}

function findProcsAndBoxes(){
	$('.block').each(function (i){
		var block = $(this)[0];
		if(block.prim=='prim_proceduredef'){
			procs[block.procname] = block;
		}
		if((block.prim=='prim_setvar') ||
		   (block.prim=='prim_changevar') ||
		   (block.prim=='prim_getvar')){
			boxes[block.varname] = 0;
		}
	});
}

/////////////////////////
// STATE MACHINE
/////////////////////////

function play(){
	setup();
	$('#playButton').attr('src', 'images/playGreen.png');
	
	// attach all procedure defs
	findProcsAndBoxes();
	var procStacks = findProcStacks();
	$(procStacks).each(function(i){
		setupConnections($(this));
	});
	
	// find all setup stacks
	setupstacks = findSetupStacks();
	
	// find first play stack
	playstack = $(findPlayStacks())[0];
	
	// run first setupstack
	if(setupstacks.length > 0){
		cursetupstack = 0;
		runStack($(setupstacks)[cursetupstack]);
	}else{
		if(playstack != undefined){
			runStack(playstack);
		}
	}
}

function stop(){
	$('#playButton').attr('src', 'images/playGray.png');
	stacktoloop = undefined;
	thisBlock = undefined;
	if(stack != undefined) while((stack.length>0)&&(stack[stack.length-1]!=procDone)) stack.pop();
}

function runStack(b){
	if(b == undefined){return;}
	setupConnections(b);
	stack = new Array();
	thisBlock = b.children()[0];
	stacktoloop = b;
	if(b.children('.block')[0].spec == '@playIconLoop'){
		loopSome();
	}else{
		runSome();
	}
}

function runSome(){
	for(var i=0;i<200;i++){
		if(wait) break;
		while(thisBlock!=undefined){
			var b = thisBlock;
			thisBlock = thisBlock.connections[thisBlock.connections.length-1];
			b.fcn(b);
			if(wait) break;
		};
		if(!wait){
			if(stack.length==0) break;
			stack.pop()();
		}
	}
	if (stack.length>0||thisBlock!=undefined) setTimeout(runSome, 20);
	if((thisBlock == undefined) && (stack.length == 0)){
		cursetupstack += 1;
		if(cursetupstack < setupstacks.length){
			runStack($(setupstacks)[cursetupstack]);
		}else{
			if(playstack != undefined){
				runStack(playstack);
			}else{
				// nothing more to run
				$('#playButton').attr('src', 'images/playGray.png');
			}
		}
	}
}

function loopSome(){
	if(stacktoloop == undefined){return;}
	for(var i=0;i<200;i++){
		if(wait) break;
		while(thisBlock!=undefined){
			var b = thisBlock;
			thisBlock = thisBlock.connections[thisBlock.connections.length-1];
			b.fcn(b);
			if(wait) break;
		};
		if(!wait){
			if(stack.length==0) break;
			stack.pop()();
		}
	}
	//if (stack.length==0||thisBlock==undefined){
	if (thisBlock==undefined){
		thisBlock = stacktoloop.children()[0];
	}
	setTimeout(loopSome, 10);
}

function prim_wait(b){
	wait = true;
	setTimeout(clearWait, getarg(b,1)*1000);
}

function clearWait(){
	wait = false;
}

function getarg(p,dockn){
	var block = p.connections[dockn];
	return block.fcn(block);
}

/////////////////////////
// FLOW
/////////////////////////

function prim_repeat(b){
	var n = Math.floor(getarg(b,1));
	if(n<1) return;
	stack.push(thisBlock);
	stack.push(n);
	thisBlock = b.connections[2];
	stack.push(thisBlock);
	stack.push(repeatAgain);
}

function repeatAgain(){
	var b = stack.pop();
	var n = stack.pop();
	n--;
	if(n>0){
		stack.push(n);
		thisBlock = b;
		stack.push(thisBlock);
		stack.push(repeatAgain);
	}
	else thisBlock=stack.pop();
}

function prim_vspace(b){}

function prim_forever(b){
	thisBlock = b.connections[1]
	stack.push(thisBlock);
	stack.push(foreverAgain);
}

function foreverAgain(){
	thisBlock = stack[stack.length-1];
	stack.push(thisBlock);
	stack.push(foreverAgain);
}

function prim_stop(b){
	stop();
}

function prim_if(b){
	var bool = getarg(b,1);
	if(bool){
		stack.push(thisBlock);
		stack.push(ifDone);
		thisBlock = b.connections[2];	
	}
}

function ifDone(){thisBlock=stack.pop();}

/////////////////////////
// NUMBERS
/////////////////////////

function prim_number(b){
	if(isNaN(parseFloat(b.value))){
		return b.value;
	}
	return parseFloat(b.value);
}

function prim_plus(b){return getarg(b,1) + getarg(b,2);}
function prim_minus(b){return getarg(b,1) - getarg(b,2);}
function prim_product(b){return getarg(b,1) * getarg(b,2);}
function prim_division(b){return getarg(b,1) / getarg(b,2);}
function prim_mod(b){return getarg(b,1) % getarg(b,2);}

function prim_less(b){return getarg(b,1)<getarg(b,2);}
function prim_greater(b){return getarg(b,1)>getarg(b,2);}
function prim_equal(b){return getarg(b,1)==getarg(b,2);}

function prim_random(b){return pickRandom(getarg(b, 1), getarg(b, 2));}
function prim_oneof(b){return Math.random()<.5 ? getarg(b, 1) : getarg(b, 2);}
function prim_round(b){return Math.round(getarg(b,1));}

function prim_and(b){return (getarg(b,1) && getarg(b,2));}
function prim_or(b){return (getarg(b,1) || getarg(b,2));}
function prim_not(b){return !getarg(b,1);}

/////////////////////////
// MY BLOCKS
/////////////////////////

function prim_setvar(b){boxes[b.varname] = getarg(b,2);}
function prim_getvar(b){return boxes[b.varname];}
function prim_changevar(b){boxes[b.varname] = (boxes[b.varname] + getarg(b,2));}

function prim_proceduredef(b){}
function prim_procedure(b){
	stack.push(thisBlock);
	stack.push(procDone);
	thisBlock=procs[b.procname];
}
function procDone(){thisBlock=stack.pop();}

/////////////////////////
// LOW LEVEL
/////////////////////////

function pickRandom(a,b){
	ia = Math.floor(a);
	ib = Math.floor(b);
	if((a==ia)&&(b==ib)) return a+(Math.floor(Math.random()*(b-a+1)));
	else return a+(Math.random()*(b-a));
}

function rad(a){return a*2*Math.PI/360;}
function sindeg(x){return Math.sin(x*2*Math.PI/360);}
function cosdeg(x){return Math.cos(x*2*Math.PI/360);}
Number.prototype.mod = function(n) {return ((this%n)+n)%n;}

/////////////////////////
// DESIGN BLOCKS
/////////////////////////

function prim_runonce(b){}
function prim_runforever(b){}

function prim_setcolor(b){setColorFromHex(getarg(b,1));}
function prim_setfillhue(b){setFillHue(getarg(b,1));}
function prim_setfillsaturation(b){setFillSaturation(getarg(b,1));}
function prim_setfilllightness(b){setFillLightness(getarg(b,1));}
function prim_setfillalpha(b){setFillAlpha(getarg(b,1));}
function prim_fillhue(b){return fillHue;}
function prim_fillsaturation(b){return fillSaturation;}
function prim_filllightness(b){return fillLightness;}
function prim_fillAlpha(b){return fillAlpha;}

function prim_fillscreen(b){fillscreen();}
function prim_clearscreen(b){clearscreen();}

function prim_translate(b){translate(getarg(b,1));}
function prim_moveto(b){moveTo(getarg(b,1), getarg(b,2));}
function prim_rotate(b){rotate(getarg(b,1));}
function prim_setrotation(b){setrotation(getarg(b,1));}
function prim_setscale(b){scale(getarg(b,1));}
function prim_x(b){return xcor;}
function prim_y(b){return ycor;}
function prim_rotation(b){return rotateVal;}
function prim_scale(b){return scaleVal;}
function prim_offcanvas(b){return offCanvas();}

function prim_line(b){drawLine(getarg(b,1));}
function prim_lineto(b){lineTo(getarg(b,1), getarg(b,2));}
function prim_setbrushsize(b){setPenSize(getarg(b,1));}
function prim_brushsize(b){return penSize;}
function prim_drawtext(b){drawText(getarg(b,1));}
function prim_fillrect(b){fillShape(getarg(b,1), getarg(b,2), 'rect');}
function prim_tracerect(b){drawShape(getarg(b,1), getarg(b,2), 'rect');}
function prim_fillellipse(b){fillShape(getarg(b,1), getarg(b,2), 'ellipse');}
function prim_traceellipse(b){drawShape(getarg(b,1), getarg(b,2), 'ellipse');}

function prim_mousex(b){return (((mousex - $('#stage').offset().left) - (swidth/2))/dpi);}
function prim_mousey(b){return (((sheight/2) - (mousey - $('#stage').offset().top))/dpi);}
function prim_mousedown(b){return mousedown;}

function prim_colourlovers(b){setColour(getarg(b,1));}
function prim_transformpush(b){transformPush();}
function prim_transformpop(b){transformPop();}
function prim_flickr(b){drawFlickrImage(getarg(b,1));}
function prim_loudness(b){return getLoudness();}
function prim_cameraimage(b){drawCameraImage();}
