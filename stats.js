/*
=========================================
CHRONICLES
Stats Engine v1.0
=========================================
*/

const StatsEngine = {

    defaultStats() {

        return {

            strength: 10,

            dexterity: 10,

            constitution: 10,

            intelligence: 10,

            wisdom: 10,

            charisma: 10

        };

    },

    randomStats() {

        const stats = {};

        const names = [

            "strength",

            "dexterity",

            "constitution",

            "intelligence",

            "wisdom",

            "charisma"

        ];

        names.forEach(stat => {

            stats[stat] = this.rollStat();

        });

        return stats;

    },

    rollStat() {

        let rolls = [];

        for(let i=0;i<4;i++){

            rolls.push(

                Math.floor(Math.random()*6)+1

            );

        }

        rolls.sort((a,b)=>a-b);

        rolls.shift();

        return rolls.reduce((a,b)=>a+b,0);

    }

};

window.StatsEngine = StatsEngine;
