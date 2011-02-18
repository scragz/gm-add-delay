// ==UserScript==
// @name          ADD Delay
// @description	  Hides specified sites for 30 seconds when loading them to break your bad habits.
// @version       0.1
// @author        scragz
// @namespace     http://scragz.com/
// @matches       <all_urls>
// @run-at 		  document-start
// ==/UserScript==

/* begin configuration */
var config = {
	delay: 30,
	sites: [
		'www.facebook.com',
		'facebook.com'
	]
};
/* end configuration */

(function() {

/* begin scragz' GM utility functions */
var _gt = function(e) { return document.getElementsByTagName(e); };
var _gi = function(e) { return document.getElementById(e); };
var _ce = function(e) { return document.createElement(e); };
var _ct = function(e) { return document.createTextNode(e); };
var _gc = function(clsName)
{
    var elems = document.getElementsByTagName('*');
    var j = 0;
    var arr = new Array();
    for (var i=0; (elem = elems[i]); i++) {
        if (elem.className == clsName) {
            arr[j] = elem;
            j++;
        }
    }
    return (arr.length > 0) ? arr : false;
};
var xpath = function(query, startingPoint)
{
    if (startingPoint == null) {
        startingPoint = document;
    }
    var retVal = document.evaluate(query, startingPoint, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    return retVal;
};
var xpathFirst = function(query, startingPoint)
{
    var res = xpath(query, startingPoint);

    if (res.snapshotLength == 0) return false;
    else return res.snapshotItem(0);
};
var swapNode = function(node, swap)
{
    var nextSibling = node.nextSibling;
    var parentNode = node.parentNode;
    swap.parentNode.replaceChild(node, swap);
    parentNode.insertBefore(swap, nextSibling);
};
var addGlobalStyle = function(css)
{
    var head, style;
    head = _gt('head')[0];
    if (!head) { return; }
    style = _ce('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
};
/* end scragz' GM utility functions */

var hideBody = function()
{
	var body = _gt('body')[0];
	var tries = 0;
	if (!body) {
		tries++;
		if (tries < 25) window.setTimeout(hideBody, 50);
		return;
    }
	body.style.display = 'none';
}

var showBody = function()
{
	var body = _gt('body')[0];
	if (!body) { return; }
	body.style.display = 'block';
}

var countdown = function(num)
{
	var title = _gt('title')[0];
	if (!title) { return; }
	num = Math.abs(parseInt(num));
	var text = title.innerHTML;
	var _countdown = function()
	{
		if (num > 0) {
			num = num - 1;
			title.innerHTML = num+" "+text;
			window.setTimeout(_countdown, 1000)
		} else {
			title.innerHTML = text;
		}
	}
	_countdown();
}

var re = new RegExp('https?://('+config.sites.join('|')+')/.*');
var ref = new RegExp('https?://'+window.location.hostname+'/.*');
if (re.test(window.location.href) && !ref.test(window.document.referrer)) { // why are you looking at this rubbish?
	hideBody();
	window.setTimeout(showBody, config.delay*1000);
	countdown(config.delay);
}

})();