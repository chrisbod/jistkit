//BUGS: broken by comments;

/*
Need to change approach

First find ALL elements that are too big to fit and decide what to do 
images,tables,iframes, objects, form elements, video, canvas, hrs (solid elements) will need special treatment

I suspect that best strategy would be 
a) to shrink to largest size possible in one 'section'
block level elements that are too wide will also neeed to be handled here (width removed etc)
b) then iterate through top level nodes looking for first node that is too tall to fit current view
when we find it
    b1) break column if it contains one of the nodes above we found above and resized creating a new section. goto b)
    b2) find first element that overflows look for the element that causes the overflow 
    giving precedence to any 'solid' elements. 
        b2.1) if it is a solid element (regardless of size) then 
        split it's parent element at the point before that element and create new section from before and after
        b2.1.1) check to see if new split element fits if not goto b2)
        b2.2) split the element at the point it overflows creating new section;

        HMMMMM








*/
Jistkit.Sections = function Jistkit_Sections(jistkit){
    Jistkit.call(this,jistkit);
}
Jistkit.createType(Jistkit.Sections,"sections",Jistkit,{
    sectionContainerClassName: "jistkit-sections",
    sectionElementClassName: "jistkit-section",
    split: function () {
        var element = this.element,
            sections;
        this.clean(element);
        element.classList.add(this.sectionContainerClassName);
        sections =  this.splitIntoSections(element);
        element.appendChild(sections);
        element.classList.remove(this.sectionContainerClassName)
        return sections;
    },
    clean: function (element) {
        return element


    },
    nodeOverflows: function (range,node,bottom) {
        if (node.getBoundingClientRect) {
            return node.getBoundingClientRect().bottom>bottom;
        }
        range.selectNode(node);
        return range.getBoundingClientRect().bottom>bottom;
    },
    splitIntoSections: function (element) {
        var range = document.createRange(),
            sections = document.createDocumentFragment(),
            bottom = element.getBoundingClientRect().bottom;
        for (var i=0;child=element.childNodes[i];i++) {             
            if (this.nodeOverflows(range,child,bottom)) {

                 sections.appendChild(this.splitToFit(range,child,bottom))
             }
        }
        if (this.element.childNodes.length) {
            range.selectNodeContents(this.element);
            sections.appendChild(this.getSectionFromRange(range))
        }
        range.detach();
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
            //if (element.nodeType!=1) {
                fragment.appendChild(this.getNextTextSection(range,element,bottom))
           // }
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