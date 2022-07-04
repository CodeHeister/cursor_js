//-- S M A L L  D O C --//

// moveCursor (e)							- window event, that set custom cursor under the real 
//
// moveCursorScroll (e)						- window event to refrash cursor position on scroll
//
// setCursor (e,							- target event to get target's position, size and toggle cursor's class
//			 sizeRate,						- cursor size (1 - element size (100%), undefined - no change (just draging effect), less or more than 1 - smaller or bigger than target)
//			 additionalClasses)				- toggle additional target's classes on wrap
//			 addScrollOffset)				- add scroll position to cursor position (only if target has position:fixed)
// coordinateCursor (e,						- target event to modify target/cursor while wrapping target
//
//					coordinationPercent,	- cursor shake ratio while wrapping target (undefined - no movement)
//					targetMovementRate,		- target float ratio (1 - follow cursor) 
//					sizeRate,				- cursor size (1 - element size (100%), undefined - no change (just draging effect), less or more than 1 - smaller or bigger than target)
//					centrify,				- (use only if target has transform:translate(-50%, -50%)) 
//					additionalEffects,		- additional transform effects
//					addScrollOffset)		- add scroll position to cursor position (only if target has position:fixed)
//					
// unsetCursor (e,							- target event on cursor out
//				additionalClasses)			- toggle target classes


//-- C U R S O R  F U N C T I O N S --//

var mouseX; // global X cursor position
var mouseY; // global Y cursor position

const moveCursor = e => { // follow real cursor
	showCursor(); // show custom cursor

	if(!cursorIcon.classList.contains('focused')) {
		mouseX = e.clientX; // refresh global cursor X
		mouseY = e.clientY; // refresh global cursor Y
   
		cursor.style.transform = `translate3d(${window.scrollX+mouseX}px, ${window.scrollY+mouseY}px, 0)`; // set new position
	}
}

const moveCursorScroll = e => { // scroll sync
	showCursor(); // show custom cursor
	
	cursor.style.transform = `translate3d(${window.scrollX+mouseX}px, ${window.scrollY+mouseY}px, 0)`; // set position (px)
}

const setCursor = (e, sizeRate, additionalClasses, addScrollOffset) => { // get target position
	if (addScrollOffset == undefined) {
		var addScrollOffset = false;
	}

	mouseX = e.currentTarget.offsetLeft+e.currentTarget.clientWidth/2; // may be commented to optimize
	mouseY = e.currentTarget.offsetTop+e.currentTarget.clientHeight/2; // may be commented to optimize

	cursorIcon.classList.add("focused"); // disables cursor following
	if (addScrollOffset) { 
		cursor.style.transform = `translate3d(${window.scrollX+mouseX}px, ${window.scrollY+mouseY}px, 0)`; // set target position (px)
	} 
	else {
		cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`; // set target position (px)
	}
	
	if (sizeRate != undefined) {
		cursorIcon.style.width = `${e.currentTarget.clientWidth*sizeRate}px`; // set new width
		cursorIcon.style.height = `${e.currentTarget.clientHeight*sizeRate}px`; // set new height
	}

	if (additionalClasses != undefined) {
		additionalClasses.forEach(item => {e.currentTarget.classList.toggle(item)});
	}
}

const coordinateCursor = (e, coordinationPercent, targetMovementRate, centrify, sizeRate, additionalEffects, addScrollOffset) => { // smooth moving targeted cursor (Rate => -1+, Percent -100+)
	if (addScrollOffset == undefined) {
		var addScrollOffset = false;
	}

	mouseX = e.currentTarget.offsetLeft+e.currentTarget.clientWidth/2; // may be commented to optimize
	mouseY = e.currentTarget.offsetTop+e.currentTarget.clientHeight/2; // may be commented to optimize

	var coordinateX = 0;
	var coordinateY = 0;
	if (coordinationPercent != undefined) {
		var coordinateX = parseInt(((e.clientX-e.currentTarget.offsetLeft)/e.currentTarget.clientWidth-0.5)*coordinationPercent);
		var coordinateY = parseInt(((e.clientY-e.currentTarget.offsetTop)/e.currentTarget.clientHeight-0.5)*coordinationPercent);
	}

	if (addScrollOffset) { 
		cursor.style.transform = `translate(${coordinateX}%, ${coordinateY}%) translate3d(${window.scrollX+mouseX}px, ${window.scrollY+mouseY}px, 0)`; // set target position (px)
	} 
	else {
		cursor.style.transform = `translate(${coordinateX}%, ${coordinateY}%) translate3d(${mouseX}px, ${mouseY}px, 0)`; // set target position (px)
	}
	
	if (sizeRate != undefined) {
		cursorIcon.style.width = `${e.currentTarget.clientWidth*sizeRate}px`; // set new width
		cursorIcon.style.height = `${e.currentTarget.clientHeight*sizeRate}px`; // set new height
	}

	if (targetMovementRate != undefined || additionalEffects != undefined) {
		var transform = "";

		if (additionalEffects != undefined) {
			transform = additionalEffects.join(" ");
		}

		if (targetMovementRate != undefined) {
			if (coordinationPercent == undefined) {
				var defaultCoordination = 20;
				var coordinateX = parseInt(((e.clientX-e.currentTarget.offsetLeft)/e.currentTarget.clientWidth-0.5)*defaultCoordination);
				var coordinateY = parseInt(((e.clientY-e.currentTarget.offsetTop)/e.currentTarget.clientHeight-0.5)*defaultCoordination);
			}
			
			if (centrify) {
				transform += ` translate(${-50+coordinateX*targetMovementRate}%, ${-50+coordinateY*targetMovementRate}%)`;
			}
			else {
				transform += ` translate(${coordinateX*targetMovementRate}%, ${coordinateY*targetMovementRate}%)`;
			}
		}

		e.currentTarget.style.transform = transform;
	}
}

const unsetCursor = (e, additionalClasses) => {
	cursorIcon.classList.remove("focused"); // enable following

	cursorIcon.style.width = null; // erase width
	cursorIcon.style.height = null; // erase height

	e.currentTarget.style.transform = null;

	if (additionalClasses != undefined) {
		additionalClasses.forEach(item => {e.currentTarget.toggle(item)});
	}
}

const showCursor = e => { // show custom cursor
 
    if(cursor.classList.contains('cursor-hidden')) {
        cursor.classList.remove('cursor-hidden');
    }
 
    cursor.classList.add('cursor-visible');
 
}

const hideCursor = e => { // hide custom cursor
	
	if(cursor.classList.contains('cursor-visible')) {
		cursor.classList.remove('cursor-visible');
    
	}
	cursor.classList.add('cursor-hidden');
}

//- E N A B L E  C U R S O R -//

var cursor = document.querySelector(".cursor");
var cursorIcon = document.querySelector(".cursor-icon");

window.addEventListener('mousemove', moveCursor);
window.addEventListener('scroll', moveCursorScroll);

document.body.addEventListener('mouseleave', hideCursor);

document.querySelectorAll(".example1").forEach(item => { 
	item.addEventListener("mouseover", e => {setCursor(e, 1)});
	item.addEventListener("mousemove", e => {coordinateCursor(e, 40, 0.2, undefined, undefined, ["scale(1.2)"])});
	item.addEventListener("mouseout", unsetCursor);
});

document.querySelectorAll(".example2").forEach(item => { 
	item.addEventListener("mouseover", e => {setCursor(e, 1)});
	item.addEventListener("mousemove", e => {coordinateCursor(e, 40, undefined, undefined, undefined, ["scale(1.2)"])});
	item.addEventListener("mouseout", unsetCursor);
});

document.querySelectorAll(".example3").forEach(item => { 
	item.addEventListener("mouseover", e => {setCursor(e, 1)});
	item.addEventListener("mousemove", e => {coordinateCursor(e, undefined, undefined, undefined, undefined, ["scale(1.2)"])});
	item.addEventListener("mouseout", unsetCursor);
});

document.querySelectorAll(".example4").forEach(item => { 
	item.addEventListener("mouseover", e => {setCursor(e, 1)});
	item.addEventListener("mousemove", e => {coordinateCursor(e, undefined, 0.2, undefined, undefined, ["scale(1.2)"])});
	item.addEventListener("mouseout", unsetCursor);
});

document.querySelectorAll(".example5").forEach(item => { 
	item.addEventListener("mouseover", e => {setCursor(e, 0.8)});
	item.addEventListener("mousemove", e => {coordinateCursor(e, 40, 0.1, undefined, undefined, ["scale(1.3)"])});
	item.addEventListener("mouseout", unsetCursor);
});

document.querySelectorAll(".example6").forEach(item => { 
	item.addEventListener("mouseover", e => {setCursor(e, 0.8)});
	item.addEventListener("mousemove", e => {coordinateCursor(e, 40, 0.2, undefined, undefined, ["scale(1.2)"])});
	item.addEventListener("mouseout", unsetCursor);
});
