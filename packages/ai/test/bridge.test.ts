// Part of the Chili3d Project, under the AGPL-3.0 License.
// See LICENSE file in the project root for full license information.

import { bridgePortFromUrl, bridgeTargetFromUrl, DEFAULT_BRIDGE_PORT } from "../src/bridge";

describe("bridgePortFromUrl", () => {
    test("is undefined when the page was not asked to connect", () => {
        expect(bridgePortFromUrl("")).toBeUndefined();
        expect(bridgePortFromUrl("?plugin=x")).toBeUndefined();
    });

    test("bare ?bridge means the default port", () => {
        expect(bridgePortFromUrl("?bridge")).toBe(DEFAULT_BRIDGE_PORT);
        expect(bridgePortFromUrl("?bridge=")).toBe(DEFAULT_BRIDGE_PORT);
    });

    test("names the port the URL carries", () => {
        expect(bridgePortFromUrl("?bridge=17374")).toBe(17374);
        expect(bridgePortFromUrl("?model=x&bridge=18000")).toBe(18000);
    });

    test.each([
        "?bridge=0",
        "?bridge=65536",
        "?bridge=abc",
        "?bridge=-1",
        "?bridge=1.5",
        "?bridge=0x10",
        "?bridge=1e3",
        "?bridge=+17373",
    ])("ignores %s", (search) => {
        expect(bridgePortFromUrl(search)).toBeUndefined();
    });
});

describe("bridgeTargetFromUrl", () => {
    test("retains legacy localhost port handling", () => {
        expect(bridgeTargetFromUrl("?bridge=17374")).toBe(17374);
        expect(bridgeTargetFromUrl("?bridge")).toBe(DEFAULT_BRIDGE_PORT);
    });

    test("accepts explicit secure remote WebSocket only", () => {
        expect(bridgeTargetFromUrl("?bridge=wss%3A%2F%2Fcad.example.com%2Fws")).toBe("wss://cad.example.com/ws");
        expect(bridgeTargetFromUrl("?bridge=ws%3A%2F%2Fcad.example.com%2Fws")).toBeUndefined();
        expect(bridgeTargetFromUrl("?bridge=wss%3A%2F%2Fuser%3Apass%40cad.example.com%2Fws")).toBeUndefined();
        expect(bridgeTargetFromUrl("?bridge=wss%3A%2F%2Fcad.example.com%2Fws%3Ftoken%3Dsecret")).toBeUndefined();
        expect(bridgeTargetFromUrl("?bridge=wss%3A%2F%2Fcad.example.com%2Fother")).toBeUndefined();
    });
});
