/*
==========================================
CHRONICLES
GAME START & CAMPAIGN CLIENT
Version 4.1
==========================================
*/

const GameStart = {
  storageKey: "chronicles-campaign",
  aiUrl: "https://chronicles-ai.micheledalpoggetto.workers.dev",

  async start() {
    const character = JSON.parse(localStorage.getItem("chronicles-character"));

    if (!character) {
      alert("Personaggio non trovato.");
      return;
    }

    this.showWorldLoading(character);

    try {
      const response = await fetch(this.aiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "setup",
          character,
          campaign: {}
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          this.buildErrorMessage(
            result,
            "Errore durante la creazione della campagna."
          )
        );
      }

      if (!result.campaign || typeof result.campaign !== "object") {
        throw new Error(
          "Il Game Master non ha restituito uno stato di campagna valido."
        );
      }

      if (!result.narration) {
        throw new Error(
          "Il Game Master non ha creato l'introduzione."
        );
      }

      const campaign = result.campaign;
      this.updateUIState(campaign, result);
      this.saveCampaign(campaign);

      if (campaign.pendingCheck) {
        this.showPendingCheck(campaign);
        return;
      }

      this.showScene(
        campaign,
        result.narration,
        campaign.ui.lastSuggestions,
        result.check || null
      );
    } catch (error) {
      this.showStartError(character, error);
    }
  },

  saveCampaign(campaign) {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(campaign)
    );
  },

  loadCampaign() {
    const raw = localStorage.getItem(this.storageKey);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  updateUIState(campaign, result) {
    campaign.ui = campaign.ui || {};

    if (
      typeof result.narration === "string" &&
      result.narration.trim()
    ) {
      campaign.ui.lastNarration = result.narration;
    }

    campaign.ui.lastSuggestions = Array.isArray(result.suggestedActions)
      ? result.suggestedActions
      : [];

    campaign.ui.lastCheck = result.check || null;
  },

  continueGame() {
    const campaign = this.loadCampaign();

    if (!campaign) {
      alert("Nessuna partita salvata.");
      return;
    }

    if (campaign.pendingCheck) {
      this.showPendingCheck(campaign);
      return;
    }

    const ui = campaign.ui || {};
    let narration = ui.lastNarration;

    if (!narration) {
      const latest = [...(campaign.history || [])]
        .reverse()
        .find(entry => entry.type === "narration");

      narration = latest
        ? latest.text
        : "La tua avventura continua.";
    }

    this.showScene(
      campaign,
      narration,
      Array.isArray(ui.lastSuggestions)
        ? ui.lastSuggestions
        : [],
      ui.lastCheck || null
    );
  },

  getHUDData(campaign) {
    const character = campaign.character || {};
    const playerState = campaign.playerState || {};
    const world = campaign.world || {};
    const progression = campaign.progression || {};
    const knowsLocation = world.playerKnownLocation !== false;

    return {
      character,
      playerState,
      progression,
      hpCurrent: playerState.hpCurrent ?? "?",
      hpMax: playerState.hpMax ?? "?",
      affiliation: campaign.affiliation || "Nessuna",
      location: knowsLocation
        ? (world.currentLocation || playerState.position || "?")
        : "?",
      level: progression.level ?? 1,
      xp: progression.xp ?? 0,
      nextLevelXP: progression.nextLevelXP ?? 100
    };
  },

  buildHUDHTML(campaign) {
    const hud = this.getHUDData(campaign);

    return `
      <div style="
        border:1px solid #333;
        border-radius:12px;
        padding:14px;
        margin-bottom:22px;
      ">
        <div style="
          display:flex;
          justify-content:space-between;
          gap:16px;
          align-items:flex-start;
        ">
          <div>
            <strong style="font-size:18px;">
              ${this.escapeHTML(hud.character.name || "?")}
            </strong>

            <div style="
              opacity:0.65;
              font-size:14px;
              margin-top:5px;
            ">
              ${this.escapeHTML(hud.affiliation)}
            </div>

            <div style="
              opacity:0.65;
              font-size:14px;
              margin-top:5px;
            ">
              Livello ${hud.level} · ${hud.xp}/${hud.nextLevelXP} XP
            </div>
          </div>

          <div style="text-align:right;">
            <strong>
              HP ${hud.hpCurrent}/${hud.hpMax}
            </strong>

            <div style="
              opacity:0.65;
              font-size:14px;
              margin-top:5px;
            ">
              📍 ${this.escapeHTML(hud.location)}
            </div>
          </div>
        </div>

        <button
          id="open-character"
          style="
            width:100%;
            padding:10px;
            margin-top:12px;
          ">
          Personaggio / Inventario
        </button>
      </div>
    `;
  },

  showScene(campaign, narration, suggestions = [], check = null) {
    const playerState = campaign.playerState || {};
    const validSuggestions = Array.isArray(suggestions)
      ? suggestions
      : [];

    const suggestionsHTML = validSuggestions
      .map(action => `
        <button
          class="suggested-action"
          data-action="${this.escapeAttribute(action)}"
          style="
            display:block;
            width:100%;
            padding:14px;
            margin:10px 0;
            font-size:16px;
            text-align:left;
          ">
          ${this.escapeHTML(action)}
        </button>
      `)
      .join("");

    const checkHTML = this.buildCheckHTML(check);

    const isDead =
      playerState.status === "dead" ||
      campaign.status === "dead";

    document.body.innerHTML = `
      <main style="
        padding:24px;
        max-width:700px;
        margin:auto;
      ">
        <h1>Chronicles</h1>

        ${this.buildHUDHTML(campaign)}

        <p style="
          opacity:0.65;
          text-transform:uppercase;
          letter-spacing:2px;
        ">
          Capitolo ${campaign.chapter || 1}
          ·
          Scena ${campaign.scene || 1}
        </p>

        ${checkHTML}

        <div style="
          font-size:20px;
          line-height:1.65;
          margin-top:24px;
          white-space:pre-wrap;
        ">
          ${this.escapeHTML(narration)}
        </div>

        ${
          !isDead && validSuggestions.length
            ? `
              <div style="margin-top:30px;">
                <p style="
                  opacity:0.65;
                  margin-bottom:8px;
                ">
                  Idee possibili
                </p>

                ${suggestionsHTML}
              </div>
            `
            : ""
        }

        ${
          !isDead
            ? `
              <div style="margin-top:32px;">
                <h3>Cosa fai?</h3>

                <textarea
                  id="player-action"
                  rows="5"
                  placeholder="Descrivi liberamente cosa vuoi fare..."
                  style="
                    width:100%;
                    box-sizing:border-box;
                    padding:14px;
                    font-size:18px;
                    border-radius:10px;
                    border:1px solid #555;
                  "
                ></textarea>

                <button
                  id="send-action"
                  style="
                    width:100%;
                    padding:16px;
                    margin-top:12px;
                    font-size:18px;
                  ">
                  Agisci
                </button>
              </div>
            `
            : `
              <div style="
                margin-top:36px;
                border-top:1px solid #333;
                padding-top:26px;
              ">
                <h2>La tua storia termina qui.</h2>
                <p style="opacity:0.7;">
                  Il personaggio è morto.
                </p>
              </div>
            `
        }
      </main>
    `;

    this.bindCharacterButton(campaign);

    if (isDead) {
      return;
    }

    document
      .querySelectorAll(".suggested-action")
      .forEach(button => {
        button.onclick = () => {
          document.getElementById("player-action").value =
            button.dataset.action;
        };
      });

    document.getElementById("send-action").onclick = () => {
      const action =
        document.getElementById("player-action").value.trim();

      if (!action) {
        alert("Scrivi cosa vuoi fare.");
        return;
      }

      this.sendAction(action);
    };
  },

  async sendAction(action) {
    const campaign = this.loadCampaign();

    if (!campaign) {
      alert("Campagna non trovata.");
      return;
    }

    if (campaign.pendingCheck) {
      this.showPendingCheck(campaign);
      return;
    }

    this.showLoading(action);

    try {
      const response = await fetch(this.aiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mode: "action",
          character: campaign.character,
          campaign,
          action
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          this.buildErrorMessage(
            result,
            "Errore del Game Master."
          )
        );
      }

      if (!result.campaign || typeof result.campaign !== "object") {
        throw new Error(
          "Il Game Master non ha restituito lo stato aggiornato della campagna."
        );
      }

      const updatedCampaign = result.campaign;

      if (
        result.type === "check-required" ||
        updatedCampaign.pendingCheck
      ) {
        updatedCampaign.ui = updatedCampaign.ui || {};
        updatedCampaign.ui.lastCheck = result.check || null;
        updatedCampaign.ui.lastSuggestions = [];

        this.saveCampaign(updatedCampaign);
        this.showPendingCheck(updatedCampaign);
        return;
      }

      if (!result.narration) {
        throw new Error(
          "Il Game Master non ha restituito una scena."
        );
      }

      this.updateUIState(updatedCampaign, result);

      if (result.gameOver || result.death) {
        updatedCampaign.status = "dead";
      }

      this.saveCampaign(updatedCampaign);

      this.showScene(
        updatedCampaign,
        result.narration,
        updatedCampaign.ui.lastSuggestions,
        result.check || null
      );
    } catch (error) {
      this.showError(
        campaign,
        action,
        error
      );
    }
  },

  showPendingCheck(campaign) {
    const pending = campaign.pendingCheck;

    if (!pending) {
      this.continueGame();
      return;
    }

    const stat = pending.stat || "?";
    const difficulty = pending.difficulty ?? "?";
    const stakes = pending.stakes || "";
    const action = pending.action || "";

    document.body.innerHTML = `
      <main style="
        padding:24px;
        max-width:700px;
        margin:auto;
      ">
        <h1>Chronicles</h1>

        ${this.buildHUDHTML(campaign)}

        <p style="
          opacity:0.65;
          text-transform:uppercase;
          letter-spacing:2px;
        ">
          Capitolo ${campaign.chapter || 1}
          ·
          Scena ${campaign.scene || 1}
        </p>

        <div style="
          margin-top:30px;
          border:1px solid #555;
          border-radius:16px;
          padding:22px;
          text-align:center;
        ">
          <div style="
            opacity:0.65;
            font-size:14px;
            text-transform:uppercase;
            letter-spacing:1.5px;
          ">
            Prova richiesta
          </div>

          <h2 style="margin:10px 0 4px 0;">
            ${this.escapeHTML(stat)}
          </h2>

          <div style="opacity:0.75;">
            Difficoltà:
            <strong>${difficulty}</strong>
          </div>

          ${
            action
              ? `
                <p style="
                  margin-top:18px;
                  line-height:1.5;
                ">
                  ${this.escapeHTML(action)}
                </p>
              `
              : ""
          }

          ${
            stakes
              ? `
                <p style="
                  margin-top:14px;
                  opacity:0.75;
                  line-height:1.5;
                ">
                  <strong>In gioco:</strong>
                  ${this.escapeHTML(stakes)}
                </p>
              `
              : ""
          }

          <div
            id="dice-face"
            style="
              width:120px;
              height:120px;
              margin:28px auto 10px auto;
              border:2px solid #777;
              border-radius:22px;
              display:flex;
              align-items:center;
              justify-content:center;
              font-size:42px;
              font-weight:bold;
              user-select:none;
            "
          >
            d20
          </div>

          <button
            id="roll-die"
            style="
              width:100%;
              padding:17px;
              margin-top:16px;
              font-size:19px;
              font-weight:bold;
            ">
            🎲 Tira il dado
          </button>
        </div>
      </main>
    `;

    this.bindCharacterButton(campaign);

    document.getElementById("roll-die").onclick = () => {
      this.resolveCheck();
    };
  },

  async resolveCheck() {
    const campaign = this.loadCampaign();

    if (!campaign || !campaign.pendingCheck) {
      alert("Non c'è alcuna prova da tirare.");
      this.continueGame();
      return;
    }

    const pending = campaign.pendingCheck;
    const button = document.getElementById("roll-die");
    const diceFace = document.getElementById("dice-face");

    if (button) {
      button.disabled = true;
      button.textContent = "Tiro in corso...";
    }

    let animation = null;

    if (diceFace) {
      animation = setInterval(() => {
        diceFace.textContent = String(
          1 + Math.floor(Math.random() * 20)
        );
      }, 75);
    }

    try {
      const response = await fetch(this.aiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mode: "resolve-check",
          character: campaign.character,
          campaign
        })
      });

      const result = await response.json();

      if (animation) {
        clearInterval(animation);
      }

      if (!response.ok) {
        throw new Error(
          this.buildErrorMessage(
            result,
            "Errore durante il tiro del dado."
          )
        );
      }

      if (!result.campaign || typeof result.campaign !== "object") {
        throw new Error(
          "Il Game Master non ha restituito lo stato della campagna dopo il tiro."
        );
      }

      if (!result.narration) {
        throw new Error(
          "Il Game Master non ha narrato l'esito della prova."
        );
      }

      const updatedCampaign = result.campaign;

      this.updateUIState(
        updatedCampaign,
        result
      );

      if (result.gameOver || result.death) {
        updatedCampaign.status = "dead";
      }

      this.saveCampaign(updatedCampaign);

      this.showScene(
        updatedCampaign,
        result.narration,
        updatedCampaign.ui.lastSuggestions,
        result.check || null
      );
    } catch (error) {
      if (animation) {
        clearInterval(animation);
      }

      this.showCheckError(
        campaign,
        pending,
        error
      );
    }
  },

  buildCheckHTML(check) {
    if (
      !check ||
      !check.required ||
      check.roll === undefined ||
      check.roll === null
    ) {
      return "";
    }

    const stat = check.stat || "?";
    const roll = check.roll ?? "?";
    const modifier = check.modifier ?? 0;
    const total = check.total ?? "?";
    const difficulty = check.difficulty ?? "?";

    const outcomeLabels = {
      "critical-success": "Successo critico",
      "success": "Successo",
      "failure": "Fallimento",
      "critical-failure": "Fallimento critico"
    };

    const outcome =
      outcomeLabels[check.outcome] ||
      check.outcome ||
      "";

    const modifierText =
      Number(modifier) >= 0
        ? `+${modifier}`
        : `${modifier}`;

    return `
      <div style="
        border:1px solid #555;
        border-radius:16px;
        padding:18px;
        margin-top:20px;
        margin-bottom:22px;
        text-align:center;
      ">
        <div style="
          opacity:0.65;
          font-size:14px;
          text-transform:uppercase;
          letter-spacing:1px;
        ">
          Prova di ${this.escapeHTML(stat)}
        </div>

        <div style="
          font-size:30px;
          font-weight:bold;
          margin-top:10px;
        ">
          🎲 ${roll} ${modifierText} = ${total}
        </div>

        <div style="
          margin-top:7px;
          opacity:0.75;
        ">
          Difficoltà: ${difficulty}
        </div>

        ${
          outcome
            ? `
              <div style="
                margin-top:12px;
                font-size:19px;
                font-weight:bold;
              ">
                ${this.escapeHTML(outcome)}
              </div>
            `
            : ""
        }
      </div>
    `;
  },

  showCharacterSheet(campaign) {
    const character = campaign.character || {};
    const playerState = campaign.playerState || {};
    const world = campaign.world || {};
    const progression = campaign.progression || {};
    const stats = character.stats || {};

    const inventory = Array.isArray(campaign.inventory)
      ? campaign.inventory
      : [];

    const equipment = Array.isArray(campaign.equipment)
      ? campaign.equipment
      : [];

    const objectives = Array.isArray(campaign.objectives)
      ? campaign.objectives
      : [];

    const conditions = Array.isArray(playerState.conditions)
      ? playerState.conditions
      : [];

    const statsHTML = Object.entries(stats)
      .map(([name, value]) => `
        <div style="
          display:flex;
          justify-content:space-between;
          padding:10px 0;
          border-bottom:1px solid #333;
        ">
          <span>${this.escapeHTML(name)}</span>
          <strong>${this.escapeHTML(value)}</strong>
        </div>
      `)
      .join("");

    const inventoryHTML = inventory.length
      ? inventory
          .map(item => `<li>${this.formatListItem(item)}</li>`)
          .join("")
      : "<li>Nessun oggetto.</li>";

    const equipmentHTML = equipment.length
      ? equipment
          .map(item => `<li>${this.formatListItem(item)}</li>`)
          .join("")
      : "<li>Nessun equipaggiamento.</li>";

    const objectivesHTML = objectives.length
      ? objectives
          .map(objective => {
            if (typeof objective === "string") {
              return `<li>${this.escapeHTML(objective)}</li>`;
            }

            const text =
              objective.text ||
              objective.name ||
              "Obiettivo";

            const completed =
              objective.status === "completed";

            return `
              <li>
                ${completed ? "✓ " : ""}
                ${this.escapeHTML(text)}
              </li>
            `;
          })
          .join("")
      : "<li>Nessun obiettivo attivo.</li>";

    const conditionsHTML = conditions.length
      ? conditions
          .map(condition => `
            <li>${this.escapeHTML(condition)}</li>
          `)
          .join("")
      : "<li>Nessuna condizione.</li>";

    const location =
      world.playerKnownLocation !== false
        ? (
            world.currentLocation ||
            playerState.position ||
            "?"
          )
        : "?";

    document.body.innerHTML = `
      <main style="
        padding:24px;
        max-width:700px;
        margin:auto;
      ">
        <h1>
          ${this.escapeHTML(
            character.name || "Personaggio"
          )}
        </h1>

        <p>
          <strong>Universo:</strong>
          ${this.escapeHTML(character.universe || "?")}
        </p>

        <p>
          <strong>Razza:</strong>
          ${this.escapeHTML(character.race || "?")}
        </p>

        <p>
          <strong>Vocazione:</strong>
          ${this.escapeHTML(character.vocation || "?")}
        </p>

        <p>
          <strong>Background:</strong>
          ${this.escapeHTML(character.background || "?")}
        </p>

        <p>
          <strong>Ruolo:</strong>
          ${this.escapeHTML(campaign.role || "?")}
        </p>

        <p>
          <strong>Affiliazione:</strong>
          ${this.escapeHTML(campaign.affiliation || "Nessuna")}
        </p>

        <p>
          <strong>Posizione:</strong>
          ${this.escapeHTML(location)}
        </p>

        <p>
          <strong>HP:</strong>
          ${playerState.hpCurrent ?? "?"}
          /
          ${playerState.hpMax ?? "?"}
        </p>

        <p>
          <strong>Livello:</strong>
          ${progression.level ?? 1}
        </p>

        <p>
          <strong>Esperienza:</strong>
          ${progression.xp ?? 0}
          /
          ${progression.nextLevelXP ?? 100}
          XP
        </p>

        <h2>Statistiche</h2>

        ${
          statsHTML ||
          "<p>Statistiche non disponibili.</p>"
        }

        <h2 style="margin-top:30px;">
          Condizioni
        </h2>
        <ul>${conditionsHTML}</ul>

        <h2 style="margin-top:30px;">
          Equipaggiamento
        </h2>
        <ul>${equipmentHTML}</ul>

        <h2 style="margin-top:30px;">
          Inventario
        </h2>
        <ul>${inventoryHTML}</ul>

        <h2 style="margin-top:30px;">
          Obiettivi
        </h2>
        <ul>${objectivesHTML}</ul>

        <button
          id="close-character"
          style="
            width:100%;
            padding:16px;
            margin-top:30px;
            font-size:18px;
          ">
          Torna alla scena
        </button>
      </main>
    `;

    document.getElementById("close-character").onclick = () => {
      this.continueGame();
    };
  },

  bindCharacterButton(campaign) {
    const button =
      document.getElementById("open-character");

    if (!button) {
      return;
    }

    button.onclick = () => {
      this.showCharacterSheet(campaign);
    };
  },

  showWorldLoading(character) {
    document.body.innerHTML = `
      <main style="
        padding:24px;
        max-width:700px;
        margin:auto;
      ">
        <h1>Chronicles</h1>

        <h2>
          La tua storia sta prendendo forma...
        </h2>

        <p style="
          font-size:19px;
          line-height:1.6;
        ">
          Il Game Master sta preparando
          il mondo attorno a
          <strong>
            ${this.escapeHTML(
              character.name ||
              "il tuo personaggio"
            )}
          </strong>.
        </p>

        <p style="
          opacity:0.65;
          margin-top:30px;
        ">
          Luoghi, persone, rapporti,
          segreti, pericoli e opportunità
          stanno prendendo forma.
        </p>
      </main>
    `;
  },

  showLoading(action) {
    document.body.innerHTML = `
      <main style="
        padding:24px;
        max-width:700px;
        margin:auto;
      ">
        <h1>Chronicles</h1>

        <h2>
          Il mondo reagisce...
        </h2>

        <p style="opacity:0.65;">
          Hai deciso:
        </p>

        <p style="
          font-size:20px;
          line-height:1.5;
        ">
          ${this.escapeHTML(action)}
        </p>

        <p style="
          margin-top:30px;
          opacity:0.65;
        ">
          Il Game Master sta determinando
          ciò che accade.
        </p>
      </main>
    `;
  },

  showStartError(character, error) {
    document.body.innerHTML = `
      <main style="
        padding:24px;
        max-width:700px;
        margin:auto;
      ">
        <h1>Chronicles</h1>

        <h2>
          Impossibile iniziare la storia
        </h2>

        <p style="
          opacity:0.7;
          white-space:pre-wrap;
        ">
          ${this.escapeHTML(error.message)}
        </p>

        <button
          id="retry-start"
          style="
            width:100%;
            padding:16px;
            margin-top:24px;
            font-size:18px;
          ">
          Riprova
        </button>
      </main>
    `;

    document.getElementById("retry-start").onclick = () => {
      this.start();
    };
  },

  showError(campaign, action, error) {
    document.body.innerHTML = `
      <main style="
        padding:24px;
        max-width:700px;
        margin:auto;
      ">
        <h1>Chronicles</h1>

        <h2>
          Il Game Master non risponde
        </h2>

        <p>
          La tua azione non è andata persa:
        </p>

        <p style="font-weight:bold;">
          ${this.escapeHTML(action)}
        </p>

        <p style="
          margin-top:24px;
          opacity:0.7;
          white-space:pre-wrap;
        ">
          Errore:
          ${this.escapeHTML(error.message)}
        </p>

        <button
          id="retry-action"
          style="
            width:100%;
            padding:16px;
            margin-top:24px;
            font-size:18px;
          ">
          Riprova
        </button>

        <button
          id="return-scene"
          style="
            width:100%;
            padding:14px;
            margin-top:10px;
            font-size:16px;
          ">
          Torna alla scena
        </button>
      </main>
    `;

    document.getElementById("retry-action").onclick = () => {
      this.sendAction(action);
    };

    document.getElementById("return-scene").onclick = () => {
      this.continueGame();
    };
  },

  showCheckError(campaign, pending, error) {
    document.body.innerHTML = `
      <main style="
        padding:24px;
        max-width:700px;
        margin:auto;
      ">
        <h1>Chronicles</h1>

        <h2>
          Il tiro non è stato risolto
        </h2>

        <p>
          La prova è ancora salvata.
        </p>

        <p style="
          opacity:0.7;
          white-space:pre-wrap;
          margin-top:20px;
        ">
          Errore:
          ${this.escapeHTML(error.message)}
        </p>

        <button
          id="retry-check"
          style="
            width:100%;
            padding:16px;
            margin-top:24px;
            font-size:18px;
          ">
          Riprova il tiro
        </button>

        <button
          id="return-check"
          style="
            width:100%;
            padding:14px;
            margin-top:10px;
            font-size:16px;
          ">
          Torna alla prova
        </button>
      </main>
    `;

    document.getElementById("retry-check").onclick = () => {
      this.resolveCheck();
    };

    document.getElementById("return-check").onclick = () => {
      this.showPendingCheck(campaign);
    };
  },

  buildErrorMessage(result, fallback) {
    let message =
      result?.error ||
      fallback;

    if (result?.details) {
      message += "\n\nDETTAGLI:\n";

      if (typeof result.details === "string") {
        message += result.details;
      } else {
        message += JSON.stringify(
          result.details,
          null,
          2
        );
      }
    }

    return message;
  },

  formatListItem(item) {
    if (
      item === null ||
      item === undefined
    ) {
      return "?";
    }

    if (typeof item === "string") {
      return this.escapeHTML(item);
    }

    if (typeof item === "object") {
      const text =
        item.name ||
        item.text ||
        item.description ||
        "Elemento";

      return this.escapeHTML(text);
    }

    return this.escapeHTML(String(item));
  },

  escapeAttribute(text) {
    return String(text ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  },

  escapeHTML(text) {
    return String(text ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};

window.GameStart = GameStart;
