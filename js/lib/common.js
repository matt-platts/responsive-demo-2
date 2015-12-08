/* 
 * File: common.js
 * Meta: common shared library functions, not specific to business logic
*/


/*
 * Function: whenDocumentLoaded
 * Param fn (string) - function to call when the document is ready 
*/
function whenDocumentLoaded(fn) {
	if (document.readyState != 'loading'){
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}


/*
 * Function: isInViewport
 * Param el (Object) - the page element
 * Meta: Tells us whether an element is in the part of the page currently displayed (without having to scroll etc)
*/
function isInViewport(el) {
    var elemTop = el.getBoundingClientRect().top;
    var elemBottom = el.getBoundingClientRect().bottom;

    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    return isVisible;
}
