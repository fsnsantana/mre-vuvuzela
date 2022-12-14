/*!
 * Copyright (c) The Free MRE Foundation. All rights reserved.
 * Licensed under the MIT License.
 
 * Copyright (c) Francisco Santana Neto. All rights reserved.
 * Licensed under the MIT License.
 */

import { Context, ParameterSet, User, AssetContainer, Guid, Actor, Quaternion, DegreesToRadians, Color4, Color3, AlphaMode, ColliderType, CollisionLayer, ButtonBehavior, PrimitiveShape } from "@microsoft/mixed-reality-extension-sdk";

/**
 * The main class of this app. All the logic goes here.
 */
export default class App {
        private assets: AssetContainer;
        private mouths: Map<Guid, Actor>;
        private vuvuzelas: Map<Guid, Actor>;
        private choosedVuvuzela: Map<Guid, String>;
	private buzzing: Map<Guid, Boolean>;
        constructor(private context: Context, params: ParameterSet) {
                this.assets = new AssetContainer(this.context);
                this.mouths = new Map<Guid, Actor>();
                this.vuvuzelas = new Map<Guid, Actor>();
                this.choosedVuvuzela = new Map<Guid, String>();
                this.buzzing = new Map<Guid, Boolean>();
                this.context.onStarted(() => this.started());
                this.context.onUserJoined((u: User) => this.userjoined(u));
                this.context.onUserLeft((u: User) => this.userleft(u));
        }

        /**
         * Once the context is "started", initialize the app.
         */
        private async started() {

        }

        private createChoosedVuvuzela(user: User, choosed: String){
                if ( choosed == "vuvuzela1" ){
                        this.createVuvuzela1(user)
                };
                if ( choosed == "vuvuzela2" ){
                        this.createVuvuzela2(user)
                };

        }

        private createVuvuzela1(user: User) {               
                if (this.vuvuzelas.has(user.id)) return;
                this.choosedVuvuzela.set(user.id,"vuvuzela1")
                const vuvuzela = Actor.CreateFromLibrary(this.context, {
                        resourceId: 'artifact:2143270789623841562',
                        actor: {
                                transform: {
                                        local: {
                                                position: {x: -0.3, y: 0, z: 0.08},
                                                rotation: Quaternion.FromEulerAngles(-90*DegreesToRadians,0,-90*DegreesToRadians),
						scale: { x: 0.75, y: 0.75, z: 0.75 }
                                        }
                                },
                                attachment: {
                                        userId: user.id,
                                        attachPoint: 'left-hand'
                                }
                        }
                });
		this.vuvuzelas.set(user.id,vuvuzela);

                const trigger = Actor.Create(this.context, {
                        actor: {
				name: "vuvuzela1",
				owner: user.id,
                                parentId: vuvuzela.id,
                                appearance: {
                                        meshId: this.assets.createBoxMesh('box', 0.06, 0.06, 0.06).id,
                                        materialId: this.assets.createMaterial('invisible', {
                                                color: Color4.FromColor3(Color3.Red(), 0),
                                                alphaMode: AlphaMode.Blend
                                        }).id
                                },
                                transform: {
                                        local: {
                                                position: {x: 0, y: 0.6, z: 0}
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
			console.log("\n",actor.name," - ", actor.owner);
			console.log(trigger.name," - ",trigger.owner);
                        if ( actor.name != 'mouth' || actor.owner != trigger.owner ) { return; }
                        this.buzz(user);
                });
        }

        private createVuvuzela2(user: User) {               
                if (this.vuvuzelas.has(user.id)) return;
                this.choosedVuvuzela.set(user.id,"vuvuzela2")
                const vuvuzela = Actor.CreateFromLibrary(this.context, {
                        resourceId: 'artifact:2143270789623841562',
                        actor: {
                                transform: {
                                        local: {
                                                position: {x: -0.1, y: 0, z: 0.08},
                                                rotation: Quaternion.FromEulerAngles(-90*DegreesToRadians,0,-90*DegreesToRadians),
						scale: { x: 0.35, y: 0.35, z: 0.35 }
                                        }
                                },
                                attachment: {
                                        userId: user.id,
                                        attachPoint: 'left-hand'
                                }
                        }
                });
		this.vuvuzelas.set(user.id,vuvuzela);

                const trigger = Actor.Create(this.context, {
                        actor: {
				name: "vuvuzela2",
				owner: user.id,
                                parentId: vuvuzela.id,
                                appearance: {
                                        meshId: this.assets.createBoxMesh('box', 0.05, 0.05, 0.05).id,
                                        materialId: this.assets.createMaterial('invisible', {
                                                color: Color4.FromColor3(Color3.Red(), 0),
                                                alphaMode: AlphaMode.Blend
                                        }).id
                                },
                                transform: {
                                        local: {
                                                position: {x: 0, y: 0.6, z: 0}
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
			console.log("\n",actor.name," - ", actor.owner);
			console.log(trigger.name," - ",trigger.owner);
                        if ( actor.name != 'mouth' || actor.owner != trigger.owner ) { return; }
                        this.buzz(user);
                });
        }

        private buzz(user: User){
		if ( this.buzzing.get(user.id) ) { return; }
		this.buzzing.set(user.id,true);

                if ( this.choosedVuvuzela.get(user.id) == "vuvuzela1" ) {
                        const actor = Actor.CreateFromLibrary(this.context, {
                                resourceId: 'artifact:2144568407004021116',
                                actor: {
                                        attachment: {
                                                userId: user.id,
                                                attachPoint: 'left-hand'
                                        }
                                }
                        });
			setTimeout(()=>{
				this.buzzing.set(user.id,false);
				actor.destroy();
			}, 4.7*1000);
                };
                if ( this.choosedVuvuzela.get(user.id) == "vuvuzela2" ) {
                        const actor = Actor.CreateFromLibrary(this.context, {
                                resourceId: 'artifact:2145512382976230004',
                                actor: {
                                        attachment: {
                                                userId: user.id,
                                                attachPoint: 'left-hand'
                                        }
                                }
                        });
                	setTimeout(()=>{
				this.buzzing.set(user.id,false);
                        	actor.destroy();
                	}, 5.2*1000);
		};
        }

        private createMouth(user: User){
                if (this.mouths.has(user.id)) return;
                const mouth = Actor.Create(this.context, {
                        actor: {
				name: 'mouth',
				owner: user.id,
                                appearance: {
                                        meshId: this.assets.createBoxMesh('box', 0.04, 0.04, 0.04).id,
                                        materialId: this.assets.createMaterial('invisible', {
                                                color: Color4.FromColor3(Color3.Red(), 0),
                                                alphaMode: AlphaMode.Blend
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
                                        geometry: { shape: ColliderType.Box},
                                        layer: CollisionLayer.Hologram
                                }

                        }
                });
                this.mouths.set(user.id, mouth);
        }

        private async userjoined(user: User) {
                this.showMenu();
        }

        private toogleVuvuzela(user: User,choosed: String){
                if (this.vuvuzelas.has(user.id)) {
                        this.userleft(user);
                        if ( choosed == this.choosedVuvuzela.get(user.id)){
                                this.choosedVuvuzela.delete(user.id)
                                return; 
                        }
                };
                this.createChoosedVuvuzela(user,choosed);
                this.createMouth(user);
        }

        private async userleft(user: User) {
                if (this.mouths.has(user.id)) {
                        this.mouths.get(user.id)?.destroy();
			this.mouths.delete(user.id);
                };
                if (this.vuvuzelas.has(user.id)) {
                        this.vuvuzelas.get(user.id)?.destroy();
			this.vuvuzelas.delete(user.id);
                };
                if (this.buzzing.has(user.id)) {
			this.buzzing.delete(user.id);
                };
        }
	private showMenu() {
		const menu = Actor.Create(this.context);

		var button1, button2;

                const vuvuzela1 = Actor.CreateFromLibrary(this.context, {
                        resourceId: 'artifact:2143270789623841562',
                        actor: {
                                name: "menu_vuvuzela1",
                                parentId: menu.id,
                                transform: {
                                        local: {
                                                position: { x: 0, y: 0, z: 0 },
                                                rotation: Quaternion.FromEulerAngles(
                                                0 * DegreesToRadians,
                                                0 * DegreesToRadians,
                                                0 * DegreesToRadians),
                                                scale: { x: 1.5, y: 1.5, z: 1.5 }
                                        }
                                }
                        }
                });

                button1 = Actor.CreatePrimitive(this.assets, {
                        definition: {
                                shape: PrimitiveShape.Box,
                                dimensions: { x: 0.3, y: 1.2, z: 0.3 }
                        },
                        addCollider: true,
                        actor: {
                            parentId: menu.id,
                            name: "vuvuzela1",
                            transform: {
                                local: {
                                    position: { x: 0, y: 0, z: 0 },
                                    scale: { x: 1, y: 1, z: 1 }
                                }
                            },
                            appearance: {
                                enabled: false
                            }
                        }
                });
                const vuvuzela2 = Actor.CreateFromLibrary(this.context, {
                        resourceId: 'artifact:2143270789623841562',
                        actor: {
                                name: "menu_vuvuzela2",
                                parentId: menu.id,
                                transform: {
                                        local: {
                                                position: { x: 1, y: 0, z: 0 },
                                                rotation: Quaternion.FromEulerAngles(
                                                0 * DegreesToRadians,
                                                0 * DegreesToRadians,
                                                0 * DegreesToRadians),
                                                scale: { x: 0.75, y: 0.75, z: 0.75 }
                                        }
                                }
                        }
                });

                button2 = Actor.CreatePrimitive(this.assets, {
                        definition: {
                                shape: PrimitiveShape.Box,
                                dimensions: { x: 0.15, y: 0.6, z: 0.15 }
                        },
                        addCollider: true,
                        actor: {
                            parentId: menu.id,
                            name: "vuvuzela2",
                            transform: {
                                local: {
                                    position: { x: 1, y: 0, z: 0 },
                                    scale: { x: 1, y: 1, z: 1 }
                                }
                            },
                            appearance: {
                                enabled: false
                            }
                        }
                    });


                button1.setBehavior(ButtonBehavior).onClick(user => this.toogleVuvuzela(user,"vuvuzela1"));
                button2.setBehavior(ButtonBehavior).onClick(user => this.toogleVuvuzela(user,"vuvuzela2"));
	}
}
