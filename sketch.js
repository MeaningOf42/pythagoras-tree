class Square {
  constructor(point1, point2, down_point, len) {
    this.point1 = point1;
    this.point2 = point2;
    this.unit_up = p5.Vector.div(p5.Vector.sub(point2,down_point), \
    p5.Vector.dist(point2,down_point));
    this.calc_points();
  }

  calc_points() {
    let up = p5.Vector.mult(this.unit_up, len);
    this.point3 = p5.Vector.add(point2, up);
    this.point4 = p5.Vector.add(point1, up);
  }

  show(color) {

    fill(color);
    beginShape();

    vertex(point1.x, point1.y);
    vertex(point2.x, point2.y);
    vertex(point3.x, point3.y);
    vertex(point4.x, point4.y);

    endShape();
  }

}

let testSquare;

function setup() {
  createCanvas(620, 620);
  let point1 = createVector(0,0);
  let point2 = createVector(50,0);
  let down_point = createVector(0, -50);
  testSquare = new Square(50, 0,0);
}

function draw() {
  background(200);
  testSquare.show(0);
}
