/*
==========================================
CHRONICLES
Character Creator
Version 1.2
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
            ]

        },

        lovecraft: {

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
            ]

        },

        superheroes: {

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
            ]

        },

        cyberpunk: {

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
            ]

        },

        "fractured-domains": {

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
                <p>
                    Universo:
                    <strong>${universe}</strong>
                </p>

                <h3>Scegli la razza</h3>

                <div id="character-races"></div>
            `
        );

        const container =
            document.getElementById("character-races");

        this.getRaces().forEach(race => {

            const button = this.createChoiceButton(
                race,
                () => {

                    this.setRace(race);

                    this.step = 2;

                    this.showVocationSelection();

                }
            );

            container.appendChild(button);

        });

    },


    showVocationSelection(){

        const universe = this.data.universe;
        const race = this.data.race;

        document.body.innerHTML = this.pageTemplate(
            "Crea il tuo personaggio",
            `
                <p>
                    Universo:
                    <strong>${universe}</strong>
                </p>

                <p>
                    Razza:
                    <strong>${race}</strong>
                </p>

                <h3>Scegli la vocazione</h3>

                <div id="character-vocations"></div>
            `
        );

        const container =
            document.getElementById("character-vocations");

        this.getVocations().forEach(vocation => {

            const button = this.createChoiceButton(
                vocation,
                () => {

                    this.setVocation(vocation);

                    this.step = 3;

                    this.showBackgroundSelection();

                }
            );

            container.appendChild(button);

        });

    },


    showBackgroundSelection(){

        const universe = this.data.universe;
        const race = this.data.race;
        const vocation = this.data.vocation;

        document.body.innerHTML = this.pageTemplate(
            "Crea il tuo personaggio",
            `
                <p>
                    Universo:
                    <strong>${universe}</strong>
                </p>

                <p>
                    Razza:
                    <strong>${race}</strong>
                </p>

                <p>
                    Vocazione:
                    <strong>${vocation}</strong>
                </p>

                <h3>Scegli il background</h3>

                <div id="character-backgrounds"></div>
            `
        );

        const container =
            document.getElementById("character-backgrounds");

        this.getBackgrounds().forEach(background => {

            const button = this.createChoiceButton(
                background,
                () => {

                    this.setBackground(background);

                    this.step = 4;

                    this.save();

                    this.showSummary();

                }
            );

            container.appendChild(button);

        });

    },


    showSummary(){

        const universe = this.data.universe;
        const race = this.data.race;
        const vocation = this.data.vocation;
        const background = this.data.background;

        document.body.innerHTML = this.pageTemplate(
            "Personaggio creato",
            `
                <p>
                    Universo:
                    <strong>${universe}</strong>
                </p>

                <p>
                    Razza:
                    <strong>${race}</strong>
                </p>

                <p>
                    Vocazione:
                    <strong>${vocation}</strong>
                </p>

                <p>
                    Background:
                    <strong>${background}</strong>
                </p>

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


    setRace(race){
        this.data.race = race;
    },


    setVocation(vocation){
        this.data.vocation = vocation;
    },


    setBackground(background){
        this.data.background = background;
    },


    save(){

        localStorage.setItem(
            "chronicles-character",
            JSON.stringify(this.data)
        );

    }

};


window.CharacterCreator = CharacterCreator;
