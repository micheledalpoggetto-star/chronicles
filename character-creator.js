/*
==========================================
CHRONICLES
Character Creator
Version 1.0
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
    this.setUniverse(universe);

    document.body.innerHTML = `
        <main style="padding:24px;max-width:700px;margin:auto;">
            <h1>Chronicles</h1>
            <h2>Crea il tuo personaggio</h2>

            <p>Universo: <strong>${universe}</strong></p>

            <h3>Scegli la razza</h3>

            <div id="character-races"></div>
        </main>
    `;

    const container = document.getElementById("character-races");

    this.getRaces().forEach(race => {

        const button = document.createElement("button");

        button.textContent = race;

        button.style.display = "block";
        button.style.width = "100%";
        button.style.padding = "16px";
        button.style.margin = "10px 0";
        button.style.fontSize = "18px";

        button.onclick = () => {
            this.setRace(race);
            alert("Razza selezionata: " + race);
        };

        container.appendChild(button);

    });

},

    setUniverse(id){

        this.data.universe=id;

    },

    getRaces(){

        return this.universes[this.data.universe].races;

    },

    getVocations(){

        return this.universes[this.data.universe].vocations;

    },

    setRace(race){

        this.data.race=race;

    },

    setVocation(vocation){

        this.data.vocation=vocation;

    },

    save(){

        localStorage.setItem(

            "chronicles-character",

            JSON.stringify(this.data)

        );

    }

};

window.CharacterCreator=CharacterCreator;
// Avvia il Character Creator dopo la scelta dell'universo
window.addEventListener("chronicles:universe-selected", function (event) {
    const universe = event.detail;
    
    if (!universe) return;

    if (window.CharacterCreator && typeof window.CharacterCreator.start === "function") {
        window.CharacterCreator.start(universe);
    }
});
