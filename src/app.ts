/*!
 * Copyright (c) The Free MRE Foundation. All rights reserved.
 * Licensed under the MIT License.
 
 * Copyright (c) Francisco Santana Neto. All rights reserved.
 * Licensed under the MIT License.
 */

import { Context, ParameterSet, User, AssetContainer, Guid, Actor, Quaternion, DegreesToRadians, Color4, Color3, AlphaMode, ColliderType, CollisionLayer } from "@microsoft/mixed-reality-extension-sdk";

/**
 * The main class of this app. All the logic goes here.
 */
export default class App {
        private assets: AssetContainer;
        private mouths: Map<Guid, Actor>;
        private vuvuzelas: Map<Guid, Actor>;
        constructor(private context: Context, params: ParameterSet) {
                this.assets = new AssetContainer(this.context);
                this.mouths = new Map<Guid, Actor>();
                this.vuvuzelas = new Map<Guid, Actor>();
                this.context.onStarted(() => this.started());
                this.context.onUserJoined((u: User) => this.userjoined(u));
                this.context.onUserLeft((u: User) => this.userleft(u));
        }

        /**
         * Once the context is "started", initialize the app.
         */
        private async started() {

        }

        private createVuvuzela(user: User) {
                if (this.vuvuzelas.has(user.id)) return;
                const vuvuzela = Actor.CreateFromLibrary(this.context, {
                        resourceId: 'artifact:2143270789623841562',
                        actor: {
                                transform: {
                                        local: {
                                                position: {x: 0, y: 0.2, z: 0},
                                                rotation: Quaternion.FromEulerAngles(1*DegreesToRadians,0,0)
                                        }
                                },
                                attachment: {
                                        userId: user.id,
                                        attachPoint: 'left-hand'
                                }
                        }
                });

                const trigger = Actor.Create(this.context, {
                        actor: {
                                parentId: vuvuzela.id,
                                appearance: {
                                        meshId: this.assets.createBoxMesh('box', 0.1, 0.1, 0.1).id,
                                        materialId: this.assets.createMaterial('invisible', {
                                                color: Color4.FromColor3(Color3.Red(), 0.1),
                                                alphaMode: AlphaMode.Blend
                                        }).id
                                },
                                transform: {
                                        local: {
                                                position: {x: 0, y: 0.2, z: 0}
                                        }
                                },
                                collider: {
                                        geometry: { shape: ColliderType.Box},
                                        layer: CollisionLayer.Hologram,
                                        isTrigger: true
                                },
                                rigidBody: {
                                        enabled: true,
                                        useGravity: false,
                                        isKinematic: true
                                }

                        }
                });

                trigger.collider.onTrigger('trigger-enter', (actor: Actor) => {
                        if (actor.name != 'mouth') return;
                        this.buzz(user);
                });
        }

        private buzz(user: User){
                const actor = Actor.CreateFromLibrary(this.context, {
                        resourceId: 'artifact:2144492187432255527',
                        actor: {
                                attachment: {
                                        userId: user.id,
                                        attachPoint: 'left-hand'
                                }
                        }
                });

                setTimeout(()=>{
                        actor.destroy();
                }, 6*1000);
        }

        private createMouth(user: User){
                if (this.mouths.has(user.id)) return;
                const mouth = Actor.Create(this.context, {
                        actor: {
                                appearance: {
                                        meshId: this.assets.createBoxMesh('box', 0.08, 0.08, 0.08).id,
                                        materialId: this.assets.createMaterial('invisible', {
                                                color: Color4.FromColor3(Color3.Red(), 0.1),
                                                alphaMode: AlphaMode.Blend
                                        }).id
                                },
                                transform: {
                                        local: {
                                                position: {
                                                        x: 0.00039,
                                                        y: -0.09840258,
                                                        z: 0.1823
                                                }
                                        }
                                },
                                attachment: {
                                        userId: user.id,
                                        attachPoint: 'head'
                                },
                                collider: {
                                        geometry: { shape: ColliderType.Box},
                                        layer: CollisionLayer.Hologram,
                                        isTrigger: true
                                }

                        }
                });
                this.mouths.set(user.id, mouth);
        }

        private async userjoined(user: User) {
                this.createVuvuzela(user);
                this.createMouth(user);
        }

        private async userleft(user: User) {
                if (this.mouths.has(user.id)) {
                        this.mouths.get(user.id)?.destroy();
                };
                if (this.vuvuzelas.has(user.id)) {
                        this.vuvuzelas.get(user.id)?.destroy();
                };
        }
}
