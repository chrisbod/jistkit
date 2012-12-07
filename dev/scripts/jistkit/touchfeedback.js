JistKit.createType(
    ["touch","tracker","feedback"],
    function TouchFeedback(target) {
        JistKit.call(this,target);
        this.classNames = Object.create(this.defaults.classNames);//'clone' the defaultClassNames
        this.enabled = Object.create(this.defaults.enabled);
        this.events = Object.create(this.defaults.events)
        this.feedbackElement = this.createElement();
        this.feedbackClassList = this.feedbackElement.classList;
        document.body.appendChild(this.feedbackElement);
    },
    {
        feedbackOffsetX: 25,//these can be nasty depending on how you are animated your feedback...
        feedbackOffsetY: 25,
        touchstartDelay: 250,//delays for removing classes to allow animation etc
        touchendDelay: 150,
        touchheldDelay: 500,
        touchmoveconfirmDelay: 0,
        classNames: null,
        enabled: null,
        events: null,
        defaults: {
            classNames: {
                element: "jistkit-touchfeedback",
                touchstart: "jistkit-touchstart",
                touchactive: "jistkit-touchactive",
                touchend: "jistkit-touchend",
                touchmoveconfirm: "jistkit-moveconfirm",
                touchhold: "jistkit-touchhold",
                touchchange: "jistkit-touchchange"
            },
            events: {
                touchstart: "jistkit.touchstart",
                touchend: "jistkit.touchend",
                touchhold: "jistkit.touchhold",
                touchmoveconfirm: "jistkit.touchmove.confirm",
                touchchange: "jistkit.touchchange"
            },
            enabled: {
                touchstart: true,
                touchactive: true,
                touchheld: true,
                touchend: true,
                touchmoveconfirm: true,
                touchchanged: true
            }
        },
        createElement: function touchFeedback_createElement(className) {
            var div = document.createElement("div");
            div.classList.add(this.classNames.element);
            return div;
        },
        activate: function touchFeedback_activate() {
            this.element.addEventListener(this.events.touchstart,this,true);
            this.activated = true;
        },
        deactivate: function touchFeedback_deactivate() {
            this.reset();
            this.element.removeEventListener(this.events.touchstart,this,true);
            this.activated = false;
        },
        reset: function touchFeedback_reset() {
            var element = this.element,
                feedbackClassList = this.feedbackClassList,
                classNames = this.classNames,
                events = this.events;

            element.removeEventListener(events.touchend,this,true);
            element.removeEventListener(events.touchmoveconfirm,this,true);
            element.removeEventListener(events.itouchhold,this,true);
            element.removeEventListener(events.touchchange,this,true);

            feedbackClassList.remove(classNames.touchactive);
            feedbackClassList.remove(classNames.touchend);
            feedbackClassList.remove(classNames.touchmoveconfirm);
            feedbackClassList.remove(classNames.touchchange);
            feedbackClassList.remove(classNames.touchhold);
            feedbackClassList.remove(classNames.touchstart);
        },
        dispose: function touchFeedback_dispose() {
            this.reset();
            for (var i in this) {
                delete this[i];
            }
        },
        handleEvent: function touchFeedback_handleEvent(event) {
            console.log(event.type)
            switch(event.type) {
                case this.events.touchstart: return this.handleTouchStart(event);
                case this.events.touchend: return this.handleTouchEnd(event);
                case this.events.touchmoveconfirm: return this.handleTouchMoveConfirm(event);
                case this.events.touchhold: return this.handleTouchHold(event);
            }
            throw new Error("JistKit.TouchFeedback unsupported event ["+event.type+"] received")
        },
        handleTouchStart: function touchFeedback_handleTouchStart(touchStartEvent) {
            var element = this.element,
                events = this.events;
            element.addEventListener(events.touchend,this,true);
            element.addEventListener(events.touchmoveconfirm,this,true);
            element.addEventListener(events.touchhold,this,true);
            element.addEventListener(events.touchchange,this,true);
            this.updatePositionFromEvent(touchStartEvent);
            if (this.enabled.touchstart) {
                this.feedbackClassList.add(this.classNames.touchstart);
                setTimeout(this.feedbackClassList.remove.bind(this.feedbackClassList,this.classNames.touchstart),this.touchstartDelay)
            }
            if (this.enabled.touchactive) {
                this.feedbackClassList.add(this.classNames.touchactive);
            }
        },
        handleTouchEnd: function touchFeedback_handleTouchEnd() {
            if (this.enabled.touchend) {
                this.feedbackClassList.add(this.classNames.touchend);
                setTimeout(this.reset.bind(this),this.touchendDelay);
            } else {
                this.reset();
            }
        },
        handleTouchMoveConfirm: function touchFeedback_handleTouchMoveConfirm() {
            if (this.enabled.touchmoveconfirm) {
                this.feedbackClassList.add(this.classNames.touchmoveconfirm);
                setTimeout(this.reset.bind(this),0);
            } else {
                this.handleTouchEnd();
            }
        },
        handleTouchHold: function touchFeedback_handleTouchHold() {
            if (this.enabled.touchhold) {
                this.feedbackClassList.add(this.touchClasses.touchhold);
                setTimeout(this.reset.bind(this),this.touchholdDelay);
            } 
        },
        updatePositionFromEvent: function touchFeedback_updatePositionFromEvent(eventOrTouch) {
            var bodyRect = document.body.getBoundingClientRect(),
                x = eventOrTouch.clientX-bodyRect.left,
                y = eventOrTouch.clientY-bodyRect.top;
            this.feedbackElement.style.left = (x-this.feedbackOffsetX)+"px";
            this.feedbackElement.style.top = (y-this.feedbackOffsetY)+"px";
        }
    }
);