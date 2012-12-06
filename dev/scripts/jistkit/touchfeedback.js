JistKit.TouchTracker.TouchFeedback = function TouchFeedback(target) {
    if (target instanceof JistKit) {
        this.target = target.element;
        JistKit.call(this,target);
    } else if (target)  {
        this.target = target;
    }
    this.classNames = Object.create(this.defaultClassNames);//'clone' the defaultClassNames
    this.feedbackElement = this.createElement();
    this.feedbackClassList = this.feedbackElement.classList;
    document.body.appendChild(this.feedbackElement);
};
JistKit.createType(JistKit.TouchTracker.TouchFeedback,"touchFeedback",JistKit,{
    touchstart: true,
    touchactive: true,
    touchheld: true,
    touchend: true,
    touchmoveconfirm: false,
    touchchanged: true,

    touchstartEvent: JistKit.TouchTracker.prototype.touchstartEvent,
    touchendEvent: JistKit.TouchTracker.prototype.touchendEvent,
    touchholdEvent: JistKit.TouchTracker.prototype.touchholdEvent,
    touchmoveconfirmEvent: JistKit.TouchTracker.prototype.touchmoveconfirmEvent,
    touchchangeEvent: JistKit.TouchTracker.prototype.touchchangeEvent,

    feedbackOffsetX: 25,//these can be nasty depending on how you are animated your feedback...
    feedbackOffsetY: 25,
    //delays for removing classes to allow animation etc
    touchstartDelay: 250,
    touchendDelay: 150,
    touchheldDelay: 500,
    touchmoveconfirmDelay: 0,

    defaultClassNames: {
        element: "jistkit-touchfeedback",
        touchstart: "jistkit-touchstart",
        touchactive: "jistkit-touchactive",
        touchend: "jistkit-touchend",
        touchmoveconfirm: "jistkit-moveconfirm",
        touchhold: "jistkit-touchhold",
        touchchange: "jistkit-touchchange"
    },
    createElement: function (className) {
        var div = document.createElement("div");
        div.classList.add(this.classNames.element);
        return div;
    },
    activate: function () {
        this.element.addEventListener(this.touchstartEvent,this,true);
        this.activated = true;
    },
    deactivate: function () {
        this.reset();
        this.element.removeEventListener(this.touchstartEvent,this,true);
        this.activated = false;
    },
    reset: function () {
        var element = this.element,
            feedbackClassList = this.feedbackClassList,
            classNames = this.classNames;
        element.removeEventListener(this.touchendEvent,this,true);
        element.removeEventListener(this.touchmoveconfirmEvent,this,true);
        element.removeEventListener(this.touchholdEvent,this,true);
        element.removeEventListener(this.touchchangeEvent,this,true);
        feedbackClassList.remove(classNames.touchactive);
        feedbackClassList.remove(classNames.touchend);
        feedbackClassList.remove(classNames.touchconfirmmove);
        feedbackClassList.remove(classNames.touchchange);
        feedbackClassList.remove(classNames.touchhold);
        feedbackClassList.remove(classNames.touchstart);
    },
    dispose: function () {
        this.reset();
        for (var i in this) {
            delete this[i];
        }
    },
    handleEvent: function (event) {
        switch(event.type) {
            case this.touchstartEvent: return this.handleTouchStart(event);
            case this.touchendEvent: return this.handleTouchEnd(event);
            case this.touchmoveconfirmEvent: return this.handleTouchMoveConfirm(event);
            case this.touchholdEvent: return this.handleTouchHold(event);
        }
        throw new Error("JistKit.TouchFeedback unsupported event ["+event.type+"] received")
    },
    handleTouchStart: function (touchStartEvent) {
        var element = this.element;
        element.addEventListener(this.touchendEvent,this,true);
        element.addEventListener(this.touchmoveconfirmEvent,this,true);
        element.addEventListener(this.touchholdEvent,this,true);
        element.addEventListener(this.touchchangeEvent,this,true);
        this.updatePositionFromEvent(touchStartEvent);
        if (this.touchstart) {
            this.feedbackClassList.add(this.classNames.touchstart);
            setTimeout(this.feedbackClassList.remove.bind(this.feedbackClassList,this.classNames.touchstart),this.touchstartDelay)
        }
        if (this.touchactive) {
            this.feedbackClassList.add(this.classNames.touchactive);
        }
    },
    handleTouchEnd: function () {
        if (this.touchend) {
            this.feedbackClassList.add(this.classNames.touchend);
            setTimeout(this.reset.bind(this),this.touchendDelay);
        } else {
            this.reset();
        }
    },
    handleTouchMoveConfirm: function () {
        if (this.touchmoveconfirm) {
            this.feedbackClassList.add(this.classNames.touchmoveconfirm);
            setTimeout(this.reset.bind(this),this.touchmoveconfirmDelay);
        } else {
            this.handleTouchEnd();
        }
    },
    handleTouchHold: function () {
        if (this.touchhold) {
            this.feedbackClassList.add(this.touchClasses.touchhold);
            setTimeout(this.reset.bind(this),this.touchholdDelay);
        } 
    },
    updatePositionFromEvent: function (eventOrTouch) {
        var bodyRect = document.body.getBoundingClientRect(),
            x = eventOrTouch.clientX-bodyRect.left,
            y = eventOrTouch.clientY-bodyRect.top;
        this.feedbackElement.style.left = (x-this.feedbackOffsetX)+"px";
        this.feedbackElement.style.top = (y-this.feedbackOffsetY)+"px";
    }
});