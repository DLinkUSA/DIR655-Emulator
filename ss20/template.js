var is_IE = ( navigator.userAgent.indexOf ( "MSIE" ) != - 1 );
var is_IE6 = ( navigator.userAgent.indexOf ( "MSIE 6" ) != - 1 );
var is_FF = ( navigator.userAgent.indexOf ( "Mozilla" ) != - 1 );
var is_Safari = ( navigator.userAgent.indexOf ( "AppleWebKit" ) != - 1 );
var is_QuickTour = ( window.location.pathname.toLowerCase().indexOf("quicktour.aspx") > 0 );
var Firebug = false;

/* * --------------------------------------------------------------------------------
 * Copyright (C) 2008 Bsecure Technologies, Inc.
 * All rights reserved
 * 
 * Revision          : $Revision: 1.256 $
 * Revised           : $Date: 2009/01/26 23:08:39 $  
 * Purpose           : Preliminary javascript file
 *
 * Notice :
 * This code is the sole property of Bsecure Technologies, Inc. and may not be
 * copied, used or distributed in any form not expressly authorized by Bsecure
 * Technologies, Inc.
 * -------------------------------------------------------------------------------- */

/* *
 * Firebug stubs - prevents errors non - Firefox browsers
 */

( function ()
{
    if ( ! this["console"] || is_Safari )
    {
        this.console =
        {
            log : function ()
            {
            }
            // no - op
        }
        ;
    }
    var cn = [ "assert", "count", "debug", "dir", "dirxml", "error", "group", "groupEnd", "info", "profile", "profileEnd", "time", "timeEnd", "trace", "warn", "log" ];
    var i = 0, tn;
    while ( ( tn = cn[i ++ ] ) )
    {
        if ( ! console[tn] )
        {
            ( function ()
            {
                var tcn = tn + "";
                console[tcn] = function ()
                {
                    var a = Array.apply (
                    {
                    }
                    , arguments );
                    a.unshift ( tcn + ":" );
                    console.log ( a.join ( " " ) );
                }
            }
            ) ();
        }
    }
}
) ();


var COOKIE_SERVICE        = "service";
var COOKIE_DEVICE         = "device";
var COOKIE_TAB            = "tab";
var COOKIE_TARGET         = "target";
var COOKIE_WELCOMEPAGE    = "welcomepage";
var COOKIE_WELCOMEBANNER  = "WelcomeBanner";
var COOKIE_RIGHTPANEL     = "rightpanel";
var COOKIE_RIGHTPANELFULL = "rightpanelfull";
var COOKIE_DEVICETYPE     = "devicetype";
var COOKIE_DOWNARROW      = "DownArrow";
var COOKIE_RIGHTARROW     = "RightArrow";
var COOKIE_UI             = "UI";
var COOKIE_QUICKTOURSTEPS = "QuickTourSteps";
var COOKIE_QUICKTOURCHAR  = "QuickTourChar";
var COOKIE_QUICKTOUR_RP   = "QuickTourRP";
var COOKIE_QUICKTOURDIR   = "QuickTourDir";


var cookies = [ COOKIE_SERVICE, COOKIE_DEVICE, COOKIE_TAB, COOKIE_TARGET, COOKIE_WELCOMEPAGE,
                COOKIE_WELCOMEBANNER, COOKIE_RIGHTPANEL, COOKIE_RIGHTPANELFULL,
                COOKIE_DEVICETYPE, COOKIE_DOWNARROW, COOKIE_RIGHTARROW, COOKIE_UI, 
                COOKIE_QUICKTOURSTEPS, COOKIE_QUICKTOURCHAR,COOKIE_QUICKTOUR_RP,COOKIE_QUICKTOURDIR ];
function clearCookies( )
{
	if (Firebug)console.info ( 'clearCookies' );

  for ( var i = 0; i < cookies.length; i ++ )
  setCookie ( cookies[i], "" );
}

function setCookie( type, value )
{
	if (Firebug)console.info ( 'setCookie', type, value );

  switch ( type )
  {
    case COOKIE_TAB:
    case COOKIE_DEVICE:
    case COOKIE_SERVICE:
    case COOKIE_DEVICETYPE:
    case COOKIE_RIGHTPANEL:
    case COOKIE_RIGHTPANELFULL:
    case COOKIE_WELCOMEPAGE:
    case COOKIE_WELCOMEBANNER:
    case COOKIE_DOWNARROW:
    case COOKIE_RIGHTARROW:
    case COOKIE_UI:
    case COOKIE_TARGET:
    case COOKIE_QUICKTOURSTEPS:
    case COOKIE_QUICKTOURCHAR:
    case COOKIE_QUICKTOUR_RP:
    case COOKIE_QUICKTOURDIR:
        // clearTimeout ( logoutTimer );
        document.cookie = type + "=" + escape ( value );
        break;
    }

}

function getCookie( name )
{
	if (Firebug)console.info ( 'getCookie', name );
	
  var start = document.cookie.indexOf ( name + "=" );
  var len = start + name.length + 1;

  if ( ( ! start ) && ( name != document.cookie.substring ( 0, name.length )) )
  {
      return '';
  }

  if ( start == - 1 )
  {
      return '';
  }
  var end = document.cookie.indexOf ( ";", len );

  if ( end == - 1 )
  {
      end = document.cookie.length;
  }
  return unescape ( document.cookie.substring ( len, end ) );
}

function getDim( divname, style )
{
	if (Firebug)console.info ( 'getDim', divname, style );
	
  var contentWidth = 0;

  if ( divname )
  {
      if ( document.defaultView )
      {
        contentWidth = document.defaultView.getComputedStyle ( divname, "" ).getPropertyValue ( style );
      }
      else if ( divname.currentStyle )
      {
        contentWidth = divname.currentStyle[ style ];
        if (contentWidth == "auto") contentWidth = divname.offsetWidth;
      }
  }
  return contentWidth;
}

/***********************************************
* Bookmark site script- © Dynamic Drive DHTML code library (www.dynamicdrive.com)
* This notice MUST stay intact for legal use
* Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code
***********************************************/
/* Modified to support Opera */
function bookmarksite(title, url)
{
  if (window.sidebar) // firefox
		window.sidebar.addPanel(title, url, "");
  else if (window.opera && window.print)
  {  
    var elem = document.createElement('a');
    elem.setAttribute('href', url);
    elem.setAttribute('title', title);
    elem.setAttribute('rel', 'sidebar');
	  elem.click();    	
  }
  else if (document.all)// ie
		window.external.AddFavorite(url, title);
}

var objBookmark =
{
	linkText: 'Bookmark This Site!',

	createTextLink: function(parId)
	{
		var a = objBookmark.createLink(parId);
		if (!a) return;

		a.appendChild(document.createTextNode(objBookmark.linkText));
	},

	createImageLink: function(parentID, imagePath)
	{
		if (!imgPath || isEmpty(imgPath)) return;

		var a = objBookmark.createLink(parentID);
		if (!a) return;

		var img = document.createElement('img');
		img.title = img.alt = objBookmark.linkText;
		img.src = imagePath;

		a.appendChild(imagePath);
	},

	createLink: function(parentID)
	{
		if (!document.getElementById || !document.createTextNode) return null;

		parentID = ((typeof (parentID) == 'string') && !isEmpty(parentID))
      ? parentID : 'addBookmarkContainer';

		var cont = document.getElementById(parentID);

		if (!cont) return null;

		var a = document.createElement('a');
		a.href = '#';

		if (window.opera)
		{
			a.rel = 'sidebar'; // this makes it work in Opera 7+
		}
		else
		{
			// If the link has an onclick handler, only add it if the browser is not Opera
			// because this operation does not work in Opera 7+.			
			a.onclick = function()
			{
				objBookmark.exec('http://securespot.dlink.com', this.title);
				return false;
			}
		}

		a.title = document.title + ' @ http://securespot.dlink.com';

		return cont.appendChild(a);
	},

	exec: function(url, title)
	{
		var ua = navigator.userAgent.toLowerCase();
		var isKonq = (ua.indexOf('konqueror') != -1);
		var isSafari = (ua.indexOf('webkit') != -1);
		var isMac = (ua.indexOf('mac') != -1);
		var buttonStr = isMac ? 'Command/Cmd' : 'CTRL';

		if (window.external && (!document.createTextNode ||
      (typeof (window.external.AddFavorite) == 'unknown')))
		{
			// IE4/Win generates an error when you
			// execute "typeof(window.external.AddFavorite)"
			// In IE7 the page must be from a web server, not directly from a local 
			// file system, otherwise, you will get a permission denied error.
			window.external.AddFavorite(url, title); // IE/Win
		}
		else if (isKonq)
		{
			alert('You need to press CTRL + B to bookmark our site.');
		}
		else if (window.opera)
		{
			void (0); // do nothing here (Opera 7+)
		}
		else if (window.home)
		{
			alert("After adding the bookmark, remember to right click on the bookmark and open in a new tab.\n" +
			"Otherwise, it will open in the sidebar.\n" +
			"You can also right click on the bookmark, go to Properties, \nand uncheck \"Load this bookmark in a sidebar\".");
		
			// Firefox, Netscape, Safari, iCab
			window.sidebar.addPanel("SecureSpot @ http://securespot.dlink.com", "http://securespot.dlink.com", "");			
		}
		else if (isSafari)
		{
			alert('Please go to http://securespot.dlink.com and press ' + buttonStr + ' + D on the keyboard to bookmark the site.');
			//window.external.AddFavorite(url, title);
		}
		else if (!window.print || isMac)
		{
			// IE5/Mac and Safari 1.0
			alert('Please go to http://securespot.dlink.com and press ' + buttonStr + ' + D on the keyboard to bookmark the site.');
		}
		else
		{
			alert('In order to bookmark this site you need to do so manually ' +
        'through your browser.');
		}
	}
}

// Description: Function is called from the Body tag of the Register.master in the OnLoad event.
// The function waits 1 millisecond before it calls backButtonOverrideBody because Safari displays
// an empty page if history.forward is immediately called in the OnLoad event.
function backButtonOverride()
{
	// Work around a Safari bug
	// that sometimes produces a blank page
	setTimeout("backButtonOverrideBody()", 1);
}

// Description: Function attempts to go forward one history point in the browser's history queue
// and sets a timer of 500 milliseconds before it calls itself after the time elapses.
// It repeatedly tries to go forward one history point every 500 milliseconds
// even if no future history point exists.  This code ensures the user can never go back a page,
// which is especially needed after the user registers his or her device since the website should
// not allow the user to register the device again.
function backButtonOverrideBody()
{
	// Works if we backed up to get here
	try
	{
		history.forward();
	} catch (e)
	{
		// OK to ignore
	}
	// Every quarter-second, try again. The only
	// guaranteed method for Opera, Firefox,
	// and Safari, which don't always call
	// onLoad but *do* resume any timers when
	// returning to a page
	setTimeout("backButtonOverrideBody()", 500);
}

function isEmpty(s) { return ((s == '') || /^\s*$/.test(s)); }

function AddEvent(event, eventType, functionReference)
{
	if (event.addEventListener && (!window.opera || opera.version) &&
  (eventType != 'load'))
	{
		event.addEventListener(eventType, functionReference, false);
	}
	else if (event.attachEvent)
	{
		event.attachEvent('on' + eventType, functionReference);
	} 
	else
	{
		if (typeof (functionReference) != "function") return;
		
		if (typeof (window.earlyNS4) == 'undefined')
		{
			// to prevent this function from crashing Netscape versions before 4.02
			window.earlyNS4 = ((navigator.appName.toLowerCase() == 'netscape') &&
      (parseFloat(navigator.appVersion) < 4.02) && document.layers);
		}
		if ((typeof (event['on' + eventType]) == "function") && !window.earlyNS4)
		{
			var tempFunc = event['on' + eventType];

			event['on' + eventType] = function(e)
			{
				var a = tempFunc(e), b = functionReference(e);
				a = (typeof (a) == 'undefined') ? true : a;
				b = (typeof (b) == 'undefined') ? true : b;
				return (a && b);
			}
		} 
		else
		{
			event['on' + eventType] = functionReference;
		}
	}	
}

AddEvent(window, 'load', objBookmark.createTextLink);

// to make multiple links, do something like this:
/*
AddEvent(window,'load',function(){
var f=addBookmarkObj.createTextLink;
f();
f('otherContainerID');
});
*/

// below is an example of how to make an image link with this
// the first parameter is the ID. If you pass an empty string it defaults to
// 'addBookmarkContainer'.
/*
AddEvent(window,'load',function(){
addBookmarkObj.createImageLink('','/images/add-bookmark.jpg');
});
*/

var timer;

function moveMap( px )
{
	if (Firebug)console.info ( 'moveMap', px );
	
  var scrollLeftArrow = $get ( "scrollLeftArrow" );
  var scrollRightArrow = $get ( "scrollRightArrow" );
  var map = $get ( Map.ID + "_MapNetworkIcons" );

  if ( map )
  {
      var scrollWidth = getScrollWidth();
      var pxl = parseInt ( px );
      map.scrollLeft += pxl;
      scrollLeftArrow.style.display = "block";
      scrollRightArrow.style.display = "block";

      if ( map.scrollLeft < 2 ) scrollLeftArrow.style.display = "none";
      if ( ( scrollWidth + map.scrollLeft ) > 0 ) scrollRightArrow.style.display = "none";
      
      //display number of devices
      var padding = 12;
      var deviceWidth = 81;
      var mapWidth = parseInt(getDim( map, "width" ))-padding;
      var totalWidth = mapWidth + (scrollWidth * -1);
      var leftToScroll = scrollWidth + map.scrollLeft;
      var deviceCount = parseInt(totalWidth / deviceWidth);
      var devicesHidden = parseInt(((leftToScroll+padding-deviceWidth) / deviceWidth) * -1);
      var devicesShown = Math.round(mapWidth/deviceWidth);
      var lastDeviceShown = deviceCount-devicesHidden;
      var firstDeviceShown = lastDeviceShown-(devicesShown-1);
      firstDeviceShown = (firstDeviceShown == 0) ? 1 : firstDeviceShown;
      
      $get('numberOfDevices').innerHTML = 'Displaying (' + firstDeviceShown + " - " + lastDeviceShown + ') of '+deviceCount;
  }
}

function moveMapEnd(num)
{
  var map = $get ( Map.ID + "_MapNetworkIcons" );
  switch (num)
  {
    case 0 :
        // Beginning
        map.scrollLeft = 0;
        break;
    case 1 :
        // End
        var cleardevices = $get ( Map.ID + "_cleardevices" );
        map.scrollLeft = cleardevices.offsetParent.offsetLeft - getScrollWidth();
        break;
    default :
        // Do nothing
  }
}

function getScrollWidth( )
{
	if (Firebug)console.info ( 'getScrollWidth' );
	
  var scrollWidth = 0;
  var content = $get ( "layout_rightside" );
  var contentWidth = parseInt ( getDim ( content, "width" ) );
  var minWidth = 800;
  var bodyWidth = document.body.offsetWidth;

  var pcmap = $get ( Map.ID +  "_PcMap" );
  var pcmapWidth = parseInt ( getDim ( pcmap, "width" ) );
  var cleardevices = $get ( Map.ID + "_cleardevices" );
  var xlocation = cleardevices.offsetLeft;

  if ( xlocation == 0 ) xlocation = pcmapWidth;

  if ( bodyWidth < minWidth ) contentWidth = contentWidth - ( minWidth - bodyWidth );
  scrollWidth = bodyWidth - contentWidth - xlocation - 15;
  return scrollWidth;
}

function resetNetworkMap( )
{
	if ( Firebug ) console.info ( 'resetNetworkMap' );
	
	//If the page is the quick Tour, exit this function
	if ( is_QuickTour ) return false;
	
  var cleardevices = $get ( Map.ID + "_cleardevices" );

  if ( cleardevices )
  {
    var scrollWidth = 0;
    var midline = $get ( "MidLine" );
    var scrollLeftArrow = $get ( "scrollLeftArrow" );
    var scrollRightArrow = $get ( "scrollRightArrow" );

    var pcmap = $get ( Map.ID + "_PcMap" );
    var pcmapWidth = parseInt ( getDim ( pcmap, "width" ) );
    var xlocation = cleardevices.offsetLeft;

    if ( xlocation == 0 ) xlocation = pcmapWidth;

    if ( scrollLeftArrow ) scrollLeftArrow.style.display = "none";
    if ( scrollRightArrow ) scrollRightArrow.style.display = "none";
    moveMap( 0 );

    if ( getScrollWidth () < 0 ) if ( scrollRightArrow ) scrollRightArrow.style.display = "block";

    if ( xlocation == 0 ) if ( midline ) midline.style.display = "none";

    else if ( midline ) midline.style.display = "block";

    if ( pcmap !== null ) pcmap.style.width = xlocation + "px";
  }
}

function toggleDiv ( divname )
{
	if ( Firebug ) console.info ( 'toggleDiv', divname );

	console.trace ();

	var div = $get ( divname );

	if ( div !== null & div !== '' )
	{
		if ( div.style.display == "block" )
		{
			div.style.display = "none";
		}
		else
		{
			div.style.display = "block";
		}
	}
}

function insertAtCursor(myField, myValue)
{
  // IE support
  if (document.selection)
  {
    myField.focus();
    var sel = document.selection.createRange();
    sel.text = myValue;
    sel.select();
  }
  // MOZILLA / NETSCAPE support
  else if (myField.selectionStart || myField.selectionStart == '0')
  {
    var startPos = myField.selectionStart;
    var endPos = myField.selectionEnd;
    myField.value = myField.value.substring(0, startPos)
    + myValue
    + myField.value.substring(endPos, myField.value.length);
    myField.selectionStart = startPos + 1;
    myField.selectionEnd = startPos + 1;
    myField.focus();

  }
  else
  {
    myField.value += myValue;
    return false;
  }
}

function txtFormat( key, keyMoz, textbox, type )
{
  var newval = textbox.value;
  // For Mozilla - IE ignores
  if ( key == 9 )
  {
      // tab
      return true;
  }
  else if(key == 8)
  {
      // Backspace
      newval = newval.substring ( 0, newval.length - 1 );
      return true;
  }
  else  if(key == 37 || key == 39)return true;
  // Back Arrow

  // Check key entered
  if ( ! is_IE )key = keyMoz;
  if ( ! is_IE && key == 0 )
  {
      // Mozilla - Do Nothing (control keys)
      textbox.value = newval;
  }
  else
  {
    switch ( type )
    {
      case "mac" :
      if ( ( ( key > 47 && key < 58 ) || ( key > 64 && key < 91 ) || ( key > 96 && key < 103 ) || ( key == 58 ) ) && newval.length < 17 )
      {
          // 0 - 9 and 0 - 9 on the number pad + A - Z and :
          // if (newval.match("^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$)"))
          insertAtCursor(textbox, String.fromCharCode ( key ));
      }
      break;

      case "zip" :
      if ( ( ( key > 47 && key < 58 ) || ( key == 45 ) || ( key == 120 ) || ( key == 32 ) ) && newval.length < 17 )
      {
          // 0 - 9 on the number pad and - and x and space " "
          // if (newval.match("^\d{5}(-\d{4})?$"))
          insertAtCursor(textbox, String.fromCharCode ( key ));
      }
      break;

      case "devicename" :
      // single quote ( key == 39 )
      if ( ( ( key > 47 && key < 58 ) || ( key > 64 && key < 91 ) || ( key > 96 && key < 123 ) || ( key == 45 ) || ( key == 32 )) && newval.length < 32 )
      {
          // 0 - 9 and 0 - 9 on the number pad + A - Z and - and space " "
          insertAtCursor(textbox, String.fromCharCode ( key ));
      }
      break;

      case "ip" :
      if ( ( ( key > 47 && key < 58 ) || ( key == 46 ) ) && newval.length < 15 )
      {
          // 0 - 9 and 0 - 9 on the number pad and .
          // if ( ! newval.match('^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$'))
          insertAtCursor(textbox, String.fromCharCode ( key ));
      }
      break;
      case "numbercomma" :
      if (( key > 47 && key < 58 ) || ( key == 44 ) )
      {
          // 0 - 9 and 0 - 9 on the number pad and ,
          // if ( ! newval.match('^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$'))
          insertAtCursor(textbox, String.fromCharCode ( key ));
      }
      break;
      case "numbercommahyphen" :
      if (( key > 47 && key < 58 ) || ( key == 44 ) || (key == 45))
      {
          // 0 - 9 and 0 - 9 on the number pad and ,
          // if ( ! newval.match('^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$'))
          insertAtCursor(textbox, String.fromCharCode ( key ));
      }
      break;
    }
  }
  return false;
}

function setDefaultDisplay( )
{
	if (Firebug)console.info ( 'setDefaultDisplay' );
	
  console.trace();    
    
	//If the page is the quick Tour, exit this function
	if(is_QuickTour) return false;

  //Resize the network map - for cross-browser horizontal scrolling
  welcomeBanner();
  resetNetworkMap ();
  
  //Set welcome banner if just logged on
  displayCookieDiv ( COOKIE_WELCOMEBANNER );
  
  //Set the down and right arrows
  displayCookieDiv ( COOKIE_DOWNARROW );
  displayCookieDiv ( COOKIE_RIGHTARROW );
}

function displayCookieDiv( cookie )
{
	if (Firebug)console.info ( 'displayCookieDiv', cookie );
	
  console.trace();
  var pref = getCookie ( cookie );
  var div = $get ( cookie );

  if ( div )
  {
    if ( pref == 'closed' ) div.style.display = 'none';
  }
}

function simulateClick( e )
{
	if (Firebug)console.info ( 'simulateClick', e );
  
  console.trace();
  if(e != null)
  {
    var evt = document.createEvent ( "MouseEvents" );
    evt.initMouseEvent ( "click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null );
    var canceled = ! e.dispatchEvent ( evt );

    if (canceled)
			if (Firebug) console.info ( 'Canceled' );
    else
			if (Firebug) console.info ( 'Not Canceled' );
  }
}

function clickButton( btn )
{
	if (Firebug)console.info ( 'clickButton', btn );
	
  console.trace();

  if ( is_IE || is_Safari )
  {
    btn.click();
  }
  else
  {
    simulateClick ( btn );
  }
}

function ctrlClick( ctrl )
{
	if (Firebug)console.info ( 'ctrlClick', ctrl );
  
  console.trace();

  if (Page_IsValid)
  {
    disableAllLinks();
    Loading();
    clickButton ( ctrl );
  }
}

var guiCmd = '';

function openGui( cmd )
{
	if (Firebug)console.info ( 'openGui', cmd );
	
  console.trace();

  guiCmd = cmd;
  getGuiHash ();
}

function failedHttpRequest( )
{
	if (Firebug)console.info ( 'failedHttpRequest' );
	
  console.trace();
}

function renderTmpMessage( )
{
	if (Firebug)console.info ( 'renderTmpMessage' );
	
  console.trace();
}

function failedInitRequest( )
{
	if (Firebug)console.info ( 'failedInitRequest' );
	
  console.trace();
}

function failedResponse( )
{
	if (Firebug)console.info ( 'failedResponse' );
	
  console.trace();
}

function successfulResponse( )
{
	if (Firebug)console.info ( 'successfulResponse' );
	
  console.trace();
  if ( guiCmd !== '' ) window.location = guiCmd + '=' + request.responseText;
}

function handleResponse( )
{
	if (Firebug)console.info ( 'handleResponse' );
 
  console.trace();
  try
  {
    if ( request.readyState == 4 )
    {
      if ( request.status == 200 )
      {
          successfulResponse();
      }
      else
      {
          alert ( contentMap.comunicationError );
      }
    }
  }
  catch (err)
  {
    alert ( contentMap.serverNotAvailable + err.message );
  }
}

function initReq( reqType, url, bool, divId )
{
	if (Firebug)console.info ( 'initReq', reqType, url, bool, divId );

	console.trace();
  
  try
  {
    request.onreadystatechange = function( )
    {
        handleResponse();
    };
    
    // Opens a request to the server.
    request.open(reqType, url, bool);
    
    // Sends an HTTP request to the server.
    request.send ( null );
  }
  catch (err)
  {
    alert ( contentMap.appCannotContactServer );
  }
}

/* 
	Description:	Function creates either an XMLHttpRequest or an ActiveX object
								and calls the "initReq" function to submit an AJAX request to the server.
*/
function httpRequest( reqType, url, asynch, divId )
{
	if (Firebug)console.info ( 'httpRequest', reqType, url, asynch, divId );
 
  console.trace();

	// Check if XMLHttpRequest objects are available for browsers except IE.
  if ( window.XMLHttpRequest )
  {
    request = new XMLHttpRequest ();
  }
  else if ( window.ActiveXObject ) // Check if ActiveX objects are available for IE.
  {
    request = new ActiveXObject ( "Msxml2.XMLHTTP" );

    if ( ! request )
    {
        request = new ActiveXObject ( "Microsoft.XMLHTTP" );
    }
  }

  if ( request )
  {
    initReq ( reqType, url, asynch, divId );
  }
  else
  {
    alert ( contentMap.browserDoesNotAllowFeatures );
  }
}

function attributeClass( )
{
  return ( is_IE ) ? "className" : "class";
}

function openCart ( sender, arg )
{
	if (Firebug)console.info ( 'openCart', sender, arg );
    
  setTimeout ( "Tab_OnClick(4);", 2000 );
  // find out if the device is a DSD
  // 	if( ! IsDSD())
  // 	  setTimeout ( "loadMainControl('~/ShoppingCartCtrl/Cart.ascx','cart');", 2000 );
  // 	else
  // 	  setTimeout ( "loadMainControl('~/ShoppingCartCtrl/DSDCart.ascx','cart');", 2000 );
  Sys.WebForms.PageRequestManager.getInstance ().remove_pageLoaded ( openCart );
 }

function RemoveItem( lb )
{
	if (Firebug)console.info ( 'RemoveItem', lb );

  for (var i = 0; i < lb.options.length; i ++ )
  {
    if ( lb.options[ i ].selected )
    {
      lb.options[ i ] = null;
      i -- ;
    }
  }
}

function selectAllOptions( selectBox )
{
	if (Firebug)console.info ( 'selectAllOptions', selectBox );

  for (var x = 0; x < selectBox.options.length;
  x ++ )
  {
      selectBox.options[ x ].selected = 'true';
  }
}

function Trim( strText )
{
	if (Firebug)console.info ( 'Trim', strText );

  // this will get rid of leading spaces
  while ( strText.substring ( 0, 1 ) == ' ' )
  {
      strText = strText.substring ( 1, strText.length );
  }

  // this will get rid of trailing spaces
  while ( strText.substring ( strText.length - 1, strText.length ) == ' ' )
  {
      strText = strText.substring ( 0, strText.length - 1 );
  }

  return strText;
}

function RemoveSite( urlBox, siteList )
{
	if (Firebug)console.info ( 'RemoveSite', urlBox, siteList );
	
  RemoveItem ( siteList );
  urlBox.value = 'http://';
  urlBox.focus ();
}

function ClearSites( siteList )
{
	if (Firebug)console.info ( 'ClearSites', siteList );
	
  siteList.length = null;
}

var ids = new Array ();

function setstate( )
{
	if (Firebug)console.info ( 'setstate' );

  for (var i = 0; i < ids.length; i ++ )
  {
    if ( ids[ i ] == this )
    {
      var d = this.parentNode.getElementsByTagName ( 'div' )[ 1 ];

      if ( d.style.display == "block" )
      {
          d.style.display = "none";
      }
      else
      {
          d.style.display = "block";
      }
    }
  }
}

// Used on Home.aspx
function TabClick( tabClicked )
{
	if (Firebug)console.info ( 'TabClick', tabClicked );
	
  // Set all divs to display = none
  document.getElementById ( 'problems' ).style.display = 'none';
  document.getElementById ( 'solutions' ).style.display = 'none';
  document.getElementById ( 'securespot' ).style.display = 'none';
  document.getElementById ( 'FAQS' ).style.display = 'none';
  document.getElementById ( 'awards' ).style.display = 'none';

  switch ( tabClicked )
  {
    case 1 :
    document.getElementById ( 'awards' ).style.display = 'block';
    break;

    case 2 :
    document.getElementById ( 'FAQS' ).style.display = 'block';
    break;

    case 3 :
    document.getElementById ( 'securespot' ).style.display = 'block';
    break;

    case 4 :
    document.getElementById ( 'solutions' ).style.display = 'block';
    break;

    default :
    document.getElementById ( 'problems' ).style.display = 'block';
    break;
  }
}

function renderBackTo( )
{
	if (Firebug)console.info ( 'showBackTo' );
  
  var BackToText = $get ( 'BackTo' );
  if ( BackToText ) BackToText.innerHTML = contentMap.backTo;
  var subRP =  $get( 'SubRP' );
  if(subRP)subRP.style.display = 'block';
  var mainRP =  $get( 'MainRP' );
  if(mainRP)mainRP.style.display = 'none'; 
  
  Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(renderBackTo);
}
function hideBackTo( )
{
  if (Firebug)console.info ( 'hideBackTo' );

  var BackToText = $get ( 'BackTo' );
  if ( BackToText ) BackToText.innerHTML = "";
  var subRP =  $get( 'SubRP' );
  if(subRP)subRP.style.display = 'none';
  var mainRP =  $get( 'MainRP' );
  if(mainRP)mainRP.style.display = 'block'; 
}

function moveDiv( div, direction, count )
{
	if (Firebug)console.info ( 'moveDiv', div, direction, count );

  resetNetworkMap ()
  var divname = $get ( div );
  var DownArrow = $get ( COOKIE_DOWNARROW );
  var RightArrow = $get ( COOKIE_RIGHTARROW );
  var WelcomeBar = $get ( COOKIE_WELCOMEBANNER );
  var tabs = $get ( 'layout_tabs' );
  var rs = $get ( 'layout_rightside' );
  var divCookie = getCookie ( div );
  var movementAcceleration = 1.06;
  var movementSpeed = 100;
  // milliseconds

  if ( divname )
  {
    // Check if the hide button has been clicked
    if ( divCookie != "closed" )
    {
      divname.style.display = "block";
      // get div locations
      var xlocation = parseInt ( divname.offsetLeft );
      var ylocation = parseInt ( divname.offsetTop );
      if ( WelcomeBar == null || getCookie ( 'WelcomeBanner' ) == 'closed' )
      {
        switch ( direction )
        {
          case "Down" :
          // Hide Right Arrow
          if ( RightArrow ) RightArrow.style.display = "none";
          // get tab location
          var tablocation = 0;

          if ( tabs ) tablocation = parseInt ( tabs.offsetTop );

          // Move Div Down
          if ( ( ylocation + 128 ) < tablocation && tablocation != 0 )
          {
              divname.style.top = ( ylocation + ( count * movementAcceleration ) ) + "px";
              setTimeout ( "moveDiv('" + div + "','" + direction + "'," + count * movementAcceleration + ");",
              movementSpeed );
          }
          else
          {
              divname.style.top = tablocation - 128 + "px";
          }
          break;

          case "Right" :
          // Hide Down Arrow
          if ( DownArrow ) DownArrow.style.display = "none";

          if ( WelcomeBar ) WelcomeBar.style.display = "none";
          // get right panel location
          var rslocation = 0;

          if ( rs ) rslocation = parseInt ( rs.offsetLeft );

          // Move Div Right
          if ( ( xlocation + 175 ) < rslocation && rslocation != 0 )
          {
              divname.style.left = ( xlocation + ( count * movementAcceleration ) ) + "px";
              setTimeout ( "moveDiv('" + div + "','" + direction + "'," + count * movementAcceleration + ");",
              movementSpeed );
          }
          else
          {
              divname.style.left = rslocation - 175 + "px";
          }
          break;

          case "Both" :
          if ( RightArrow.style.display == "none" ) moveDiv ( 'DownArrow', 'Down', 5 )
          else moveDiv ( 'RightArrow', 'Right', 5 )
          break;
        }
        // switch(direction)
      }
      else
      {
        if ( WelcomeBar ) WelcomeBar.style.display = "block";

        if ( DownArrow ) DownArrow.style.display = "none";

        if ( RightArrow ) RightArrow.style.display = "none";
      }
    }
  }
}

function welcomeBanner()
{
	if (Firebug)console.info ( 'welcomeBanner' );
	
  var WelcomeBar = $get ( COOKIE_WELCOMEBANNER );
  var WelcomeBarCookie = getCookie(COOKIE_WELCOMEBANNER);

  if ( UI.Device === null && ! isRefreshed())
  NetworkMapIcon_OnClick(0);
}

function hideDivision( divname )
{
	if (Firebug)console.info ( 'hideDivision', divname );
	
  var div = $get ( divname );

  if ( div )
  {
      setCookie ( divname, 'closed' );
      div.style.display = "none";
  }

  if ( divname == "WelcomeBanner" ) moveDiv ( 'DownArrow', 'Both', 5 )
}

function log( msg, msgType )
{
	console.trace();
  var a = arguments;
  if ( ! msgType ) msgType = 'info';
  console.trace();
  Sys.Debug.trace ( 'js: ' + msg );
  if(typeof debugUI != 'undefined')if( ! debugUI)return;
  try
  {
      sendMessage ( msgType, msg );
  }
  catch (e)
  {
      // Do Nothing
  }
}

function expandCollapse( ID )
{
	if (Firebug)console.info ( 'expandCollapse', ID );
	
  var tmp = $get ( ID );

  if ( tmp )
  {
      var src = tmp.src;

      if ( src.indexOf ( 'dot.gif' ) != - 1 )
      {
          // expanded
          tmp.className = 'Expand';
      }
      else if ( src.indexOf ( 'spacer.gif' ) != - 1 )
      {
          // collapsed
          tmp.className = 'Collapse';
      }
  }
}

function WebForm_CallbackComplete_SyncFixed()
{
	if (Firebug)console.info ( 'WebForm_CallbackComplete_SyncFixed' );
    
  // SyncFix : the original version uses "i" as global thereby resulting in javascript errors when "i" is used elsewhere in consuming pages
  for (var i = 0; i < __pendingCallbacks.length;
  i ++ )
  {
    callbackObject = __pendingCallbacks[ i ];
    if (callbackObject && callbackObject.xmlRequest && (callbackObject.xmlRequest.readyState == 4))
    {
      // the callback should be executed after releasing all resources
      // associated with this request.
      // Originally if the callback gets executed here and the callback
      // routine makes another ASP.NET ajax request then the pending slots and
      // pending callbacks array gets messed up since the slot is not released
      // before the next ASP.NET request comes.
      // FIX : This statement has been moved below
      // WebForm_ExecuteCallback(callbackObject);
      if ( ! __pendingCallbacks[ i ].async)
      {
          __synchronousCallBackIndex = - 1;
      }
      __pendingCallbacks[i] = null;

      var callbackFrameID = "__CALLBACKFRAME" + i;
      var xmlRequestFrame = document.getElementById(callbackFrameID);
      if (xmlRequestFrame)
      {
          xmlRequestFrame.parentNode.removeChild(xmlRequestFrame);
      }

      // SyncFix : the following statement has been moved down from above;
      WebForm_ExecuteCallback(callbackObject);
    }
  }
}

if (typeof (WebForm_CallbackComplete) == "function")
{
  // set the original version with fixed version
  WebForm_CallbackComplete = WebForm_CallbackComplete_SyncFixed;
}

/**
* Populates the device types and determines the visibility of OS options.
*/
function ddlNewDeviceCategory_onChange(deviceTypeIndex)
{
	if (Firebug)console.info ( 'ddlNewDeviceCategory_onChange' );

  var ddlCat  = $get(AddNewDeviceControls.ddlNewDeviceCategory);
  var ddlType = $get(AddNewDeviceControls.ddlNewDeviceType);
  var selCat = eval(ddlCat.value);
  var selType = eval(ddlType.value);
  var deviceTypeIndex = eval(deviceTypeIndex);

  ddlType.length = null;

  for ( var i = 0; i < DeviceTypes.Categories.length;
  i ++ )
  {
      if ( DeviceTypes.Categories[i].ID == selCat )
      {
          var max = (is_IE) ? DeviceTypes.Categories[i].Types.length - 1 : DeviceTypes.Categories[i].Types.length;
          for ( var j = 0; j < max; j ++ )
          {
              var opt = new Option ( DeviceTypes.Categories[i].Types[j].Description, DeviceTypes.Categories[i].Types[j].ID );
              ddlType.options[ ddlType.options.length ] = opt;
          }
      }
  }
  $get(AddNewDeviceControls.pnlOS).style.display = (selCat == 1) ? 'block' : 'none';
  $get(AddNewDeviceControls.pnlDeviceTypes).style.display = (selCat > 0) ? 'block' : 'none';
  $get(AddNewDeviceControls.pnlInfo).style.display = (selCat > 0) ? 'block' : 'none';
  $get(AddNewDeviceControls.pnlSaveBtn).style.display = (selCat > 0) ? 'block' : 'none';
  //webcam
  if((selType == 8 || deviceTypeIndex == 8) && selCat == 3)
  {
    $get(AddNewDeviceControls.pnlWebCams).style.display = "block";
    $get(AddNewDeviceControls.pnlWebCamInfo).style.display = "block";
  }
  else
  {
    $get(AddNewDeviceControls.pnlWebCams).style.display = "none";
    $get(AddNewDeviceControls.pnlWebCamInfo).style.display = "none";
    $get(AddNewDeviceControls.txtNewName).value = "";
    $get(AddNewDeviceControls.txtNewIP).value = "";
    $get(AddNewDeviceControls.txtUsername).value = "";
    $get(AddNewDeviceControls.txtPassword).value = "";
    $get(AddNewDeviceControls.txtTCPports).value = "";
    $get(AddNewDeviceControls.txtUDPports).value = "";
    $get(AddNewDeviceControls.txtHTTPport).value = "";
    $get(AddNewDeviceControls.ddlWebCams).value = 0;
  }

  if(deviceTypeIndex > 0)$get(AddNewDeviceControls.ddlNewDeviceType).value = deviceTypeIndex;
}

/**
* Populates the device types and determines the visibility of the webcam options.
*/
function ddlNewDeviceType_onChange(deviceTypeIndex)
{
	if (Firebug)console.info ( 'ddlNewDeviceType_onChange' );

  var ddlType = $get(AddNewDeviceControls.ddlNewDeviceType);
  var selType = eval(ddlType.value);

  //webcam
  $get(AddNewDeviceControls.pnlWebCams).style.display = (selType == 8) ? 'block' : 'none'; 
  $get(AddNewDeviceControls.pnlWebCamInfo).style.display = (selType == 8) ? 'block' : 'none'; 
}


function onCountryCallbackComplete ( result, context )
{
	if (Firebug)console.info ( 'onCountryCallbackComplete', result, context );

  var func = new Function("return " + result);
  var obj = func();
  $get(ShoppingCart.ddCCState).length = null;
  for ( var i = 0; i < obj.states.length - 1;
  i ++ )
  {
      var opt = new Option ( obj.states[i].Name, obj.states[i].ID );
      $get(ShoppingCart.ddCCState).options[ $get(ShoppingCart.ddCCState).options.length ] = opt;
  }
  $get(ShoppingCart.ddCCState).style.display = ( $get(ShoppingCart.ddCCState).options.length <= 1 ) ? 'none' : 'block';
  $get(ShoppingCart.hidStateID).value = $get(ShoppingCart.ddCCState).options[0].value;
}

function onCallbackError ( )
{
	if (Firebug)console.info ( 'onCallbackError' );
	
  console.trace();
  alert('Error loading Client information. Please refresh the page and try requesting again.');
}

function selectArrayItem ( direction, arr, hidIndex, txt, hlNext, hlPrevious )
{
	if (Firebug)console.info ( 'selectArrayItem', direction, arr, hidIndex, txt, hlNext, hlPrevious );
	
  var selIndex = document.getElementById(hidIndex).value;
  var nextIndex;
  if ( direction == 'next' )
  {
      nextIndex = eval(selIndex) + 1;
      document.getElementById(txt).value = arr[nextIndex];
      document.getElementById(hlNext).style.display = (arr.length == nextIndex + 1) ? 'none' : 'block';
      document.getElementById(hlPrevious).style.display = 'block';
      document.getElementById(hidIndex).value = nextIndex;
  }
  else
  {
      nextIndex = eval(selIndex) - 1;
      document.getElementById(txt).value = arr[nextIndex];
      document.getElementById(hlPrevious).style.display = (nextIndex == 0) ? 'none' : 'block';
      document.getElementById(hlNext).style.display = 'block';
      document.getElementById(hidIndex).value = nextIndex;
  }
}

function PromptPopupBlocker( )
{
  // Display Popup Blocker prompt
  if (Firebug)console.info ( 'PromptPopupBlocker' );
  
  $get('divPopupBlockerDetected').style.display = 'block';
}

function ckCookieNumVal(cookie)
{
  // Return a numeric value for a cookie
  if (Firebug)console.info ( 'ckCookieNumVal', cookie );
  
  var tmp = '';
  if(cookie.length > 0)
  {
      tmp = parseInt(cookie);
  }
  else
  {
      tmp = 0;
  }
  return tmp;
}

function loadControl ( controlPath, fullPanel )
{
  if (Firebug)console.info ( 'loadControl', controlPath, fullPanel );

  set_ContentTarget(( fullPanel ) ? 'rightFull' : 'right');
  if(controlPath != null)UI.LoadPanel(controlPath);
  if ( Map.Item[getCookie ( COOKIE_DEVICE )].Type == "WebCam" )
	  ServicesBack_HTML_webcam ();
  else
    ServiceBack_Render();
}

function isRefreshed()
{
  // Checks if the page has recently been refreshed
  if (Firebug)console.info ( 'isRefreshed' );
  
  var refreshVal = $get( MasterControls.hidPageRefresh ).value;
  if(refreshVal == "")
    return true;
  else
    return false;
}

function loadMainControl ( controlPath, target )
{
	if (Firebug)console.info ( 'loadMainControl', controlPath, target );
	
  set_ContentTarget(target);
  UI.LoadPanel(controlPath);
}

function getSelectedCountry ( )
{
	if (Firebug)console.info ( 'getSelectedCountry' );
	
  return 'country|' + $get(ShoppingCart.ddCCCountry).value;
}

function isNumberKey(evt)
{
  var charCode = (evt.which) ? evt.which : event.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57))
  return false;
  return true;
}

function OnDeleteItem ()
{
  return window.confirm ( "Are you sure you want to delete this port?" );
}
