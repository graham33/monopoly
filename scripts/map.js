// map.js

// globals
var map = null;

var colours = new Object();
colours["blue"] = "#0044EE";
colours["brown"] = "#430000";
colours["green"] = "#008800";
colours["orange"] = "#EE4400";
colours["pink"] = "#EE00BA";
colours["purple"] = "#880088";
colours["red"] = "#EE0000";
colours["station"] = "#FFFFFF";
colours["yellow"] = "#EEEE00";

function getChild(element, name) {
  var children = element.getElementsByTagName(name);
  if (children.length > 0)
    return children[0];
  else
    return null; 
}
 
function getUrlParam(param) {
  var href = window.location.href;
  if ( href.indexOf("?") > -1 ){
    var queryString = href.substr(href.indexOf("?")).toLowerCase();
    var params = queryString.split("&");
    for (var i=0; i<params.length; ++i) {
      if (params[i].indexOf(param.toLowerCase() + "=") > -1 ){
        var pair = params[i].split("=");
	return unescape(pair[1]);
      }
    }
  }
  return null;
}

var baseIcon = new GIcon();
baseIcon.shadow = "/site_media/images/pin_shadow.png";
baseIcon.iconSize = new GSize(16, 28);
baseIcon.shadowSize = new GSize(40, 28);
baseIcon.iconAnchor = new GPoint(8, 28);
baseIcon.infoWindowAnchor = new GPoint(8, 2);
baseIcon.infoShadowAnchor = new GPoint(16, 20);

var markerIcons = new Array();

function createIcon(colour) {
  var icon = new GIcon(baseIcon);
  icon.image = "/site_media/images/marker_" + colour + ".png";
  markerIcons[colour] = icon;	  
}

createIcon("blue");
createIcon("brown");
createIcon("green");
createIcon("orange");
createIcon("pink");
createIcon("purple");
createIcon("red");
createIcon("station");
createIcon("yellow");


function Stop(point, pub) {
  this._point = point;      
  this._stop = parseInt(pub.getAttribute("stop"));
  this._colour = GXml.value(getChild(pub, "colour"));
  this._name = GXml.value(getChild(pub, "name"));
  this._square = GXml.value(getChild(pub, "square"));

  if (!markerIcons[this._colour]) alert("Can't find icon for colour " + this._colour);

  this._marker = new GMarker(point, markerIcons[this._colour]);

  var overview = "";
  overview += "<hr style='background-color: " + colours[this._colour] + "; width: 350px; height: 10px; border: 1px; border-style: solid; border-color: black; margin-top: 10px'/>";
  overview += "<h2>" + this._stop + ". " + this._square + "</h2>";
  overview += "<img style='float: left; margin-right: 10px' src='" + GXml.value(getChild(pub, "thumbnail")) + "'/>";
  overview += "<div>";
  overview += this._name + "<br/>";
  overview += GXml.value(getChild(pub, "location")) + "<br/>";
  overview += "Time: " + GXml.value(getChild(pub, "time"));
  overview += "</div>";
  overview += "<div style='clear: both'>&nbsp;</div>";

  var description = "<p style='width: 350px; font-size: 9pt'>" + GXml.value(getChild(pub, "description")) + "</p>";

  var directions = "<p style='width: 350px; font-size: 9pt'>" 
    + GXml.value(getChild(pub, "directions"))
    + "</p>";

  this._infoTabs = [
    new GInfoWindowTab("Overview", overview),
    new GInfoWindowTab("Directions", directions),
    new GInfoWindowTab("Description", description)
    ];
}

Stop.prototype._point;
Stop.prototype._stop;
Stop.prototype._colour;
Stop.prototype._marker;
Stop.prototype._name;
Stop.prototype._square;
Stop.prototype._infoTabs;

Stop.prototype.getStop = function() {
  return this._stop;
}

Stop.prototype.getColour = function() {
  return this._colour;
}

Stop.prototype.getMarker = function() {
  return this._marker;
}

Stop.prototype.getSquare = function() {
  return this._square;
}

Stop.prototype.openInfoWindow = function() {
  this._marker.openInfoWindowTabsHtml(this._infoTabs);
}

Stop.prototype.onClick = function() {
  this.openInfoWindow();
}

function Route(url) {
  var self = this;
  self._url = url;

  GDownloadUrl(url, function(data, responseCode) {
    var xml = GXml.parse(data);
    var pubs = xml.documentElement.getElementsByTagName("pub");
    var line = new Array();

    self._stops = new Array();

    for (var i = 0; i < pubs.length; i++) {      
      var location = getChild(pubs[i], ("location"));

      if (location != null) {
	var latitude = location.getAttribute("latitude");
	var longitude = location.getAttribute("longitude");

	if (latitude != null && longitude != null) {
	  var point = new GLatLng(parseFloat(latitude), parseFloat(longitude));	

	  self._stops[i] = new Stop(point, pubs[i]);		
	  line[line.length] = point;
	}
      }
    }

    self._line = new GPolyline(line, "#ff0000", 5, 0.6);

    self.display();

    self._isInitialised = true;
  });

} // Route

Route.prototype._url;
Route.prototype._line;
Route.prototype._stops;
Route.prototype._isInitialised = false;

Route.prototype.getUrl = function() {
  return this._url;
}

Route.prototype.getStop = function(stop) {
  return this._stops[stop];
}

Route.prototype.isInitialised = function() {
  return this._isInitialised;
}

function createMarker(stop) {
  GEvent.addListener(stop.getMarker(), "click", function() {
    stop.onClick();
  });
  map.addOverlay(stop.getMarker());
}

Route.prototype.display = function() {

  var stopsDiv = document.getElementById("stops");

  for (var i = 0; i < this._stops.length; i++) {
    createMarker(this._stops[i]);

    var frag = document.createDocumentFragment();
    var span = document.createElement("span");
    span.style.backgroundColor = colours[this._stops[i].getColour()];
    span.appendChild(document.createTextNode('\u00A0')); // &nbsp;
    frag.appendChild(span);
    var link = document.createElement("a");
    link.setAttribute("href", "javascript: currentRoute.getStop(" + i + ").openInfoWindow();");
    link.appendChild(document.createTextNode(this._stops[i].getStop() + ". " + this._stops[i].getSquare()));
    frag.appendChild(link);
    frag.appendChild(document.createElement("br"));

    stopsDiv.appendChild(frag);
  }

  map.addOverlay(this._line);
}

Route.prototype.hide = function() {
  map.removeOverlay(this._line);

  for (var i = 0; i < this._stops.length; i++) {
    map.removeOverlay(this.getStop(i).getMarker());
  }

  var stopsDiv = document.getElementById("stops");

  while (stopsDiv.hasChildNodes()) {
    stopsDiv.removeChild(stopsDiv.firstChild);
  }
}

var routes = new Object();
var currentRoute = null;
var currentRouteName = null;

function highlight(id) {
  var li = document.getElementById(id);
  if (li != null) {
    var elements = li.parentNode.getElementsByTagName("li");
    
    for (var i=0; i<elements.length; ++i)
      elements[i].style.listStyle = "none";
    
    li.style.listStyle = "circle";
  }
}

function displayRoute(name) {
  var url = "/scripts/" + name + ".xml";
  if (currentRoute != null && currentRoute == routes[url]) {
    return; // no need to redisplay
  }

  if (currentRoute != null) {
    currentRoute.hide();
    currentRoute = null;
  }

  if (currentRoute != null && !currentRoute.isInitialised()) {
    // it's still loading, leave it alone
    return;
  }

  if (routes[url]) {
    currentRoute = routes[url];
    currentRoute.display();
  } else {  
    // creating the route will display it
    routes[url] = new Route(url);
    currentRoute = routes[url];
  }
  currentRouteName = name;

  highlight(url);
}

function printableVersion() {
  if (currentRoute != null) {
    document.location.href = "/route/" + currentRouteName + "/";
  }
}

function load(route) {

  if (GBrowserIsCompatible()) {
    map = new GMap2(document.getElementById("map"));

    map.addControl(new GSmallMapControl());
    map.addControl(new GMapTypeControl());

    var point = new GLatLng(51.517876, -0.119905);
    map.setCenter(point, 13);
            
    displayRoute(route);
  } // is browser compatible
} // load()
