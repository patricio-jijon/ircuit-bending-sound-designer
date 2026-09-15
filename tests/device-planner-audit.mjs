import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const source = await readFile(resolve(root, "devices-data.js"), "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context);

const controllers = context.window.DEVICE_CONTROLLERS;
const devices = context.window.DEVICE_LIBRARY;
assert.ok(controllers.length >= 7, "Expected at least seven supported controller boards");
assert.ok(devices.length >= 25, "Expected at least twenty-five supported devices");
assert.equal(new Set(controllers.map((item) => item.id)).size, controllers.length, "Duplicate controller ID");
assert.equal(new Set(devices.map((item) => item.id)).size, devices.length, "Duplicate device ID");

for (const controller of controllers) {
  assert.ok(controller.name && controller.logic && controller.source, `Incomplete controller: ${controller.id}`);
  assert.ok(Array.isArray(controller.interfaces) && controller.interfaces.length, `Missing interfaces: ${controller.id}`);
  assert.ok(controller.note.includes("3.3 V") || controller.note.includes("5 V") || controller.logic, `Missing voltage guidance: ${controller.id}`);
}
for (const device of devices) {
  assert.ok(device.name && device.category && device.model, `Incomplete device: ${device.id}`);
  assert.ok(Array.isArray(device.interfaces) && device.interfaces.length, `Missing interface: ${device.id}`);
  assert.ok(device.note, `Missing pre-build note: ${device.id}`);
}

for (const required of ["led","hcsr04","sg90","dc-motor","mcp3008","sn74hc595","l293d","uln2003","ne555p","tl072cp","cd40106be"]) {
  assert.ok(devices.some((device) => device.id === required), `Missing supported device ${required}`);
}

console.log(`Device planner audit passed: ${controllers.length} boards and ${devices.length} supported devices.`);
