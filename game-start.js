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
        chapter: campaign.chapter,
        scene: campaign.scene,
        type: "player-choice",
        text: choice,
        createdAt: new Date().toISOString()
    });

    campaign.scene++;

    const consequences = {

        "Indaga su ciò che sta accadendo": {

            text:
                "Ti avvicini alla fonte del pericolo. Tra il fumo distingui una figura ferita che stringe un oggetto avvolto in un panno.",

            choices: [
                "Soccorri la figura ferita",
                "Esamina prima l'oggetto",
                "Resta nascosto e osserva"
            ]

        },

        "Preparati prima di agire": {

            text:
                "Raccogli ciò che può servirti e studi la situazione. Il tempo perso, però, permette al pericolo di avvicinarsi.",

            choices: [
                "Affronta il pericolo direttamente",
                "Cerca qualcuno disposto ad aiutarti",
                "Trova un percorso alternativo"
            ]

        },

        "Allontanati dal pericolo": {

            text:
                "Ti allontani, ma presto scopri che la minaccia non è confinata al luogo da cui provieni. Qualcuno ti sta seguendo.",

            choices: [
                "Affronta chi ti segue",
                "Tenta di seminarlo",
                "Fingi di non averlo notato"
            ]

        }

    };

    const result =
        consequences[choice];

    if(!result){

        this.showEnding(
            campaign,
            "La tua scelta cambia il corso degli eventi."
        );

        return;

    }

    campaign.history.push({
        chapter: campaign.chapter,
        scene: campaign.scene,
        type: "narration",
        text: result.text,
        createdAt: new Date().toISOString()
    });

    localStorage.setItem(
        this.storageKey,
        JSON.stringify(campaign)
    );

    this.showScene(
        campaign,
        result.text,
        result.choices
    );

},


showScene(campaign, text, choices){

    const buttonsHTML =
        choices
        .map((choice, index) => `

            <button
                class="scene-choice"
                data-choice="${choice}"
                style="
                    display:block;
                    width:100%;
                    padding:16px;
                    margin:10px 0;
                    font-size:18px;
                ">
                ${choice}
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
                opacity:0.7;
                text-transform:uppercase;
                letter-spacing:2px;
            ">
                Capitolo ${campaign.chapter}
                · Scena ${campaign.scene}
            </p>

            <h2>La conseguenza</h2>

            <p style="
                font-size:20px;
                line-height:1.6;
            ">
                ${text}
            </p>

            <h3>Cosa fai?</h3>

            ${buttonsHTML}

        </main>

    `;

    document
        .querySelectorAll(".scene-choice")
        .forEach(button => {

            button.onclick = () => {

                this.continueStory(
                    button.dataset.choice
                );

            };

        });

},


continueStory(choice){

    const campaign =
        JSON.parse(
            localStorage.getItem(
                this.storageKey
            )
        );

    campaign.history.push({
        chapter: campaign.chapter,
        scene: campaign.scene,
        type: "player-choice",
        text: choice,
        createdAt: new Date().toISOString()
    });

    campaign.scene++;

    localStorage.setItem(
        this.storageKey,
        JSON.stringify(campaign)
    );

    this.showEnding(
        campaign,
        `Hai scelto: ${choice}. La tua decisione avrà conseguenze nella prossima scena.`
    );

},


showEnding(campaign, text){

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
                Capitolo ${campaign.chapter}
                · Scena ${campaign.scene}
            </p>

            <h2>Il viaggio continua</h2>

            <p style="
                font-size:20px;
                line-height:1.6;
            ">
                ${text}
            </p>

            <p>
                La campagna è stata salvata.
            </p>

        </main>

    `;

}

};


window.GameStart = GameStart;
