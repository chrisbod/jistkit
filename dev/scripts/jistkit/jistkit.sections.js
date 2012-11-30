JistKit.Sections = function JistKit_Sections(jistkit){
    JistKit.call(this,jistkit);
}
JistKit.createType(JistKit.Sections,"sections",JistKit,{
    sectionContainerClassName: "jistkit-sections",
    sectionElementClassName: "jistkit-section",
    split: function () {
        var element = this.element,
            sections;
        element.classList.add(this.sectionContainerClassName);
        sections =  this.splitIntoSections(element.childNodes,element.getBoundingClientRect().bottom);
        element.appendChild(sections);
        element.classList.remove(this.sectionContainerClassName)
        return sections;
    },
    nodeOverflows: function (range,node,bottom) {
        if (node.getBoundingClientRect) {
            return node.getBoundingClientRect().bottom>bottom;
        }
        range.selectNode(node);
        return range.getBoundingClientRect().bottom>bottom;
    },
    splitIntoSections: function (childNodes,bottom) {
        var range = document.createRange(),
            sections = document.createDocumentFragment();
        for (var child=childNodes[0];child;child=child.nextSibling) {
            if (this.nodeOverflows(range,child,bottom)) {
                sections.appendChild(this.splitToFit(range,child,bottom))
            }
        }
        if (this.element.childNodes.length) {
            range.selectNodeContents(this.element);
            sections.appendChild(this.getSectionFromRange(range))
        }
        range.detach()
        return sections;
    },
    splitToFit: function (range,element,bottom) {
        range.selectNode(element);
        return this.getSection(range,element,bottom)
    },
    getSection: function (range,element,bottom) {
        var fragment = document.createDocumentFragment();
        var currentNode = element.lastChild||element;
        if (currentNode.nodeType!=1) {//text node>?
            this.contractRangeToFit(range,currentNode,currentNode.textContent.length,bottom)
            range.setStart(this.element)
            fragment.appendChild(this.getSectionFromRange(range))
            if (element.nodeType!=1) {
                fragment.appendChild(this.getNextTextSection(range,element,bottom))
            }
            return fragment;
        } else {//need to split the node
            throw new Error("Unsupported node")
            return element
        }
    },
    getNextTextSection: function (range,textNode,bottom) {
            range.selectNode(textNode);
            this.contractRangeToFit(range,textNode,textNode.textContent.length,bottom)
            return this.getSectionFromRange(range);
    },
    contractRangeToFit: function (range,node,startPosition,bottom) {
        while (startPosition) {
            range.setEnd(node,--startPosition)
            var rects = range.getClientRects();
            if (rects[rects.length-1].bottom<=bottom) {
                range.setEnd(node,startPosition)
                break;
            } 
        }
        return range;
    },
    getSectionFromRange: function (range) {
        var section = document.createElement("section")
        section.classList.add(this.sectionElementClassName)
        section.appendChild(range.extractContents());
        return section;
    }

})