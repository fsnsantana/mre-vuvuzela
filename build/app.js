"use strict";
/*!
 * Copyright (c) The Free MRE Foundation. All rights reserved.
 * Licensed under the MIT License.
 
 * Copyright (c) Francisco Santana Neto. All rights reserved.
 * Licensed under the MIT License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mixed_reality_extension_sdk_1 = require("@microsoft/mixed-reality-extension-sdk");
/**
 * The main class of this app. All the logic goes here.
 */
class App {
    constructor(context, params) {
        this.context = context;
        this.assets = new mixed_reality_extension_sdk_1.AssetContainer(this.context);
        this.mouths = new Map();
        this.vuvuzelas = new Map();
        this.buzzing = new Map();
        this.context.onStarted(() => this.started());
        this.context.onUserJoined((u) => this.userjoined(u));
        this.context.onUserLeft((u) => this.userleft(u));
    }
    /**
     * Once the context is "started", initialize the app.
     */
    started() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    createVuvuzela(user) {
        if (this.vuvuzelas.has(user.id))
            return;
        const vuvuzela = mixed_reality_extension_sdk_1.Actor.CreateFromLibrary(this.context, {
            resourceId: 'artifact:2143270789623841562',
            actor: {
                transform: {
                    local: {
                        position: { x: -0.3, y: 0, z: 0.08 },
                        rotation: mixed_reality_extension_sdk_1.Quaternion.FromEulerAngles(-90 * mixed_reality_extension_sdk_1.DegreesToRadians, 0, -90 * mixed_reality_extension_sdk_1.DegreesToRadians),
                        scale: { x: 0.75, y: 0.75, z: 0.75 }
                    }
                },
                attachment: {
                    userId: user.id,
                    attachPoint: 'left-hand'
                }
            }
        });
        this.vuvuzelas.set(user.id, vuvuzela);
        const trigger = mixed_reality_extension_sdk_1.Actor.Create(this.context, {
            actor: {
                name: "vuvuzela_trigger",
                owner: user.id,
                parentId: vuvuzela.id,
                appearance: {
                    meshId: this.assets.createBoxMesh('box', 0.06, 0.06, 0.06).id,
                    materialId: this.assets.createMaterial('invisible', {
                        color: mixed_reality_extension_sdk_1.Color4.FromColor3(mixed_reality_extension_sdk_1.Color3.Red(), 0),
                        alphaMode: mixed_reality_extension_sdk_1.AlphaMode.Blend
                    }).id
                },
                transform: {
                    local: {
                        position: { x: 0, y: 0.6, z: 0 }
                    }
                },
                collider: {
                    geometry: { shape: mixed_reality_extension_sdk_1.ColliderType.Box },
                    layer: mixed_reality_extension_sdk_1.CollisionLayer.Hologram,
                    isTrigger: true
                },
                rigidBody: {
                    enabled: true,
                    useGravity: false,
                    isKinematic: true
                }
            }
        });
        trigger.collider.onTrigger('trigger-enter', (actor) => {
            console.log("\n", actor.name, " - ", actor.owner);
            console.log(trigger.name, " - ", trigger.owner);
            if (actor.name != 'mouth' || actor.owner != trigger.owner) {
                return;
            }
            this.buzz(user);
        });
    }
    buzz(user) {
        if (this.buzzing.get(user.id)) {
            return;
        }
        this.buzzing.set(user.id, true);
        const actor = mixed_reality_extension_sdk_1.Actor.CreateFromLibrary(this.context, {
            resourceId: 'artifact:2144568407004021116',
            actor: {
                attachment: {
                    userId: user.id,
                    attachPoint: 'left-hand'
                }
            }
        });
        setTimeout(() => {
            this.buzzing.set(user.id, false);
            actor.destroy();
        }, 4.7 * 1000);
    }
    createMouth(user) {
        if (this.mouths.has(user.id))
            return;
        const mouth = mixed_reality_extension_sdk_1.Actor.Create(this.context, {
            actor: {
                name: 'mouth',
                owner: user.id,
                appearance: {
                    meshId: this.assets.createBoxMesh('box', 0.04, 0.04, 0.04).id,
                    materialId: this.assets.createMaterial('invisible', {
                        color: mixed_reality_extension_sdk_1.Color4.FromColor3(mixed_reality_extension_sdk_1.Color3.Red(), 0),
                        alphaMode: mixed_reality_extension_sdk_1.AlphaMode.Blend
                    }).id
                },
                transform: {
                    local: {
                        position: {
                            x: 0.00039,
                            y: -0.09840258,
                            z: 0.12
                        }
                    }
                },
                attachment: {
                    userId: user.id,
                    attachPoint: 'head'
                },
                collider: {
                    geometry: { shape: mixed_reality_extension_sdk_1.ColliderType.Box },
                    layer: mixed_reality_extension_sdk_1.CollisionLayer.Hologram
                }
            }
        });
        this.mouths.set(user.id, mouth);
    }
    userjoined(user) {
        return __awaiter(this, void 0, void 0, function* () {
            this.createVuvuzela(user);
            this.createMouth(user);
        });
    }
    userleft(user) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mouths.has(user.id)) {
                (_a = this.mouths.get(user.id)) === null || _a === void 0 ? void 0 : _a.destroy();
                this.mouths.delete(user.id);
            }
            ;
            if (this.vuvuzelas.has(user.id)) {
                (_b = this.vuvuzelas.get(user.id)) === null || _b === void 0 ? void 0 : _b.destroy();
                this.vuvuzelas.delete(user.id);
            }
            ;
        });
    }
    showMenu() {
        const menu = mixed_reality_extension_sdk_1.Actor.Create(this.context);
        var button;
    }
}
exports.default = App;
