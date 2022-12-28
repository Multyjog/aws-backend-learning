import { functions } from "../src/functions";

test("2 + 2 is 4", () => {
  expect(functions.add(2, 2)).toBe(4);
});
