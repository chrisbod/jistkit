JistKit.Sections = function JistKit_Sections(jistkit){
    JistKit.call(this,jistkit);
    this.range = document.createRange();
}
JistKit.createType(JistKit.Sections,"sections",JistKit,{
    sectionClassName: "jistkit-section",
    split: function () {
        var element = this.element;
        this.formatOversizeElements();
        this.prepareForReflow()
        this.splitIntoSections(element);
        this.range.detach();
        element.classList.remove(this.sectionContainerClassName);

    },
    prepareForReflow: function () {
        this.element.classList.add("jistkit-sections");
        this.boundingClientRectangle = this.element.getBoundingClientRect();
        this.bottomPerimeter = this.boundingClientRectangle.bottom;
    },
    formatOversizeElements: function () {

    },
    splitIntoSections: function () {
        var fragment = document.createDocumentFragment()
        while (this.element.childNodes.length) {
            fragment.appendChild(this.getNextSection())
        }
        this.element.appendChild(fragment);
        var elements = document.querySelectorAll("div > section");
        for (var i=0;i<elements.length;i++) {
            console.log(elements[i].getBoundingClientRect().height)
        }
        
    },
    getNextSection: function () {
        var section = this.getNewSection(),
            element = this.element;
        element.insertBefore(section,element.firstChild);
        while (element.childNodes.length>1) {
            var availableHeight = this.boundingClientRectangle.height-section.getBoundingClientRect().height
            var currentHeight = section.getBoundingClientRect().height,
                nextHeight = this.getNodeRect(section.nextSibling).height;
            if (nextHeight<availableHeight) {
                section.appendChild(section.nextSibling);
               // continue;
            } else {
                if (section.nextSibling.nodeType == 3) {
                    this.splitNextTextNodeToFit(section)
                } else if (section.nextSibling.nodeType == 1) {
                    this.splitNextNodeToFit(section)

                }
                break;                
            }
        }
        element.removeChild(section)
        return section;
    },
    splitNextTextNodeToFit: function (section) {
        var textNode = section.nextSibling;
        var range = this.range;
        section.appendChild(textNode);
        range.selectNodeContents(textNode)
        var startPosition = textNode.textContent.length;
        while (startPosition) {
            range.setEnd(textNode,--startPosition);
            if (range.getBoundingClientRect().bottom<=this.bottomPerimeter) {
                section.parentNode.insertBefore(textNode.splitText(startPosition),section.nextSibling)
                break
            }
        }
    },
    splitNextNodeToFit: function (section) {
        var nodeToSplit = section.nextSibling;
        if (!nodeToSplit.childNodes) {
            return;
        }
        section.appendChild(nodeToSplit);
        var lastTextNode = this.getLastTextNodeThatStartsInView(nodeToSplit,this.bottomPerimeter),
            range = this.range,
            contents;
        if (lastTextNode) {
            range.selectNode(lastTextNode);
             var startPosition = lastTextNode.textContent.length;
                while (startPosition) {
                    range.setEnd(lastTextNode,--startPosition);
                    if (range.getBoundingClientRect().bottom<=this.bottomPerimeter) {
                        range.setStartBefore(nodeToSplit)
                        contents = range.extractContents()
                        break;
                }
            }
        }
        if (contents) {
            section.replaceChild(contents,nodeToSplit);
            section.parentNode.insertBefore(nodeToSplit,section.nextSibling)
        }
    },
    getLastTextNodeThatStartsInView: function (container,bottom) {

        var iterator = document.createNodeIterator(container,4),
            textNode;
        while (textNode = iterator.nextNode()) {
            this.range.selectNode(textNode);
            if (this.range.getBoundingClientRect().bottom>=bottom) {
                return textNode;
            }
        }
        return null;
    },
    getNewSection: function (fragmentOrNode) {
        var section = document.createElement("section");
        section.classList.add(this.sectionClassName);
        if (fragmentOrNode) {
            section.appendChild(fragmentOrNode);
        }
        return section;
    },
    getNodeRect: function (node) {
        if (node.getBoundingClientRect) {
            return node.getBoundingClientRect();
        }
        this.range.selectNode(node);
        return this.range.getBoundingClientRect();
    },
    rectExtendsBeyondVerticalPerimeter: function (rect) {
        return rect.bottom>this.bottomPerimeter;
    },
    rectIsTallerThanView: function (rect) {
        return rect.height>this.boundingClientRectangle.height
    }

})