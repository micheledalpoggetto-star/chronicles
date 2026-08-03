/*
==========================================
CHRONICLES
Game Start
Version 1.0
==========================================
*/

const GameStart = {

    storageKey: "chronicles-campaign",

    start(){

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

        const campaign = {

            version: 1,

            createdAt:
                new Date().toISOString(),

            universe:
                character.universe,

            character:
                character,

            chapter: 1,

            scene: 1,

            status: "active",

            history: [],

            inventory: [],

            objectives: [],

            worldState: {}

        };

        localStorage.setItem(
            this.storageKey,
            JSON.stringify(campaign)
        );

        this.showOpening(campaign);

    },


    showOpening(campaign){

        const character =
            campaign.character;

        const openings = {

            fantasy:
                `${character.name} apre gli occhi al suono delle campane d'allarme. Dal borgo, oltre le mura, si alza una colonna di fumo nero.`,

            lovecraft:
                `${character.name} riceve una lettera priva di mittente. All'interno c'è una fotografia scattata domani.`,

            superheroes:
                `${character.name} osserva la città dall'alto quando tutte le comunicazioni si interrompono nello stesso istante.`,

            cyberpunk:
                `${character.name} si risveglia in un vicolo di neon con un impianto sconosciuto collegato alla propria memoria.`,

            "fractured-domains":
                `${character.name} sente la Frattura prima ancora di vederla. Il cielo si apre e un Dominio impossibile emerge oltre l'orizzonte.`

        };

        const opening =
            openings[campaign.universe]
            || "La tua avventura sta per iniziare.";

        campaign.history.push({

            chapter: 1,

            scene: 1,

            type: "narration",

            text: opening,

            createdAt:
                new Date().toISOString()

        });

        localStorage.setItem(
            this.storageKey,
            JSON.stringify(campaign)
        );

        document.body.innerHTML = `

            <main style="
                padding:24px;
                max-width:700px;
                margin:auto;
            ">

                <h1>Chronicles</h1>

                <p style="
                    opacity:0.7;
                    text-transform:uppercase;
                    letter-spacing:2px;
                ">
                    Capitolo 1
                </p>

                <h2>L'inizio</h2>

                <p style="
                    font-size:20px;
                    line-height:1.6;
                ">
                    ${opening}
                </p>

                <h3>Cosa fai?</h3>

                <button
                    id="choice-investigate"
                    style="
                        display:block;
                        width:100%;
                        padding:16px;
                        margin:10px 0;
                        font-size:18px;
                    ">
                    Indaga su ciò che sta accadendo
                </button>

                <button
                    id="choice-prepare"
                    style="
                        display:block;
                        width:100%;
                        padding:16px;
                        margin:10px 0;
                        font-size:18px;
                    ">
                    Preparati prima di agire
                </button>

                <button
                    id="choice-ignore"
                    style="
                        display:block;
                        width:100%;
                        padding:16px;
                        margin:10px 0;
                        font-size:18px;
                    ">
                    Allontanati dal pericolo
                </button>

            </main>

        `;

        document
            .getElementById(
                "choice-investigate"
            )
            .onclick = () =>
                this.choose(
                    "Indaga su ciò che sta accadendo"
                );

        document
            .getElementById(
                "choice-prepare"
            )
            .onclick = () =>
                this.choose(
                    "Preparati prima di agire"
                );

        document
            .getElementById(
                "choice-ignore"
            )
            .onclick = () =>
                this.choose(
                    "Allontanati dal pericolo"
                );

    },


    choose(choice){

        const campaign =
            JSON.parse(
                localStorage.getItem(
                    this.storageKey
                )
            );

        campaign.history.push({

            chapter:
                campaign.chapter,

            scene:
                campaign.scene,

            type:
                "player-choice",

            text:
                choice,

            createdAt:
                new Date().toISOString()

        });

        campaign.scene++;

        localStorage.setItem(
            this.storageKey,
            JSON.stringify(campaign)
        );

        document.body.innerHTML = `

            <main style="
                padding:24px;
                max-width:700px;
                margin:auto;
            ">

                <h1>Chronicles</h1>

                <h2>Scelta registrata</h2>

                <p>
                    Hai scelto:
                </p>

                <p style="
                    font-size:22px;
                    font-weight:bold;
                ">
                    ${choice}
                </p>

                <p>
                    La campagna è stata salvata.
                </p>

            </main>

        `;

    }

};


window.GameStart = GameStart;
