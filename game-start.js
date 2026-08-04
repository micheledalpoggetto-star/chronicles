/*
==========================================
CHRONICLES
GAME START & CAMPAIGN CLIENT
Version 3.0
==========================================
*/

const GameStart = {

    storageKey: "chronicles-campaign",

    aiUrl:
        "https://chronicles-ai.micheledalpoggetto.workers.dev",


    /*
    ==========================================
    AVVIO NUOVA CAMPAGNA
    ==========================================
    */

    async start(){

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


        /*
        Mostriamo subito una schermata di caricamento.
        NON inventiamo più localmente la scena iniziale.
        */

        this.showWorldLoading(character);


        try {

            /*
            Chiediamo al Game Master di creare
            l'effettivo punto di partenza della campagna.
            */

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

                                mode: "setup",

                                character:
                                    character,

                                campaign: null,

                                action:
                                    "__CREATE_CAMPAIGN__"

                            })
                    }
                );


            const result =
                await response.json();


            if(!response.ok){

                let errorMessage =
                    result.error
                    || "Errore durante la creazione della campagna.";

                if(result.details){

                    errorMessage +=
                        "\n\nDETTAGLI:\n" +
                        JSON.stringify(
                            result.details,
                            null,
                            2
                        );

                }

                throw new Error(errorMessage);

            }


            if(!result.narration){

                throw new Error(
                    "Il Game Master non ha creato una scena iniziale."
                );

            }


            /*
            ==========================================
            CREAZIONE CAMPAGNA
            ==========================================
            */

            const campaign = {

                version: 3,

                createdAt:
                    new Date().toISOString(),

                universe:
                    character.universe,

                character:
                    character,

                chapter: 1,

                scene: 1,

                status: "active",

                /*
                Il luogo può essere sconosciuto.
                In quel caso la UI mostrerà "?".
                */

                location:
                    result.location
                    || "?",

                affiliation:
                    result.affiliation
                    || character.affiliation
                    || "Nessuna",

                /*
                HP.
                Se il Worker fornisce valori iniziali
                utilizziamo quelli.
                */

                hp:
                    result.hp
                    || {
                        current: 10,
                        max: 10
                    },


                /*
                Inventario iniziale generato dal GM.
                Deve essere coerente con universo,
                vocazione e background.
                */

                inventory:
                    Array.isArray(result.inventory)
                    ? result.inventory
                    : [],


                objectives:
                    Array.isArray(result.objectives)
                    ? result.objectives
                    : [],


                /*
                Stato persistente del mondo.
                */

                worldState:
                    result.worldState
                    && typeof result.worldState === "object"
                    ? result.worldState
                    : {},


                /*
                Informazioni che il personaggio conosce.
                */

                knownWorld:
                    result.knownWorld
                    && typeof result.knownWorld === "object"
                    ? result.knownWorld
                    : {},


                /*
                Memoria narrativa sintetica.
                */

                memory:
                    result.memory
                    && typeof result.memory === "object"
                    ? result.memory
                    : {},


                /*
                Storico completo della partita.
                */

                history: [

                    {
                        chapter: 1,

                        scene: 1,

                        type: "narration",

                        text:
                            result.narration,

                        createdAt:
                            new Date().toISOString()
                    }

                ]

            };


            this.saveCampaign(campaign);


            this.showScene(
                campaign,
                result.narration,
                result.suggestedActions || []
            );


        } catch(error){

            this.showStartError(
                character,
                error
            );

        }

    },


    /*
    ==========================================
    SALVATAGGIO
    ==========================================
    */

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


    /*
    ==========================================
    INTERFACCIA DI GIOCO
    ==========================================
    */

    showScene(
        campaign,
        narration,
        suggestions = []
    ){

        const character =
            campaign.character || {};


        const hp =
            campaign.hp
            || {
                current: "?",
                max: "?"
            };


        const location =
            campaign.location
            || "?";


        const affiliation =
            campaign.affiliation
            || character.affiliation
            || "Nessuna";


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
                    ${this.escapeHTML(action)}
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


                <!--
                ======================================
                HUD DEL PERSONAGGIO
                ======================================
                -->

                <div style="
                    border:1px solid #333;
                    border-radius:12px;
                    padding:14px;
                    margin-bottom:22px;
                ">

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        gap:15px;
                        flex-wrap:wrap;
                    ">

                        <div>

                            <strong>
                                ${this.escapeHTML(
                                    character.name
                                    || "?"
                                )}
                            </strong>

                            <div style="
                                opacity:0.65;
                                font-size:14px;
                                margin-top:4px;
                            ">
                                ${this.escapeHTML(
                                    affiliation
                                )}
                            </div>

                        </div>


                        <div style="
                            text-align:right;
                        ">

                            <strong>
                                HP
                                ${hp.current}
                                /
                                ${hp.max}
                            </strong>

                            <div style="
                                opacity:0.65;
                                font-size:14px;
                                margin-top:4px;
                            ">
                                📍
                                ${this.escapeHTML(
                                    location
                                )}
                            </div>

                        </div>

                    </div>


                    <button
                        id="open-character"
                        style="
                            width:100%;
                            padding:10px;
                            margin-top:12px;
                        ">
                        Personaggio / Inventario
                    </button>

                </div>


                <p style="
                    opacity:0.65;
                    text-transform:uppercase;
                    letter-spacing:2px;
                ">
                    Capitolo ${campaign.chapter}
                    · Scena ${campaign.scene}
                </p>


                <!-- NARRAZIONE -->

                <div style="
                    font-size:20px;
                    line-height:1.65;
                    margin-top:24px;
                    white-space:pre-wrap;
                ">
                    ${this.escapeHTML(narration)}
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


        /*
        ==========================================
        SUGGERIMENTI
        ==========================================
        */

        document
            .querySelectorAll(
                ".suggested-action"
            )
            .forEach(button => {

                button.onclick = () => {

                    document
                        .getElementById(
                            "player-action"
                        )
                        .value =
                            button.dataset.action;

                };

            });


        /*
        ==========================================
        SCHEDA PERSONAGGIO
        ==========================================
        */

        document
            .getElementById(
                "open-character"
            )
            .onclick = () => {

                this.showCharacterSheet(
                    campaign
                );

            };


        /*
        ==========================================
        INVIO AZIONE
        ==========================================
        */

        document
            .getElementById(
                "send-action"
            )
            .onclick = () => {

                const action =
                    document
                        .getElementById(
                            "player-action"
                        )
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


    /*
    ==========================================
    AZIONE DEL GIOCATORE
    ==========================================
    */

    async sendAction(action){

        const campaign =
            this.loadCampaign();


        if(!campaign){

            alert(
                "Campagna non trovata."
            );

            return;

        }


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

                                mode: "action",

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

                let errorMessage =
                    result.error
                    || "Errore del Game Master IA.";


                if(result.details){

                    errorMessage +=
                        "\n\nDETTAGLI:\n" +
                        JSON.stringify(
                            result.details,
                            null,
                            2
                        );

                }


                throw new Error(
                    errorMessage
                );

            }


            if(!result.narration){

                throw new Error(
                    "Il Game Master non ha restituito una scena."
                );

            }


            /*
            ==========================================
            APPLICAZIONE CAMBIAMENTI
            ==========================================
            */

            this.applyStateChanges(
                campaign,
                result.stateChanges
            );


            /*
            Se il GM richiede una prova,
            conserviamo i dati.
            Il vero lancio del dado verrà gestito
            dal sistema di check.
            */

            if(
                result.check
                &&
                result.check.required
            ){

                campaign.pendingCheck =
                    result.check;

            }
            else {

                campaign.pendingCheck =
                    null;

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

                check:
                    result.check || null,

                createdAt:
                    new Date().toISOString()

            });


            this.saveCampaign(campaign);


            this.showScene(
                campaign,
                result.narration,
                result.suggestedActions || []
            );


        }
        catch(error){

            this.showError(
                campaign,
                action,
                error
            );

        }

    },


    /*
    ==========================================
    CAMBIAMENTI DI STATO
    ==========================================
    */

    applyStateChanges(
        campaign,
        changes
    ){

        if(!changes){
            return;
        }


        /*
        INVENTARIO
        */

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


        /*
        OBIETTIVI
        */

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
            Array.isArray(
                changes.objectivesComplete
            )
        ){

            campaign.objectives =
                campaign.objectives
                .filter(objective =>

                    !changes
                        .objectivesComplete
                        .includes(objective)

                );

        }


        /*
        HP
        */

        if(
            typeof changes.hpChange
            === "number"
        ){

            if(!campaign.hp){

                campaign.hp = {
                    current: 10,
                    max: 10
                };

            }


            campaign.hp.current +=
                changes.hpChange;


            if(
                campaign.hp.current
                > campaign.hp.max
            ){

                campaign.hp.current =
                    campaign.hp.max;

            }


            if(
                campaign.hp.current
                <= 0
            ){

                campaign.hp.current = 0;

                campaign.status =
                    "dead";

            }

        }


        /*
        POSIZIONE
        */

        if(
            typeof changes.location
            === "string"
            &&
            changes.location.trim()
        ){

            campaign.location =
                changes.location.trim();

        }


        /*
        AFFILIAZIONE
        */

        if(
            typeof changes.affiliation
            === "string"
        ){

            campaign.affiliation =
                changes.affiliation;

        }


        /*
        WORLD STATE
        */

        if(
            changes.worldState
            &&
            typeof changes.worldState
            === "object"
        ){

            campaign.worldState = {

                ...campaign.worldState,

                ...changes.worldState

            };

        }


        /*
        MEMORIA
        */

        if(
            changes.memory
            &&
            typeof changes.memory
            === "object"
        ){

            campaign.memory = {

                ...(campaign.memory || {}),

                ...changes.memory

            };

        }

    },


    /*
    ==========================================
    SCHEDA PERSONAGGIO / INVENTARIO
    ==========================================
    */

    showCharacterSheet(campaign){

        const character =
            campaign.character || {};


        const inventory =
            campaign.inventory || [];


        const objectives =
            campaign.objectives || [];


        const inventoryHTML =
            inventory.length

            ? inventory
                .map(item =>
                    `<li>${this.escapeHTML(item)}</li>`
                )
                .join("")

            : "<li>Nessun oggetto.</li>";


        const objectivesHTML =
            objectives.length

            ? objectives
                .map(item =>
                    `<li>${this.escapeHTML(item)}</li>`
                )
                .join("")

            : "<li>Nessun obiettivo attivo.</li>";


        const stats =
            character.stats || {};


        const statsHTML =
            Object.entries(stats)
            .map(([name, value]) => `

                <div style="
                    display:flex;
                    justify-content:space-between;
                    padding:8px 0;
                    border-bottom:1px solid #333;
                ">

                    <span>
                        ${this.escapeHTML(name)}
                    </span>

                    <strong>
                        ${this.escapeHTML(value)}
                    </strong>

                </div>

            `)
            .join("");


        document.body.innerHTML = `

            <main style="
                padding:24px;
                max-width:700px;
                margin:auto;
            ">

                <h1>
                    ${this.escapeHTML(
                        character.name
                        || "Personaggio"
                    )}
                </h1>


                <p>
                    <strong>Affiliazione:</strong>
                    ${this.escapeHTML(
                        campaign.affiliation
                        || "Nessuna"
                    )}
                </p>


                <p>
                    <strong>Posizione:</strong>
                    ${this.escapeHTML(
                        campaign.location
                        || "?"
                    )}
                </p>


                <p>
                    <strong>HP:</strong>
                    ${
                        campaign.hp
                        ? `${campaign.hp.current}/${campaign.hp.max}`
                        : "?"
                    }
                </p>


                <h2>Statistiche</h2>

                ${
                    statsHTML
                    || "<p>Statistiche non disponibili.</p>"
                }


                <h2 style="
                    margin-top:30px;
                ">
                    Inventario
                </h2>

                <ul>
                    ${inventoryHTML}
                </ul>


                <h2 style="
                    margin-top:30px;
                ">
                    Obiettivi
                </h2>

                <ul>
                    ${objectivesHTML}
                </ul>


                <button
                    id="close-character"
                    style="
                        width:100%;
                        padding:16px;
                        margin-top:30px;
                        font-size:18px;
                    ">
                    Torna alla scena
                </button>

            </main>

        `;


        document
            .getElementById(
                "close-character"
            )
            .onclick = () => {

                const latest =
                    [...campaign.history]
                    .reverse()
                    .find(entry =>
                        entry.type ===
                        "narration"
                    );


                this.showScene(

                    campaign,

                    latest
                    ? latest.text
                    : "",

                    []

                );

            };

    },


    /*
    ==========================================
    CARICAMENTO CREAZIONE MONDO
    ==========================================
    */

    showWorldLoading(character){

        document.body.innerHTML = `

            <main style="
                padding:24px;
                max-width:700px;
                margin:auto;
            ">

                <h1>Chronicles</h1>

                <h2>
                    La tua storia sta prendendo forma...
                </h2>

                <p style="
                    font-size:19px;
                    line-height:1.6;
                ">
                    Il Game Master sta preparando
                    il mondo attorno a
                    <strong>
                        ${this.escapeHTML(
                            character.name
                            || "il tuo personaggio"
                        )}
                    </strong>.
                </p>

                <p style="
                    opacity:0.65;
                    margin-top:30px;
                ">
                    Luoghi, personaggi, rapporti,
                    pericoli e opportunità stanno
                    prendendo forma.
                </p>

            </main>

        `;

    },


    /*
    ==========================================
    CARICAMENTO AZIONE
    ==========================================
    */

    showLoading(action){

        document.body.innerHTML = `

            <main style="
                padding:24px;
                max-width:700px;
                margin:auto;
            ">

                <h1>Chronicles</h1>

                <h2>
                    Il mondo reagisce...
                </h2>

                <p style="
                    opacity:0.7;
                ">
                    Hai deciso:
                </p>

                <p style="
                    font-size:20px;
                ">
                    ${this.escapeHTML(action)}
                </p>

                <p style="
                    margin-top:30px;
                    opacity:0.65;
                ">
                    Il Game Master sta determinando
                    ciò che accade.
                </p>

            </main>

        `;

    },


    /*
    ==========================================
    ERRORE DURANTE L'AVVIO
    ==========================================
    */

    showStartError(
        character,
        error
    ){

        document.body.innerHTML = `

            <main style="
                padding:24px;
                max-width:700px;
                margin:auto;
            ">

                <h1>Chronicles</h1>

                <h2>
                    Impossibile iniziare la storia
                </h2>

                <p style="
                    opacity:0.7;
                    white-space:pre-wrap;
                ">
                    ${this.escapeHTML(
                        error.message
                    )}
                </p>

                <button
                    id="retry-start"
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
            .getElementById(
                "retry-start"
            )
            .onclick = () => {

                this.start();

            };

    },


    /*
    ==========================================
    ERRORE DURANTE IL GIOCO
    ==========================================
    */

    showError(
        campaign,
        action,
        error
    ){

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
                    ${this.escapeHTML(action)}
                </p>

                <p style="
                    margin-top:24px;
                    opacity:0.7;
                    white-space:pre-wrap;
                ">
                    Errore:
                    ${this.escapeHTML(
                        error.message
                    )}
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
            .getElementById(
                "retry-action"
            )
            .onclick = () => {

                this.sendAction(action);

            };

    },


    /*
    ==========================================
    SICUREZZA HTML
    ==========================================
    */

    escapeAttribute(text){

        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    },


    escapeHTML(text){

        return String(
            text ?? ""
        )
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    }

};


window.GameStart = GameStart;
