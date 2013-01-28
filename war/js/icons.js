// icons.js
// Loads icons
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

var icons = [
['playIcon', 'images/playIcon.png'],
['playIconLoop', 'images/playIconLoop.png'],
['lineIcon', 'images/line.png'],
['fellipseIcon', 'images/fellipse.png'],
['tellipseIcon', 'images/tellipse.png'],
['frectIcon', 'images/frect.png'],
['trectIcon', 'images/trect.png'],
['diceIcon', 'images/dice.png'],
['flickrIcon', 'images/flickr.png'],
['colourIcon', 'images/colour.png'],
]

function getIcon(iconName){
	var img = null;
	for(var i=0; i < icons.length; i++){
		if(icons[i][0] == iconName){
			img = $(icons[i][2]).clone();
			$(img).attr('class', 'label');
		}
	}
	return $(img);
}

function preload(arrayOfImages) {
	for(i in arrayOfImages){
        var newImage = new Image();
        newImage.src = arrayOfImages[i];
        icons[i][2] = newImage;
    };
}
