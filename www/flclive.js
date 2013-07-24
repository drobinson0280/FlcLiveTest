// generic get JSON data function
function fetchJSONFile(path, callback) {
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				var data = JSON.parse(httpRequest.responseText);
				if (callback) callback(data);
			}
		}
	};
	// false tells it to be synchronous instead of asynchronous
	httpRequest.open('GET', path, false);
	httpRequest.send(); 
}

// set a global javascript variable
var featuredseries, featuredseries_camelcase, featuredseries_speaker;
// tell the function where the JSON data is
fetchJSONFile('http://www.flcbranson.org/api/featuredseries', function(data) {
	// do something with your data
	// alert(JSON.stringify(data));
	// alert(data.title + ', ' + data.camelcase);
	// define the global variable (only works when using synchronous connections)
	featuredseries = data.title;
	featuredseries_camelcase = data.camelcase;
	featuredseries_speaker = data.speaker;
});
// see if the global variable is still set (would say "undefined" if using an asychronous connection)
//alert(featuredseries + ', ' + featuredseries_camelcase);

// full service rebroadcasts
function sundayRebroadcast() {
	// tell the function where the JSON data is
	fetchJSONFile('http://www.flcbranson.org/api/rebroadcast', function(data){
		// do something with your data
		// alert(JSON.stringify(data));
		//alert(data.sunday_publishingpoint_hls);
		//var sundayrebroadcastlink = 'http://www.flcbranson.org/liveapp/?rebroadcastsite=' + data.sunday + '&rebroadcastday=sun';
		//window.location = sundayrebroadcastlink;
		openVideo(data.sunday_publishingpoint_hls);
	});
}
function fridayRebroadcast() {
	// tell the function where the JSON data is
	fetchJSONFile('http://www.flcbranson.org/api/rebroadcast', function(data){
		// do something with your data
		// alert(JSON.stringify(data));
		//alert(data.friday_publishingpoint_hls);
		//var fridayrebroadcastlink = 'http://www.flcbranson.org/liveapp/?rebroadcastsite=' + data.friday + '&rebroadcastday=fri';
		//window.location = fridayrebroadcastlink;
		openVideo(data.friday_publishingpoint_hls);
	});
}

// window.open wasn't opening a link in the system browser on iOS, so we have to use this function (requires phonegap.js)
function redirectToSystemBrowser(url) {
	// Wait for Cordova to load
	document.addEventListener('deviceready', onDeviceReady, false);
	// Cordova is ready
	function onDeviceReady() {
		// open URL in default web browser
		var ref = window.open(encodeURI(url), '_system', 'location=yes');
	}
}

// opens and closes the video lightbox (jquery)
function openVideo(url, poster) {
	if (poster === undefined) poster = "http://www.flcbranson.org/images/Posters/Flcb.jpg";
	$('body').append('<div class="lightbox" onclick="closeVideo();"><a class="close" href="javascript:void(0)" onclick="closeVideo();">x</a></div>');
	$('.lightbox').append('<div class="lightboxcontent video"></div>');
	$('.lightboxcontent').append('<video src="' + url + '" poster="' + poster + '" autoplay controls x-webkit-airplay="allow" loop></video>');
}
function closeVideo() {
	$('.lightbox video')[0].pause();
	$('.lightbox').remove();
	// refresh the page
	//document.location.reload(true);
}

// opens and closes the service times lightbox (jquery)
function openServiceTimes() {
	$('body').append('<div class="lightbox" onclick="closeServiceTimes();"><a class="close" href="javascript:void(0)" onclick="closeServiceTimes();">x</a></div>');
	$('.lightbox').append('<div class="lightboxcontent servicetimes"></div>');
	$('.lightboxcontent').append('\
	<dl>\n\
		<dt>Broadcast Times</dt>\n\
		<dd>Sundays @ 9:00 <abbr>AM</abbr> & <span class="qualification">***</span> 11:00 <abbr>AM</abbr> <span class="timezone">Central Time</span></dd>\n\
		<dd>Fridays @ 6:30 <abbr>PM</abbr> <span class="timezone">Central Time</span></dd>\n\
	</dl>\n\
	<p>Open "<abbr title="Faith Life Church">FLC</abbr> Live" during these times to connect directly to our live service broadcasts.</p>\n\
	<p><small><span class="qualification">***</span> When our Sunday service is broadcast live from Sarasota at 9:00 <abbr>AM</abbr> (central), the 11:00 AM service will be a rebroadcast and may be viewed by selecting Sunday Rebroadcast.</small></p>\
	');
}
function closeServiceTimes() {
	$('.lightbox').remove();
}

// start javascript countdown (http://www.developphp.com/view.php?tid=1248)
// don't forget to pass the broadcast variable
function cdtd(broadcast) {
	// just about any standard date format is accepted
	var nextinternetbroadcast = new Date(broadcast);
	var now = new Date();
	var timeDiff = nextinternetbroadcast.getTime() - now.getTime();
	if (timeDiff <= 0) {
		document.getElementById('nextinternetbroadcast').classList.remove('disabled');
		document.getElementById('nextinternetbroadcast').innerHTML = '<a href="index.html">Join live service now<\/a>';
		//document.getElementById('nextinternetbroadcast').innerHTML = '<a href="javscript:openVideo(' + livepublishingpoint + ');">Join live service now<\/a>';
	} else {
		var seconds = Math.floor(timeDiff / 1000);
		var minutes = Math.floor(seconds / 60);
		var hours = Math.floor(minutes / 60);
		var days = Math.floor(hours / 24);
		hours %= 24;
		minutes %= 60;
		seconds %= 60;
		document.getElementById('nextinternetbroadcast').className += " disabled";
		document.getElementById('nextinternetbroadcast').innerHTML = '<span class="days">' + days + '</span><span class="hours">' + hours + '</span><span class="minutes">' + minutes + '</span><span class="seconds">' + seconds + '</span>';
		// loop the function every second
		setTimeout(function() { cdtd(broadcast); }, 1000);
	}
}

// load one of our XML files and show the info
function loadXML(url) {
	var xmlhttp;
	var x, i, xx;
	if (window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else {
		// code for IE6, IE5
		xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			// do s<!---->omething with your data
			txt = '<div>';
			x = xmlhttp.responseXML.documentElement.getElementsByTagName('item');
			for (i = 0; i < x.length; i++) {
				txt = txt + '<dl class="box">';
				txt = txt + '<dt>Sermon Title</dt>';
				xx = x[i].getElementsByTagName('title'); {
					try {
						txt = txt + '<dd>Pt. ' + xx[0].firstChild.nodeValue + '</dd>';
					}
					catch (er) {
						txt = txt + '<dd> </dd>';
					}
				}
				txt = txt + '<dt>Speaker</dt>';
				// loads speakers in Internet Explorer but not iOS (maybe a namespace issue)
				xx = x[i].getElementsByTagName('dc:creator'); {
					try {
						txt = txt + '<dd style="font-size:0.85em;">' + xx[0].firstChild.nodeValue + '</dd>';
					}
					catch (er) {
						txt = txt + '<dd> </dd>';
					}
				}
				txt = txt + '<dt>Date Preached</dt>';
				xx = x[i].getElementsByTagName('pubDate'); {
					// date.js (included separately) string format (Sunday, March 05, 2012)
					var date = Date.parse(xx[0].firstChild.nodeValue).toString('dddd, MMMM dd, yyyy');
					try {
						txt = txt + '<dd style="font-size:0.65em;">' + date + '</dd>';
					}
					catch (er) {
						txt = txt + '<dd> </dd>';
					}
				}
				txt = txt + '<dt>Download Link</dt>';
				xx = x[i].getElementsByTagName('guid'); {
					try {
						txt = txt + '<dd><a class="link" href="javascript:openVideo(\'' + xx[0].firstChild.nodeValue + '\', \'http://www.flcbranson.org/images/Posters/' + basename(featuredseries_camelcase) + '.jpg\');">Audio</a></dd>';
					}
					catch (er) {
						txt = txt + '<dd> </dd>';
					}
				}
				txt = txt + '</dl>';
			}
			txt = txt + '</div>';
			document.getElementById('sermons').innerHTML = txt;
		}
	}
	xmlhttp.open('GET', url, true);
	xmlhttp.send();
}

// google analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-39575525-1']);
_gaq.push(['_trackPageview']);
(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

// a JavaScript equivalent of PHP’s basename() function
function basename(path, suffix) {
	// http://kevin.vanzonneveld.net
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   improved by: Ash Searle (http://hexmen.com/blog/)
	// +   improved by: Lincoln Ramsay
	// +   improved by: djmix
	// *     example 1: basename('/www/site/home.htm', '.htm');
	// *     returns 1: 'home'
	// *     example 2: basename('ecra.php?p=1');
	// *     returns 2: 'ecra.php?p=1'
	var b = path.replace(/^.*[\/\\]/g, '');
	if (typeof(suffix) == 'string' && b.substr(b.length - suffix.length) == suffix) {
		b = b.substr(0, b.length - suffix.length);
	}
	return b;
}

// get URL queries ?name1=value1&name2=value2 and turns them into javascript variables
function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return(false);
}

/* testing functions
function yo() {
	alert('Yo')
};
$(document).ready(yo);
*/

