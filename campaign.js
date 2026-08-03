(function(global){
  'use strict';
  const SCHEMA_VERSION = 3;
  const nowIso = () => new Date().toISOString();
  const clone = value => JSON.parse(JSON.stringify(value));
  const id = prefix => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;

  function baseCampaign({universeId='age_of_legends', title='Nuova campagna'}={}){
    return {
      version: SCHEMA_VERSION,
      id: id('campaign'),
      title,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      universe: { id: universeId, version: 1, customizations: {} },
      character: null,
      world: { description:'', location:'Da stabilire', day:1, time:'mattina', flags:{} },
      calendar: { day:1, phase:'mattina', elapsedMinutes:0, events:[] },
      factions: [],
      domains: { primary:null, affinities:{}, awakened:[], history:[] },
      quests: [],
      locations: [],
      npcs: [],
      inventory: [],
      history: [],
      masterMemory: { facts:[], secrets:[], notes:[], summary:'', recentMessages:[] },
      rules: { system:'chronicles-d20', difficulty:'standard' },
      runtime: { lastRoll:null, pendingRoll:null, revision:0 }
    };
  }

  function createCharacter(input, classPreset){
    if(!input?.name?.trim()) throw new Error('Il personaggio deve avere un nome.');
    const p=classPreset||{};
    return {
      id:id('character'), name:input.name.trim(),
      origin:input.origin||input.race||'Umano', vocation:input.vocation||input.className||'Avventuriero',
      background:input.background||'', appearance:input.appearance||input.look||'', biography:input.biography||'',
      level:1, xp:0, hp:p.hp||10, maxHp:p.hp||10, ac:p.ac||10,
      stats:clone(p.stats||{FOR:10,DES:10,COS:10,INT:10,SAG:10,CAR:10}),
      skills:clone(input.skills||{}), proficiencies:clone(input.proficiencies||[]),
      resources:{}, conditions:[], reputation:{}, portrait:null
    };
  }

  function createLegacyCompatible({name,className,race,background,look,worldDescription,classPreset}){
    const c=baseCampaign({universeId:'age_of_legends',title:'Le Cronache di '+name});
    c.character=createCharacter({name,className,race,background,look},classPreset);
    c.world.description=worldDescription||'Fantasy classico, mistero e avventura.';
    c.inventory=clone(classPreset?.items||[]);
    return exposeLegacyAliases(c);
  }

  function exposeLegacyAliases(c){
    if(!c.masterMemory)c.masterMemory={facts:[],secrets:[],notes:[],summary:'',recentMessages:[]};
    c.facts=c.masterMemory.facts;
    c.masterSecrets=c.masterMemory.secrets;
    c.notes=c.masterMemory.notes;
    c.messages=c.masterMemory.recentMessages;
    c.lastRoll=c.runtime?.lastRoll||c.lastRoll||null;
    if(c.character){
      c.character.class=c.character.vocation||c.character.class;
      c.character.race=c.character.origin||c.character.race;
      c.character.look=c.character.appearance||c.character.look||'';
      c.character.maxhp=c.character.maxHp??c.character.maxhp;
      c.character.hp=c.character.hp??c.character.maxhp;
    }
    return c;
  }

  function migrate(raw){
    if(!raw||typeof raw!=='object')return null;
    if(raw.version>=SCHEMA_VERSION && raw.masterMemory)return exposeLegacyAliases(raw);
    // Migration from prototype v1/v2.
    const c=baseCampaign({universeId:raw.universe?.id||'age_of_legends',title:raw.title||'Campagna'});
    c.id=raw.id||c.id;c.createdAt=raw.createdAt||c.createdAt;
    if(raw.character){
      c.character={
        id:raw.character.id||id('character'), name:raw.character.name||'Avventuriero',
        origin:raw.character.origin||raw.character.race||'Umano',
        vocation:raw.character.vocation||raw.character.class||'Avventuriero',
        background:raw.character.background||'', appearance:raw.character.appearance||raw.character.look||'',
        biography:raw.character.biography||'', level:raw.character.level||1, xp:raw.character.xp||0,
        hp:raw.character.hp||10, maxHp:raw.character.maxHp||raw.character.maxhp||raw.character.hp||10,
        ac:raw.character.ac||10, stats:clone(raw.character.stats||{}), skills:clone(raw.character.skills||{}),
        proficiencies:clone(raw.character.proficiencies||[]), resources:clone(raw.character.resources||{}),
        conditions:clone(raw.character.conditions||[]), reputation:clone(raw.character.reputation||{}), portrait:raw.character.portrait||null
      };
    }
    c.world={...c.world,...clone(raw.world||{})};
    c.inventory=clone(raw.inventory||[]);c.quests=clone(raw.quests||[]);c.npcs=clone(raw.npcs||[]);
    c.factions=clone(raw.factions||[]);c.locations=clone(raw.locations||[]);c.domains=clone(raw.domains||c.domains);
    c.masterMemory.facts=clone(raw.facts||raw.masterMemory?.facts||[]);
    c.masterMemory.secrets=clone(raw.masterSecrets||raw.masterMemory?.secrets||[]);
    c.masterMemory.notes=clone(raw.notes||raw.masterMemory?.notes||[]);
    c.masterMemory.recentMessages=clone(raw.messages||raw.masterMemory?.recentMessages||[]);
    c.runtime.lastRoll=clone(raw.lastRoll||raw.runtime?.lastRoll||null);
    return exposeLegacyAliases(c);
  }

  function touch(c){c.updatedAt=nowIso();c.runtime=c.runtime||{};c.runtime.revision=(c.runtime.revision||0)+1;return c;}
  function addHistory(c,type,payload={}){c.history.push({id:id('event'),at:nowIso(),type,payload:clone(payload)});return touch(c);}
  function snapshot(c){const s=clone(c);delete s.facts;delete s.masterSecrets;delete s.notes;delete s.messages;delete s.lastRoll;return s;}

  global.ChroniclesCampaign={SCHEMA_VERSION,baseCampaign,createCharacter,createLegacyCompatible,migrate,exposeLegacyAliases,touch,addHistory,snapshot};
})(window);