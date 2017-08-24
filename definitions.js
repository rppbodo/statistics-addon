'use strict';

var ELEMENT_NODE = 1;
var ATTRIBUTE_NODE = 2;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;

var attributes = ['width', 'height', 'top', 'left', 'padding', 'borderWidth', 'margin'];

var nTags = 0;
var tagHist = {};
var globalStyle = {};
var tagStyle = {};

var init = function() {
	nTags = 0;
	tagHist = {};
	globalStyle = {};
	tagStyle = {};

	for (var i in attributes) {
		var attr = attributes[i];
		globalStyle[attr] = [];
	}
};

var insertStyle = function(element) {
	globalStyle['width'].push(element.offsetWidth);
	tagStyle[element.tagName]['width'].push(element.offsetWidth);

	globalStyle['height'].push(element.offsetHeight);
	tagStyle[element.tagName]['height'].push(element.offsetHeight);

	globalStyle['top'].push(element.offsetTop);
	tagStyle[element.tagName]['top'].push(element.offsetTop);

	globalStyle['left'].push(element.offsetLeft);
	tagStyle[element.tagName]['left'].push(element.offsetLeft);

	var style = getComputedStyle(element, null);

	globalStyle['padding'].push(getPadding(style));
	tagStyle[element.tagName]['padding'].push(getPadding(style));

	globalStyle['borderWidth'].push(getBorderWidth(style));
	tagStyle[element.tagName]['borderWidth'].push(getBorderWidth(style));

	globalStyle['margin'].push(getMargin(style));
	tagStyle[element.tagName]['margin'].push(getMargin(style));
};

var load = function(element) {
	nTags += 1;
	if (element.tagName in tagHist) {
		tagHist[element.tagName] += 1;
	} else {
		tagHist[element.tagName] = 1;
		tagStyle[element.tagName] = {};
		for (var i in attributes) {
			var attr = attributes[i];
			tagStyle[element.tagName][attr] = [];
		}
	}
	insertStyle(element);

	var children = element.childNodes;
	if (children.length != 0) {
		var i;
		for (var i = 0; i < children.length; i++) {
			var item = children[i];
			if (item.nodeType == ELEMENT_NODE) {
				load(item);
			}
		}
	}
};

var sortObject = function(dict) {
	var keys = Object.keys(dict).sort(function(a,b) { return dict[b] - dict[a] });
	var obj = {};
	for (var i = 0; i < keys.length; i++) {
		k = keys[i];
		obj[k] = dict[k];
	}
	return obj;
};

var dataURItoBlob = function(dataURI, type) {
	var byteString = atob(dataURI.split(',')[1]);
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	var bb = new Blob([ab], { type: type });
	return bb;
};

var formatFloat = function(f) {
	return parseFloat(Math.round(f * 100) / 100).toFixed(2);
};

var normalize = function(array) {
	var min = Math.min.apply(Math, array);
	var max = Math.max.apply(Math, array);

	for (var i = 0; i < array.length; i++) {
		array[i] = (array[i] - min) / max;
	}

	return array;
};

var getNumber = function(measure) {
	return parseInt(measure.replace(/[^-\d\.]/g, '')) || 0;
};

var sumNumbers = function(measure) {
	var parts = measure.split(" ");
	var sum = 0;
	var i;
	for (i = 0; i < parts.length; i++) {
		sum += getNumber(parts[i]);
	}
	return sum;
};

var getPadding = function(style) {
	var p = sumNumbers(style.padding);
	var pt = getNumber(style.paddingTop);
	var pl = getNumber(style.paddingLeft);
	var pb = getNumber(style.paddingBottom);
	var pr = getNumber(style.paddingRight);
	return p + pt + pl + pb + pr;
};

var getBorderWidth = function(style) {
	var bw = sumNumbers(style.borderWidth);
	var btw = getNumber(style.borderTopWidth);
	var blw = getNumber(style.borderLeftWidth);
	var bbw = getNumber(style.borderBottomWidth);
	var brw = getNumber(style.borderRightWidth);
	return bw + btw + blw + bbw + brw;
};

var getMargin = function(style) {
	var m = sumNumbers(style.margin);
	var mt = getNumber(style.marginTop);
	var ml = getNumber(style.marginLeft);
	var mb = getNumber(style.marginBottom);
	var mr = getNumber(style.marginRight);
	return m + mt + ml + mb + mr;
};
