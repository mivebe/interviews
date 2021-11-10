const element = document.getElementById("test");
console.log("Test Element ", element);
class UniversalDOMManipulator {
    setHeight(el, height) {
        el.style.height = height;
    }
    setWidth(el, width) {
        el.style.width = width;
    }
    setPadding(el, padding) {
        el.style.padding = padding;
    }
    setMargin(el, margin) {
        el.style.margin = margin;
    }
    getPosition(el) {
        return el.getBoundingClientRect();
    }
    addClick(el, callback) {
        el.addEventListener("click", callback);
    }
}
const DOMManipulator = new UniversalDOMManipulator;
DOMManipulator.setHeight(element, "500px");
DOMManipulator.setWidth(element, "500px");
DOMManipulator.setPadding(element, "50px");
DOMManipulator.setMargin(element, "100px");
console.log("Test Element Position => ", DOMManipulator.getPosition(element));
DOMManipulator.addClick(element, ev => ev.target.style.backgroundColor = ("#" + Math.floor(Math.random() * 16777215).toString(16)));
