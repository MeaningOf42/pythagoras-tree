class Square {
  constructor(l, x,y) {
    this.l = l;
    this.x = x;
    this.y = y;
  }

  show(color) {
    var point1 = [this.x       , this.y       ];
    var point2 = [this.x       , this.y+this.l];
    var point3 = [this.x+this.l, this.y+this.l];
    var point4 = [this.x+this.l, this.y       ];

    fill(color);
    beginShape();
    vertex(point1);
    vertex(point2);
    vertex(point3);
    vertex(point4);
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
