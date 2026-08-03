/*
==========================================
CHRONICLES
Character Creator
Version 1.5
==========================================
*/

const CharacterCreator = {

    step: 0,

    statPoints: 0,
    statFloor: {},

    data: {
        universe: null,
        race: null,
        vocation: null,
        background: null,
        alignment: null,
        stats: {},
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
            ],

            raceBonuses: {
                "Umano": {
                    "Forza": 1,
                    "Destrezza": 1,
                    "Costituzione": 1
                },

                "Elfo Alto": {
                    "Destrezza": 2,
                    "Intelligenza": 1
                },

                "Elfo dei Boschi": {
                    "Destrezza": 2,
                    "Saggezza": 1
                },

                "Nano": {
                    "Costituzione": 2,
                    "Forza": 1
                },

                "Halfling": {
                    "Destrezza": 2,
                    "Carisma": 1
                },

                "Gnomo": {
                    "Intelligenza": 2,
                    "Destrezza": 1
                },

                "Dragonide": {
                    "Forza": 2,
                    "Carisma": 1
                },

                "Tiefling": {
                    "Carisma": 2,
                    "Intelligenza": 1
                },

                "Mezzelfo": {
                    "Carisma": 2,
                    "Destrezza": 1
                },

                "Mezzorco": {
                    "Forza": 2,
                    "Costituzione": 1
                }
            },

            vocationBonuses: {

                "Guerriero": {
                    "Forza": 2,
                    "Costituzione": 1
                },

                "Paladino": {
                    "Forza": 1,
                    "Costituzione": 1,
                    "Carisma": 1
                },

                "Barbaro": {
                    "Forza": 2,
                    "Costituzione": 1
                },

                "Ladro": {
                    "Destrezza": 2,
                    "Intelligenza": 1
                },

                "Ranger": {
                    "Destrezza": 1,
                    "Saggezza": 2
                },

                "Monaco": {
                    "Destrezza": 1,
                    "Saggezza": 2
                },

                "Mago": {
                    "Intelligenza": 3
                },

                "Stregone": {
                    "Carisma": 2,
                    "Costituzione": 1
                },

                "Warlock": {
                    "Carisma": 2,
                    "Saggezza": 1
                },

                "Bardo": {
                    "Carisma": 2,
                    "Destrezza": 1
                },

                "Druido": {
                    "Saggezza": 2,
                    "Costituzione": 1
                },

                "Chierico": {
                    "Saggezza": 2,
                    "Carisma": 1
                }

            }

        },


        lovecraft: {

            orientationLabel:
                "Scegli il tuo atteggiamento verso l'ignoto",

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
            ],

            raceBonuses: {
                "Umano": {
                    "Fisico": 1,
                    "Intelletto": 1,
                    "Volontà": 1
                }
            },

            vocationBonuses: {

                "Detective": {
                    "Intelletto": 2,
                    "Presenza": 1
                },

                "Medico": {
                    "Istruzione": 2,
                    "Intelletto": 1
                },

                "Storico": {
                    "Istruzione": 2,
                    "Intelletto": 1
                },

                "Professore": {
                    "Istruzione": 3
                },

                "Giornalista": {
                    "Presenza": 2,
                    "Intelletto": 1
                },

                "Investigatore Privato": {
                    "Intelletto": 1,
                    "Destrezza": 1,
                    "Presenza": 1
                },

                "Sacerdote": {
                    "Volontà": 2,
                    "Presenza": 1
                },

                "Antiquario": {
                    "Istruzione": 2,
                    "Volontà": 1
                },

                "Criminale": {
                    "Destrezza": 2,
                    "Presenza": 1
                }

            }

        },


        superheroes: {

            orientationLabel:
                "Scegli da che parte stare",

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
            ],

            raceBonuses: {

                "Umano": {
                    "Volontà": 1,
                    "Intelletto": 1,
                    "Presenza": 1
                },

                "Mutante": {
                    "Potenza": 2,
                    "Volontà": 1
                },

                "Alieno": {
                    "Potenza": 1,
                    "Resistenza": 2
                },

                "Androide": {
                    "Resistenza": 2,
                    "Intelletto": 1
                }

            },

            vocationBonuses: {

                "Speedster": {
                    "Agilità": 3
                },

                "Telepate": {
                    "Volontà": 2,
                    "Intelletto": 1
                },

                "Tecnologico": {
                    "Intelletto": 3
                },

                "Mistico": {
                    "Volontà": 2,
                    "Presenza": 1
                },

                "Combattente": {
                    "Potenza": 2,
                    "Resistenza": 1
                },

                "Mutaforma": {
                    "Resistenza": 1,
                    "Agilità": 1,
                    "Presenza": 1
                }

            }

        },


        cyberpunk: {

            orientationLabel:
                "Scegli la tua posizione nel sistema",

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
            ],

            raceBonuses: {

                "Umano": {
                    "Empatia": 1,
                    "Freddezza": 1,
                    "Intelligenza": 1
                },

                "Cyborg": {
                    "Corpo": 2,
                    "Riflessi": 1
                },

                "Clone": {
                    "Riflessi": 1,
                    "Intelligenza": 1,
                    "Tecnica": 1
                },

                "Sintetico": {
                    "Tecnica": 2,
                    "Intelligenza": 1
                }

            },

            vocationBonuses: {

                "Netrunner": {
                    "Intelligenza": 2,
                    "Tecnica": 1
                },

                "Mercenario": {
                    "Corpo": 2,
                    "Riflessi": 1
                },

                "Tecnomedico": {
                    "Tecnica": 2,
                    "Intelligenza": 1
                },

                "Infiltratore": {
                    "Riflessi": 2,
                    "Freddezza": 1
                },

                "Cacciatore": {
                    "Riflessi": 1,
                    "Freddezza": 2
                }

            }

        },


        "fractured-domains": {

            orientationLabel:
                "Scegli il tuo rapporto con i Domini",

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
            ],

            raceBonuses: {

                "Umano": {
                    "Vigore": 1,
                    "Mente": 1,
                    "Presenza": 1
                },

                "Custode": {
                    "Volontà": 2,
                    "Affinità": 1
                },

                "Forgiato": {
                    "Vigore": 2,
                    "Volontà": 1
                },

                "Nomade": {
                    "Agilità": 2,
                    "Mente": 1
                }

            },

            vocationBonuses: {

                "Custode": {
                    "Volontà": 2,
                    "Affinità": 1
                },

                "Mistico": {
                    "Affinità": 2,
                    "Volontà": 1
                },

                "Campione": {
                    "Vigore": 2,
                    "Presenza": 1
                },

                "Esploratore": {
                    "Agilità": 2,
                    "Mente": 1
                },

                "Arcanista": {
                    "Mente": 2,
                    "Affinità": 1
                }

            }

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
            portrait: null
        };

        this.statPoints = 0;
        this.statFloor = {};

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

        const button =
            document.createElement("button");

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

        document.body.innerHTML =
            this.pageTemplate(
                "Crea il tuo personaggio",
                `
                    <p>
                        Universo:
                        <strong>
                            ${this.data.universe}
                        </strong>
                    </p>

                    <h3>Scegli la razza</h3>

                    <div id="character-races"></div>
                `
            );

        const container =
            document.getElementById(
                "character-races"
            );

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

        document.body.innerHTML =
            this.pageTemplate(
                "Crea il tuo personaggio",
                `
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

                    <h3>Scegli la vocazione</h3>

                    <div id="character-vocations"></div>
                `
            );

        const container =
            document.getElementById(
                "character-vocations"
            );

        this.getVocations()
            .forEach(vocation => {

                container.appendChild(

                    this.createChoiceButton(
                        vocation,
                        () => {

                            this.setVocation(
                                vocation
                            );

                            this.step = 3;

                            this.showBackgroundSelection();

                        }
                    )

                );

            });

    },


    showBackgroundSelection(){

        document.body.innerHTML =
            this.pageTemplate(
                "Crea il tuo personaggio",
                `
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

                    <h3>Scegli il background</h3>

                    <div id="character-backgrounds"></div>
                `
            );

        const container =
            document.getElementById(
                "character-backgrounds"
            );

        this.getBackgrounds()
            .forEach(background => {

                container.appendChild(

                    this.createChoiceButton(
                        background,
                        () => {

                            this.setBackground(
                                background
                            );

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

        document.body.innerHTML =
            this.pageTemplate(
                "Crea il tuo personaggio",
                `
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

                    <h3>${label}</h3>

                    <div id="character-alignments"></div>
                `
            );

        const container =
            document.getElementById(
                "character-alignments"
            );

        this.getAlignments()
            .forEach(alignment => {

                container.appendChild(

                    this.createChoiceButton(
                        alignment,
                        () => {

                            this.setAlignment(
                                alignment
                            );

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

        Object.entries(source)
            .forEach(([stat, bonus]) => {

                if(
                    this.data.stats[stat]
                    !== undefined
                ){
                    this.data.stats[stat] +=
                        bonus;
                }

            });

    },


    generateStats(){

        this.data.stats = {};

        this.getStatNames()
            .forEach(stat => {

                this.data.stats[stat] = 10;

            });


        const universe =
            this.universes[
                this.data.universe
            ];


        this.applyBonuses(
            universe.raceBonuses[
                this.data.race
            ]
        );


        this.applyBonuses(
            universe.vocationBonuses[
                this.data.vocation
            ]
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
            this.data.stats[stat]
            <= this.statFloor[stat]
        ){
            return;
        }

        this.data.stats[stat]--;

        this.statPoints++;

        this.showStats();

    },


    showStats(){

        const statsHTML =
            Object.entries(
                this.data.stats
            )
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

                        <strong>
                            ${name}
                        </strong>

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
            .querySelectorAll(
                ".stat-plus"
            )
            .forEach(button => {

                button.onclick = () => {

                    this.increaseStat(
                        button.dataset.stat
                    );

                };

            });


        document
            .querySelectorAll(
                ".stat-minus"
            )
            .forEach(button => {

                button.onclick = () => {

                    this.decreaseStat(
                        button.dataset.stat
                    );

                };

            });


        document
            .getElementById(
                "accept-stats"
            )
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

                this.save();

                this.showSummary();

            };

    },


    showSummary(){

        const statsHTML =
            Object.entries(
                this.data.stats
            )
            .map(
                ([name, value]) =>
                    `<p>
                        ${name}:
                        <strong>
                            ${value}
                        </strong>
                    </p>`
            )
            .join("");


        document.body.innerHTML =
            this.pageTemplate(
                "Personaggio creato",
                `

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
                        Caratteristiche
                    </h3>

                    ${statsHTML}


                    <p style="
                        margin-top:30px;
                    ">
                        Il personaggio è stato salvato.
                    </p>

                `
            );

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
        this.data.background =
            background;
    },


    setAlignment(alignment){
        this.data.alignment =
            alignment;
    },


    save(){

        localStorage.setItem(
            "chronicles-character",
            JSON.stringify(
                this.data
            )
        );

    }

};


window.CharacterCreator =
    CharacterCreator;
