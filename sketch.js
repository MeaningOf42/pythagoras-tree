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

  calcArea() {
    //assume rectangle
    return this.len*p5.Vector.dist(this.point1, this.point2);
  }
}

class Triangle {
  constructor(point1, point2, point3) {
    this.point1 = point1;
    this.point2 = point2;
    this.point3 = point3;
    this.done = false;
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
    if (up.mag()>precision) {
      let unit_up = p5.Vector.div(up, p5.Vector.dist(this.point1, this.point2));
      this.point3.add(p5.Vector.mult(unit_up, len));
    }
    else {
      this.done = true;
    }
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
    let point3 = p5.Vector.sub(point2, point1).normalize().mult(
      p5.Vector.dist(point1, point2)*ratio).add(point1);
    super(point1, point2, point3);
    this.ratio = ratio;
    this.branches = [];
    this.children = [];
  }

  grow() {
    if (!super.isRight()) {
      super.grow(1);
    }
    else if (this.branches[0] instanceof Square && this.branches[1] instanceof Square) {
      if (this.branches[0].calcArea()+this.branches[1].calcArea()
        < Math.pow(p5.Vector.dist(this.point1, this.point2), 2)) {
            this.branches[0].grow(p5.Vector.dist(this.point1, this.point3)/100);
            this.branches[1].grow(p5.Vector.dist(this.point2, this.point3)/100);
          }
      else if (this.children[0] instanceof TreeNode && this.children[1] instanceof TreeNode) {
        if (this.children.reduce((ac, child)=> ac || !child.done, false)) {
          this.children.forEach(function(child) {
              child.grow();
            });
          }
        else {
          this.done = true;
          console.log("time saved");
        }
      }
      else {
        this.children.push(new TreeNode(this.branches[0].point4,
          this.branches[0].point3, this.ratio));
        this.children.push(new TreeNode(this.branches[1].point3,
          this.branches[1].point4, this.ratio));
        }

      }
    else {
      this.branches.push(new Square(this.point1, this.point3, this.point2, 0))
      this.branches.push(new Square(this.point2, this.point3, this.point1, 0))
    }
  }

  show(main_color, branches_color,increment, fast_show) {
    if (!this.done || !fast_show) {
      super.show(main_color);
      this.branches.forEach(function(branch){
        branch.show(branches_color);
      });
      this.children.forEach(function(child) {
        child.show(color(hue(main_color)+increment, saturation(main_color), brightness(main_color)),
          color(hue(branches_color)+increment, saturation(branches_color), brightness(branches_color)),
          increment, fast_show);
      });
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
      this.baseNode.grow();
    }
    else {
      this.baseNode = new TreeNode(this.trunk.point4, this.trunk.point3, this.sideRatio);
    }
  }

  show(fast_show) {
    this.trunk.show(color(50,50,255));
    if (this.baseNode instanceof TreeNode) {
      this.baseNode.show(color(50,255,50), color(50,50,255), 50, fast_show);
    }
  }
}

function third_point(point1, point2, pointIn) {
  pointIn.y = min(point1.y, pointIn.y);
  let mag = p5.Vector.dist(point1, point2)/2;
  let center = p5.Vector.add(point1, mag);
  let fromCenter = p5.Vector.sub(pointIn, center).setMag(mag);
  return p5.Vector.add(center, fromCenter);
}

function mousePressed() {
  mouseDown = true;
}

function mouseReleased() {
  mouseDown = false;
}

function beginGrow() {
  inSetup = false;
  userTree = new Tree(userTriangle);
  background(color(0,0,255));
}

let userTriangle;
let userTree;
let inSetup = true;
let mouseDown = false;
//these points used to create initial Triangle.
let point1;
let point2;
let point3;
let precision = 5;

function setup() {
  colorMode(HSB);
  createCanvas(1080, 620);
  point1 = createVector(450,400);
  point2 = createVector(550,400);
  point3 = createVector(500,360);
  userTriangle = new Triangle(point1, point2, third_point(point1, point2, point3));
  growButton = createButton('Grow');
  growButton.mousePressed(beginGrow);
}

function draw() {
  if (inSetup) {
    background(color(0,0,255));
    if (mouseDown) {
      mouseVector = createVector(mouseX, mouseY);
      userTriangle = new Triangle(point1, point2, third_point(point1, point2, mouseVector));
    }
    noFill();
    stroke(color(0,0,0));
    let mag = p5.Vector.dist(userTriangle.point1, userTriangle.point2);
    let center = p5.Vector.add(userTriangle.point1, p5.Vector.sub(userTriangle.point2, userTriangle.point1).div(2))
    arc(center.x, center.y,mag,mag, PI, 0, PIE);
    userTriangle.show(color(100,255,255));
  }
  else {
    userTree.grow();
    userTree.show(true);
  }
}
