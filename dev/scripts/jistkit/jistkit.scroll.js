Jistkit.Scroll = function Jistkit_Scroll(jistkit) {
    Jistkit.call(this,jistkit);
    this.computedStyle = getComputedStyle(this.element,null)
}
Jistkit.createType(
    Jistkit.Scroll,
    Jistkit,
    "scroll",
    {
        overflowValues: ["scroll","auto"],
        overflowProperties: ["overflow","overflowX","overFlowY"],
        isCapturingScrolling: false,
        elementCanScroll: function Jistkit_scroll_elementCanScroll() {
            for (var i=0;i!=this.overflowProperties.length;i++) {
                if (this.overflowProperties.indexOf(this.computedStyle[this.overflowProperties[i]]) != -1) {
                    return true;
                }
            }
            return false;
        },
        hasTouchScrolling: function Jistkit_scroll_elementHasTouchScrolling() {
            return this.computedStyle.webkitOverflowScrolling == "touch";
        },
        isOverflowing: function Jistkit_scroll_isOverflowing(x,y) {
            var element = this.element,
                overflowsX = element.clientWidth < element.scrollWidth,
                overflowsY = element.clientHeight < element.scrollHeight;
            if (x==y) {
                return overflowsX||overflowsY;
            }
            if (y) {
                return overflowsY;
            }
            if (x) {
                return overflowsX;
            }
            throw new Error("Illegal arguments passed to Jistkit Scroll")
        },
        captureScrolling: function Jistkit_scroll_captureScrolling() {
            this.isCapturingScrolling = true;
            ///
        },
        releaseScrolling: function Jistkit_scroll_releaseScrolling() {
            this.isCapturingScrolling = false;
            ///
        }
    },
    {
        element: {
            get: function () {
                return this.jistkit.element;
            }
        }
    }
)