class Square {
  constructor(l, x,y) {
    this.l = l;
    this.x = x;
    this.y = y;
  }

  show(color) {

    fill(color);
    beginShape();
    vertex(this.x       , this.y       );
    vertex(this.x       , this.y+this.l);
    vertex(this.x+this.l, this.y+this.l);
    vertex(this.x+this.l, this.y       );
    endShape();
  }

}

let testSquare;

function setup() {
  createCanvas(620, 620);
  testSquare = new Square(50, 0,0);
}

function draw() {
  background(200);
  testSquare.show(0);
}
