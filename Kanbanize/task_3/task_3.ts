const element = document.getElementById("test")
console.log("Test Element ", element);


class UniversalDOMManipulator {

    setHeight(el: HTMLElement, height: string): void {
        el.style.height = height
    }
    setWidth(el: HTMLElement, width: string): void {
        el.style.width = width
    }
    setPadding(el: HTMLElement, padding: string): void {
        el.style.padding = padding
    }
    setMargin(el: HTMLElement, margin: string): void {
        el.style.margin = margin
    }
    getPosition(el: HTMLElement): DOMRect {
        return el.getBoundingClientRect()
    }
    addClick(el: HTMLElement, callback) {
        el.addEventListener("click", callback)
    }

}
const DOMManipulator = new UniversalDOMManipulator;
DOMManipulator.setHeight(element, "500px");
DOMManipulator.setWidth(element, "500px");
DOMManipulator.setPadding(element, "50px");
DOMManipulator.setMargin(element, "100px");
console.log("Test Element Position => ", DOMManipulator.getPosition(element));
DOMManipulator.addClick(element, ev => ev.target.style.backgroundColor = ("#" + Math.floor(Math.random() * 16777215).toString(16)));
