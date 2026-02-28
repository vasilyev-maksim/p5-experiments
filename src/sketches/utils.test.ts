import { describe, expect, test, vi } from "vitest";
import { rotate } from "./utils";

vi.mock("p5", () => {
  return { default: {} };
});

describe("rel dirs", () => {
  test("getRelToRelDir()", () => {
    expect(rotate("up", "up")).toBe("up");
    expect(rotate("up", "down")).toBe("down");
    expect(rotate("up", "left")).toBe("left");
    expect(rotate("up", "right")).toBe("right");

    expect(rotate("down", "up")).toBe("down");
    expect(rotate("down", "down")).toBe("up");
    expect(rotate("down", "left")).toBe("right");
    expect(rotate("down", "right")).toBe("left");

    expect(rotate("left", "up")).toBe("left");
    expect(rotate("left", "down")).toBe("right");
    expect(rotate("left", "left")).toBe("down");
    expect(rotate("left", "right")).toBe("up");

    expect(rotate("right", "up")).toBe("right");
    expect(rotate("right", "down")).toBe("left");
    expect(rotate("right", "left")).toBe("up");
    expect(rotate("right", "right")).toBe("down");
  });
});
