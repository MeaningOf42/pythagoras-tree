class Square {
  constructor(point1, point2, down_point, len) {
    this.len = len;
    this.point1 = point1;
    this.point2 = point2;
    this.unit_up = p5.Vector.div(p5.Vector.sub(point2,down_point),
    p5.Vector.dist(point2,down_point));
    this.calc_points();
  }

  calc_points() {
    let up = p5.Vector.mult(this.unit_up, this.len);
    this.point3 = p5.Vector.add(this.point2, up);
    this.point4 = p5.Vector.add(this.point1, up);
  }

  show(color) {

    fill(color);
    noStroke();
    beginShape();

    vertex(this.point1.x, this.point1.y);
    vertex(this.point2.x, this.point2.y);
    vertex(this.point3.x, this.point3.y);
    vertex(this.point4.x, this.point4.y);

    endShape();
  }

}

class Triangle {
  constructor(point1, point2, point3) {
    this.point1 = point1;
    this.point2 = point2;
    this.point3 = point3;
  }

  show(color) {
    fill(color);
    noStroke();
    beginShape();

    vertex(this.point1.x, this.point1.y);
    vertex(this.point2.x, this.point2.y);
    vertex(this.point3.x, this.point3.y);

    endShape();
  }
}

let testSquare;
let testTriangle;

function setup() {
  createCanvas(620, 620);
  let point1 = createVector(0,0);
  let point2 = createVector(50,0);
  let point3 = createVector(25, 25);
  let down_point = createVector(50, -50);
  testSquare = new Square(point1, point2,down_point, 50);
  testTriangle = new Triangle(point1, point2, point3);
}

function draw() {
  background(200);
  testSquare.show(color(255,10,10));
  testTriangle.show(color(10,10,255));
}
