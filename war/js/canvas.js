// canvas.js
// Low level drawing primitives, mostly AS3
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

var brush = $('<canvas id="brush"></canvas>');
var ctx;
var swidth = 500;
var sheight = 500;
var dpi = 1;
var bm;
	
//var app:DesignBlocks;
//var astage:Sprite;
//var turtlecanvas:DesignBlocksCanvas = DesignBlocks.drawPane;
//var offscreenShape:Shape = DesignBlocks.drawPane.offscreenShape;
//var offscreenBitmapData:BitmapData = DesignBlocks.drawPane.offscreenBitmapData;
var DEGTOR = 2*Math.PI/360;
//var tshape:Shape = new Shape();
//var gridshape:Shape = new Shape();
//var feedbacktext:TextField = new TextField();
//var feedbackcolor:Shape = new Shape();

var penSize;
var penHue;
var penSaturation;
var penLightness;
var penAlpha;
var penRGBColor;
	
var fillHue;
var fillSaturation;
var fillLightness;
var fillAlpha;
var fillRGBColor;
var colours = [];
var lastColour;
	
//var image:Bitmap;
var xcor;
var ycor;
var scaleVal;
var rotateVal;
var transformStack = [];
//var alphaTransform:ColorTransform;

//var cam:Camera;
//var vid:Video;
var camWidth = 320;
var camHeight = 240;
var regionX1 = 0;
var regionY1 = 0;
var regionX2 = 1000;
var regionY2 = 1000;

var loudness = 0;
	
//flickr
var loadingImage = false;
var flickrKeyword = "";
var flickrImage;
 
//function Brush(app:DesignBlocks){
//	setup();
	
//	this.app = app;
	
//	addChild(tshape);
//	setupTurtle();
	
//	addChild(gridshape);
//	setupGrid();
	
//	addChild(feedbacktext);
//	setupFeedbackText();
	
//	addChild(feedbackcolor);
//	setupFeedbackColor();
//}

function initStage(){
	// clear background
	$('#stage')[0].height = 500;
	$('#stage')[0].width = 500;
	$('#stage').attr('onSelectStart','return false');
	$('#stage')[0].addEventListener("touchstart", touchHandler, true);
	$('#stage')[0].addEventListener("touchmove", touchHandler, true);
	$('#stage')[0].addEventListener("touchend", touchHandler, true);
	ctx = $('#stage')[0].getContext('2d');
	ctx.fillStyle = '#FFF';
	ctx.fillRect(0,0,500,500);
	
	// prepare brush
	init_brush();
	setup();
}

function init_brush(){
	//$('#stageHolder').append(brush);
}

/////////////////////////
// DESIGN BLOCKS
/////////////////////////

function setup() {
	//alphaTransform = new ColorTransform();
	setPenSize(1);
	
	setPenHue(0);
	setPenLightness(50);
	setPenSaturation(100);
	setPenAlpha(100);
		
	setFillHue(0);
	setFillLightness(50);
	setFillSaturation(100);
	setFillAlpha(0);
	
	clearscreen();
	
	calcTransform();
	
	updateTurtle();
	setupFeedbackText();
	setupFeedbackColor();
	
	flickrKeyword = "";
}

function changeCanvasSize(){
	dpi=DesignBlocks.drawPane.dpi;
	swidth=DesignBlocks.drawPane.swidth;
	sheight=DesignBlocks.drawPane.sheight;
	offscreenBitmapData = DesignBlocks.drawPane.offscreenBitmapData; 
}

function loadInit(txcor,tycor, pstate, rgb, theading) {
	xcor = txcor;
	ycor = tycor;
	penRGBColor = rgb;
}

/////////////////////////////
// TURTLE & GRID
/////////////////////////////

function setupGrid() {
	gridshape.graphics.lineStyle(3,0x222222,0.10);
	for(var i = -250; i <= 250; i+=50){
		gridshape.graphics.moveTo(primXCor(i),primYCor(250));
		gridshape.graphics.lineTo(primXCor(i),primYCor(-250));
	}
	for(var j = -250; j <= 250; j+=50){
		gridshape.graphics.moveTo(primXCor(-250),primYCor(j));
		gridshape.graphics.lineTo(primXCor(250),primYCor(j));	
	}
}

function setupTurtle() {
	tshape.graphics.lineStyle(3.5,0x333333);
	
	tshape.graphics.moveTo(-7,2.5);
	tshape.graphics.lineTo(0,-5);
	
	tshape.graphics.moveTo(7,2.5);
	tshape.graphics.lineTo(0,-5);
}

function setupFeedbackText() {
	//feedbacktext.x = 8;
	//feedbacktext.y = 10;
	//feedbacktext.text = "";
	//feedbacktext.setTextFormat(new TextFormat("Verdana", 22));
	//feedbackcolor.visible = false;
}

function setupFeedbackColor() {
	//feedbackcolor.x = 20;
	//feedbackcolor.y = 26;
}

function updateTurtle() {
	brush.css('left', primXCor(xcor));
	brush.css('top', primYCor(ycor));
	//tshape.transform.matrix = calcTurtleTransform();
	
	//trace("DesignBlocks.mode = " + DesignBlocks.mode);
	//if(DesignBlocks.feedbackPane != null){
	 //  	if((DesignBlocks.mode == "edit") && DesignBlocks.feedbackPane.nibValue.selected){
	  // 		if(offCanvas()){
	   //			tshape.visible = false;
	   //		}else{
	   //			tshape.visible = true;
	   //		}
	   //	}else{
	   //		tshape.visible = false;
	   //	}
   	//}
}

function print(text) {
	feedbacktext.text = text;
	
	if(feedbackcolor.visible == false){
		feedbackcolor.visible = true;
	}
	
	if(feedbacktext.text.substr(0,7) == "pen hue"){
		feedbackcolor.x = 125;
		var newText = feedbacktext.text.substr(0,9) + "   " + feedbacktext.text.substr(9,feedbacktext.text.length - 9);
		feedbacktext.text = newText;
		feedbackcolor.graphics.clear();
		feedbackcolor.graphics.beginFill(penRGBColor);
		feedbackcolor.graphics.drawCircle(0,0,10);
		feedbackcolor.graphics.endFill();
	}
	
	feedbacktext.setTextFormat(new TextFormat("Verdana", 22));
	feedbacktext.width = feedbacktext.textWidth + 10;
}


/////////////////////////////
// DRAW
/////////////////////////////

function clearTransform() {
	xcor = 0;
	ycor = 0;
	rotateVal = 0;
	scaleVal = 100;
	transformStack = [];
}

function clearscreen() {
	ctx.save();
	ctx.setTransform(1,0,0,1,0,0);
	ctx.globalAlpha = calcAlpha(1.0);
	ctx.fillStyle = '#FFFFFF';
	ctx.fillRect(0,0,500,500);
	ctx.restore();
	
	clearTransform();
	
	// reset colors
	ctx.globalAlpha = calcAlpha(fillAlpha);
  	ctx.fillStyle = hexStringFromColor(fillRGBColor);
  	ctx.strokeStyle = hexStringFromColor(fillRGBColor);
  	ctx.lineWidth = penSize*dpi;
	
    //offscreenBitmapData.draw(offscreenShape);
	//DesignBlocks.needsRedraw = true;
}

function fillscreen() {
	ctx.save();
	ctx.setTransform(1,0,0,1,0,0);
  	ctx.fillStyle = hexStringFromColor(fillRGBColor);
  	ctx.globalAlpha = calcAlpha(fillAlpha);
	ctx.fillRect(0,0,500,500);
	ctx.restore();
	
    //offscreenBitmapData.draw(offscreenShape,null,alphaTransform);
  	//DesignBlocks.needsRedraw = true;
}

function lineTo(ox,oy){
	primDrawLine(xcor,ycor,ox,oy);
    moveTo(ox,oy);
    
    updateTurtle();
}

function drawLine(n){
	var ox = xcor;
	var oy = ycor;
	translate(n);
	primDrawLine(ox,oy,xcor,ycor);
	
	updateTurtle();
}

function primDrawLine(x1,y1,x2,y2) {
	ctx.save();
	ctx.setTransform(1,0,0,1,0,0);
	
	// reset colors
	ctx.globalAlpha = calcAlpha(fillAlpha);
  	ctx.fillStyle = hexStringFromColor(fillRGBColor);
  	ctx.strokeStyle = hexStringFromColor(fillRGBColor);
  	ctx.lineWidth = penSize*dpi;
  	ctx.lineCap = "round";
  	ctx.lineJoin = "round";
  	
  	ctx.beginPath();
  	ctx.moveTo(primXCor(x1), primYCor(y1));
  	ctx.lineTo(primXCor(x2), primYCor(y2));
  	ctx.stroke();
  	ctx.closePath();
  	
	ctx.restore();
  
  	//offscreenBitmapData.draw(offscreenShape);
  	//DesignBlocks.needsRedraw = true;
}

function drawText(s) {
	ctx.fillStyle = hexStringFromColor(fillRGBColor);
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'left';
	ctx.font = 'bold 28px sans-serif';
	calcTransform();
	
	ctx.fillText(s, 0, 0);
	
	//offscreenBitmapData.draw(textField, m, alphaTransform);
  	//DesignBlocks.needsRedraw = true;
}

function drawShape(w, h, t) {	
  	ctx.lineWidth = penSize*dpi;
  	ctx.lineCap = "round";
  	ctx.lineJoin = "round";
  	ctx.strokeStyle = hexStringFromColor(fillRGBColor);
  	ctx.globalAlpha = calcAlpha(fillAlpha);
	calcTransform();
	
	if(t == 'rect'){
		ctx.strokeRect(-(w/2), -(h/2), w*dpi, h*dpi);
	}
	
	if(t == 'ellipse'){
		
		// Ellipse drawing code from:
		// http://canvaspaint.org/blog/2006/12/ellipse/
		// Christopher Clay c.2006
		// http://soup.c3o.org/
		
		var KAPPA = 4 * ((Math.sqrt(2) -1) / 3);

		var rx = w/2;
		var ry = h/2;

		var cx = rx-(w/2);
		var cy = ry-(h/2);

		ctx.beginPath();
		ctx.moveTo(cx, cy - ry);
		ctx.bezierCurveTo(cx + (KAPPA * rx), cy - ry,  cx + rx, cy - (KAPPA * ry), cx + rx, cy);
		ctx.bezierCurveTo(cx + rx, cy + (KAPPA * ry), cx + (KAPPA * rx), cy + ry, cx, cy + ry);
		ctx.bezierCurveTo(cx - (KAPPA * rx), cy + ry, cx - rx, cy + (KAPPA * ry), cx - rx, cy);
		ctx.bezierCurveTo(cx - rx, cy - (KAPPA * ry), cx - (KAPPA * rx), cy - ry, cx, cy - ry);
		ctx.stroke();
		ctx.closePath();
	}
	
	//offscreenBitmapData.draw(offscreenShape,calcTransform());
  	//DesignBlocks.needsRedraw = true;
}

function fillShape(w, h, t) {
	ctx.fillStyle = hexStringFromColor(fillRGBColor);
	ctx.globalAlpha = calcAlpha(fillAlpha);
	calcTransform();
	
	if(t == 'rect'){
		ctx.fillRect(-(w/2), -(h/2), w*dpi, h*dpi);
	}
	
	if(t == 'ellipse'){
		var KAPPA = 4 * ((Math.sqrt(2) -1) / 3);

		var rx = w/2;
		var ry = h/2;

		var cx = rx-(w/2);
		var cy = ry-(h/2);

		ctx.beginPath();
		ctx.moveTo(cx, cy - ry);
		ctx.bezierCurveTo(cx + (KAPPA * rx), cy - ry,  cx + rx, cy - (KAPPA * ry), cx + rx, cy);
		ctx.bezierCurveTo(cx + rx, cy + (KAPPA * ry), cx + (KAPPA * rx), cy + ry, cx, cy + ry);
		ctx.bezierCurveTo(cx - (KAPPA * rx), cy + ry, cx - rx, cy + (KAPPA * ry), cx - rx, cy);
		ctx.bezierCurveTo(cx - rx, cy - (KAPPA * ry), cx - (KAPPA * rx), cy - ry, cx, cy - ry);
		ctx.fill();
		ctx.closePath();
	}
	
	//offscreenBitmapData.draw(offscreenShape,calcTransform());
  	//DesignBlocks.needsRedraw = true;
}

function drawFlickrImage(keyword) {
	if(!(keyword == flickrKeyword)){
		wait = true;
		$('#loadingpane').show();
		flickrKeyword = keyword;
		//loadingImage = true;
		if(keyword.indexOf('.jpg') != -1){
			flickrImage = new Image();
			flickrImage.onload = function() {
				calcTransform();
				ctx.drawImage(flickrImage, 0, 0, flickrImage.width/2, flickrImage.height/2);
			};
			flickrImage.src = keyword;
			wait = false;
			$('#loadingpane').hide();
			return false;
		}else{
			$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags="+keyword+"&tagmode=any&format=json&jsoncallback=?",
				function(data){
					$.each(data.items, function(i,item){
						flickrImage = new Image();
						flickrImage.onload = function() {
							calcTransform();
							ctx.drawImage(flickrImage, 0, 0, flickrImage.width/2, flickrImage.height/2);
						};
						flickrImage.src = item.media.m;
						wait = false;
						$('#loadingpane').hide();
						return false;
						//offscreenBitmapData.draw(image.bitmapData, calcTransform(), alphaTransform);
	  					//DesignBlocks.needsRedraw = true;
	  					//loadingImage = false;
					});
				}
			);
		}
	}else{
		calcTransform();
		ctx.drawImage(flickrImage, 0, 0, 200, 200);
	}
	//if(loadingImage){
	//	app.interp.doYield();
	//	return;
	//}
	//if(image != null){
		//var t:Matrix = calcTransform();
		//t.scale(2,2);
  	//}
}

function drawCameraImage() {
	bm = ctx.createImageData(320, 240);
	var words = getFlashMovie("DesignBlocksMedia").getCameraImage();
	
	// bm.data is array of w x h x 4 octets in RGBA order
	var wordCount = Math.min(words.length, bm.data.length / 4);
	var dst = 0;
	for (var i = 0; i < wordCount; i++)  {
		var argb = words[i];
		bm.data[dst++] = (argb >> 16) & 0xFF;
		bm.data[dst++] = (argb >> 8) & 0xFF;
		bm.data[dst++] = argb & 0xFF;
		bm.data[dst++] = 0xFF;
	}
	
	// WRITE CAMERA IMAGE TO EXTERNAL CANVAS
	var cameraCanvas = document.createElement("canvas");
    cameraCanvas.width = 320;
    cameraCanvas.height = 240;
    var cameraCtx = cameraCanvas.getContext("2d");
    cameraCtx.putImageData(bm, 0, 0);
    
    // PAINT THE EXTERNAL CANVAS TO THE STAGE CANVAS
    calcTransform();
    ctx.drawImage(cameraCanvas, 0, 0);
}

function setRegion(x1, y1, x2, y2){
	regionX1 = x1;
	regionY1 = y1;
	regionX2 = x2;
	regionY2 = y2;
}

function setRegionHue(hue){
	
	var rgbArray = hslToRgb(wrap360(Math.abs(hue)),wrap200(Math.abs(50)),wrap200(Math.abs(50)));
    var r = rgbArray[0];
    var g = rgbArray[1];
    var b = rgbArray[2];
    //var cTransform:ColorTransform = new ColorTransform();
	cTransform.redMultiplier = r / 255;
	cTransform.greenMultiplier = g / 255;
	cTransform.blueMultiplier = b / 255;
	
	//var manipulatedBitmapData:BitmapData = offscreenBitmapData.clone();
	manipulatedBitmapData.draw(offscreenBitmapData.clone(), null, cTransform);
	offscreenBitmapData.copyPixels(manipulatedBitmapData,new Rectangle(regionX1,regionY1,regionX2,regionY2),new Point(regionX1, regionY1));
	//var outline:Shape = new Shape();
	outline.graphics.lineStyle(5,0xFFFFFF);
	outline.graphics.drawRect(regionX1,regionY1,regionX2,regionY2);
	offscreenBitmapData.draw(outline);
  	DesignBlocks.needsRedraw = true;
}

function setRegionDark(){
	
	var rgbArray = hslToRgb(wrap360(Math.abs(0)),wrap200(Math.abs(50)),wrap200(Math.abs(50)));
    var r = rgbArray[0];
    var g = rgbArray[1];
    var b = rgbArray[2];
    //var cTransform:ColorTransform = new ColorTransform();
	cTransform.redMultiplier = g / 255;
	cTransform.greenMultiplier = g / 255;
	cTransform.blueMultiplier = g / 255;
	
	//var manipulatedBitmapData:BitmapData = offscreenBitmapData.clone();
	manipulatedBitmapData.draw(offscreenBitmapData.clone(), null, cTransform);
	offscreenBitmapData.copyPixels(manipulatedBitmapData,new Rectangle(regionX1,regionY1,regionX2,regionY2),new Point(regionX1, regionY1));
	//var outline:Shape = new Shape();
	outline.graphics.lineStyle(5,0xFFFFFF);
	outline.graphics.drawRect(regionX1,regionY1,regionX2,regionY2);
	offscreenBitmapData.draw(outline);
  	DesignBlocks.needsRedraw = true;
}

/////////////////////////////
// MOTION
/////////////////////////////

function primXCor(ox) {
	return (swidth/2) + (ox*dpi);
}

function primYCor(oy) {
	return (sheight/2) - (oy*dpi);
}

function moveTo(ox,oy){
    xcor = ox;
    ycor = oy;
    
    updateTurtle();
}

function rotate(n){
	rotateVal = wrap360(rotateVal + n);
	
	updateTurtle();
}

function setrotation(n){
	rotateVal = wrap360(n);
	
	updateTurtle();
}

function scale(n){
	if(n > 0){
		scaleVal = n;
	}else{
		scaleVal = Math.abs(n);
	}
	
	updateTurtle();
}

function translate(n){
	xcor += n*Math.sin(rotateVal*DEGTOR)*(scaleVal/100.0);
    ycor += n*Math.cos(rotateVal*DEGTOR)*(scaleVal/100.0);
    
    updateTurtle();
}

function calcTransform(){
	ctx.setTransform(1,0,0,1,0,0);
	// translate to xcor, ycor
	ctx.translate(primXCor(xcor),primYCor(ycor));
	// rotate
	ctx.rotate(rotateVal*DEGTOR);
	// scale
	ctx.scale(scaleVal/100.0,scaleVal/100.0);
}

function calcTurtleTransform(){
	//var transform:Matrix = new Matrix();
	// rotate
	transform.rotate(rotateVal*DEGTOR);
	// translate to xcor, ycor
	transform.translate(primXCor(xcor),primYCor(ycor));
	return transform;
}

function transformPush() {
	var newTransform = [];
	newTransform.xcor = xcor;
	newTransform.ycor = ycor;
	newTransform.rotateVal = rotateVal
	newTransform.scaleVal = scaleVal;
	transformStack.push(newTransform);
}

function transformPop() {
	var t = transformStack.pop();
	if (t) {
		xcor = t.xcor;
		ycor = t.ycor;
		rotateVal = t.rotateVal;
		scaleVal = t.scaleVal;
	}
}

function offCanvas() {
	if (xcor > 250) return true;
	if (xcor < -250) return true;
	if (ycor > 250) return true;
	if (ycor < -250) return true;
	return false;
}

/////////////////////////////
// CAMERA/MICROPHONE
/////////////////////////////

function setupCamera() {
	cam = Camera.getCamera();
	if(cam != null){
		cam.setMode(camWidth,camHeight,30);
		vid = new Video(camWidth,camHeight);
		vid.attachCamera(cam);
		cam.setMotionLevel(0, 0);
		cam.addEventListener(ActivityEvent.ACTIVITY, camActivityHandler);
	}
}

function camActivityHandler(e) {
	// this handler must exist so that activityLevel will be reported
}

function getCameraMotion() {
	if (!cam) {
		setupCamera();
	}
	return cam.activityLevel;
}

function getLoudness() {
	return getFlashMovie("DesignBlocksMedia").getLoudness();
}

function getFlashMovie(movieName){
	var isIE = navigator.appName.indexOf("Microsoft") != -1;
	return (isIE) ? window[movieName] : document[movieName];
}

function showDialog(){
	$('#DesignBlocksMedia').css('visibility', 'visible');
}

function hideDialog(){
	$('#DesignBlocksMedia').css('visibility', 'hidden');
}

/////////////////////////////////
// PEN HSLA
/////////////////////////////////

function setPenSize(ps) {
	penSize = ps;
}

function setPenHue(h) {
	penHue = h;
	setPenRGBColor();
}

function setPenSaturation(s) {
	penSaturation = s;
	setPenRGBColor();
}

function setPenLightness(l) {
	penLightness = l;
	setPenRGBColor();
}

function setPenAlpha(a) {
	if(a < 0) a *= -1;
	penAlpha = a;
}

function setPenRGBColor() {
    var rgbArray = hslToRgb(wrap360(Math.abs(penHue)),wrap200(Math.abs(penSaturation)),wrap200(Math.abs(penLightness)));
    penRGBColor = (rgbArray[0] << 16) + (rgbArray[1] << 8) + rgbArray[2];
}

/////////////////////////////////
// FILL HSLA
/////////////////////////////////
	
function setFillHue(h) {
	fillHue = h;
	setFillRGBColor();
}

function setFillSaturation(s) {
	fillSaturation = s;
	setFillRGBColor();
}

function setFillLightness(l) {
	fillLightness = l;
	setFillRGBColor();
}

function setFillAlpha(a) {
	if(a < 0) a *= -1;
	fillAlpha = a;
	calcAlpha(fillAlpha);
}

function setFillRGBColor() {
    var rgbArray = hslToRgb(wrap360(Math.abs(fillHue)),wrap200(Math.abs(fillSaturation)),wrap200(Math.abs(fillLightness)));
    fillRGBColor = (Math.round(rgbArray[0]) << 16) + (Math.round(rgbArray[1]) << 8) + Math.round(rgbArray[2]);
}

function setColour(keyword) {
	if(lastColour != keyword){
		$.getJSON("http://www.colourlovers.com/api/colors/top?keywordExact=1&orderCol=score&sortBy=asc&keywords="+keyword+'&format=jsonp&jsonCallback=?',
			function(data) {
				colours = [];
				$.each(data, function(i,color){
					colours[i] = color.hex;
				});
				setRandomColour();
			}
		);
		lastColour = keyword;
	}else{
		setRandomColour();
	}
}

function getColorAt(x, y) {
	var p = DesignBlocks.drawPane.onscreenBitmapData.getPixel(primXCor(x), primYCor(y));
	setColorFromHex(p);
}

function setRandomColour() {
	var randomColour = 0 + parseInt(Math.random() * ((19 + 1) - 0));
	setColorFromHex('0x' + colours[randomColour]);
}

function setColorFromHex(hex) {
	var r = ((hex & 0xFF0000) >> 16);
	var g = ((hex & 0x00FF00) >> 8);
	var b = ((hex & 0x0000FF));
	var hsl = this.rgbToHsl(r,g,b);
	this.setFillHue(hsl[0]*360);
	this.setFillSaturation(hsl[1]*100);
	this.setFillLightness(hsl[2]*100);
}

function colorAt(ox, oy) {
	return offscreenBitmapData.getPixel(primXCor(ox), primYCor(oy));
}

/////////////////////////////////
// COLOR UTILS
/////////////////////////////////

function wrap200(n){
    n = Math.round(n);
    n %= 200;
    if (n>99) n=199-n;
    return n;
}

function wrap100(n){
    n = Math.round(n);
    n %= 100;
    return n;
}

function wrap360(n){
    n %= 360;
    return n;
}

function hexStringFromColor(c){
	var t = c.toString(16);
	var l = t.length
  	if(t.length < 6){
  		for(var i = 0; i < (6-l); i++){
  			t = '0'+t;
  		}
  	}
  	return '#'+t;
}

function hslToRgb(H,S,L) {  
    var p1;  
    var p2;  
    var rgb = new Array(3);
    
    S /= 100.0;
    L /= 100.0;
    
    if (L <= 0.5)
    	p2 = L*(1+S);  
    else
    	p2 = L+S-(L*S);  
  
    p1 = 2*L-p2;  
  
    if (S == 0) {  
        rgb[0] = L;  
        rgb[1] = L;  
        rgb[2] = L;  
    } else {  
        rgb[0] = toRgb(p1, p2, H+120);  
        rgb[1] = toRgb(p1, p2, H);  
        rgb[2] = toRgb(p1, p2, H-120);  
    }  
    rgb[0] *= 255;  
    rgb[1] *= 255;  
    rgb[2] *= 255;
    return rgb;  
}
  
function toRgb(q1, q2, hue) {  
    if (hue>360) hue = hue-360;  
    if (hue<0) hue = hue+360;  
    if (hue<60) return (q1+(q2-q1)*hue/60);  
    else if (hue<180) return (q2);  
    else if (hue<240) return (q1+(q2-q1)*(240-hue)/60);  
  
    return (q1);  
}

function rgbToHsl(r, g, b){
    r = r/255, g = g/255, b = b/255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
 
    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
 
    return [h, s, l];
}

function calcAlpha(alpha) {
	return (1.0 - (wrap200(alpha)/100));
}
