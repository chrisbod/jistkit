JistKit.createType(
    "touchFeedback",
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
                touchmove: "jistkit.touchmove.confirm",
                touchchange: "jistkit.touchchange"
            },
            enabled: {
                touchstart: true,
                touchactive: true,
                touchheld: true,
                touchend: true,
                touchmoveconfirm: false,
                touchchanged: true
            }
        },
        createElement: function (className) {
            var div = document.createElement("div");
            div.classList.add(this.classNames.element);
            return div;
        },
        activate: function () {
            this.element.addEventListener(this.events.touchstart,this,true);
            this.activated = true;
        },
        deactivate: function () {
            this.reset();
            this.element.removeEventListener(this.events.touchstart,this,true);
            this.activated = false;
        },
        reset: function () {
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
                case this.events.touchstart: return this.handleTouchStart(event);
                case this.events.touchend: return this.handleTouchEnd(event);
                case this.events.touchmoveconfirm: return this.handleTouchMoveConfirm(event);
                case this.events.touchhold: return this.handleTouchHold(event);
            }
            throw new Error("JistKit.TouchFeedback unsupported event ["+event.type+"] received")
        },
        handleTouchStart: function (touchStartEvent) {
            var element = this.element;
            element.addEventListener(this.events.touchend,this,true);
            element.addEventListener(this.events.touchmoveconfirm,this,true);
            element.addEventListener(this.events.touchhold,this,true);
            element.addEventListener(this.events.touchchange,this,true);
            this.updatePositionFromEvent(touchStartEvent);
            if (this.enabled.touchstart) {
                this.feedbackClassList.add(this.classNames.touchstart);
                setTimeout(this.feedbackClassList.remove.bind(this.feedbackClassList,this.classNames.touchstart),this.touchstartDelay)
            }
            if (this.enabled.touchactive) {
                this.feedbackClassList.add(this.classNames.touchactive);
            }
        },
        handleTouchEnd: function () {
            if (this.enabled.touchend) {
                this.feedbackClassList.add(this.classNames.touchend);
                setTimeout(this.reset.bind(this),this.touchendDelay);
            } else {
                this.reset();
            }
        },
        handleTouchMoveConfirm: function () {
            if (this.enabled.touchmoveconfirm) {
                this.feedbackClassList.add(this.classNames.touchmoveconfirm);
                setTimeout(this.reset.bind(this),this.touchmoveconfirmDelay);
            } else {
                this.handleTouchEnd();
            }
        },
        handleTouchHold: function () {
            if (this.enabled.touchhold) {
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
    }
);