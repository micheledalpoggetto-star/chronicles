/*
==========================================
CHRONICLES
Character Creator
Version 1.5
==========================================
*/

const CharacterCreator = {

    step: 0,

    data: {
        universe: null,
        race: null,
        vocation: null,
        background: null,
        alignment: null,
        stats: {},
        name: null,
        portrait: null
    },

    universes: {

        fantasy: {

            orientationLabel: "Scegli l'allineamento",

            races: [
                "Umano",
                "Elfo Alto",
                "Elfo dei Boschi",
                "Nano",
                "Halfling",
                "Gnomo",
                "Dragonide",
                "Tiefling",
                "Mezzelfo",
                "Mezzorco"
            ],

            vocations: [
                "Guerriero",
                "Paladino",
                "Barbaro",
                "Ladro",
                "Ranger",
                "Monaco",
                "Mago",
                "Stregone",
                "Warlock",
                "Bardo",
                "Druido",
                "Chierico"
            ],

            backgrounds: [
                "Nobile",
                "Soldato",
                "Mercante",
                "Artigiano",
                "Studioso",
                "Eremita",
                "Criminale",
                "Esploratore",
                "Sacerdote",
                "Marinaio",
                "Cacciatore",
                "Intrattenitore",
                "Orfano",
                "Guardia cittadina"
            ],

            alignments: [
                "Legale Buono",
                "Neutrale Buono",
                "Caotico Buono",
                "Legale Neutrale",
                "Neutrale",
                "Caotico Neutrale",
                "Legale Malvagio",
                "Neutrale Malvagio",
                "Caotico Malvagio"
            ],

            stats: [
                "Forza",
                "Destrezza",
                "Costituzione",
                "Intelligenza",
                "Saggezza",
                "Carisma"
            ]
        },
                lovecraft: {

            orientationLabel: "Scegli il tuo atteggiamento verso l'ignoto",

            races: [
                "Umano"
            ],

            vocations: [
                "Detective",
                "Medico",
                "Storico",
                "Professore",
                "Giornalista",
                "Investigatore Privato",
                "Sacerdote",
                "Antiquario",
                "Criminale"
            ],

            backgrounds: [
                "Famiglia benestante",
                "Veterano di guerra",
                "Accademico",
                "Ex poliziotto",
                "Viaggiatore",
                "Erede di una fortuna",
                "Sopravvissuto a un evento inspiegabile",
                "Membro di una società segreta",
                "Archivista",
                "Abitante del luogo"
            ],

            alignments: [
                "Scettico",
                "Razionalista",
                "Curioso",
                "Ossessionato",
                "Credente",
                "Occultista",
                "Timoroso",
                "Fatalista"
            ],

            stats: [
                "Fisico",
                "Destrezza",
                "Intelletto",
                "Istruzione",
                "Volontà",
                "Presenza"
            ]
        },


        superheroes: {

            orientationLabel: "Scegli da che parte stare",

            races: [
                "Umano",
                "Mutante",
                "Alieno",
                "Androide"
            ],

            vocations: [
                "Speedster",
                "Telepate",
                "Tecnologico",
                "Mistico",
                "Combattente",
                "Mutaforma"
            ],

            backgrounds: [
                "Esperimento scientifico",
                "Erede di una dinastia",
                "Agente governativo",
                "Vigilante",
                "Celebrità",
                "Ex criminale",
                "Soldato",
                "Scienziato",
                "Studente",
                "Investigatore",
                "Sopravvissuto a una catastrofe",
                "Visitante da un altro mondo"
            ],

            alignments: [
                "Eroe",
                "Villain"
            ],

            stats: [
                "Potenza",
                "Agilità",
                "Resistenza",
                "Intelletto",
                "Volontà",
                "Presenza"
            ]
        },
                cyberpunk: {

            orientationLabel: "Scegli la tua posizione nel sistema",

            races: [
                "Umano",
                "Cyborg",
                "Clone",
                "Sintetico"
            ],

            vocations: [
                "Netrunner",
                "Mercenario",
                "Tecnomedico",
                "Infiltratore",
                "Cacciatore"
            ],

            backgrounds: [
                "Corporativo",
                "Ragazzo di strada",
                "Nomade",
                "Ex militare",
                "Fuggitivo",
                "Contrabbandiere",
                "Tecnico",
                "Ex agente corporativo",
                "Giornalista clandestino",
                "Rivoluzionario",
                "Cacciatore di taglie",
                "Sopravvissuto delle periferie"
            ],

            alignments: [
                "Corporativo",
                "Indipendente",
                "Mercenario",
                "Ribelle",
                "Anarchico",
                "Idealista"
            ],

            stats: [
                "Corpo",
                "Riflessi",
                "Tecnica",
                "Intelligenza",
                "Freddezza",
                "Empatia"
            ]
        },


        "fractured-domains": {

            orientationLabel: "Scegli il tuo rapporto con i Domini",

            races: [
                "Umano",
                "Custode",
                "Forgiato",
                "Nomade"
            ],

            vocations: [
                "Custode",
                "Mistico",
                "Campione",
                "Esploratore",
                "Arcanista"
            ],

            backgrounds: [
                "Figlio del Dominio",
                "Esule",
                "Pellegrino",
                "Guardiano di una reliquia",
                "Studioso delle Fratture",
                "Mercenario",
                "Nobile decaduto",
                "Nomade delle frontiere",
                "Sopravvissuto a una Frattura",
                "Adepto di un antico ordine"
            ],

            alignments: [
                "Devoto al proprio Dominio",
                "Custode dell'equilibrio",
                "Cercatore di conoscenza",
                "Ambizioso",
                "Ribelle",
                "Indipendente"
            ],

            stats: [
                "Vigore",
                "Agilità",
                "Mente",
                "Volontà",
                "Presenza",
                "Affinità"
            ]
        }

    },


    start(universe){

        this.step = 1;

        this.data = {
            universe: null,
            race: null,
            vocation: null,
            background: null,
            alignment: null,
            stats: {},
            name: null,
            portrait: null
        };

        this.setUniverse(universe);

        this.showRaceSelection();
    },
        pageTemplate(title, extraContent){

        return `
            <main style="
                padding:24px;
                max-width:700px;
                margin:auto;
            ">
                <h1>Chronicles</h1>
                <h2>${title}</h2>
                ${extraContent}
            </main>
        `;
    },


    createChoiceButton(text, callback){

        const button = document.createElement("button");

        button.textContent = text;
        button.style.display = "block";
        button.style.width = "100%";
        button.style.padding = "16px";
        button.style.margin = "10px 0";
        button.style.fontSize = "18px";
        button.style.cursor = "pointer";

        button.onclick = callback;

        return button;
    },


    showRaceSelection(){

        document.body.innerHTML = this.pageTemplate(
            "Crea il tuo personaggio",
            `
                <p>
                    Universo:
                    <strong>${this.data.universe}</strong>
                </p>

                <h3>Scegli la razza</h3>

                <div id="character-races"></div>
            `
        );

        const container =
            document.getElementById("character-races");

        this.getRaces().forEach(race => {

            container.appendChild(
                this.createChoiceButton(
                    race,
                    () => {

                        this.setRace(race);
                        this.step = 2;
                        this.showVocationSelection();

                    }
                )
            );

        });
    },


    showVocationSelection(){

        document.body.innerHTML = this.pageTemplate(
            "Crea il tuo personaggio",
            `
                <p>
                    Universo:
                    <strong>${this.data.universe}</strong>
                </p>

                <p>
                    Razza:
                    <strong>${this.data.race}</strong>
                </p>

                <h3>Scegli la vocazione</h3>

                <div id="character-vocations"></div>
            `
        );

        const container =
            document.getElementById("character-vocations");

        this.getVocations().forEach(vocation => {

            container.appendChild(
                this.createChoiceButton(
                    vocation,
                    () => {

                        this.setVocation(vocation);
                        this.step = 3;
                        this.showBackgroundSelection();

                    }
                )
            );

        });
    },
        showBackgroundSelection(){

        document.body.innerHTML = this.pageTemplate(
            "Crea il tuo personaggio",
            `
                <p>
                    Universo:
                    <strong>${this.data.universe}</strong>
                </p>

                <p>
                    Razza:
                    <strong>${this.data.race}</strong>
                </p>

                <p>
                    Vocazione:
                    <strong>${this.data.vocation}</strong>
                </p>

                <h3>Scegli il background</h3>

                <div id="character-backgrounds"></div>
            `
        );

        const container =
            document.getElementById("character-backgrounds");

        this.getBackgrounds().forEach(background => {

            container.appendChild(
                this.createChoiceButton(
                    background,
                    () => {

                        this.setBackground(background);
                        this.step = 4;
                        this.showAlignmentSelection();

                    }
                )
            );

        });
    },


    showAlignmentSelection(){

        const label =
            this.universes[
                this.data.universe
            ].orientationLabel;

        document.body.innerHTML = this.pageTemplate(
            "Crea il tuo personaggio",
            `
                <p>
                    Universo:
                    <strong>${this.data.universe}</strong>
                </p>

                <p>
                    Razza:
                    <strong>${this.data.race}</strong>
                </p>

                <p>
                    Vocazione:
                    <strong>${this.data.vocation}</strong>
                </p>

                <p>
                    Background:
                    <strong>${this.data.background}</strong>
                </p>

                <h3>${label}</h3>

                <div id="character-alignments"></div>
            `
        );

        const container =
            document.getElementById("character-alignments");

        this.getAlignments().forEach(alignment => {

            container.appendChild(
                this.createChoiceButton(
                    alignment,
                    () => {

                        this.setAlignment(alignment);
                        this.step = 5;
                        this.generateStats();
                        this.showStats();

                    }
                )
            );

        });
    },
        applyBonuses(source){

        if(!source){
            return;
        }

        Object.entries(source).forEach(([stat, bonus]) => {

            if(this.data.stats[stat] !== undefined){
                this.data.stats[stat] += bonus;
            }

        });

    },


    generateStats(){

        this.data.stats = {};

        this.getStatNames().forEach(stat => {
            this.data.stats[stat] = 10;
        });

        const universe =
            this.universes[this.data.universe];

        this.applyBonuses(
            universe.raceBonuses
                ? universe.raceBonuses[this.data.race]
                : null
        );

        this.applyBonuses(
            universe.vocationBonuses
                ? universe.vocationBonuses[this.data.vocation]
                : null
        );

        this.statFloor = {
            ...this.data.stats
        };

        this.statPoints = 6;

    },


    increaseStat(stat){

        if(this.statPoints <= 0){
            return;
        }

        if(this.data.stats[stat] >= 18){
            return;
        }

        this.data.stats[stat]++;

        this.statPoints--;

        this.showStats();

    },


    decreaseStat(stat){

        if(
            this.data.stats[stat] <=
            this.statFloor[stat]
        ){
            return;
        }

        this.data.stats[stat]--;

        this.statPoints++;

        this.showStats();

    },


    showStats(){

        const statsHTML =
            Object.entries(this.data.stats)
            .map(([name, value]) => `

                <div style="
                    border:1px solid #555;
                    border-radius:10px;
                    padding:16px;
                    margin:10px 0;
                ">

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        margin-bottom:12px;
                    ">

                        <strong>${name}</strong>

                        <span style="
                            font-size:28px;
                            font-weight:bold;
                        ">
                            ${value}
                        </span>

                    </div>

                    <div style="
                        display:flex;
                        gap:10px;
                    ">

                        <button
                            class="stat-minus"
                            data-stat="${name}"
                            style="
                                flex:1;
                                padding:10px;
                                font-size:20px;
                            ">
                            −
                        </button>

                        <button
                            class="stat-plus"
                            data-stat="${name}"
                            style="
                                flex:1;
                                padding:10px;
                                font-size:20px;
                            ">
                            +
                        </button>

                    </div>

                </div>

            `)
            .join("");

        document.body.innerHTML =
            this.pageTemplate(
                "Caratteristiche",
                `

                    <p>
                        Razza e vocazione hanno già
                        modificato le tue caratteristiche.
                    </p>

                    <p style="
                        font-size:20px;
                        font-weight:bold;
                    ">
                        Punti da distribuire:
                        ${this.statPoints}
                    </p>

                    <div>
                        ${statsHTML}
                    </div>

                    <button
                        id="accept-stats"
                        style="
                            width:100%;
                            padding:16px;
                            margin-top:20px;
                            font-size:18px;
                        ">
                        Conferma caratteristiche
                    </button>

                `
            );

        document
            .querySelectorAll(".stat-plus")
            .forEach(button => {

                button.onclick = () => {

                    this.increaseStat(
                        button.dataset.stat
                    );

                };

            });

        document
            .querySelectorAll(".stat-minus")
            .forEach(button => {

                button.onclick = () => {

                    this.decreaseStat(
                        button.dataset.stat
                    );

                };

            });

        document
            .getElementById("accept-stats")
            .onclick = () => {

                if(this.statPoints > 0){

                    alert(
                        "Devi ancora distribuire " +
                        this.statPoints +
                        " punti."
                    );

                    return;

                }

                this.step = 6;

                this.showIdentity();

            };

    },
     showIdentity(){

        document.body.innerHTML =
            this.pageTemplate(
                "Chi sei?",
                `

                    <p>
                        Ora diamo un'identità al tuo personaggio.
                    </p>

                    <label style="
                        display:block;
                        margin-top:20px;
                        font-weight:bold;
                    ">
                        Nome *
                    </label>

                    <input
                        id="character-name"
                        type="text"
                        placeholder="Nome del personaggio"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:14px;
                            margin-top:8px;
                            font-size:18px;
                            border-radius:8px;
                            border:1px solid #555;
                        "
                    >


                    <label style="
                        display:block;
                        margin-top:20px;
                        font-weight:bold;
                    ">
                        Età
                    </label>

                    <input
                        id="character-age"
                        type="number"
                        min="1"
                        placeholder="Età"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:14px;
                            margin-top:8px;
                            font-size:18px;
                            border-radius:8px;
                            border:1px solid #555;
                        "
                    >


                    <label style="
                        display:block;
                        margin-top:20px;
                        font-weight:bold;
                    ">
                        Genere / identità
                    </label>

                    <input
                        id="character-identity"
                        type="text"
                        placeholder="Facoltativo"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:14px;
                            margin-top:8px;
                            font-size:18px;
                            border-radius:8px;
                            border:1px solid #555;
                        "
                    >


                    <label style="
                        display:block;
                        margin-top:20px;
                        font-weight:bold;
                    ">
                        Provenienza
                    </label>

                    <input
                        id="character-origin"
                        type="text"
                        placeholder="Città, regione, pianeta, distretto..."
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:14px;
                            margin-top:8px;
                            font-size:18px;
                            border-radius:8px;
                            border:1px solid #555;
                        "
                    >


                    <label style="
                        display:block;
                        margin-top:20px;
                        font-weight:bold;
                    ">
                        Tratto distintivo
                    </label>

                    <textarea
                        id="character-trait"
                        placeholder="Es. diffidente verso gli estranei, ironico, ossessionato dalla conoscenza..."
                        rows="4"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:14px;
                            margin-top:8px;
                            font-size:18px;
                            border-radius:8px;
                            border:1px solid #555;
                        "
                    ></textarea>


                    <button
                        id="confirm-identity"
                        style="
                            width:100%;
                            padding:16px;
                            margin-top:24px;
                            font-size:18px;
                        ">
                        Continua
                    </button>

                `
            );


        document
            .getElementById("confirm-identity")
            .onclick = () => {

                const name =
                    document
                        .getElementById("character-name")
                        .value
                        .trim();

                if(!name){

                    alert(
                        "Inserisci il nome del personaggio."
                    );

                    return;

                }


                const ageValue =
                    document
                        .getElementById("character-age")
                        .value;


                this.data.name = name;

                this.data.age =
                    ageValue
                    ? Number(ageValue)
                    : null;

                this.data.identity =
                    document
                        .getElementById("character-identity")
                        .value
                        .trim()
                    || null;

                this.data.origin =
                    document
                        .getElementById("character-origin")
                        .value
                        .trim()
                    || null;

                this.data.trait =
                    document
                        .getElementById("character-trait")
                        .value
                        .trim()
                    || null;


                this.step = 7;

                this.save();

                this.showSummary();

            };

    },
        showSummary(){

        const statsHTML =
            Object.entries(this.data.stats)
            .map(([name, value]) => `

                <p>
                    ${name}:
                    <strong>${value}</strong>
                </p>

            `)
            .join("");


        const optional = value => {

            if(value !== null &&
               value !== undefined &&
               value !== ""){

                return `<strong>${value}</strong>`;

            }

            return `<em>Non specificato</em>`;

        };


        document.body.innerHTML =
            this.pageTemplate(
                "Personaggio creato",
                `

                    <h3>
                        ${this.data.name}
                    </h3>


                    <p>
                        Universo:
                        <strong>
                            ${this.data.universe}
                        </strong>
                    </p>

                    <p>
                        Razza:
                        <strong>
                            ${this.data.race}
                        </strong>
                    </p>

                    <p>
                        Vocazione:
                        <strong>
                            ${this.data.vocation}
                        </strong>
                    </p>

                    <p>
                        Background:
                        <strong>
                            ${this.data.background}
                        </strong>
                    </p>

                    <p>
                        Orientamento:
                        <strong>
                            ${this.data.alignment}
                        </strong>
                    </p>


                    <h3>
                        Identità
                    </h3>

                    <p>
                        Età:
                        ${optional(this.data.age)}
                    </p>

                    <p>
                        Genere / identità:
                        ${optional(this.data.identity)}
                    </p>

                    <p>
                        Provenienza:
                        ${optional(this.data.origin)}
                    </p>

                    <p>
                        Tratto distintivo:
                        ${optional(this.data.trait)}
                    </p>


                    <h3>
                        Caratteristiche
                    </h3>

                    ${statsHTML}


                    <p style="
                        margin-top:30px;
                    ">
                        Il personaggio è stato salvato.
                    </p>
<button
    id="start-adventure"
    style="
        width:100%;
        padding:16px;
        margin-top:20px;
        font-size:18px;
    ">
    Inizia avventura
</button>
                `
            );
document.getElementById("start-adventure").onclick = () => {

    this.save();

    try {

        if (!window.GameStart) {
            throw new Error(
                "GameStart non è stato caricato."
            );
        }

        if (typeof window.GameStart.start !== "function") {
            throw new Error(
                "GameStart esiste, ma start() non è disponibile."
            );
        }

        window.GameStart.start();

    } catch (error) {

        alert(
            "ERRORE AVVIO CHRONICLES:\n\n" +
            (error.stack || error.message || error)
        );

    }

};
            
    },


    

    setUniverse(id){

        this.data.universe = id;

    },


    getRaces(){

        return this.universes[
            this.data.universe
        ].races;

    },


    getVocations(){

        return this.universes[
            this.data.universe
        ].vocations;

    },


    getBackgrounds(){

        return this.universes[
            this.data.universe
        ].backgrounds;

    },


    getAlignments(){

        return this.universes[
            this.data.universe
        ].alignments;

    },


    getStatNames(){

        return this.universes[
            this.data.universe
        ].stats;

    },


    setRace(race){

        this.data.race = race;

    },


    setVocation(vocation){

        this.data.vocation = vocation;

    },


    setBackground(background){

        this.data.background = background;

    },


    setAlignment(alignment){

        this.data.alignment = alignment;

    },


    save(){

        localStorage.setItem(
            "chronicles-character",
            JSON.stringify(this.data)
        );

    }

};


window.CharacterCreator = CharacterCreator;
window.addEventListener("chronicles:universe-selected", function(event) {

    const universe = event.detail;

    if(!universe){
        return;
    }

    CharacterCreator.start(universe);

});
