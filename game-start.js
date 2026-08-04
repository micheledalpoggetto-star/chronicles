/*
==========================================
CHRONICLES
GAME START & CAMPAIGN CLIENT
Version 3.1
==========================================

REGOLE ARCHITETTURALI:

- Il Worker è l'autorità sullo stato del gioco.
- Il frontend NON calcola HP.
- Il frontend NON modifica inventario.
- Il frontend NON aggiorna posizione.
- Il frontend NON decide morte o conseguenze.
- Il frontend mostra e salva result.campaign.
==========================================
*/

const GameStart = {

    storageKey:
        "chronicles-campaign",

    aiUrl:
        "https://chronicles-ai.micheledalpoggetto.workers.dev",


    /*
    ==========================================
    NUOVA PARTITA
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

            alert(
                "Personaggio non trovato."
            );

            return;

        }


        this.showWorldLoading(
            character
        );


        try {

            const response =
                await fetch(
                    this.aiUrl,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                mode:
                                    "setup",

                                character:
                                    character,

                                campaign:
                                    {}

                            })

                    }
                );


            const result =
                await response.json();


            if(!response.ok){

                throw new Error(
                    this.buildErrorMessage(
                        result,
                        "Errore durante la creazione della campagna."
                    )
                );

            }


            /*
            Il Worker DEVE restituire
            l'intera campagna.
            */

            if(
                !result.campaign
                ||
                typeof result.campaign
                    !== "object"
            ){

                throw new Error(
                    "Il Game Master non ha restituito uno stato di campagna valido."
                );

            }


            if(!result.narration){

                throw new Error(
                    "Il Game Master non ha creato l'introduzione."
                );

            }


            /*
            ==========================================
            IL WORKER È L'AUTORITÀ
            ==========================================
            */

            const campaign =
                result.campaign;


            /*
            Manteniamo alcuni dati UI
            che non appartengono al mondo.
            */

            campaign.ui =
                campaign.ui || {};

            campaign.ui.lastNarration =
                result.narration;

            campaign.ui.lastSuggestions =
                Array.isArray(
                    result.suggestedActions
                )
                ? result.suggestedActions
                : [];

            campaign.ui.lastCheck =
                result.check || null;


            this.saveCampaign(
                campaign
            );


            this.showScene(
                campaign,
                result.narration,
                campaign.ui.lastSuggestions,
                result.check || null
            );


        }
        catch(error){

            this.showStartError(
                character,
                error
            );

        }

    },


    /*
    ==========================================
    SALVATAGGIO LOCALE
    ==========================================
    */

    saveCampaign(
        campaign
    ){

        localStorage.setItem(
            this.storageKey,
            JSON.stringify(
                campaign
            )
        );

    },


    loadCampaign(){

        const raw =
            localStorage.getItem(
                this.storageKey
            );


        if(!raw){

            return null;

        }


        try {

            return JSON.parse(
                raw
            );

        }
        catch{

            return null;

        }

    },


    /*
    ==========================================
    CONTINUA PARTITA
    ==========================================
    */

    continueGame(){

        const campaign =
            this.loadCampaign();


        if(!campaign){

            alert(
                "Nessuna partita salvata."
            );

            return;

        }


        const ui =
            campaign.ui || {};


        let narration =
            ui.lastNarration;


        /*
        Fallback:
        cerchiamo l'ultima narrazione
        nella history.
        */

        if(!narration){

            const latest =
                [...(
                    campaign.history || []
                )]
                .reverse()
                .find(
                    entry =>
                        entry.type ===
                        "narration"
                );


            narration =
                latest
                ? latest.text
                : "La tua avventura continua.";

        }


        this.showScene(

            campaign,

            narration,

            Array.isArray(
                ui.lastSuggestions
            )
                ? ui.lastSuggestions
                : [],

            ui.lastCheck || null

        );

    },


    /*
    ==========================================
    SCHERMATA PRINCIPALE
    ==========================================
    */

    showScene(
        campaign,
        narration,
        suggestions = [],
        check = null
    ){

        const character =
            campaign.character || {};


        /*
        ==========================================
        HUD
        ==========================================
        */

        const playerState =
            campaign.playerState || {};


        const world =
            campaign.world || {};


        const hpCurrent =
            playerState.hpCurrent
            ?? "?";


        const hpMax =
            playerState.hpMax
            ?? "?";


        const affiliation =
            campaign.affiliation
            || "Nessuna";


        const knowsLocation =
            world.playerKnownLocation
            !== false;


        const location =
            knowsLocation

            ? (
                world.currentLocation
                || playerState.position
                || "?"
            )

            : "?";


        /*
        ==========================================
        SUGGERIMENTI
        ==========================================
        */

        const validSuggestions =
            Array.isArray(
                suggestions
            )
                ? suggestions
                : [];


        const suggestionsHTML =
            validSuggestions
            .map(
                action => `

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

                `
            )
            .join("");


        /*
        ==========================================
        TIRO
        ==========================================
        */

        const checkHTML =
            this.buildCheckHTML(
                check
            );


        /*
        ==========================================
        MORTE
        ==========================================
        */

        const isDead =
            playerState.status ===
                "dead"
            ||
            campaign.status ===
                "dead";


        document.body.innerHTML = `

            <main style="
                padding:24px;
                max-width:700px;
                margin:auto;
            ">

                <h1>
                    Chronicles
                </h1>


                <!-- HUD -->

                <div style="
                    border:1px solid #333;
                    border-radius:12px;
                    padding:14px;
                    margin-bottom:22px;
                ">

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        gap:16px;
                        align-items:flex-start;
                    ">

                        <div>

                            <strong style="
                                font-size:18px;
                            ">
                                ${this.escapeHTML(
                                    character.name
                                    || "?"
                                )}
                            </strong>

                            <div style="
                                opacity:0.65;
                                font-size:14px;
                                margin-top:5px;
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
                                ${hpCurrent}
                                /
                                ${hpMax}
                            </strong>

                            <div style="
                                opacity:0.65;
                                font-size:14px;
                                margin-top:5px;
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


                <!-- CAPITOLO -->

                <p style="
                    opacity:0.65;
                    text-transform:uppercase;
                    letter-spacing:2px;
                ">
                    Capitolo
                    ${campaign.chapter || 1}
                    ·
                    Scena
                    ${campaign.scene || 1}
                </p>


                <!-- EVENTUALE TIRO -->

                ${checkHTML}


                <!-- NARRAZIONE -->

                <div style="
                    font-size:20px;
                    line-height:1.65;
                    margin-top:24px;
                    white-space:pre-wrap;
                ">
                    ${this.escapeHTML(
                        narration
                    )}
                </div>


                ${
                    !isDead
                    &&
                    validSuggestions.length

                    ? `

                        <div style="
                            margin-top:30px;
                        ">

                            <p style="
                                opacity:0.65;
                                margin-bottom:8px;
                            ">
                                Idee possibili
                            </p>

                            ${suggestionsHTML}

                        </div>

                    `

                    : ""
                }


                ${
                    !isDead

                    ? `

                        <div style="
                            margin-top:32px;
                        ">

                            <h3>
                                Cosa fai?
                            </h3>


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

                    `

                    : `

                        <div style="
                            margin-top:36px;
                            border-top:1px solid #333;
                            padding-top:26px;
                        ">

                            <h2>
                                La tua storia termina qui.
                            </h2>

                            <p style="
                                opacity:0.7;
                            ">
                                Il personaggio è morto.
                            </p>

                        </div>

                    `
                }

            </main>

        `;


        /*
        ==========================================
        SCHEDA
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
        SE MORTO NON AGGIUNGIAMO CONTROLLI
        ==========================================
        */

        if(isDead){

            return;

        }


        /*
        ==========================================
        SUGGERIMENTI
        ==========================================
        */

        document
            .querySelectorAll(
                ".suggested-action"
            )
            .forEach(
                button => {

                    button.onclick =
                        () => {

                            document
                                .getElementById(
                                    "player-action"
                                )
                                .value =
                                    button.dataset.action;

                        };

                }
            );


        /*
        ==========================================
        AZIONE
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


                this.sendAction(
                    action
                );

            };

    },


    /*
    ==========================================
    INVIO TURNO
    ==========================================
    */

    async sendAction(
        action
    ){

        const campaign =
            this.loadCampaign();


        if(!campaign){

            alert(
                "Campagna non trovata."
            );

            return;

        }


        /*
        IMPORTANTISSIMO:

        NON modifichiamo:
        - history
        - scena
        - inventario
        - HP
        - mondo

        Lo farà il Worker.
        */


        this.showLoading(
            action
        );


        try {

            const response =
                await fetch(
                    this.aiUrl,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                mode:
                                    "action",

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
                    this.buildErrorMessage(
                        result,
                        "Errore del Game Master."
                    )
                );

            }


            if(!result.narration){

                throw new Error(
                    "Il Game Master non ha restituito una scena."
                );

            }


            if(
                !result.campaign
                ||
                typeof result.campaign
                    !== "object"
            ){

                throw new Error(
                    "Il Game Master non ha restituito lo stato aggiornato della campagna."
                );

            }


            /*
            ==========================================
            NUOVO STATO UFFICIALE
            ==========================================
            */

            const updatedCampaign =
                result.campaign;


            updatedCampaign.ui =
                updatedCampaign.ui || {};


            updatedCampaign.ui
                .lastNarration =
                    result.narration;


            updatedCampaign.ui
                .lastSuggestions =
                    Array.isArray(
                        result.suggestedActions
                    )
                    ? result.suggestedActions
                    : [];


            updatedCampaign.ui
                .lastCheck =
                    result.check || null;


            this.saveCampaign(
                updatedCampaign
            );


            /*
            ==========================================
            GAME OVER
            ==========================================
            */

            if(
                result.gameOver
                ||
                result.death
            ){

                updatedCampaign.status =
                    "dead";

            }


            this.showScene(

                updatedCampaign,

                result.narration,

                updatedCampaign.ui
                    .lastSuggestions,

                result.check || null

            );


        }
        catch(error){

            /*
            Nessun dato del turno è stato
            salvato localmente.

            Quindi Riprova non duplica azioni.
            */

            this.showError(
                campaign,
                action,
                error
            );

        }

    },


    /*
    ==========================================
    VISUALIZZAZIONE TIRO
    ==========================================
    */

    buildCheckHTML(
        check
    ){

        if(
            !check
            ||
            !check.required
        ){

            return "";

        }


        const stat =
            check.stat
            || "?";


        const roll =
            check.roll
            ?? "?";


        const modifier =
            check.modifier
            ?? 0;


        const total =
            check.total
            ?? "?";


        const difficulty =
            check.difficulty
            ?? "?";


        const outcomeLabels = {

            "critical-success":
                "Successo critico",

            "success":
                "Successo",

            "failure":
                "Fallimento",

            "critical-failure":
                "Fallimento critico"

        };


        const outcome =
            outcomeLabels[
                check.outcome
            ]
            || check.outcome
            || "";


        const modifierText =
            Number(modifier) >= 0
            ? `+${modifier}`
            : `${modifier}`;


        return `

            <div style="
                border:1px solid #444;
                border-radius:12px;
                padding:16px;
                margin-top:20px;
                margin-bottom:20px;
            ">

                <div style="
                    opacity:0.65;
                    font-size:14px;
                    text-transform:uppercase;
                    letter-spacing:1px;
                ">
                    Prova di
                    ${this.escapeHTML(stat)}
                </div>


                <div style="
                    font-size:24px;
                    font-weight:bold;
                    margin-top:8px;
                ">
                    🎲
                    ${roll}
                    ${modifierText}
                    =
                    ${total}
                </div>


                <div style="
                    margin-top:6px;
                    opacity:0.75;
                ">
                    Difficoltà:
                    ${difficulty}
                </div>


                ${
                    outcome

                    ? `

                        <div style="
                            margin-top:10px;
                            font-weight:bold;
                        ">
                            ${this.escapeHTML(
                                outcome
                            )}
                        </div>

                    `

                    : ""
                }

            </div>

        `;

    },


    /*
    ==========================================
    SCHEDA PERSONAGGIO
    ==========================================
    */

    showCharacterSheet(
        campaign
    ){

        const character =
            campaign.character || {};


        const playerState =
            campaign.playerState || {};


        const world =
            campaign.world || {};


        const stats =
            character.stats || {};


        const inventory =
            Array.isArray(
                campaign.inventory
            )
            ? campaign.inventory
            : [];


        const equipment =
            Array.isArray(
                campaign.equipment
            )
            ? campaign.equipment
            : [];


        const objectives =
            Array.isArray(
                campaign.objectives
            )
            ? campaign.objectives
            : [];


        const conditions =
            Array.isArray(
                playerState.conditions
            )
            ? playerState.conditions
            : [];


        /*
        STATISTICHE
        */

        const statsHTML =
            Object.entries(
                stats
            )
            .map(
                ([name, value]) => `

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        padding:10px 0;
                        border-bottom:1px solid #333;
                    ">

                        <span>
                            ${this.escapeHTML(name)}
                        </span>

                        <strong>
                            ${this.escapeHTML(value)}
                        </strong>

                    </div>

                `
            )
            .join("");


        /*
        INVENTARIO
        */

        const inventoryHTML =
            inventory.length

            ? inventory
                .map(
                    item => `
                        <li>
                            ${this.formatListItem(item)}
                        </li>
                    `
                )
                .join("")

            : "<li>Nessun oggetto.</li>";


        /*
        EQUIPAGGIAMENTO
        */

        const equipmentHTML =
            equipment.length

            ? equipment
                .map(
                    item => `
                        <li>
                            ${this.formatListItem(item)}
                        </li>
                    `
                )
                .join("")

            : "<li>Nessun equipaggiamento.</li>";


        /*
        OBIETTIVI
        */

        const objectivesHTML =
            objectives.length

            ? objectives
                .map(
                    objective => {

                        if(
                            typeof objective
                            === "string"
                        ){

                            return `
                                <li>
                                    ${this.escapeHTML(
                                        objective
                                    )}
                                </li>
                            `;

                        }


                        const text =
                            objective.text
                            || objective.name
                            || "Obiettivo";


                        const completed =
                            objective.status
                            === "completed";


                        return `

                            <li>

                                ${
                                    completed
                                    ? "✓ "
                                    : ""
                                }

                                ${this.escapeHTML(
                                    text
                                )}

                            </li>

                        `;

                    }
                )
                .join("")

            : "<li>Nessun obiettivo attivo.</li>";


        /*
        CONDIZIONI
        */

        const conditionsHTML =
            conditions.length

            ? conditions
                .map(
                    condition => `
                        <li>
                            ${this.escapeHTML(
                                condition
                            )}
                        </li>
                    `
                )
                .join("")

            : "<li>Nessuna condizione.</li>";


        /*
        POSIZIONE
        */

        const location =
            world.playerKnownLocation
            !== false

            ? (
                world.currentLocation
                || playerState.position
                || "?"
            )

            : "?";


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

                    <strong>
                        Universo:
                    </strong>

                    ${this.escapeHTML(
                        character.universe
                        || "?"
                    )}

                </p>


                <p>

                    <strong>
                        Razza:
                    </strong>

                    ${this.escapeHTML(
                        character.race
                        || "?"
                    )}

                </p>


                <p>

                    <strong>
                        Vocazione:
                    </strong>

                    ${this.escapeHTML(
                        character.vocation
                        || "?"
                    )}

                </p>


                <p>

                    <strong>
                        Background:
                    </strong>

                    ${this.escapeHTML(
                        character.background
                        || "?"
                    )}

                </p>


                <p>

                    <strong>
                        Ruolo:
                    </strong>

                    ${this.escapeHTML(
                        campaign.role
                        || "?"
                    )}

                </p>


                <p>

                    <strong>
                        Affiliazione:
                    </strong>

                    ${this.escapeHTML(
                        campaign.affiliation
                        || "Nessuna"
                    )}

                </p>


                <p>

                    <strong>
                        Posizione:
                    </strong>

                    ${this.escapeHTML(
                        location
                    )}

                </p>


                <p>

                    <strong>
                        HP:
                    </strong>

                    ${
                        playerState.hpCurrent
                        ?? "?"
                    }

                    /

                    ${
                        playerState.hpMax
                        ?? "?"
                    }

                </p>


                <h2>
                    Statistiche
                </h2>

                ${
                    statsHTML
                    ||
                    "<p>Statistiche non disponibili.</p>"
                }


                <h2 style="
                    margin-top:30px;
                ">
                    Condizioni
                </h2>

                <ul>
                    ${conditionsHTML}
                </ul>


                <h2 style="
                    margin-top:30px;
                ">
                    Equipaggiamento
                </h2>

                <ul>
                    ${equipmentHTML}
                </ul>


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

                this.continueGame();

            };

    },


    /*
    ==========================================
    CREAZIONE MONDO
    ==========================================
    */

    showWorldLoading(
        character
    ){

        document.body.innerHTML = `

            <main style="
                padding:24px;
                max-width:700px;
                margin:auto;
            ">

                <h1>
                    Chronicles
                </h1>

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
                    Luoghi, persone, rapporti,
                    segreti, pericoli e opportunità
                    stanno prendendo forma.
                </p>

            </main>

        `;

    },


    /*
    ==========================================
    CARICAMENTO TURNO
    ==========================================
    */

    showLoading(
        action
    ){

        document.body.innerHTML = `

            <main style="
                padding:24px;
                max-width:700px;
                margin:auto;
            ">

                <h1>
                    Chronicles
                </h1>


                <h2>
                    Il mondo reagisce...
                </h2>


                <p style="
                    opacity:0.65;
                ">
                    Hai deciso:
                </p>


                <p style="
                    font-size:20px;
                    line-height:1.5;
                ">
                    ${this.escapeHTML(
                        action
                    )}
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
    ERRORE AVVIO
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

                <h1>
                    Chronicles
                </h1>


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
    ERRORE TURNO
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

                <h1>
                    Chronicles
                </h1>


                <h2>
                    Il Game Master non risponde
                </h2>


                <p>
                    La tua azione non è andata persa:
                </p>


                <p style="
                    font-weight:bold;
                ">
                    ${this.escapeHTML(
                        action
                    )}
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


                <button
                    id="return-scene"
                    style="
                        width:100%;
                        padding:14px;
                        margin-top:10px;
                        font-size:16px;
                    ">
                    Torna alla scena
                </button>

            </main>

        `;


        document
            .getElementById(
                "retry-action"
            )
            .onclick = () => {

                this.sendAction(
                    action
                );

            };


        document
            .getElementById(
                "return-scene"
            )
            .onclick = () => {

                this.continueGame();

            };

    },


    /*
    ==========================================
    ERRORE API
    ==========================================
    */

    buildErrorMessage(
        result,
        fallback
    ){

        let message =
            result?.error
            || fallback;


        if(result?.details){

            message +=
                "\n\nDETTAGLI:\n";


            if(
                typeof result.details
                === "string"
            ){

                message +=
                    result.details;

            }
            else {

                message +=
                    JSON.stringify(
                        result.details,
                        null,
                        2
                    );

            }

        }


        return message;

    },


    /*
    ==========================================
    LIST ITEM
    ==========================================
    */

    formatListItem(
        item
    ){

        if(
            item === null
            ||
            item === undefined
        ){

            return "?";

        }


        if(
            typeof item
            === "string"
        ){

            return this.escapeHTML(
                item
            );

        }


        if(
            typeof item
            === "object"
        ){

            const text =
                item.name
                || item.text
                || item.description
                || "Elemento";


            return this.escapeHTML(
                text
            );

        }


        return this.escapeHTML(
            String(item)
        );

    },


    /*
    ==========================================
    SICUREZZA HTML
    ==========================================
    */

    escapeAttribute(
        text
    ){

        return String(
            text ?? ""
        )
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    },


    escapeHTML(
        text
    ){

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


window.GameStart =
    GameStart;
