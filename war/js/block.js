// block.js
// Creates, draws and lays out blocks
//
// Copyright (c) 2010 Evelyn Eastmond <evelyn@media.mit.edu>
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

//////////////////////
// CREATE BLOCK
//////////////////////

function makeCompositeBlock(prim, spec, type, color, varprocname){

	// COLOR HACK
	if((prim == "LOUDNESS") ||
	   (prim == "CAMERAIMAGE") ||
	   (prim == "CAMERAMOTION") ||
	   (prim == "FLICKR") ||
	   (prim == "prim_flickr")){
		color = "#A00000";
	}

	var block = $('<div class="block"></div>');
	block[0].prim = prim;
	block[0].spec = spec;
	block[0].type = type;
	block[0].color = color;
	block[0].fcn = window[prim];
	block.attr('onSelectStart','return false');
	var shape = $('<canvas onclick="void(0)" class="shape"></canvas>'); // for iPhone: onclick = "void(0)"
	block.append(shape);
	shape.css('z-index', 0);
	
	// PARSE PROCEDURE
	if((block[0].prim == 'prim_procedure') || (block[0].prim == 'prim_proceduredef')){
		var label = $('<div class="label">'+varprocname+'</div>');
		label.attr('onSelectStart','return false'); //avoid text selection on browser other then Mozilla
		block.append(label);
		block[0].procname = varprocname;
	}else{
	// PARSE SPEC
		var specArray = spec.split(" ");
		for(s in specArray){
			var p = specArray[s];
			if((p.charAt(0) == '%') && (p.length != 1)){
				// ARGUMENT
				var arg;
				if(p.charAt(1) == 'n'){
					arg = $('<input class="arg" value="10" />');
					arg[0].type = 'text';
					arg[0].fcn = window['prim_number'];
				}
				if(p.charAt(1) == 'p'){
					arg = $('<input class="arg" value="10" />');
					arg[0].type = 'text';
					arg[0].fcn = window['prim_number'];
				}
				if(p.charAt(1) == 's'){
					arg = $('<input class="arg" value="10" />');
					arg[0].type = 'text';
					arg[0].fcn = window['prim_number'];
				}
				if(p.charAt(1) == 'b'){
					arg = $('<div class="arg"><canvas class="boolean" /></div>');
					arg.css('z-index', 1);
					arg[0].type = 'text';
					arg[0].fcn = window['prim_boolean'];
				}
				if(p.charAt(1) == 'f'){
					arg = $('<input class="arg" value="10" />');
					arg[0].type = 'text';
					arg[0].fcn = window['prim_number'];
				}
				if((p.charAt(1) == 'v') && (spec == 'set %v to %n')){
					var varLabel = $('<div class="arg">v</div>');
					varLabel.attr('onSelectStart','return false');
					block.append(varLabel);
					block[0].varname = varprocname;
				}
				if((p.charAt(1) == 'v') && (spec == 'change %v by %n')){
					var varLabel = $('<div class="arg">v</div>');
					varLabel.attr('onSelectStart','return false');
					block.append(varLabel);
					block[0].varname = varprocname;
				}
				if((p.charAt(1) == 'v') && (spec == '%v')){
					var varLabel = $('<div class="label">'+varprocname+'</div>');
					varLabel.attr('onSelectStart','return false');
					block.append(varLabel);
					block[0].varname = varprocname;
				}
				
				if(arg != undefined){
					block.append(arg);
					arg.keydown(function() {
						layoutArg($(this));
						layoutStack($(this).parents('.stack'));
					});
				}
			}else if(p.charAt(0) == '@'){
				// ICON
				var icon = getIcon(p.substring(1,p.length));
				if(icon!= null){
					icon.css('z-index', 5);
					block.append(icon);
					icon.attr('onSelectStart','return false'); //avoid text selection on browser other then Mozilla
					icon.attr('onDragStart','return false'); //avoid image drag
				}else{
					var label = $('<div class="label">'+p+'</div>');
					label.attr('onSelectStart','return false'); //avoid text selection on browser other then Mozilla
					block.append(label);
				}
			}else{
				// LABEL
				var label = $('<div class="label">'+p+'</div>');
				label.attr('onSelectStart','return false'); //avoid text selection on browser other then Mozilla
				block.append(label);
			}
		}
	}
	
	return block;
}

//////////////////////
// LAYOUT BLOCK
//////////////////////

function layoutBlock(block){
	// recurse first
	block.children('.block').each(function(i) {
		layoutBlock($(this));
	});
	
	var curh = 14; 									// block min height
	var top = (block[0].type == 'h') ? 9 : 0;		// block top padding
	var curw = 5;  									// block left padding
	switch(block[0].type) {       
        case 'r': curw = 7; break;
        case 'b': curw = 8; break;
        default: curw = 5;
	}
	
	// measure all args
	block.children('.arg').each(function(i) {
		layoutArg($(this));
	});
	
	// DRAW BOOLEAN ARG SHAPE
	block.children('[class!=shape]').each(function(i) {
		if($(this).hasClass('arg') && ($(this).children().length > 0)){
			var child = $(this).children()[0];
			$(this).width = 26;
			if(child.tagName == 'CANVAS'){
				child.width = 26;
				child.height = 15;
				var w = 24;
				var h = 12;
				var ctx = child.getContext('2d');
				var color = 'DDDDDD';
				drawBooleanBlockPath(ctx, '#'+colorscale(color, 0.1), w, h, 0, 0);
				drawBooleanBlockPath(ctx, color, w, h, 2, 2);
			}
		}
	});

	// layout horizontally
	block.children('[class!=shape][class!=substack]').each(function(i) {
		var w = $(this)[0].clientWidth;
		//var w = $(this).width;
		var h = $(this)[0].clientHeight;
		//var h = $(this).height();
		if($(this)[0].tagName == 'INPUT'){
			w += 2;
			h += 2;
		}
		// measure height
		if(h > curh){
			curh = h;
		}
		
		$(this).css('left', curw);
		if($(this).hasClass('arg')){
			curw += (w + 6);
		}else{
			curw += (w + 3);
		}
	});
	curh += 4;
	
	// layout vertically
	block.children('[class!=shape]').each(function(i) {
		var h = $(this)[0].clientHeight;
		//var h = $(this).height();
		$(this).css('top', top + (curh/2) - (h/2) + 2);
		if($(this).hasClass('arg')){
			$(this).css('top', top + parseInt($(this).css('top')) - 2);
		}
	});
	if(block[0].type == 'b'){
		curw += 3;
	}
	if(block[0].type == 'h'){
		if(curh < 18){
			curh = 18;
		}else{
			curh -= 1;
		}
	}
	
	var subStackHeight = 25;
	// substack for c shape
	block.children('.substack').each(function(i) {
		$(this).css('left', 11);
		$(this).css('top', curh + 4);
		layoutStack($(this));
		subStackHeight = Math.max($(this)[0].clientHeight + 12, 25);
		//subStackHeight = Math.max($(this).height() + 12, 25);
	});
	if(block[0].type == 'c'){
		block[0].topHeight = curh;
	}
	
	// DRAW SHAPE
	var shape = block.children('.shape')[0];
	var context = shape.getContext('2d');	// label
	var color = block[0].color;
	
	// DIMENSIONS TO USE
	var w = curw;
	var h = curh;
	var radius = 4;
	var notchIndent = 5;
	var notchWidth = 6;
	var notchRadius = 3;
	if(block[0].type == 'r'){
		notchRadius = 0;
	}
	if(block[0].type == 'c'){
		h += subStackHeight;
	}
	shape.width = w + 2;
	shape.height = h + notchRadius + 3;
	block.css('width', w + 2);
	block.css('height', h + notchRadius + 3);
	if(block[0].type == 'h'){
		shape.height += 10;
		block.css('height', parseInt(block.css('height')) + 10);
		if(w < 100){
			w = 100;
			shape.width = w + 2;
			block.css('width', w + 2);
		}
	}
	
	// DEBUGGING
	//context.fillStyle = '#00F';
	//context.fillRect(0,0, shape.width, shape.height);
	
	// DRAW BLOCK SHAPE
	if(block[0].type == ' '){
		drawCommandBlockPath(context, '#'+colorscale(color, 3), w + 1, h + 2, radius, notchIndent, notchWidth, notchRadius, 0, 0);
		drawCommandBlockPath(context, '#'+colorscale(color, 1.5), w, h, radius, notchIndent, notchWidth, notchRadius, 0, 1);
		drawCommandBlockPath(context, '#'+colorscale(color, 0.3), w + 1, h + 1, radius, notchIndent, notchWidth, notchRadius, 1, 1);
		drawCommandBlockPath(context, color, w, h, radius, notchIndent, notchWidth, notchRadius, 0, 0);
	} else if(block[0].type == 'r'){
		drawReporterBlockPath(context, '#'+colorscale(color, 3), w + 1, h + 2, 0, 0);
		drawReporterBlockPath(context, '#'+colorscale(color, 1.5), w, h, 0, 1);
		drawReporterBlockPath(context, '#'+colorscale(color, 0.3), w + 1, h + 1, 1, 1);
		drawReporterBlockPath(context, color, w, h, 0, 0);
	} else if(block[0].type == 'b'){
		drawBooleanBlockPath(context, '#'+colorscale(color, 3), w + 1, h + 2, 0, 0);
		drawBooleanBlockPath(context, '#'+colorscale(color, 1.5), w, h, 0, 1);
		drawBooleanBlockPath(context, '#'+colorscale(color, 0.3), w + 1, h + 1, 1, 1);
		drawBooleanBlockPath(context, color, w, h, 0, 0);
	} else if(block[0].type == 'h'){
		drawHatBlockPath(context, '#'+colorscale(color, 3), w + 1, h + 2, radius, notchIndent, notchWidth, notchRadius, 0, 10);
		drawHatBlockPath(context, '#'+colorscale(color, 1.5), w, h, radius, notchIndent, notchWidth, notchRadius, 0, 1);
		drawHatBlockPath(context, '#'+colorscale(color, 0.3), w + 1, h + 1, radius, notchIndent, notchWidth, notchRadius, 1, 1);
		drawHatBlockPath(context, color, w, h, radius, notchIndent, notchWidth, notchRadius, 0, 0);
	} else if(block[0].type == 'c'){
		drawCBlockPath(context, '#'+colorscale(color, 3), w + 1, h + 2, radius, notchIndent, notchWidth, notchRadius, 0, 0, subStackHeight);
		drawCBlockPath(context, '#'+colorscale(color, 1.5), w, h, radius, notchIndent, notchWidth, notchRadius, 0, 1, subStackHeight);
		drawCBlockPath(context, '#'+colorscale(color, 0.3), w + 1, h + 1, radius, notchIndent, notchWidth, notchRadius, 1, 1, subStackHeight);
		drawCBlockPath(context, color, w, h, radius, notchIndent, notchWidth, notchRadius, 0, 0, subStackHeight);
	}
}

function layoutArg(arg){
	var mt = $('#measureText');
	mt.html(arg.val());
	mt[0].style.fontSize = 10;
	var width = (mt[0].clientWidth + 8) + "px";
	if(parseInt(width) > 14){
		arg.css('width', width);
	}else{
		//arg.css('width', 14 + "px");
	}
}

//////////////////////
// DRAW BLOCK SHAPE
//////////////////////

function drawCommandBlockPath(c, color, w, h, radius, notchIndent, notchWidth, notchRadius, shiftX, shiftY){
	c.fillStyle = color;
	c.translate(shiftX,shiftY);
	c.beginPath();
	c.arc(radius, radius, radius, (Math.PI/180)*180, (Math.PI/180)*270, false);
	c.arc(radius + notchIndent + notchRadius, 0, notchRadius, (Math.PI/180)*180, (Math.PI/180)*90, true)
	c.arc(radius + notchIndent + notchWidth + notchRadius, 0, notchRadius, (Math.PI/180)*90, (Math.PI/180)*0, true);
	c.arc(w - radius, radius, radius, (Math.PI/180)*270, (Math.PI/180)*360, false);
	c.arc(w - radius, h - radius, radius, (Math.PI/180)*0, (Math.PI/180)*90, false);
	c.arc(radius + notchIndent + notchWidth + notchRadius, h, notchRadius, (Math.PI/180)*0, (Math.PI/180)*90, false);
	c.arc(radius + notchIndent + notchRadius, h, notchRadius, (Math.PI/180)*90, (Math.PI/180)*180, false);
	c.arc(radius, h - radius, radius, (Math.PI/180)*90, (Math.PI/180)*180, false);
	c.fill();
	c.closePath();
}

function drawHatBlockPath(c, color, w, h, radius, notchIndent, notchWidth, notchRadius, shiftX, shiftY){
	c.fillStyle = color;
	c.translate(shiftX,shiftY);
	c.beginPath();
	c.moveTo(0,0);
	c.bezierCurveTo(20, -13, 60, -13, 80, 0);
	c.arc(w - radius, radius, radius, (Math.PI/180)*270, (Math.PI/180)*360, false);
	c.arc(w - radius, h - radius, radius, (Math.PI/180)*0, (Math.PI/180)*90, false);
	c.arc(radius + notchIndent + notchWidth + notchRadius, h, notchRadius, (Math.PI/180)*0, (Math.PI/180)*90, false);
	c.arc(radius + notchIndent + notchRadius, h, notchRadius, (Math.PI/180)*90, (Math.PI/180)*180, false);
	c.arc(radius, h - radius, radius, (Math.PI/180)*90, (Math.PI/180)*180, false);
	c.fill();
	c.closePath();
}

function drawReporterBlockPath(c, color, w, h, shiftX, shiftY){
	c.fillStyle = color;
	c.translate(shiftX,shiftY);
	c.beginPath();
	c.arc(h/2, h/2, h/2, (Math.PI/180)*90, (Math.PI/180)*270, false);
	c.arc(w - (h/2), h/2, h/2, (Math.PI/180)*270, (Math.PI/180)*450, false);
	c.fill();
	c.closePath();
}

function drawBooleanBlockPath(c, color, w, h, shiftX, shiftY){
	c.fillStyle = color;
	c.translate(shiftX,shiftY);
	c.beginPath();
	c.moveTo(0, h/2);
	c.lineTo(h/2, 0);
	c.lineTo(w - (h/2), 0);
	c.lineTo(w, h/2);
	c.lineTo(w - (h/2), h);
	c.lineTo(h/2, h);
	c.fill();
	c.closePath();
}

function drawCBlockPath(c, color, w, h, radius, notchIndent, notchWidth, notchRadius, shiftX, shiftY, subStackHeight){
	var topHeight = h;
	var middleHeight = subStackHeight;
	var bottomHeight = 18;
	var leftWidth = 10;
	c.fillStyle = color;
	c.translate(shiftX,shiftY);
	c.beginPath();
	c.arc(radius, radius, radius, (Math.PI/180)*180, (Math.PI/180)*270, false);
	c.arc(radius + notchIndent + notchRadius, 0, notchRadius, (Math.PI/180)*180, (Math.PI/180)*90, true)
	c.arc(radius + notchIndent + notchWidth + notchRadius, 0, notchRadius, (Math.PI/180)*90, (Math.PI/180)*0, true);
	c.arc(w - radius, radius, radius, (Math.PI/180)*270, (Math.PI/180)*360, false);
	c.arc(w - radius, topHeight - middleHeight - notchRadius, radius, (Math.PI/180)*0, (Math.PI/180)*90, false);
	c.arc(leftWidth + radius + notchIndent + notchWidth + notchRadius, topHeight - middleHeight + 1, notchRadius, (Math.PI/180)*0, (Math.PI/180)*90, false);
	c.arc(leftWidth + radius + notchIndent + notchRadius, topHeight - middleHeight + 1, notchRadius, (Math.PI/180)*90, (Math.PI/180)*180, false);
	c.arc(leftWidth + radius, topHeight - middleHeight + 1 + radius, radius, (Math.PI/180)*270, (Math.PI/180)*180, true);
	c.arc(leftWidth + radius, topHeight - bottomHeight + radius, radius, (Math.PI/180)*180, (Math.PI/180)*90, true);
	c.arc(w - radius + 2, topHeight - bottomHeight + (radius*3), radius, (Math.PI/180)*270, (Math.PI/180)*360, false);
	c.arc(w - radius, topHeight - radius, radius, (Math.PI/180)*0, (Math.PI/180)*90, false);
	c.arc(radius + notchIndent + notchWidth + notchRadius, topHeight, notchRadius, (Math.PI/180)*0, (Math.PI/180)*90, false);
	c.arc(radius + notchIndent + notchRadius, topHeight, notchRadius, (Math.PI/180)*90, (Math.PI/180)*180, false);
	c.arc(radius, topHeight - radius, radius, (Math.PI/180)*90, (Math.PI/180)*180, false);	
	c.fill();
	c.closePath();
}