/*TODO:
    Turn this into a proper type with the following method(s)
    simulate: provide touch simulation for browsers
    preventTouchHoldDefault: disable 'contextual' behviour when user presses the element for a long time
    err...

*/
JistKit.createOnDemandProperty(JistKit.prototype,"touch",function JistKitTouch(target){JistKit.call(this,target);});