/*
==========================================
CHRONICLES
Character Creator
Version 1.1
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


    showRaceSelection(){

        const universe = this.data.universe;

        document.body.innerHTML = `
            <main style="
                padding:24px;
                max-width:700px;
                margin:auto;
            ">

                <h1>Chronicles</h1>

                <h2>Crea il tuo personaggio</h2>

                <p>
                    Universo:
                    <strong>${universe}</strong>
                </p>

                <h3>Scegli la razza</h3>

                <div id="character-races"></div>

            </main>
        `;

        const container =
            document.getElementById("character-races");

        this.getRaces().forEach(race => {

            const button =
                document.createElement("button");

            button.textContent = race;

            button.style.display = "block";
            button.style.width = "100%";
            button.style.padding = "16px";
            button.style.margin = "10px 0";
            button.style.fontSize = "18px";
            button.style.cursor = "pointer";

            button.onclick = () => {

                this.setRace(race);

                this.step = 2;

                this.showVocationSelection();

            };

            container.appendChild(button);

        });

    },


    showVocationSelection(){

        const universe = this.data.universe;
        const race = this.data.race;

        document.body.innerHTML = `
            <main style="
                padding:24px;
                max-width:700px;
                margin:auto;
            ">

                <h1>Chronicles</h1>

                <h2>Crea il tuo personaggio</h2>

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

            </main>
        `;

        const container =
            document.getElementById("character-vocations");

        this.getVocations().forEach(vocation => {

            const button =
                document.createElement("button");

            button.textContent = vocation;

            button.style.display = "block";
            button.style.width = "100%";
            button.style.padding = "16px";
            button.style.margin = "10px 0";
            button.style.fontSize = "18px";
            button.style.cursor = "pointer";

            button.onclick = () => {

                this.setVocation(vocation);

                this.step = 3;

                this.save();

                this.showSummary();

            };

            container.appendChild(button);

        });

    },


    showSummary(){

        const universe = this.data.universe;
        const race = this.data.race;
        const vocation = this.data.vocation;

        document.body.innerHTML = `
            <main style="
                padding:24px;
                max-width:700px;
                margin:auto;
            ">

                <h1>Chronicles</h1>

                <h2>Personaggio creato</h2>

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

                <p style="margin-top:30px;">
                    Il personaggio è stato salvato.
                </p>

            </main>
        `;

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


    setRace(race){

        this.data.race = race;

    },


    setVocation(vocation){

        this.data.vocation = vocation;

    },


    save(){

        localStorage.setItem(

            "chronicles-character",

            JSON.stringify(this.data)

        );

    }

};


window.CharacterCreator = CharacterCreator;
