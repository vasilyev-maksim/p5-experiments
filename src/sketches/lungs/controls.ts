import type { ExtractParams, IControls } from "@/models";

export type Params = ExtractParams<typeof controls>;

export const controls = {
  COLOR: {
    type: "color",
    colors: [["#ff0000ff"], ["#00fbffff"], ["#36ff1fff"], ["#ffffffff"]],
    label: "Color",
  },
} as const satisfies IControls;
