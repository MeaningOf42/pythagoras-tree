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

  grow(len) {
    this.len += len;
    this.calc_points();
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

  grow(len) {
    let up = p5.Vector.sub(this.point2, this.point1).rotate(-HALF_PI);
    let unit_up = p5.Vector.div(up, p5.Vector.dist(this.point1, this.point2));
    this.point3.add(p5.Vector.mult(unit_up, len));
  }

  isRight() {
    let hyp = p5.Vector.dist(this.point1, this.point2);
    let opp = p5.Vector.dist(this.point2, this.point3);
    let adj = p5.Vector.dist(this.point3, this.point1);
    return Math.pow(hyp, 2) <= Math.pow(opp, 2) + Math.pow(adj, 2);
  }
}

class TreeNode extends Triangle {
  constructor(point1, point2, ratio) {
    let point3 = p5.Vector.mult(p5.Vector.sub(point2, point1).normalize(),
      p5.Vector.dist(point1, point2)*ratio);
    super(point1, point2, point3);
    this.branches = [];
    this.children = [];
  }

  grow() {
    if (!super.isRight()) {
      super.grow(1);
    }
  }

}

class Tree {
  constructor(baseTriangle) {
    this.baseLen = Math.abs(baseTriangle.point2.x-baseTriangle.point1.x);
    this.sideRatio = Math.abs(baseTriangle.point3.x-baseTriangle.point1.x)/
      this.baseLen;
    this.trunk = new Square(
      createVector(baseTriangle.point1.x, baseTriangle.point1.y+this.baseLen),
      createVector(baseTriangle.point2.x, baseTriangle.point2.y+this.baseLen),
      createVector(baseTriangle.point2.x, baseTriangle.point2.y+this.baseLen+5),
      0);
  }
  grow(len) {
    if (this.trunk.len < this.baseLen) {
      this.trunk.grow(1);
    }
    else if (this.baseNode instanceof TreeNode) {
      console.log("woot");
    }
    else {
      this.baseNode = new TreeNode(this.trunk.point4, this.trunk.point3, this.sideRatio);
    }
  }

  show() {
    this.trunk.show(color(255,50,50));
  }
}

let testSquare1;
let testSquare2;
let testTree;
let testTriangle;

function setup() {
  createCanvas(620, 620);
  let point1 = createVector(250,400);
  let point2 = createVector(350,400);
  let point3 = createVector(270, 360);
  testTriangle = new Triangle(point1, point2, point3);
  testTree = new Tree(testTriangle);
  //testSquare1 = new Square(point1, point3,point2, 50);
  //testSquare2 = new Square(point2, point3,point1, 50);
}

function draw() {
  background(200);
  // testSquare1.show(color(255,10,10));
  // testSquare2.show(color(255,10,10));
  testTriangle.show(color(10,10,255));
  if (!testTriangle.isRight()) {
    testTriangle.grow(1);
  }
  testTree.show();
  testTree.grow();
}
