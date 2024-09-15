import { IsArrayEq } from "../ts/common";
// import { Vector, Vector3 } from "@minecraft/server";

class Test {
  x: number;
  y: number;
  z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

test("check array object eq", () => {
  const obj1 = new Test(0, 0, 0);
  const obj2 = new Test(0, 0, 0);
  const result = IsArrayEq<Test>(obj1, obj2);
  expect(result).toBe(true);
});

// test("check vector eq", () => {
//   const obj1: Vector3 = new Vector(0, 0, 0);
//   const obj2: Vector3 = new Vector(0, 0, 0);
//   const result = IsArrayEq<Vector3>(obj1, obj2);
//   expect(result).toBe(true);
// });
