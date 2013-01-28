// site.js
// Main UI for the website
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

//////////////////
// HEADER
//////////////////

function getHeader(){
	if($.cookie('SID')){
		$.get("http://www.designblocks.net/checksessionid?sid="+$.cookie('SID'),
			function(data){
				if(data == "valid"){
					$.get("http://www.designblocks.net/username?uid="+$.cookie('UID'),
						function(name){
							showLoggedInHeader(name);
						}
					);
				}else{
					clearCookies();
					showLoggedOutHeader();
				}
			}
		);
	}else{
		showLoggedOutHeader();
	}
}

function showLoggedOutHeader(){
	$('#login').html('<form><input type="text" name="username" value="username"><input type="password" name="password" value="password"><input type="submit" value="login" class="loginbutton"></form>');
	$('#login').append('<div id="registerlinkdiv">New? <a id="registerlink" href="#">Register</a></div>');
	$('#login').append('<div id="register" style="display:none; cursor: default"><br><img align="middle" src="http://designblocks.aquapixel.net/img/logosm2.png" width="170px"><br><br><form id="registerform" action="#"><div class="registerfield">Username:</div><input type="text" name="username" id="registerusername" size="15" /><br /><div class="registerfield">Password:</div><input type="password" name="password" id="registerpassword1" size="15" /><br /><div class="registerfield">Confirm Password:</div><input type="password" name="password" id="registerpassword2" size="15" /><br /><div align="center"><p><input id="registersubmit" type="submit" value="Register" /><input id="registercancel" type="submit" value="Cancel"></p></div></form></div>');
	
	$('#registerlink').click(function(event) { 
        register();
    });
    $('#registercancel').click(function(event) { 
		$.unblockUI();
		event.preventDefault(); 
	});
    $('#registersubmit').click(function(event) {
    	if($('#registerusername').val().length != 0){
	    	if($('#registerpassword1').val() == $('#registerpassword2').val()){
	    		$.get('http://www.designblocks.net/newuser?username='+$('#registerusername').val()+'&password='+$('#registerpassword1').val(),
	    			function(data){
						var vals = data.split(":");
	    				alert(vals[0]);
	    				if(vals[0] == "Thank you for registering!"){
	    					// SET COOKIE
							$.cookie('SID',escape(vals[1]),{ path: '/', domain: 'www.designblocks.net' });
							$.cookie('UID',escape(vals[2]),{ path: '/', domain: 'www.designblocks.net' });
							$('#notification').fadeOut();
							$.unblockUI();
							// GO TO USER PAGE
							window.location = "http://www.designblocks.net/"+vals[3];
	    				}
	    			}
				);
	    	}else{
	    		alert('Passwords do not match');
	    	}
	    }else{
	    	alert('Please fill in a username');
	    }
		event.preventDefault(); 
	});
	
	$('form').submit(
		function(event) {
			$.get('http://www.designblocks.net/loginuser?username='+$("input[name='username']").attr("value")+'&password='+$("input[name='password']").attr("value"),
				function(data){
					if(data.indexOf('Invalid') != -1){
						// INVALID NOTIFICATION
						$('#notification').html('<b>'+data+'</b>');
					}else{
						// SET COOKIE
						var vals = data.split(":");
						$.cookie('SID',escape(vals[0]),{ path: '/', domain: 'www.designblocks.net' });
						$.cookie('UID',escape(vals[1]),{ path: '/', domain: 'www.designblocks.net' });
						$('#notification').fadeOut();
						// GO TO USER PAGE
						window.location = "http://www.designblocks.net/"+vals[2];
					}
				}
			);
			return false;
		}
	);
}

function showLoggedInHeader(name){
	$('#login').html('<b>'+name+'</b> &nbsp; &nbsp; <a href="http://www.designblocks.net/'+name+'">My Designs</a> | <a href="javascript:logout()">Logout</a>');
}

function logout() {
	$.get("http://www.designblocks.net/logoutuser?sid="+$.cookie('SID'),
		function(data){
			if(data == "success"){
				clearCookies();
				window.location = "http://www.designblocks.net";
			}
		}
	);
}

function register() {
	// alert("test register");
	$.blockUI({ message: $('#register') });
}

function setupRegisterLogin() {
	 $('#registercancel').click(function(event) { 
		$.unblockUI();
		event.preventDefault(); 
	});
    $('#registersubmit').click(function(event) {
    	if($('#registerusername').val().length != 0){
	    	if($('#registerpassword1').val() == $('#registerpassword2').val()){
	    		$.get('http://www.designblocks.net/newuser?username='+$('#registerusername').val()+'&password='+$('#registerpassword1').val(),
	    			function(data){
	    				var vals = data.split(":");
	    				alert(vals[0]);
	    				if(vals[0] == "Thank you for registering!"){
	    					// SET COOKIE
							$.cookie('SID',escape(vals[1]),{ path: '/', domain: 'www.designblocks.net' });
							$.cookie('UID',escape(vals[2]),{ path: '/', domain: 'www.designblocks.net' });
							$('#notification').fadeOut();
							$.unblockUI();
							saveBlocksToServer();
							// GO TO USER PAGE
							// window.location =
							// "http://www.designblocks.net/"+vals[3];
	    				}
	    			}
				);
	    	}else{
	    		alert('Passwords do not match');
	    	}
	    }else{
	    	alert('Please fill in a username');
	    }
		event.preventDefault(); 
	});
	
	$('form').submit(
		function(event) {
			$.get('http://www.designblocks.net/loginuser?username='+$("input[name='username']").attr("value")+'&password='+$("input[name='password']").attr("value"),
				function(data){
					if(data.indexOf('Invalid') != -1){
						// INVALID NOTIFICATION
						$('#notification').html('<b>'+data+'</b>');
					}else{
						// SET COOKIE
						var vals = data.split(":");
						$.cookie('SID',escape(vals[0]),{ path: '/', domain: 'www.designblocks.net' });
						$.cookie('UID',escape(vals[1]),{ path: '/', domain: 'www.designblocks.net' });
						$('#notification').fadeOut();
						// GO TO USER PAGE
						// window.location =
						// "http://www.designblocks.net/"+vals[2];
						$.unblockUI();
						saveBlocksToServer();
					}
				}
			);
			return false;
		}
	);
}

// ////////////////
// COOKIES
// ////////////////

function getValidUID(){
	// if($.cookie('SID')){
	// $.get("http://www.designblocks.net/checksessionid?sid="+$.cookie('SID'),
	// function(data){
	// if(data == "valid"){
	// alert('1: ' + $.cookie('UID'));
	// return $.cookie('UID');
	// }else{
	// alert('2');
	// return null;
	// }
	// }
	// );
	// }else{
	// alert('3');
	// return null;
	// }
	
	return $.cookie('UID');
}

function clearCookies(){
	$.cookie('SID',null, { path: '/', domain: 'www.designblocks.net' });
	$.cookie('UID',null, { path: '/', domain: 'www.designblocks.net' });
	$.cookie('JSESSIONID',null, { domain: 'www.designblocks.net' });
}

// ////////////////
// AUTOPLAY
// ////////////////

function autoPlay(){
	var $first = $('img.playoverlay:first');
	showProjectInfo($first.attr('id'));
	callToActionscript($first.attr('id'));
}

// ///////////////////
// THUMBNAIL PANES
// ///////////////////

function getThumbnailPane(url, numThumbs){

	$.getJSON(url+'&type=jsonp&callback=?',
		function(data) {
			$('#thumbs').html("<ul class='thumbs noscript'></ul>");
			if((url.indexOf('http://www.designblocks.net/recentprojectlist') == -1) && $.cookie('UID') && (data.length == 0)){
				$('#thumbs').html("This user has no designs.<br>New? <a target='_blank' id='newcreate' href='http://www.designblocks.net/create'>Create something!</a>");
			}else{
				if((url.indexOf('http://www.designblocks.net/recentprojectlist') == -1) && $.cookie('UID') && ($.cookie('UID') == data[0].userid)){
					if(data.length == 0){
						$('#thumbs').html('New? Click create to get started!');
					}else{
						$.each(data, function(i,project){
							var privateIcon = "green_b.png";
							if(project.viewable == false){
								privateIcon = "red_b.png";
							}
							$('#thumbs ul.thumbs').append('<li><div class="wrapper"><a href="javascript:void(0);" id="thumblink" class="thumb" name="'+project.title+' by '+project.username+'" title="'+project.title+' by '+project.username+'"><img class="playthumb" src="http://www.designblocks.net/thumbnails/'+project.id+'" alt="'+project.title+'" width="75px" height="75px"/><img class="playoverlay" id="'+project.id+'" src="http://www.designblocks.net/assets/playoverlay.png"><img class="lock" src="http://www.designblocks.net/assets/'+privateIcon+'"><img class="delete" src="http://www.designblocks.net/assets/delete.png"></a></div></li>');
						});
						
						$('img.playoverlay').hide();
						$('img.lock').hide();
						$('img.delete').hide();
						
					    $('img.playthumb').mouseenter(function(event) {
							// var $target = $(event.target);
							// $target.next().show();
							// $target.next().next().show();
							// $target.next().next().next().show();
						});
						
						$('img.playthumb')[0].addEventListener("touchstart", touchHandler, true);
						$('img.playthumb')[0].addEventListener("touchend", touchHandler, true);
						$('img.playthumb').mouseup(function(event) {
							playProject(event);
						});
						
						// $('img.playoverlay').click(function(event) {
						// playProject(event);
						// });
						
						$('img.playoverlay')[0].addEventListener("touchstart", touchHandler, true);
						$('img.playoverlay')[0].addEventListener("touchend", touchHandler, true);
						$('img.playoverlay').mouseup(function(event) {
							playProject(event);
						});
						
						$('img.playoverlay').mouseleave(function(event) {
							// var $target = $(event.target);
							// $target.hide();
							// $target.next().hide();
							// $target.next().next().hide();
						});
						
						$('#privacy').show();
					}
					
				} else {
					if(data.length == 0){
						$('#thumbs').html('This user has no designs.');
					}else{
						$.each(data, function(i,project){
							$('#thumbs ul.thumbs').append('<li><div class="wrapper"><a href="javascript:void(0);" class="thumb" name="'+project.title+' by '+project.username+'" title="'+project.title+' by '+project.username+'"><img class="playthumb" src="http://www.designblocks.net/thumbnails/'+project.id+'" alt="'+project.title+'" width="75px" height="75px" id="'+project.id+'"/><img class="playoverlay" id="'+project.id+'" src="http://www.designblocks.net/assets/playoverlay.png"></a></div></li>');
						});
						
						$('img.playoverlay').hide();
						
						$('img.playthumb')[0].addEventListener("touchstart", touchHandler, true);
						$('img.playthumb')[0].addEventListener("touchend", touchHandler, true);
						$('img.playthumb').mouseup(function(event) {
							loadProject($(event.target).attr('id'));
							$('#stageprojectinfo').html($(event.target).parent()[0].title);
							$('img.playthumb').parent('.thumb').css('background-color', '#444');
							$(event.target).parent('.thumb').css('background-color', '#EEE');
						});
						
						// $('img.playoverlay').click(function(event) {
						// playProject(event);
						// });
						
						// $('img.playoverlay')[0].addEventListener("touchstart",
						// touchHandler, true);
						// $('img.playoverlay')[0].addEventListener("touchend",
						// touchHandler, true);
						// $('img.playoverlay').mouseup(function(event) {
						// loadProject($(event.target).attr('id'));
						// $('#stageprojectinfo').html($(event.target).parent()[0].title);
						// });
						
						// $('img.playoverlay').click(function(event) {
							// showProjectInfo($(event.target).attr('id'));
							// callToActionscript($(event.target).attr('id'));
							// loadProject($(event.target).attr('id'));
							// $('#stageprojectinfo').html($(event.target).parent()[0].title);
						// });
						
						$('img.playthumb').mouseenter(function(event) {
							// $(event.target).next().show();
						});
						
						$('img.playoverlay').mouseleave(function(event) {
							// $(event.target).hide();
						});
						
						$('#privacy').hide();
					}
				}
			}
			
			$('div.content').css('display', 'block');
			
			var gallery = $('#thumbs').galleriffic({
				delay:                     2500,
				numThumbs:                 numThumbs,
				preloadAhead:              10,
				enableTopPager:            true,
				enableBottomPager:         false,
				maxPagesToShow:            7,
				imageContainerSel:         '#slideshow',
				controlsContainerSel:      '#controls',
				captionContainerSel:       '#caption',
				loadingContainerSel:       '#loading',
				renderSSControls:          false,
				renderNavControls:         false,
				playLinkText:              'Play Slideshow',
				pauseLinkText:             'Pause Slideshow',
				prevLinkText:              '&lsaquo; Previous Design',
				nextLinkText:              'Next Design &rsaquo;',
				nextPageLinkText:          '&rsaquo; &rsaquo;',
				prevPageLinkText:          '&lsaquo; &lsaquo;',
				enableHistory:             false,
				autoStart:                 false,
				syncTransitions:           true,
				defaultTransitionDuration: 0,
				onSlideChange:             '',
				onPageTransitionOut:       '',
				onPageTransitionIn:        ''
			});
		
		}
		
	);
}

function getAllUserThumbnailPane(){
	$.getJSON("http://www.designblocks.net/alluserprojectlist?type=jsonp&callback=?",
		function(data, textStatus) {
			$.each(data, function(i,item){
				var thumburl = "http://www.designblocks.net/thumbnails/"+item.pid;
				if(item.pid == "null"){
					thumburl = "http://www.designblocks.net/assets/blankuser.png"
				}
				$('#mycarousel').append('<li><div class="wrapper"><a href="javascript:void(0);" class="thumb" name="'+item.username+'" title="'+item.username+'"><img class="userthumb" src="'+thumburl+'" alt="'+item.username+'" id="'+item.uid+'" width="75px" height="75px"/>'+item.username+'</a></div></li>');		
			});
			
			$('img.userthumb')[0].addEventListener("touchstart", touchHandler, true);
			$('img.userthumb')[0].addEventListener("touchend", touchHandler, true);
			$('img.userthumb').mouseup(function(event) {
				if($('#pane').is(':visible')){
					$('#pane').hide("slide", { direction: "right" }, speed);
					$('#pencil').css('background-color', '#444');
				}
				getThumbnailPane('http://www.designblocks.net/projectlist?uid='+$(event.target).attr('id')+'&private=false', 25)
				$('#userlabel').html($(event.target).attr('alt'));
				$('img.userthumb').parent('.thumb').css('background-color', '#444');
				$('img.userthumb').parent('.thumb').css('color', '#FFF');
				$(event.target).parent('.thumb').css('background-color', '#EEE');
				$(event.target).parent('.thumb').css('color', '#333');
			});
			
			$('div.content').css('display', 'block');
			
			$('#mycarousel').jcarousel({
        		scroll: 5,
    		});
		
		}
	);
}

function playProject(event) {
	var $target = $(event.target);
	var p = $target.offset();
	if((event.pageX > p.left) && (event.pageX < p.left + 17) && (event.pageY > p.top) && (event.pageY < p.top + 16)){
		if($target.siblings('img.lock').attr('src') == 'http://www.designblocks.net/assets/red_b.png'){
			$.get("http://www.designblocks.net/setprojectprivacy?id="+$target.attr('id')+"&private=false", function(data){
				if(data == "success"){
					$target.siblings('img.lock').attr('src','http://www.designblocks.net/assets/green_b.png');
				}
			});
		}else{
			$.get("http://www.designblocks.net/setprojectprivacy?id="+$target.attr('id')+"&private=true", function(data){
				if(data == "success"){
					$target.siblings('img.lock').attr('src','http://www.designblocks.net/assets/red_b.png');
				}
			});
		}
	}else if((event.pageX > p.left + 58) && (event.pageX < p.left + 58 + 17) && (event.pageY > p.top) && (event.pageY < p.top + 16)){
		var answer = confirm("Are you sure you want to delete the design?")
		if (answer){
			$.get("http://www.designblocks.net/deleteproject?id="+$target.attr('id'), function(data){
				if(data == "success"){
					getThumbnailPane(url, numThumbs);
				}
			});
		}
	}else{
		// showProjectInfo($target.attr('id'));
		callToActionscript($target.attr('id'));
	}
}

function showProjectInfo(pid){
	$.getJSON("http://www.designblocks.net/getprojectinfo?id="+pid, function(data){
		project = data[0];
		$('#projectinfo').html('<div id="author"><b><a href="http://www.designblocks.net/'+project.username+'/'+pid+'">'+project.title+'</a></b><br>by <a href="http://www.designblocks.net/'+project.username+'/">'+project.username+'</a></div>');
		// $('#projectinfo').append('<div id="goodies"><a id="blocksViewToggle"
		// title="Show blocks" onClick="showBlocksView();" href="#"><img
		// src="http://www.designblocks.net/assets/blocksOff.png"></a> <a
		// title="Comment on this design"
		// href="http://www.designblocks.net/'+project.username+'/'+pid+'"><img
		// src="http://www.designblocks.net/assets/comment.png"></a> <a
		// title="Download snapshot image" onClick="downloadPNG();"
		// href="#"><img
		// src="http://www.designblocks.net/assets/download.png"></a> <a
		// title="Edit this design"
		// href="http://www.designblocks.net/create?pid='+pid+'"
		// target="_blank"><img
		// src="http://www.designblocks.net/assets/edit.png"></a></div>');
		$('#projectinfo').append('<div id="goodies"><a title="Comment on this design" href="http://www.designblocks.net/'+project.username+'/'+pid+'"><img src="http://www.designblocks.net/assets/comment.png"></a> <a title="Download snapshot image" onClick="downloadPNG();" href="#"><img src="http://www.designblocks.net/assets/download.png"></a> <a title="Edit this design" href="http://www.designblocks.net/create?pid='+pid+'" target="_blank"><img src="http://www.designblocks.net/assets/edit.png"></a></div>');
	});
}

// ////////////////
// FOOTER
// ////////////////

function getFooter(){
	$('#footer').html('<div id="mainbottom"><div id="tutorial"><div id="tutorial12"><div id="tutorial1"><b>info</b><br><a href="http://www.designblocks.net">home</a><br><a href="http://spreadsheets.google.com/viewform?formkey=dFB0bHZMR1o3d2hTM2VINmxRekN0Y1E6MA" target="_blank">send feedback</a><br><a href="http://www.designblocks.net/about.html">about</a></div><div id="tutorial2"><b>help</b><br><a href="http://www.designblocks.net/gettingstarted.html">get started</a><br><a target="_blank" href="http://www.designblocks.net/blocks.html">blocks guide</a><br><a target="_blank" href="http://www.designblocks.net/cards.html">cards</a><br><a target="_blank" href="http://www.designblocks.net/handouts.html">handouts</a></div></div><div id="tutorial3"><b><a href="http://www.designblocks.net/gettingstarted.html">Get Started</a><b><a href="http://www.designblocks.net/gettingstarted.html"><img align="middle" src="http://www.designblocks.net/assets/gettingstarted.png"></a></div></div></div>');
	var url = "http://www.designblocks.net/create";
	// $('#mainbottom').append('<div id="create"><a href="'+url+'" title="Create
	// a new design" target="_blank"><img
	// src="http://www.designblocks.net/assets/create.png"></a></div>');
	$('#footer').append('<div clear="both">&#169; Lifelong Kindergarten. MIT Media Lab. 2009-2010</div>');
}
