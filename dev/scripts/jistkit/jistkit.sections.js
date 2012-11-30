JistKit.Sections = function JistKit_Sections(jistkit){
    JistKit.call(this,jistkit);
}
JistKit.createType(JistKit.Sections,"sections",JistKit,{
    sectionContainerClassName: "jistkit-sections",
    sectionElementClassName: "jistkit-section",
    split: function () {
        var element = this.element,
            containerRectangle,
            rectangles,
            sections;
        element.classList.add(this.sectionContainerClassName);
        this.boundingClientRect = element.getBoundingClientRect()
        sections =  this.splitIntoSections(element.childNodes);
        element.appendChild(sections)
        element.classList.remove(this.sectionContainerClassName)
        return sections;
    },
    nodeOverflows: function (node,bottom) {

        if (node.getBoundingClientRect) {
            return node.getBoundingClientRect().bottom>bottom;
        }
        var range = document.createRange()
        range.selectNode(node)
        return range.getBoundingClientRect().bottom>bottom;
    },
    splitIntoSections: function (childNodes) {
        var boundingRectangle = this.element.getBoundingClientRect(),
            bottom = this.boundingClientRect.bottom,
            elementToSplit,
            range = document.createRange()
        var sections = document.createDocumentFragment();
        for (var child=childNodes[0];child;child=child.nextSibling) {

            if (this.nodeOverflows(child,bottom)) {
                sections.appendChild(this.splitToFit(child))
            }
        }
        if (this.element.childNodes.length) {
            range.selectNodeContents(this.element);
            var section = document.createElement("section")
            section.classList.add(this.sectionElementClassName)
            section.appendChild(range.extractContents())
            sections.appendChild(section)
        }
        range.detach()
        return sections;
    },
    splitToFit: function (element) {

        var range = document.createRange()
        var bottom = this.boundingClientRect.bottom;
        range.selectNode(element);

        var section = this.getSection(range,element,bottom)
        range.detach();
        return section
    },
    getSection: function (range,element,bottom) {
        var fragment = document.createDocumentFragment()
        var currentNode = element.lastChild||element;
        //console.log(element.textContent.length)
        if (currentNode.nodeType!=1) {//text node>?
            var startPos = currentNode.textContent.length;
            while (startPos) {
                range.setEnd(currentNode,--startPos)
                var rects = range.getClientRects();
                if (rects[rects.length-1].bottom<=bottom) {
                    range.setEnd(currentNode,startPos)
                    break;
                } 
            }
            range.setStart(this.element)
  
            
            var section = document.createElement("section")
            section.classList.add(this.sectionElementClassName)
            section.appendChild(range.extractContents());
            fragment.appendChild(section)
            if (element.nodeType!=1) {
                fragment.appendChild(this.getNextTextSection(range,element,bottom))
            }
            return fragment;
        } else {//need to split the node

            return element
        }
    },
    getNextTextSection: function (range,textNode,bottom) {
            var startPos = textNode.textContent.length;
            range.selectNode(textNode);
            while (startPos) {
                range.setEnd(textNode,--startPos)
                var rects = range.getClientRects();
                if (rects[rects.length-1].bottom<=bottom) {
                    range.setEnd(textNode,startPos)
                    break;
                } 
            }
            var section = document.createElement("section")
            section.classList.add(this.sectionElementClassName)
            section.appendChild(range.extractContents()); 
            return section
        
            
            

        //}
    }

})