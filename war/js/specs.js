// specs.js
// List of block specifications
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

var specs = [
["control", '#7C7C7C',
	["@playIcon",					"h", "prim_runonce"],
	["@playIconLoop",				"h", "prim_runforever"],
	["repeat %n",					"c", "prim_repeat",				10],
	["if %b",						"c", "prim_if"],
	//["if %b",						"e", "IFELSE"],
	["wait %n",						" ", "prim_wait",				1],
	["stop",						" ", "prim_stop"],
],
["brush", '#7C7C7C',
	["move %n",						" ", "prim_translate",			50],
	["move to x %n y %n",			" ", "prim_moveto",				0,50],
	["x",							"r", "prim_x"],
	["y",							"r", "prim_y"],
	["rotate by %n",				" ", "prim_rotate",				30],
	["set rotation %n",				" ", "prim_setrotation",  		90],
	["rotation",					"r", "prim_rotation"],
	["set scale %n %",				" ", "prim_setscale",			200],
	["scale",						"r", "prim_scale"],
	["off canvas?",					"b", "prim_offcanvas"],
],
["shapes", '#7C7C7C',
	["@lineIcon %n",				" ", "prim_line",				50],
	["@lineIcon to x %n y %n",		" ", "prim_lineto",				0,50],
	["@frectIcon w %n h %n",		" ", "prim_fillrect",			30,50],
	["@trectIcon w %n h %n",		" ", "prim_tracerect",			30,50],
	["@fellipseIcon w %n h %n",		" ", "prim_fillellipse",		30,50],
	["@tellipseIcon w %n h %n",		" ", "prim_traceellipse",		30,50],
	["text %s",						" ", "prim_drawtext",			"design"],
	["set brush size %n",			" ", "prim_setbrushsize",		1],
	["brush size",					"r", "prim_brushsize"],
],
["color", '#7C7C7C',
	["set color %p",				" ", "prim_setcolor"],
	["set hue %n",					" ", "prim_setfillhue",			0],
	["set saturation %n",			" ", "prim_setfillsaturation",	100],
	["set lightness %n",			" ", "prim_setfilllightness",	50],
	["set transparency %n",			" ", "prim_setfillalpha",		0],
	["hue",							"r", "prim_fillhue"],
	["saturation",					"r", "prim_fillsaturation"],
	["lightness",					"r", "prim_filllightness"],
	["transparency",				"r", "prim_fillalpha"],
	//["get color at x %n y %n",	" ", "GETCOLORAT",				0, 0],
	//["color at %n %n",			"r", "COLORAT"],
],
["fill", '#7C7C7C',
	["clean",						" ", "prim_clearscreen"],
	["fill background",				" ", "prim_fillscreen"],
],
["numbers", '#7C7C7C',
	["%n + %n",						"r", "prim_plus"],
	["%n - %n",						"r", "prim_minus"],
	["%n * %n",						"r", "prim_product"],
	["%n / %n",						"r", "prim_division"],
	["%n % %n",						"r", "prim_mod"],
	["%n < %n",						"b", "prim_less"],
	["%n = %n",						"b", "prim_equal"],
	["%n > %n",						"b", "prim_greater"],
	["%b and %b",					"b", "prim_and"],
	["%b or %b",					"b", "prim_or"],
	["not %b",						"b", "prim_not"],
	["@diceIcon %n to %n",			"r", "prim_random",				1, 100],
	["round %n",					"r", "prim_round", 				1.5],
],
["mouse", '#7C7C7C',
	["mouse x",						"r", "prim_mousex"],
	["mouse y",						"r", "prim_mousey"],
	["mouse pressed",				"b", "prim_mousedown"],
],
["my Blocks", '#7C7C7C',
	["%v",							"r", "prim_getvar",				"v"],
	["set %v to %n",				" ", "prim_setvar",				"v", 0],
	["change %v by %n",				" ", "prim_changevar",			"v", 1],
	["custom block def",			"h", "prim_proceduredef"],
	["custom block",				" ", "prim_procedure"],
],
["other", '#7C7C7C',
	["@flickrIcon %f",				" ", "prim_flickr"],
	["@colourIcon %s",				" ", "prim_colourlovers",		"love"],
	["camera image",				" ", "prim_cameraimage"],
	["camera motion",				"r", "CAMERAMOTION"],
	["loudness",					"r", "prim_loudness"],
	["push",						" ", "prim_transformpush"],
	["pop",							" ", "prim_transformpop"],
]]

function blockFromSpec(spec, varprocname){
	var b;
	for(var i=0; i < specs.length; i++){
		var list = specs[i];
		for(var j=2; j < list.length; j++){
			var entry = list[j];
			if(jQuery.trim(entry[0]) == jQuery.trim(spec)){
				b = makeCompositeBlock(entry[2], entry[0], entry[1], list[1], varprocname);
			}
		}
	}
	if(b == undefined){
		b = makeCompositeBlock("dummy_prim",spec, ' ', '#FF0000', varprocname);
	}
	return b;
}
