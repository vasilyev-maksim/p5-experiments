import p5 from "p5";
import type { IControls, IPreset, ISketch } from "../../models";
import { createSketch } from "@core/createSketch";
import { drawVec } from "../utils";

export type Controls = typeof controls;

const controls = {
  GRAVITY: {
    type: "range",
    min: 0,
    max: 10,
    step: 1,
    label: "Gravity",
  },
  ATTRACTOR: {
    type: "range",
    min: 0,
    max: 100,
    step: 1,
    label: "Attractor",
  },
  DEBUG: {
    type: "boolean",
    label: "Debug",
  },
} as const satisfies IControls;

export const factory = createSketch<Controls>(({ p }) => {
  let bodies: Body[] = [];
  let attractors: Attractor[] = [];

  return {
    setup: () => {
      p.background("black");

      const randomOrigin = () => {
        return p.createVector(
          p.random(p.width / 4, (p.width * 3) / 4),
          p.random(p.height / 4, (p.height * 3) / 4),
        );
      };

      const randomSpeed = () => {
        return p.createVector(0, 0);
        // return p.createVector(p.random(), p.random());
      };

      bodies = [
        new Body(0, randomOrigin(), 30, 30, randomSpeed(), p),
        new Body(1, randomOrigin(), 30, 30, randomSpeed(), p),
        // new Body(2, randomOrigin(), 30, 30, randomSpeed(), p),
      ];

      attractors = [
        // new Attractor(
        //   p.createVector((p.width * 3) / 4, p.height / 2),
        //   100,
        //   100,
        //   p,
        // ),
        // new Attractor(p.createVector(p.width / 4, p.height / 2), 100, 100, p),
        ...bodies,
      ];
    },
    draw: () => {
      p.background(p.color(0, 0, 0, 255));

      p.stroke("white");
      p.noFill();

      bodies.forEach((body) => {
        const forces: p5.Vector[] = [];
        // body.applyForce(gravity);
        attractors
          .filter((x) => x !== body)
          .forEach((attr) => {
            const attraction = attr.attract(body);
            forces.push(attraction);
            // body.applyForce(attractionForce);
          });

        const resultingForce = forces.reduce(
          (acc, f) => acc.add(f),
          p.createVector(0, 0),
        );

        body.renderForce(resultingForce);
        body.applyForce(resultingForce);
        body.render();

        // const mouseAttractor = p5.Vector.sub(mouseVec, body.position).setMag(
        //   getParam("ATTRACTOR"),
        // );
        // const forces = [...universalForces, mouseAttractor];
        // const mutualAttraction = bodies
        //   .filter((x) => x !== body)
        //   .map((x) => {
        //     const vec = p5.Vector.sub(x.position, body.position);
        //     if (vec.mag() < body.mass + x.mass) {
        //       vec.mult(-2);
        //     }
        //     let mag =
        //       (getParam("ATTRACTOR") * x.mass * body.mass) / vec.mag() ** 2;
        //     mag = p.constrain(mag, 0, 10);
        //     vec.setMag(mag);
        //     return vec;
        //   });
        // const centerAttractor = p5.Vector.sub(
        //   centerVec,
        //   body.position,
        // ).setMag(5);
        // const forces = [
        //   ...universalForces,
        //   ...mutualAttraction,
        //   centerAttractor,
        // ];
        // body.recalc(forces);
        // if (getParam("DEBUG")) {
        //   p.line(body.position.x, body.position.y, p.mouseX, p.mouseY);
        // }
      });

      attractors.forEach((x) => x.render());
    },
  };
});

const G = 1;

let max = 0;

class Attractor {
  public constructor(
    public id: number,
    public position: p5.Vector,
    public mass: number,
    public diameter: number,
    public readonly p: p5,
  ) {}

  public attract(body: Body): p5.Vector {
    const vec = this.position.copy().sub(body.position);

    const dist = this.p.constrain(vec.mag(), 1, 10000) / 3;
    // const bodyRadius = body.diameter / 2;
    // const attractorRadius = this.diameter / 2;
    const mag = (G * body.mass * this.mass) / (dist * dist);
    if (mag > max) {
      max = mag;
      console.log(mag);
    }

    // repulse if too close (to avoid infinite acceleration)
    // if (dist < bodyRadius + attractorRadius) {
    //   vec.mult(-0.5);
    // }

    // dist = this.p.constrain(dist, 5, 25);
    vec.setMag(mag);
    return vec;
  }

  public render() {
    this.p.push();
    {
      this.p.translate(this.position);
      this.p.stroke("gray");
      this.p.noFill();
      this.p.strokeWeight(1);
      this.p.circle(0, 0, this.diameter);
    }
    this.p.pop();
  }
}

// class Repeller {
//   public constructor(
//     public position: p5.Vector,
//     public readonly mass: number,
//     public readonly p: p5,
//   ) {}

//   public repulse(body: Body): p5.Vector {
//     const vec = this.position.copy().sub(body.position);
//     let dist = vec.mag();
//     // dist = this.p.constrain(dist, 5, 25);
//     const mag = (G * body.mass * this.mass) / dist ** 2;
//     vec.setMag(mag);
//     return vec;
//   }
// }

class Body extends Attractor {
  public constructor(
    id: number,
    position: p5.Vector,
    mass: number,
    diameter: number,
    public velocity: p5.Vector,
    p: p5,
  ) {
    super(id, position, mass, diameter, p);
  }

  public applyForce(force: p5.Vector) {
    const acceleration = force.copy().div(this.mass);
    this.velocity = p5.Vector.add(this.velocity, acceleration);
    this.position = p5.Vector.add(this.position, this.velocity);
  }

  public renderForce(force: p5.Vector) {
    // const vec = this.position.copy().add(force.copy().mult(100));
    // console.log("force mag", force.mag());

    drawVec(this.p, this.position, force.copy().mult(100), "red");
  }

  public render() {
    this.p.push();
    {
      this.p.translate(this.position);
      this.p.circle(0, 0, this.diameter);
      this.p.text(this.id, 0, 0, 100, 100);
    }
    this.p.pop();
  }
}

const presets: IPreset<Controls>[] = [
  {
    params: {
      GRAVITY: 0,
      ATTRACTOR: 1,
      DEBUG: false,
    },
    timeDelta: 1,
    name: "0",
  },
];

export const sketch: ISketch<Controls> = {
  factory,
  id: "bodies",
  name: "bodies",
  preview: {
    sizeInPercents: 45,
  },
  // randomSeed: 44,
  controls,
  presets,
  type: "hidden",
};
