class Chenxi {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    toString() {
        console.log(`width is ${this.width} height is ${this.height}`)
    }
}
class ChenxiChild extends Chenxi {
    constructor(width, height, length) {
        super(width, height);
        this.length = length;
    }
    toString() {
        console.log(`width is ${this.width} height is ${this.height} length is ${this.length}`)
    }
}
let chenxi = new Chenxi(1, 2);
let chenxiChild = new ChenxiChild(1, 2, 3);