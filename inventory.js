/*
=========================================
CHRONICLES
Inventory Engine v1.0
=========================================
*/

const InventoryEngine = {

    create() {

        return {

            gold: 0,

            items: [],

            equipment: {

                weapon: null,

                armor: null,

                helmet: null,

                gloves: null,

                boots: null,

                ring1: null,

                ring2: null,

                necklace: null

            }

        };

    },

    addItem(item) {

        Campaign.inventory.items.push(item);

        SaveCampaign();

    },

    removeItem(index) {

        Campaign.inventory.items.splice(index,1);

        SaveCampaign();

    },

    addGold(amount){

        Campaign.inventory.gold += amount;

        SaveCampaign();

    },

    removeGold(amount){

        Campaign.inventory.gold = Math.max(

            0,

            Campaign.inventory.gold - amount

        );

        SaveCampaign();

    },

    equip(slot,item){

        Campaign.inventory.equipment[slot]=item;

        SaveCampaign();

    }

};

window.InventoryEngine=InventoryEngine;
