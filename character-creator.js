/*
==========================================
CHRONICLES
Character Creator
Version 1.4
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

        const universe = this.data.universe;

        document.body.innerHTML = this.pageTemplate(
            "Crea il tuo personaggio",
            `
                <p>Universo: <strong>${universe}</strong></p>

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
                <p>Universo: <strong>${this.data.universe}</strong></p>
                <p>Razza: <strong>${this.data.race}</strong></p>

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
                <p>Universo: <strong>${this.data.universe}</strong></p>
                <p>Razza: <strong>${this.data.race}</strong></p>
                <p>Vocazione: <strong>${this.data.vocation}</strong></p>

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
            this.universes[this.data.universe].orientationLabel;

        document.body.innerHTML = this.pageTemplate(
            "Crea il tuo personaggio",
            `
                <p>Universo: <strong>${this.data.universe}</strong></p>
                <p>Razza: <strong>${this.data.race}</strong></p>
                <p>Vocazione: <strong>${this.data.vocation}</strong></p>
                <p>Background: <strong>${this.data.background}</strong></p>

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


    rollStat(){

        const rolls = [];

        for(let i = 0; i < 4; i++){

            rolls.push(
                Math.floor(Math.random() * 6) + 1
            );

        }

        rolls.sort((a,b) => a-b);

        rolls.shift();

        return rolls.reduce(
            (total, value) => total + value,
            0
        );

    },


    generateStats(){

        this.data.stats = {};

        this.getStatNames().forEach(stat => {

            this.data.stats[stat] =
                this.rollStat();

        });

    },


    showStats(){

        const statsHTML =
            Object.entries(this.data.stats)
            .map(([name, value]) => `
                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    border:1px solid #555;
                    border-radius:10px;
                    padding:16px;
                    margin:10px 0;
                ">
                    <strong>${name}</strong>
                    <span style="
                        font-size:24px;
                        font-weight:bold;
                    ">
                        ${value}
                    </span>
                </div>
            `)
            .join("");

        document.body.innerHTML = this.pageTemplate(
            "Caratteristiche",
            `
                <p>
                    Queste sono le caratteristiche iniziali
                    del tuo personaggio.
                </p>

                <div>
                    ${statsHTML}
                </div>

                <button id="reroll-stats"
                    style="
                        width:100%;
                        padding:16px;
                        margin-top:20px;
                        font-size:18px;
                    ">
                    Rigenera
                </button>

                <button id="accept-stats"
                    style="
                        width:100%;
                        padding:16px;
                        margin-top:10px;
                        font-size:18px;
                    ">
                    Accetta
                </button>
            `
        );

        document
            .getElementById("reroll-stats")
            .onclick = () => {

                this.generateStats();

                this.showStats();

            };


        document
            .getElementById("accept-stats")
            .onclick = () => {

                this.step = 6;

                this.save();

                this.showSummary();

            };

    },


    showSummary(){

        const statsHTML =
            Object.entries(this.data.stats)
            .map(([name, value]) =>
                `<p>${name}: <strong>${value}</strong></p>`
            )
            .join("");

        document.body.innerHTML = this.pageTemplate(
            "Personaggio creato",
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

                <p>
                    Orientamento:
                    <strong>${this.data.alignment}</strong>
                </p>

                <h3>Caratteristiche</h3>

                ${statsHTML}

                <p style="margin-top:30px;">
                    Il personaggio è stato salvato.
                </p>
            `
        );

    },


    setUniverse(id){
        this.data.universe = id;
    },


    getRaces(){
        return this.universes[this.data.universe].races;
    },


    getVocations(){
        return this.universes[this.data.universe].vocations;
    },


    getBackgrounds(){
        return this.universes[this.data.universe].backgrounds;
    },


    getAlignments(){
        return this.universes[this.data.universe].alignments;
    },


    getStatNames(){
        return this.universes[this.data.universe].stats;
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
