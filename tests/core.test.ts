import { describe, it, expect } from "vitest";
import { Diffuseoss } from "../src/core.js";
describe("Diffuseoss", () => {
  it("init", () => { expect(new Diffuseoss().getStats().ops).toBe(0); });
  it("op", async () => { const c = new Diffuseoss(); await c.process(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new Diffuseoss(); await c.process(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
