/*
==========================================
CHRONICLES
AI GAME MASTER
Version 2.0
==========================================
*/

const GameStart = {

    storageKey: "chronicles-campaign",

    aiUrl:
        "https://chronicles-ai.micheledalpoggetto.workers.dev",


    start(){

        const character =
            JSON.parse(
                localStorage.getItem(
                    "chronicles-character"
                )
            );

        if(!character){

            alert("Personaggio non trovato.");

            return;

        }

        const openings = {

            fantasy:
                `${character.name} apre gli occhi al suono delle campane d'allarme. Dal borgo, oltre le mura, si alza una colonna di fumo nero.`,

            lovecraft:
                `${character.name} riceve una lettera priva di mittente. All'interno c'è una fotografia che sembra essere stata scattata domani.`,

            superheroes:
                `${character.name} osserva la città quando tutte le comunicazioni si interrompono nello stesso istante.`,

            cyberpunk:
                `${character.name} si risveglia in un vicolo illuminato dai neon con un impianto sconosciuto collegato alla propria memoria.`,

            "fractured-domains":
                `${character.name} sente la Frattura prima ancora di vederla. Il cielo si apre e qualcosa di impossibile emerge oltre l'orizzonte.`

        };


        const opening =
            openings[character.universe]
            || "La tua avventura sta per iniziare.";


        const campaign = {

            version: 2,

            createdAt:
                new Date().toISOString(),

            universe:
                character.universe,

            character:
                character,

            chapter: 1,

            scene: 1,

            status: "active",

            history: [
                {
                    chapter: 1,
                    scene: 1,
                    type: "narration",
                    text: opening,
                    createdAt:
                        new Date().toISOString()
                }
            ],

            inventory: [],

            objectives: [],

            worldState: {}

        };


        this.saveCampaign(campaign);

        this.showScene(
            campaign,
            opening,
            [
                "Mi avvicino per capire cosa sta succedendo",
                "Cerco qualcuno che possa avere informazioni",
                "Osservo attentamente la situazione prima di agire"
            ]
        );

    },


    saveCampaign(campaign){

        localStorage.setItem(
            this.storageKey,
            JSON.stringify(campaign)
        );

    },


    loadCampaign(){

        return JSON.parse(
            localStorage.getItem(
                this.storageKey
            )
        );

    },


    showScene(campaign, narration, suggestions = []){

        const suggestionsHTML =
            suggestions
            .map(action => `

                <button
                    class="suggested-action"
                    data-action="${this.escapeAttribute(action)}"
                    style="
                        display:block;
                        width:100%;
                        padding:14px;
                        margin:10px 0;
                        font-size:16px;
                        text-align:left;
                    ">
                    ${action}
                </button>

            `)
            .join("");


        document.body.innerHTML = `

            <main style="
                padding:24px;
                max-width:700px;
                margin:auto;
            ">

                <h1>Chronicles</h1>

                <p style="
                    opacity:0.65;
                    text-transform:uppercase;
                    letter-spacing:2px;
                ">
                    Capitolo ${campaign.chapter}
                    · Scena ${campaign.scene}
                </p>


                <div style="
                    font-size:20px;
                    line-height:1.65;
                    margin-top:24px;
                    white-space:pre-wrap;
                ">
                    ${narration}
                </div>


                ${
                    suggestions.length
                    ? `
                        <div style="
                            margin-top:30px;
                        ">

                            <p style="
                                opacity:0.7;
                                margin-bottom:8px;
                            ">
                                Idee possibili
                            </p>

                            ${suggestionsHTML}

                        </div>
                    `
                    : ""
                }


                <div style="
                    margin-top:32px;
                ">

                    <h3>Cosa fai?</h3>

                    <textarea
                        id="player-action"
                        rows="5"
                        placeholder="Descrivi liberamente cosa vuoi fare..."
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:14px;
                            font-size:18px;
                            border-radius:10px;
                            border:1px solid #555;
                        "
                    ></textarea>


                    <button
                        id="send-action"
                        style="
                            width:100%;
                            padding:16px;
                            margin-top:12px;
                            font-size:18px;
                        ">
                        Agisci
                    </button>

                </div>

            </main>

        `;


        document
            .querySelectorAll(".suggested-action")
            .forEach(button => {

                button.onclick = () => {

                    document
                        .getElementById("player-action")
                        .value =
                            button.dataset.action;

                };

            });


        document
            .getElementById("send-action")
            .onclick = () => {

                const action =
                    document
                        .getElementById("player-action")
                        .value
                        .trim();

                if(!action){

                    alert(
                        "Scrivi cosa vuoi fare."
                    );

                    return;

                }

                this.sendAction(action);

            };

    },


    async sendAction(action){

        const campaign =
            this.loadCampaign();


        campaign.history.push({

            chapter:
                campaign.chapter,

            scene:
                campaign.scene,

            type:
                "player-choice",

            text:
                action,

            createdAt:
                new Date().toISOString()

        });


        this.saveCampaign(campaign);

        this.showLoading(action);


        try {

            const response =
                await fetch(
                    this.aiUrl,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                character:
                                    campaign.character,

                                campaign:
                                    campaign,

                                action:
                                    action

                            })
                    }
                );


            const result =
                await response.json();


            if(!response.ok){

                throw new Error(
                    result.error
                    || "Errore del Game Master IA."
                );

            }


            if(!result.narration){

                throw new Error(
                    "Il Game Master non ha restituito una scena."
                );

            }


            campaign.scene++;


            campaign.history.push({

                chapter:
                    campaign.chapter,

                scene:
                    campaign.scene,

                type:
                    "narration",

                text:
                    result.narration,

                createdAt:
                    new Date().toISOString()

            });


            this.applyStateChanges(
                campaign,
                result.stateChanges
            );


            this.saveCampaign(campaign);


            this.showScene(
                campaign,
                result.narration,
                result.suggestedActions || []
            );


        } catch(error){

            this.showError(
                campaign,
                action,
                error
            );

        }

    },


    applyStateChanges(campaign, changes){

        if(!changes){
            return;
        }


        if(
            Array.isArray(
                changes.inventoryAdd
            )
        ){

            changes.inventoryAdd
                .forEach(item => {

                    if(
                        !campaign.inventory
                            .includes(item)
                    ){

                        campaign.inventory
                            .push(item);

                    }

                });

        }


        if(
            Array.isArray(
                changes.inventoryRemove
            )
        ){

            campaign.inventory =
                campaign.inventory
                .filter(item =>
                    !changes
                        .inventoryRemove
                        .includes(item)
                );

        }


        if(
            Array.isArray(
                changes.objectivesAdd
            )
        ){

            changes.objectivesAdd
                .forEach(objective => {

                    if(
                        !campaign.objectives
                            .includes(objective)
                    ){

                        campaign.objectives
                            .push(objective);

                    }

                });

        }


        if(
            changes.worldState
            &&
            typeof changes.worldState === "object"
        ){

            campaign.worldState = {

                ...campaign.worldState,

                ...changes.worldState

            };

        }

    },


    showLoading(action){

        document.body.innerHTML = `

            <main style="
                padding:24px;
                max-width:700px;
                margin:auto;
            ">

                <h1>Chronicles</h1>

                <h2>Il mondo reagisce...</h2>

                <p style="
                    opacity:0.7;
                ">
                    Hai deciso:
                </p>

                <p style="
                    font-size:20px;
                ">
                    ${action}
                </p>

                <p style="
                    margin-top:30px;
                    opacity:0.65;
                ">
                    Il Game Master sta preparando
                    la scena successiva.
                </p>

            </main>

        `;

    },


    showError(campaign, action, error){

        document.body.innerHTML = `

            <main style="
                padding:24px;
                max-width:700px;
                margin:auto;
            ">

                <h1>Chronicles</h1>

                <h2>
                    Il Game Master non risponde
                </h2>

                <p>
                    La tua azione non è andata persa:
                </p>

                <p style="
                    font-weight:bold;
                ">
                    ${action}
                </p>

                <p style="
                    margin-top:24px;
                    opacity:0.7;
                ">
                    Errore:
                    ${error.message}
                </p>

                <button
                    id="retry-action"
                    style="
                        width:100%;
                        padding:16px;
                        margin-top:24px;
                        font-size:18px;
                    ">
                    Riprova
                </button>

            </main>

        `;


        document
            .getElementById("retry-action")
            .onclick = () => {

                this.sendAction(action);

            };

    },


    escapeAttribute(text){

        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    }

};


window.GameStart = GameStart;
