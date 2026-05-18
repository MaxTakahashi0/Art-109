const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusLevel = document.getElementById('level');
const statusHealth = document.getElementById('health');
const statusGold = document.getElementById('treasure');
const statusKeys = document.getElementById('inventory');
const statusPotions = document.getElementById('potions');
const statusArmor = document.getElementById('armor');
const statusXP = document.getElementById('xp');
const statusPower = document.getElementById('power');
const statusMessage = document.getElementById('message');
const facingText = document.getElementById('facing');
const mapCanvas = document.getElementById('mapCanvas');
const mapCtx = mapCanvas.getContext('2d');
const shopPanel = document.getElementById('shopPanel');
const gameOverlay = document.querySelector('.game-overlay');
const shopDescription = document.getElementById('shopDescription');
const shopItems = document.getElementById('shopItems');
const shopCloseButton = document.getElementById('shopClose');
const questToggleButton = document.getElementById('questToggle');
const deathScreen = document.getElementById('deathScreen');
const restartButton = document.getElementById('restartButton');
const questCloseButton = document.getElementById('questClose');
const questContent = document.getElementById('questContent');
const dialoguePanel = document.getElementById('dialoguePanel');
const dialogueHeader = document.getElementById('dialogueHeader');
const dialogueText = document.getElementById('dialogueText');
const dialogueButtons = document.getElementById('dialogueButtons');
const overworldScreen = document.getElementById('overworldScreen');
const questLog = document.getElementById('questLog');
const actionButtons = document.querySelectorAll('.game-btn');

const DIRS = [
    { dx: 0, dy: -1, label: 'North' },
    { dx: 1, dy: 0, label: 'East' },
    { dx: 0, dy: 1, label: 'South' },
    { dx: -1, dy: 0, label: 'West' }
];

const levelNames = ['Bone Hall', 'Iron Keep', 'Obsidian Throne'];

const floorThemes = [
    {
        name: 'Bone Hall',
        description: 'A frost-laced crypt of bones, low torches and shifting shadows.',
        palette: {
            skyTop: '#1e1422',
            skyMid: '#120a18',
            skyBottom: '#07070d',
            wall: '#453548',
            wallAccent: '#6a4d74',
            floor: '#16121b',
            floorDark: '#09060e',
            corridor: '#2e2137',
            chest: '#d9a84d',
            enemy: '#b85b56',
            boss: '#8b3e6e',
            exit: '#3b7a5d',
            key: '#4c96c9',
            shop: '#73c4e8'
        }
    },
    {
        name: 'Iron Keep',
        description: 'A molten fortress of black steel, heat and echoing clanks.',
        palette: {
            skyTop: '#25181d',
            skyMid: '#170f13',
            skyBottom: '#0b060a',
            wall: '#4b3b42',
            wallAccent: '#7d4d5f',
            floor: '#191318',
            floorDark: '#0d090d',
            corridor: '#3b2e3a',
            chest: '#ddaf58',
            enemy: '#c25b4f',
            boss: '#9a3f6f',
            exit: '#4b8b70',
            key: '#4c96c9',
            shop: '#6bc4d9'
        }
    },
    {
        name: 'Obsidian Throne',
        description: 'A crystalline catacomb where shadows gleam on sharp black stone.',
        palette: {
            skyTop: '#1c1018',
            skyMid: '#11090f',
            skyBottom: '#080409',
            wall: '#362e4b',
            wallAccent: '#6d5c8d',
            floor: '#13101a',
            floorDark: '#08060b',
            corridor: '#2f2639',
            chest: '#d9a84d',
            enemy: '#b85b56',
            boss: '#993f7a',
            exit: '#3c7f65',
            key: '#4c96c9',
            shop: '#65abda'
        }
    }
];

const LOCATIONS = {
    startingTown: { name: 'Thornwick', x: 5, y: 5, type: 'town', npc: 'elder' },
    northDungeon: { name: 'Bone Hall', x: 5, y: 2, type: 'dungeon', level: 0 },
    eastCity: { name: 'Ironhearth', x: 8, y: 5, type: 'city', npc: 'merchant' },
    eastDungeon: { name: 'Iron Keep', x: 8, y: 2, type: 'dungeon', level: 1 },
    southCity: { name: 'Obsidian Spire', x: 5, y: 8, type: 'city', npc: 'scholar' },
    southDungeon: { name: 'Obsidian Throne', x: 5, y: 11, type: 'dungeon', level: 2 }
};

const NPCS = {
    elder: {
        name: 'Elder Thorne',
        greeting: 'Traveler, Thornwick trembles under an old shadow. The crypts have woken and the king seeks a champion to answer the call.',
        options: [
            { text: 'Where should I go?', reply: 'Three gates open from Thornwick: Bone Hall to the north, Iron Keep to the east, and the Obsidian Throne beneath the southern cliffs. Each hides a guardian and a piece of the kingdom\'s fate.' },
            { text: 'Any wisdom?', reply: 'Leave no chest unopened, keep thy armor strong, and carry hope in thy heart. A potion can mean the difference between dawn and doom.' }
        ]
    },
    merchant: {
        name: 'Merchant Kess',
        greeting: 'Coin and rumors flow alike in Thornwick. Have ye heard of the throne that bleeds shadow?',
        options: [
            { text: 'What news?', reply: 'The Iron Keep is ash and iron, but its vaults still smolder with treasure. The bravest who return speak of a lord of fire within.' },
            { text: 'Any advice?', reply: 'Do not rush blindly. Gather strength, then strike with purpose. The dungeons test both steel and will.' }
        ]
    },
    scholar: {
        name: 'Scholar Vex',
        greeting: 'The ancient runes whisper of a broken ward. The dungeons are fragments of something far older than Thornwick.',
        options: [
            { text: 'Tell me more.', reply: 'Each dungeon holds a shard of the old curse. Free one, and the others grow restless. Restore the last ward by bringing down their lord.' },
            { text: 'Is it dangerous?', reply: 'Yes. Not only from men and beasts, but from the darkness that hungers for a failed heart.' }
        ]
    }
};

const GAME_MODE = { OVERWORLD: 'overworld', DUNGEON: 'dungeon' };
const QUEST = {
    title: 'Slay the Dungeon Boss',
    description: 'The Obsidian Throne has risen again. King Aldric bids thee seek the cursed vault, defeat its lord, and end the spreading shadow over Thornwick.',
    accepted: false,
    completed: false
};

function generateLevelMap(levelIndex) {
    const theme = floorThemes[levelIndex] || floorThemes[0];
    const size = 9;
    const map = Array.from({ length: size }, () => Array(size).fill(0));
    for (let i = 0; i < size; i++) {
        map[0][i] = 1;
        map[size - 1][i] = 1;
        map[i][0] = 1;
        map[i][size - 1] = 1;
    }

    const start = { x: 1, y: 1, dir: 1 };
    const exit = { x: size - 2, y: size - 2 };

    let path = [{ x: start.x, y: start.y }];
    let px = start.x;
    let py = start.y;
    while (px < exit.x || py < exit.y) {
        if (px < exit.x && (Math.random() < 0.55 || py === exit.y)) {
            px += 1;
        } else if (py < exit.y) {
            py += 1;
        }
        path.push({ x: px, y: py });
    }
    path.forEach(({ x, y }) => (map[y][x] = 0));

    for (let i = 0; i < 18; i++) {
        const rx = 1 + Math.floor(Math.random() * (size - 2));
        const ry = 1 + Math.floor(Math.random() * (size - 2));
        if (map[ry][rx] === 0 && !path.some(cell => cell.x === rx && cell.y === ry) && !(rx === start.x && ry === start.y)) {
            if (Math.random() < 0.65) map[ry][rx] = 1;
        }
    }

    const openPositions = [];
    for (let y = 1; y < size - 1; y++) {
        for (let x = 1; x < size - 1; x++) {
            if (map[y][x] === 0 && !(x === start.x && y === start.y)) openPositions.push({ x, y });
        }
    }

    const pickOpen = () => {
        const idx = Math.floor(Math.random() * openPositions.length);
        const pos = openPositions.splice(idx, 1)[0];
        return pos;
    };

    const chestCount = 3 + Math.floor(Math.random() * 3) + (levelIndex > 0 ? 1 : 0);
    for (let i = 0; i < chestCount; i++) {
        const pos = pickOpen();
        if (pos) map[pos.y][pos.x] = 2;
    }

    const enemyCount = 3 + levelIndex * 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < enemyCount; i++) {
        const pos = pickOpen();
        if (!pos) break;
        map[pos.y][pos.x] = 3;
    }

    const hasBoss = levelIndex === floorThemes.length - 1;
    if (hasBoss) {
        const pos = pickOpen() || exit;
        map[pos.y][pos.x] = 4;
    }

    const shopPos = pickOpen();
    if (shopPos) map[shopPos.y][shopPos.x] = 7;

    const keyPos = pickOpen();
    if (keyPos) map[keyPos.y][keyPos.x] = 6;

    map[exit.y][exit.x] = 5;

    return { name: theme.name, map, start, theme };
}

let currentLevel = 0;
let currentLevelData = null;
let map = [];
let player = { x: 1, y: 1, dir: 1, hp: 24, maxHp: 26, gold: 0, keys: 0, xp: 0, damage: 5, armor: 0, potions: 1, talisman: false };
let enemies = {};
let gameOver = false;
let shopOpen = false;
let lastMessage = 'Hark, brave traveler. The halls await thy foolish courage.';
let currentMessageType = 'neutral';
let animationTick = 0;
let chestEffect = null;
let gameMode = GAME_MODE.OVERWORLD;
let overworldPos = { x: 5, y: 5 };
let completedDungeons = new Set();
let discoveredLocations = new Set();
let currentStory = { chapter: 0, questsCompleted: 0 };
let dialogueActive = false;
let currentNPC = null;

function getLocationAt(x, y) {
    return Object.values(LOCATIONS).find(loc => loc.x === x && loc.y === y) || null;
}

function startDungeon(dungeonLocation) {
    gameMode = GAME_MODE.DUNGEON;
    overworldScreen.classList.add('hidden');
    if (gameOverlay) gameOverlay.classList.remove('hidden');
    currentLevel = dungeonLocation.level;
    loadLevel(dungeonLocation.level);
    dialogueActive = false;
    dialoguePanel.classList.add('hidden');
}

function returnToOverworld() {
    gameMode = GAME_MODE.OVERWORLD;
    completedDungeons.add(currentLevel);
    overworldScreen.classList.remove('hidden');
    dialogueActive = false;
    dialoguePanel.classList.add('hidden');
    updateQuestLog();
}

function showNPCDialogue(npc) {
    if (!NPCS[npc]) return;
    const npcData = NPCS[npc];
    dialogueActive = true;
    currentNPC = npc;
    dialogueHeader.textContent = npcData.name;
    dialogueText.textContent = npcData.greeting;
    dialogueButtons.innerHTML = '';
    npcData.options.forEach((option, idx) => {
        const btn = document.createElement('button');
        btn.className = 'dialogue-btn';
        btn.textContent = option.text;
        btn.addEventListener('click', () => {
            dialogueText.textContent = option.reply;
            dialogueButtons.innerHTML = '<button class="dialogue-btn" onclick="closeDialogue()">Back</button>';
        });
        dialogueButtons.appendChild(btn);
    });
    const closeBtn = document.createElement('button');
    closeBtn.className = 'dialogue-btn';
    closeBtn.textContent = 'Farewell';
    closeBtn.addEventListener('click', closeDialogue);
    dialogueButtons.appendChild(closeBtn);
    dialoguePanel.classList.remove('hidden');
}

function closeDialogue() {
    dialogueActive = false;
    currentNPC = null;
    dialoguePanel.classList.add('hidden');
}

function showKingDialogue() {
    dialogueActive = true;
    dialogueHeader.textContent = 'King Aldric';
    dialogueText.textContent = 'I am Aldric of Thornwick. A dark will rises beneath the Obsidian Throne, and its corruption spreads through the land. We need a single blade to strike the heart of this curse.';
    dialogueButtons.innerHTML = '';

    const accept = document.createElement('button');
    accept.className = 'dialogue-btn';
    accept.textContent = 'I pledge myself to this cause';
    accept.addEventListener('click', () => {
        QUEST.accepted = true;
        dialoguePanel.classList.add('hidden');
        dialogueActive = false;
        lastMessage = 'The king\'s command echoes: seek the Obsidian Throne, face the darkness, and bring peace back to Thornwick.';
        currentMessageType = 'important';
        updateQuestLog();
        render();
    });

    const details = document.createElement('button');
    details.className = 'dialogue-btn';
    details.textContent = 'Tell me more of the threat';
    details.addEventListener('click', () => {
        dialogueText.textContent = 'Long ago the Obsidian Throne stood as a seal against the void. Now its guardian has turned and draws the old curse into our fields. Strengthen thy arms and wits before descending.';
    });

    const leave = document.createElement('button');
    leave.className = 'dialogue-btn';
    leave.textContent = 'I will return to the journey';
    leave.addEventListener('click', closeDialogue);

    dialogueButtons.append(accept, details, leave);
    dialoguePanel.classList.remove('hidden');
}

function moveOverworld(dx, dy) {
    const nx = overworldPos.x + dx;
    const ny = overworldPos.y + dy;
    if (nx >= 0 && nx <= 13 && ny >= 0 && ny <= 13) {
        overworldPos.x = nx;
        overworldPos.y = ny;
        const location = getLocationAt(nx, ny);
        if (location) {
            discoveredLocations.add(location.name);
            if (location.type === 'dungeon' && !completedDungeons.has(location.level)) {
                lastMessage = `Thou standest before ${location.name}, a dungeon of old power. Press Space to enter and face its guardian.`;
            } else if (location.type === 'dungeon' && completedDungeons.has(location.level)) {
                lastMessage = `${location.name} hath been cleared, though whispers still linger in its halls.`;
            } else if (location.type === 'town' || location.type === 'city') {
                lastMessage = `Thou art in ${location.name}, a place of refuge and rumor. Press Space to speak with its folk.`;
            }
        } else {
            lastMessage = 'Thou travelest through wilderness. Nothing of note here.';
        }
    }
}

function updateQuestLog() {
    const questStatus = QUEST.completed ? 'Quest complete' : QUEST.accepted ? 'Quest active' : 'Quest available';
    const questPrompt = QUEST.completed
        ? 'The final lord has fallen. Rest now, for Thornwick breathes again.'
        : QUEST.accepted
            ? 'Move toward the Obsidian Throne and strike the dungeon boss.'
            : 'Begin by speaking with King Aldric in the dialogue window.';

    const dungeonList = Object.values(LOCATIONS)
        .filter(loc => loc.type === 'dungeon')
        .map(loc => {
            const done = completedDungeons.has(loc.level);
            return `<div class="quest-item"><span class="quest-marker">${done ? '✓' : '◇'}</span> ${loc.name}</div>`;
        })
        .join('');

    if (questContent) {
        questContent.innerHTML = `
            <h3>Quest Log</h3>
            <div class="quest-item"><span class="quest-marker">${QUEST.completed ? '✓' : QUEST.accepted ? '▶' : '◇'}</span> ${QUEST.title}</div>
            <div class="quest-item">${QUEST.description}</div>
            <div class="quest-item">${questPrompt}</div>
            ${QUEST.accepted ? `<div class="quest-item">${questStatus}</div>` : ''}
            <div class="quest-item"><strong>Available dungeons:</strong></div>
            ${dungeonList}
        `;
    }
}

function drawOverworldMap() {
    const cols = 14;
    const rows = 14;
    const cell = 20;
    mapCtx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    mapCtx.fillStyle = '#11101a';
    mapCtx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
    mapCtx.strokeStyle = 'rgba(255,255,255,0.08)';
    mapCtx.lineWidth = 1;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            mapCtx.strokeRect(x * cell + 8, y * cell + 8, cell - 2, cell - 2);
        }
    }

    Object.values(LOCATIONS).forEach(loc => {
        const px = loc.x * cell + 8 + cell / 2;
        const py = loc.y * cell + 8 + cell / 2;
        if (loc.type === 'dungeon') {
            mapCtx.fillStyle = completedDungeons.has(loc.level) ? '#6c4a7b' : '#b15f91';
            mapCtx.beginPath();
            mapCtx.arc(px, py, 6, 0, Math.PI * 2);
            mapCtx.fill();
        } else if (loc.type === 'town') {
            mapCtx.fillStyle = '#f0d35d';
            mapCtx.fillRect(px - 6, py - 6, 12, 12);
        } else if (loc.type === 'city') {
            mapCtx.fillStyle = '#5fb5d6';
            mapCtx.fillRect(px - 6, py - 10, 12, 20);
        }
    });

    const px = overworldPos.x * cell + 8 + cell / 2;
    const py = overworldPos.y * cell + 8 + cell / 2;
    mapCtx.fillStyle = '#ffffff';
    mapCtx.beginPath();
    mapCtx.arc(px, py, 8, 0, Math.PI * 2);
    mapCtx.fill();
    mapCtx.strokeStyle = '#fff';
    mapCtx.lineWidth = 2;
    mapCtx.stroke();
}

function startOverworld() {
    gameMode = GAME_MODE.OVERWORLD;
    if (overworldScreen) overworldScreen.classList.add('hidden');
    if (gameOverlay) gameOverlay.classList.add('hidden');
    dialoguePanel.classList.add('hidden');
    updateQuestLog();
    render();
}

function overworldInteract() {
    const location = getLocationAt(overworldPos.x, overworldPos.y);
    if (location && location.type === 'dungeon') {
        if (!QUEST.accepted) {
            lastMessage = 'The king\'s decree is required before thou mayst enter. Swear thy blade to Thornwick and then return.';
            currentMessageType = 'warning';
            return;
        }
        startDungeon(location);
        return;
    }
    if (location && (location.type === 'town' || location.type === 'city')) {
        showNPCDialogue(location.npc);
        return;
    }
    lastMessage = 'No one of note is here. Seek the dungeon marker and enter when thou art ready.';
    currentMessageType = 'neutral';
}

function renderOverworld() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = '#1c401b';
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < 14; y++) {
        for (let x = 0; x < 14; x++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? '#2d6f33' : '#26612e';
            ctx.fillRect(x * 68 + 4, y * 38.5 + 4, 60, 30);
            if ((x + y) % 3 === 0) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
                ctx.fillRect(x * 68 + 52, y * 38.5 + 8, 4, 10);
            }
        }
    }
    ctx.strokeStyle = '#0f2e14';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 14; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 68 + 2, 2);
        ctx.lineTo(i * 68 + 2, h - 2);
        ctx.stroke();
    }
    for (let j = 0; j <= 14; j++) {
        ctx.beginPath();
        ctx.moveTo(2, j * 38.5 + 2);
        ctx.lineTo(w - 2, j * 38.5 + 2);
        ctx.stroke();
    }
    Object.values(LOCATIONS).forEach(loc => {
        const x = loc.x * 68 + 34;
        const y = loc.y * 38.5 + 19.25;
        const label = loc.name;
        if (loc.type === 'dungeon') {
            ctx.fillStyle = completedDungeons.has(loc.level) ? '#4a2a3a' : '#8b3e6e';
            ctx.fillRect(x - 16, y - 16, 32, 32);
            ctx.strokeStyle = completedDungeons.has(loc.level) ? '#b893c4' : '#ff8f99';
            ctx.lineWidth = 3;
            ctx.strokeRect(x - 16, y - 16, 32, 32);
        } else if (loc.type === 'town') {
            ctx.fillStyle = '#d9b16c';
            ctx.fillRect(x - 14, y - 14, 28, 28);
            ctx.strokeStyle = '#aaa05e';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 14, y - 14, 28, 28);
        } else if (loc.type === 'city') {
            ctx.fillStyle = '#6fb0d8';
            ctx.fillRect(x - 18, y - 16, 14, 32);
            ctx.fillRect(x + 4, y - 16, 14, 32);
            ctx.fillStyle = '#cce7a1';
            ctx.fillRect(x - 18, y - 22, 36, 8);
            ctx.strokeStyle = '#8ca8bf';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 18, y - 16, 36, 32);
        }
        ctx.font = 'bold 11px "Courier New", monospace';
        ctx.textAlign = 'center';
        const textWidth = ctx.measureText(label).width + 12;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
        ctx.fillRect(x - textWidth / 2, y + 16, textWidth, 18);
        ctx.fillStyle = '#f6e1a3';
        ctx.fillText(label, x, y + 30);
    });
    const px = overworldPos.x * 68 + 34;
    const py = overworldPos.y * 38.5 + 19.25;
    ctx.fillStyle = '#f4ff7b';
    ctx.fillRect(px - 8, py - 8, 16, 16);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(px - 8, py - 8, 16, 16);
}

function loadLevel(index) {
    currentLevel = index;
    currentLevelData = generateLevelMap(index);
    map = currentLevelData.map.map(row => row.slice());
    player.x = currentLevelData.start.x;
    player.y = currentLevelData.start.y;
    player.dir = currentLevelData.start.dir;
    player.hp = Math.max(player.hp, 16);
    enemies = {};
    map.forEach((row, y) => {
        row.forEach((tile, x) => {
            if (tile === 3) enemies[`${x},${y}`] = { hp: 6 + currentLevel * 2 };
            if (tile === 4) enemies[`${x},${y}`] = { hp: 20 + currentLevel * 6 };
        });
    });
    gameOver = false;
    shopOpen = false;
    shopPanel.classList.add('hidden');
    if (deathScreen) deathScreen.classList.add('hidden');
    lastMessage = `Entering ${currentLevelData.name}. ${currentLevelData.theme.description}`;
    writeMessage(`Hark! ${currentLevelData.theme.description}`);
    render();
}

function getTile(x, y) {
    if (!map[y] || map[y][x] === undefined) return 1;
    return map[y][x];
}

function setTile(x, y, value) {
    if (map[y] && map[y][x] !== undefined) map[y][x] = value;
}

function getFacingLabel() {
    return DIRS[player.dir].label;
}

function writeMessage(message, type = 'neutral') {
    lastMessage = message;
    currentMessageType = type;
}

function move(delta) {
    if (gameOver) return;
    const dir = DIRS[player.dir];
    const nx = player.x + dir.dx * delta;
    const ny = player.y + dir.dy * delta;
    const tile = getTile(nx, ny);
    if (tile === 1) {
        writeMessage('A grim stone wall bars thy path. Turn thy head or strike not this cursed rock.');
        return;
    }
    if (tile === 3 || tile === 4) {
        writeMessage('A foul knave lurks yond corridor. Steel thy courage and smite him with thy blade.');
        return;
    }
    if (tile === 2) {
        player.x = nx;
        player.y = ny;
        openChest(nx, ny);
        return;
    }
    if (tile === 7) {
        player.x = nx;
        player.y = ny;
        openShop();
        return;
    }
    if (tile === 6) {
        player.x = nx;
        player.y = ny;
        player.keys += 1;
        setTile(nx, ny, 0);
        writeMessage('Behold! A rusted key is thine. Some locked door shall quake before thee.');
        render();
        return;
    }
    if (tile === 5) {
        player.x = nx;
        player.y = ny;
        if (currentLevel < levelNames.length - 1) {
            writeMessage('Thou passest through the gate and descend into yet darker halls.', 'important');
            render();
            setTimeout(() => loadLevel(currentLevel + 1), 500);
            return;
        }
        if (Object.keys(enemies).some(key => map[key.split(',')[1]][key.split(',')[0]] === 4)) {
            writeMessage('The final guardian standeth still. Slay him ere thou departest.', 'warning');
            return;
        }
        victory();
        return;
    }
    player.x = nx;
    player.y = ny;
    writeMessage('Thou advance cautiously through the shadowed hall.');
    render();
}

function turn(direction) {
    if (gameOver) return;
    player.dir = (player.dir + direction + 4) % 4;
    writeMessage(`Thou turnest ${direction > 0 ? 'to the right' : 'to the left'}, now gazing ${getFacingLabel()}.`);
    render();
}

function attackAhead() {
    if (gameOver) return;
    const dir = DIRS[player.dir];
    const nx = player.x + dir.dx;
    const ny = player.y + dir.dy;
    const tile = getTile(nx, ny);
    if (tile === 3 || tile === 4) {
        const key = `${nx},${ny}`;
        const enemy = enemies[key];
        if (!enemy) return;
        const damage = Math.floor(Math.random() * player.damage) + 2;
        enemy.hp -= damage;
        let message = `You strike the ${tile === 4 ? 'boss' : 'enemy'} for ${damage} damage.`;
        if (enemy.hp <= 0) {
            setTile(nx, ny, 0);
            delete enemies[key];
            const xpReward = tile === 4 ? 28 + currentLevel * 4 : 12 + currentLevel * 3;
            player.xp += Math.ceil(xpReward * (player.talisman ? 1.2 : 1));
            let dropMessage = '';
            if (tile === 4 || Math.random() < 0.45) {
                const healAmount = Math.min(10, player.maxHp - player.hp);
                if (healAmount > 0) {
                    player.hp += healAmount;
                    dropMessage = ` You recover ${healAmount} HP from a fallen pack.`;
                } else {
                    player.damage += 1;
                    dropMessage = ' You scavenge a sharper blade: +1 damage.';
                }
            } else {
                player.damage += 1;
                dropMessage = ' You scavenge a sharper blade: +1 damage.';
            }
            message += ` The ${tile === 4 ? 'boss collapses' : 'enemy falls'} and the corridor clears.`;
            message += ` +${xpReward} XP.`;
            message += dropMessage;
            if (tile === 4) message += ' Now reach the exit to win!';
            writeMessage(message, 'drop');
        } else {
            const counter = Math.floor(Math.random() * 4) + 2 + currentLevel;
            const defense = Math.floor(player.armor * 0.5);
            const actualDamage = Math.max(1, counter - defense);
            player.hp -= actualDamage;
            message += ` It hits back for ${actualDamage}.`;
            if (player.hp <= 0) {
                player.hp = 0;
                gameOver = true;
                message += ' Thy light hath guttered. Press R to rise again.';
                writeMessage(message, 'warning');
                showDeathScreen();
            } else {
                writeMessage(message, player.hp <= 6 ? 'warning' : 'neutral');
            }
        }
        render();
        return;
    }
    if (tile === 2) {
        openChest(nx, ny);
        return;
    }
    if (tile === 5) {
        writeMessage('A heavy gate bars the exit. Step into it to continue if the path is clear.');
        return;
    }
    writeMessage('There is nothing to attack in that direction.');
}

function getShopOffers(levelIndex) {
    const baseCost = 12 + levelIndex * 6;
    const offers = [
        {
            id: 'potion',
            title: 'Health Potion',
            description: 'Carry a potion to restore 14 HP when used.',
            cost: baseCost,
            buy: () => {
                player.potions += 1;
                writeMessage('Thou hast procured a health draught. Press P to sip it in battle.', 'success');
            },
            repeatable: true
        },
        {
            id: 'weapon',
            title: 'Sharpened Blade',
            description: 'Gain +1 damage for every strike.',
            cost: 16 + levelIndex * 8,
            buy: () => {
                player.damage += 1;
                writeMessage('Thy blade grows keener. Steel and fury answer thy will.', 'success');
            },
            repeatable: true
        },
        {
            id: 'armor',
            title: 'Reinforced Armor',
            description: 'Reduce incoming damage with extra plating.',
            cost: 20 + levelIndex * 10,
            buy: () => {
                player.armor += 2;
                writeMessage('Thou armorest thyself in plate. Fewer wounds shall mar thy flesh.', 'success');
            },
            repeatable: true
        }
    ];

    if (levelIndex >= 1) {
        offers.push({
            id: 'heart',
            title: 'Heart Tonic',
            description: 'Increase max HP by 4 and heal immediately.',
            cost: 30 + levelIndex * 10,
            buy: () => {
                player.maxHp += 4;
                player.hp = Math.min(player.maxHp, player.hp + 4);
                writeMessage('Thy heart swells with stoutness. Thy life shall endure longer.', 'success');
            },
            repeatable: true
        });
    }

    if (levelIndex >= 2) {
        offers.push({
            id: 'talisman',
            title: 'Crystal Talisman',
            description: 'Earn 20% more XP from every foe.',
            cost: 45,
            buy: () => {
                player.talisman = true;
                writeMessage('Thou claimst the Crystal Talisman. Each foe felled grants thee greater renown.', 'important');
            },
            repeatable: false
        });
    }

    return offers;
}

function openShop() {
    if (gameOver) return;
    shopOpen = true;
    shopPanel.classList.remove('hidden');
    shopDescription.textContent = `The vendor of ${currentLevelData.name} offers trinkets, elixirs and steel.`;
    populateShop();
    render();
}

function closeShop() {
    shopOpen = false;
    shopPanel.classList.add('hidden');
}

function populateShop() {
    shopItems.innerHTML = '';
    const offers = getShopOffers(currentLevel);
    offers.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'shop-item';

        const info = document.createElement('div');
        info.innerHTML = `<strong>${item.title}</strong><p>${item.description}</p><span class="shop-cost">${item.cost} gold</span>`;

        const action = document.createElement('button');
        action.className = 'shop-button';
        action.textContent = player.gold >= item.cost ? 'Buy' : 'No gold';
        action.disabled = player.gold < item.cost || (item.id === 'talisman' && player.talisman);
        action.addEventListener('click', () => {
            if (player.gold < item.cost) return;
            player.gold -= item.cost;
            item.buy();
            updateStatus();
            populateShop();
        });

        card.append(info, action);
        shopItems.appendChild(card);
    });
}

function buyShopItem(item) {
    if (player.gold < item.cost) {
        writeMessage('Thy purse be too light for this treasure.', 'warning');
        return;
    }
    player.gold -= item.cost;
    item.buy();
    updateStatus();
    populateShop();
}

function showDeathScreen() {
    if (deathScreen) deathScreen.classList.remove('hidden');
}

function hideDeathScreen() {
    if (deathScreen) deathScreen.classList.add('hidden');
}

function usePotion() {
    if (gameOver) return;
    if (player.potions <= 0) {
        writeMessage('Thy flask is empty. No potion remains for thy wounds.', 'warning');
        return;
    }
    if (player.hp >= player.maxHp) {
        writeMessage('Thy body is already whole. Save the draught for later danger.', 'neutral');
        return;
    }
    const heal = Math.min(14, player.maxHp - player.hp);
    player.hp += heal;
    player.potions -= 1;
    writeMessage(`Thou quaff the potion and regain ${heal} vigor.`, 'success');
    render();
}

function openChest(x, y) {
    const reward = Math.floor(Math.random() * 10) + 6;
    const heal = Math.random() < 0.35 ? Math.floor(Math.random() * 6) + 4 : 0;
    const keyFound = Math.random() < 0.22;
    const boost = Math.random() < 0.25;
    player.gold += reward;
    if (heal) player.hp = Math.min(player.hp + heal, player.maxHp);
    if (keyFound) player.keys += 1;
    if (boost) player.damage += 1;
    setTile(x, y, 0);
    chestEffect = {
        progress: 0,
        reward,
        heal,
        keyFound,
        boost,
        particles: Array.from({ length: 10 }, () => ({
            x: (Math.random() - 0.5) * 80,
            y: (Math.random() - 0.5) * 40,
            speed: 0.9 + Math.random() * 1.3,
            angle: Math.random() * Math.PI * 2,
            color: Math.random() > 0.5 ? '#ffe27a' : '#ffd2a0'
        }))
    };
    let message = `Thy chest yields +${reward} gold.`;
    if (heal) message += ` Thine wounds mend by ${heal} HP.`;
    if (boost) message += ' Thy weapon grows keener: +1 damage.';
    if (keyFound) message += ' A key is thine! Use it to unseal a hidden gate.';
    writeMessage(message, boost ? 'success' : 'neutral');
}

function victory() {
    gameOver = true;
    QUEST.completed = true;
    writeMessage('By Saint and steel, thou hast vanquished the final lord. Glory and coin are thine!');
    render();
}

function drawChestEffect() {
    if (!chestEffect) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 24;
    chestEffect.progress += 1;
    chestEffect.particles.forEach((particle, index) => {
        const life = Math.max(0, 1 - chestEffect.progress / 70);
        const px = centerX + particle.x * life + Math.cos(particle.angle + chestEffect.progress * 0.08) * 12;
        const py = centerY - 16 - chestEffect.progress * 0.7 + Math.sin(particle.angle + index) * 6;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(px, py, 2.5 + life * 1.5, 0, Math.PI * 2);
        ctx.fill();
    });
    if (chestEffect.progress > 72) {
        chestEffect = null;
    }
}

function gameLoop() {
    animationTick += 1;
    render();
    window.requestAnimationFrame(gameLoop);
}

function render() {
    if (gameMode === GAME_MODE.OVERWORLD) {
        renderOverworld();
        drawOverworldMap();
    } else {
        renderFirstPerson();
        drawMap();
    }
    updateStatus();
    drawChestEffect();
}

function updateStatus() {
    statusLevel.textContent = gameMode === GAME_MODE.OVERWORLD ? 'Overworld' : currentLevelData.name;
    statusHealth.textContent = `HP ${player.hp}/${player.maxHp}`;
    statusGold.textContent = `Gold ${player.gold}`;
    statusKeys.textContent = `Keys ${player.keys}`;
    statusPotions.textContent = `Potions ${player.potions}`;
    statusArmor.textContent = `Armor ${player.armor}`;
    statusXP.textContent = `XP ${player.xp}`;
    statusPower.textContent = `Power ${player.damage}`;
    statusMessage.innerHTML = `<span class="msg-${currentMessageType}">${lastMessage}</span>`;
    facingText.innerText = gameMode === GAME_MODE.OVERWORLD ? 'N/A' : getFacingLabel();
    if (gameOverlay) {
        gameOverlay.classList.toggle('compact-status', gameMode === GAME_MODE.DUNGEON);
    }
}

function renderFirstPerson() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const theme = currentLevelData.theme || floorThemes[0];

    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, theme.palette.skyTop);
    sky.addColorStop(0.4, theme.palette.skyMid);
    sky.addColorStop(1, theme.palette.skyBottom);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    const leftNear = w * 0.16;
    const rightNear = w * 0.84;
    const leftFar = w * 0.34;
    const rightFar = w * 0.66;
    const topY = h * 0.24;
    const midY = h * 0.36;
    const bottomY = h * 0.72;

    ctx.fillStyle = theme.palette.wall;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(rightFar, topY);
    ctx.lineTo(leftFar, topY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = theme.palette.wallAccent;
    ctx.beginPath();
    ctx.moveTo(leftFar, topY);
    ctx.lineTo(rightFar, topY);
    ctx.lineTo(rightNear, bottomY);
    ctx.lineTo(leftNear, bottomY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = theme.palette.corridor;
    ctx.beginPath();
    ctx.moveTo(leftNear, bottomY);
    ctx.lineTo(rightNear, bottomY);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(leftFar, topY);
    ctx.lineTo(leftNear, bottomY);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(w, 0);
    ctx.lineTo(rightFar, topY);
    ctx.lineTo(rightNear, bottomY);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    const floorGradient = ctx.createLinearGradient(0, bottomY, 0, h);
    floorGradient.addColorStop(0, theme.palette.floor);
    floorGradient.addColorStop(1, theme.palette.floorDark);
    ctx.fillStyle = floorGradient;
    ctx.fillRect(0, bottomY, w, h - bottomY);

    const depthSteps = 6;
    for (let step = 1; step <= depthSteps; step++) {
        const t = step / (depthSteps + 1);
        const lineY = topY + (bottomY - topY) * t;
        const innerLeft = leftFar + (leftNear - leftFar) * t;
        const innerRight = rightFar + (rightNear - rightFar) * t;

        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(innerLeft, lineY);
        ctx.lineTo(innerRight, lineY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(innerLeft, lineY);
        ctx.lineTo(innerLeft - 24 * t, lineY + 20 * t);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(innerRight, lineY);
        ctx.lineTo(innerRight + 24 * t, lineY + 20 * t);
        ctx.stroke();
    }

    const wallOutline = ctx.createLinearGradient(0, 0, w, 0);
    wallOutline.addColorStop(0, 'rgba(255,255,255,0.08)');
    wallOutline.addColorStop(0.5, 'rgba(255,255,255,0.02)');
    wallOutline.addColorStop(1, 'rgba(255,255,255,0.08)');
    ctx.strokeStyle = wallOutline;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftFar, topY);
    ctx.lineTo(leftNear, bottomY);
    ctx.moveTo(rightFar, topY);
    ctx.lineTo(rightNear, bottomY);
    ctx.stroke();

    const tile = getTile(player.x + DIRS[player.dir].dx, player.y + DIRS[player.dir].dy);
    if (tile === 1) {
        ctx.fillStyle = 'rgba(95, 69, 108, 0.95)';
        ctx.beginPath();
        ctx.moveTo(leftFar + 18, topY + 14);
        ctx.lineTo(rightFar - 18, topY + 14);
        ctx.lineTo(rightNear - 24, bottomY - 12);
        ctx.lineTo(leftNear + 24, bottomY - 12);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#caa6ff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    drawCenterIcon();
}

function drawCenterIcon() {
    const tile = getTile(player.x + DIRS[player.dir].dx, player.y + DIRS[player.dir].dy);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 20;
    const pulse = 1 + Math.sin(animationTick * 0.14) * 0.08;
    const sizeScale = 1 + currentLevel * 0.12;

    if (tile === 2) {
        const lidAngle = Math.sin(animationTick * 0.18) * 0.12;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.fillStyle = '#b4882f';
        ctx.fillRect(-28, -22, 56, 34);
        ctx.fillStyle = '#8a6321';
        ctx.fillRect(-28, -22, 56, 10);
        ctx.strokeStyle = '#ffe8a0';
        ctx.lineWidth = 2;
        ctx.strokeRect(-28, -22, 56, 34);
        ctx.translate(0, -16);
        ctx.rotate(-0.25 + lidAngle);
        ctx.fillStyle = '#d4a83d';
        ctx.fillRect(-30, -8, 60, 16);
        ctx.restore();

        ctx.strokeStyle = 'rgba(255,220,100,0.35)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 48, -Math.PI / 2, -Math.PI / 2 + 0.9);
        ctx.stroke();
    } else if (tile === 3) {
        const bob = Math.sin(animationTick * 0.2) * 4;
        const skullY = centerY - 14 + bob;
        const ribY = centerY + 10 + bob;
        const skullWidth = 16 * sizeScale;
        const skullHeight = 18 * sizeScale;
        const eyeX = 6 * sizeScale;
        const eyeY = 2 * sizeScale;
        const eyeSize = 4 * sizeScale;
        const ribOffset = 12 * sizeScale;
        const lineGap = 8 * sizeScale;

        ctx.fillStyle = '#ece6dc';
        ctx.beginPath();
        ctx.ellipse(centerX, skullY, skullWidth, skullHeight, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#b8aea1';
        ctx.lineWidth = 2 * sizeScale;
        ctx.stroke();

        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.ellipse(centerX - eyeX, skullY - eyeY, eyeSize, eyeSize * 1.4, 0, 0, Math.PI * 2);
        ctx.ellipse(centerX + eyeX, skullY - eyeY, eyeSize, eyeSize * 1.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(centerX - 6 * sizeScale, skullY + 6 * sizeScale, 12 * sizeScale, 3 * sizeScale);

        ctx.strokeStyle = '#e3dbcf';
        ctx.lineWidth = 3 * sizeScale;
        ctx.beginPath();
        ctx.moveTo(centerX - ribOffset, ribY - 4 * sizeScale);
        ctx.lineTo(centerX + ribOffset, ribY - 4 * sizeScale);
        ctx.stroke();
        for (let i = 0; i < 4; i++) {
            const y = ribY + i * lineGap;
            ctx.beginPath();
            ctx.moveTo(centerX - 16 * sizeScale, y);
            ctx.lineTo(centerX + 16 * sizeScale, y);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(centerX, ribY - 8 * sizeScale);
        ctx.lineTo(centerX, ribY + 28 * sizeScale);
        ctx.stroke();

        ctx.strokeStyle = '#c8c0b5';
        ctx.lineWidth = 4 * sizeScale;
        ctx.beginPath();
        ctx.moveTo(centerX - 28 * sizeScale, centerY + 2 * sizeScale + bob);
        ctx.lineTo(centerX - 38 * sizeScale, centerY + 24 * sizeScale + bob);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX + 28 * sizeScale, centerY + 2 * sizeScale + bob);
        ctx.lineTo(centerX + 38 * sizeScale, centerY + 24 * sizeScale + bob);
        ctx.stroke();

        ctx.strokeStyle = '#8d8b86';
        ctx.lineWidth = 5 * sizeScale;
        ctx.beginPath();
        ctx.moveTo(centerX - 40 * sizeScale, centerY + 24 * sizeScale + bob);
        ctx.lineTo(centerX + 40 * sizeScale, centerY + 42 * sizeScale + bob);
        ctx.stroke();
        ctx.fillStyle = '#c5c0b4';
        ctx.beginPath();
        ctx.moveTo(centerX + 40 * sizeScale, centerY + 42 * sizeScale + bob);
        ctx.lineTo(centerX + 36 * sizeScale, centerY + 38 * sizeScale + bob);
        ctx.lineTo(centerX + 46 * sizeScale, centerY + 36 * sizeScale + bob);
        ctx.closePath();
        ctx.fill();
    } else if (tile === 4) {
        const wingFlap = Math.sin(animationTick * 0.16) * 0.28;
        const headY = centerY - 20;
        const bodyScale = sizeScale;

        ctx.fillStyle = '#4a1b28';
        ctx.beginPath();
        ctx.ellipse(centerX, headY + 2, 32 * bodyScale, 28 * bodyScale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2f0813';
        ctx.beginPath();
        ctx.moveTo(centerX - 18 * bodyScale, headY - 6 * bodyScale);
        ctx.lineTo(centerX - 30 * bodyScale, headY - 26 * bodyScale);
        ctx.lineTo(centerX - 24 * bodyScale, headY - 30 * bodyScale);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(centerX + 18 * bodyScale, headY - 6 * bodyScale);
        ctx.lineTo(centerX + 30 * bodyScale, headY - 26 * bodyScale);
        ctx.lineTo(centerX + 24 * bodyScale, headY - 30 * bodyScale);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#f9e18d';
        ctx.beginPath();
        ctx.ellipse(centerX - 8 * bodyScale, headY + 2 * bodyScale, 8 * bodyScale, 11 * bodyScale, 0, 0, Math.PI * 2);
        ctx.ellipse(centerX + 8 * bodyScale, headY + 2 * bodyScale, 8 * bodyScale, 11 * bodyScale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2e0810';
        ctx.beginPath();
        ctx.arc(centerX - 8 * bodyScale, headY + 2 * bodyScale, 3 * bodyScale, 0, Math.PI * 2);
        ctx.arc(centerX + 8 * bodyScale, headY + 2 * bodyScale, 3 * bodyScale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#d7a82f';
        ctx.beginPath();
        ctx.moveTo(centerX - 12 * bodyScale, headY + 18 * bodyScale);
        ctx.lineTo(centerX + 12 * bodyScale, headY + 18 * bodyScale);
        ctx.lineTo(centerX + 8 * bodyScale, headY + 30 * bodyScale);
        ctx.lineTo(centerX - 8 * bodyScale, headY + 30 * bodyScale);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3e1020';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 24, 36 * bodyScale, 24 * bodyScale, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(centerX, centerY + 4 * bodyScale);
        ctx.rotate(-0.5 + wingFlap);
        ctx.fillStyle = '#4d1f2f';
        ctx.beginPath();
        ctx.moveTo(-28 * bodyScale, 4 * bodyScale);
        ctx.lineTo(-70 * bodyScale, -24 * bodyScale);
        ctx.lineTo(-60 * bodyScale, 10 * bodyScale);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(centerX, centerY + 4 * bodyScale);
        ctx.rotate(0.5 - wingFlap);
        ctx.fillStyle = '#4d1f2f';
        ctx.beginPath();
        ctx.moveTo(28 * bodyScale, 4 * bodyScale);
        ctx.lineTo(70 * bodyScale, -24 * bodyScale);
        ctx.lineTo(60 * bodyScale, 10 * bodyScale);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.strokeStyle = '#d7a82f';
        ctx.lineWidth = 5 * bodyScale;
        ctx.beginPath();
        ctx.moveTo(centerX - 16 * bodyScale, centerY + 6 * bodyScale);
        ctx.lineTo(centerX + 16 * bodyScale, centerY + 8 * bodyScale);
        ctx.stroke();
    } else if (tile === 5) {
        const glow = 0.5 + Math.sin(animationTick * 0.18) * 0.15;
        ctx.fillStyle = `rgba(88, 176, 126, ${0.18 + glow * 0.15})`;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 24, 80, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#5fbf8b';
        ctx.beginPath();
        ctx.moveTo(centerX - 22, centerY - 18);
        ctx.lineTo(centerX + 22, centerY - 18);
        ctx.lineTo(centerX + 40, centerY + 26);
        ctx.lineTo(centerX - 40, centerY + 26);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#1b3b2c';
        ctx.fillRect(centerX - 16, centerY + 2, 32, 8);
        ctx.fillStyle = '#9ee1c3';
        for (let step = 0; step < 4; step++) {
            const stepY = centerY - 14 + step * 10;
            const width = 16 + step * 8;
            ctx.fillRect(centerX - width / 2, stepY, width, 6);
        }
    } else if (tile === 6) {
        ctx.fillStyle = '#7ea5d4';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 28);
        ctx.lineTo(centerX + 28, centerY);
        ctx.lineTo(centerX + 8, centerY + 4);
        ctx.lineTo(centerX + 12, centerY + 28);
        ctx.lineTo(centerX - 12, centerY + 28);
        ctx.lineTo(centerX - 8, centerY + 4);
        ctx.lineTo(centerX - 28, centerY);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#f5f8ff';
        ctx.fillRect(centerX - 6, centerY - 12, 12, 20);
        ctx.fillStyle = '#5b82ae';
        ctx.beginPath();
        ctx.arc(centerX, centerY - 16, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawMap() {
    const cellSize = 24;
    const rows = map.length;
    const cols = map[0].length;
    const theme = currentLevelData.theme || floorThemes[0];
    mapCtx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    mapCtx.fillStyle = '#11101a';
    mapCtx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const tile = map[y][x];
            let color = theme.palette.floor;
            if (tile === 1) color = theme.palette.wall;
            if (tile === 2) color = theme.palette.chest;
            if (tile === 3) color = theme.palette.enemy;
            if (tile === 4) color = theme.palette.boss;
            if (tile === 5) color = theme.palette.exit;
            if (tile === 6) color = theme.palette.key;
            if (tile === 7) color = theme.palette.shop;
            mapCtx.fillStyle = color;
            mapCtx.fillRect(x * cellSize + 8, y * cellSize + 8, cellSize - 2, cellSize - 2);
        }
    }
    const px = player.x * cellSize + 8 + cellSize / 2;
    const py = player.y * cellSize + 8 + cellSize / 2;
    const angle = (player.dir * Math.PI) / 2 - Math.PI / 2;
    const coneLength = cellSize * 2.4;
    const coneSpread = Math.PI / 2.4;

    mapCtx.fillStyle = 'rgba(147, 255, 114, 0.16)';
    mapCtx.beginPath();
    mapCtx.moveTo(px, py);
    mapCtx.lineTo(px + Math.cos(angle - coneSpread / 2) * coneLength, py + Math.sin(angle - coneSpread / 2) * coneLength);
    mapCtx.arc(px, py, coneLength, angle - coneSpread / 2, angle + coneSpread / 2);
    mapCtx.closePath();
    mapCtx.fill();

    mapCtx.fillStyle = '#e3ff72';
    mapCtx.fillRect(player.x * cellSize + 8, player.y * cellSize + 8, cellSize - 2, cellSize - 2);
    mapCtx.strokeStyle = '#fff';
    mapCtx.lineWidth = 2;
    mapCtx.beginPath();
    mapCtx.moveTo(px + Math.cos(angle) * 10, py + Math.sin(angle) * 10);
    mapCtx.lineTo(px + Math.cos(angle + 2.1) * 8, py + Math.sin(angle + 2.1) * 8);
    mapCtx.lineTo(px + Math.cos(angle - 2.1) * 8, py + Math.sin(angle - 2.1) * 8);
    mapCtx.closePath();
    mapCtx.fill();
}

function setButtonState(action, pressed) {
    const button = document.querySelector(`[data-action="${action}"]`);
    if (button) button.classList.toggle('active', pressed);
}

function performAction(action) {
    if (action === 'restart') {
        resetGame();
        return;
    }
    if (gameMode === GAME_MODE.OVERWORLD) {
        if (action === 'move-forward') moveOverworld(0, -1);
        if (action === 'move-back') moveOverworld(0, 1);
        if (action === 'turn-left') moveOverworld(-1, 0);
        if (action === 'turn-right') moveOverworld(1, 0);
        if (action === 'attack') overworldInteract();
        if (action === 'use-potion') usePotion();
        return;
    }
    if (action === 'move-forward') move(1);
    if (action === 'move-back') move(-1);
    if (action === 'turn-left') turn(-1);
    if (action === 'turn-right') turn(1);
    if (action === 'attack') attackAhead();
    if (action === 'use-potion') usePotion();
}

function bindControlButtons() {
    actionButtons.forEach(button => {
        const action = button.dataset.action;
        button.addEventListener('pointerdown', event => {
            event.preventDefault();
            setButtonState(action, true);
            performAction(action);
        });
        button.addEventListener('pointerup', () => setButtonState(action, false));
        button.addEventListener('pointerleave', () => setButtonState(action, false));
        button.addEventListener('pointercancel', () => setButtonState(action, false));
    });
}

function resetGame() {
    gameOver = false;
    if (deathScreen) hideDeathScreen();
    player.hp = player.maxHp;
    player.gold = 0;
    player.keys = 0;
    player.xp = 0;
    player.damage = 5;
    player.armor = 0;
    player.potions = 1;
    player.talisman = false;
    currentLevel = 0;
    completedDungeons.clear();
    QUEST.accepted = false;
    QUEST.completed = false;
    overworldPos = { x: 5, y: 5 };
    currentLevelData = generateLevelMap(0);
    startOverworld();
    showKingDialogue();
}

const keyActionMap = {
    w: 'move-forward',
    s: 'move-back',
    a: 'turn-left',
    d: 'turn-right',
    ' ': 'attack',
    p: 'use-potion',
    r: 'restart'
};

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (event.defaultPrevented) return;
    if (Object.prototype.hasOwnProperty.call(keyActionMap, key) && ['w', 's', 'a', 'd', ' ', 'r'].includes(key)) {
        event.preventDefault();
    }
    if (key === 'r') {
        resetGame();
        setButtonState('restart', true);
        return;
    }
    const action = keyActionMap[key];
    if (!action) return;
    setButtonState(action, true);
    performAction(action);
});

document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    const action = keyActionMap[key];
    if (action) setButtonState(action, false);
});

window.addEventListener('load', () => {
    bindControlButtons();
    shopCloseButton.addEventListener('pointerdown', event => {
        event.preventDefault();
        closeShop();
    });
    const toggleQuestLog = () => {
        if (!questLog) return;
        const isHidden = questLog.classList.contains('hidden');
        if (isHidden) {
            updateQuestLog();
            questLog.classList.remove('hidden');
            if (questToggleButton) questToggleButton.textContent = 'Hide Quest Log';
        } else {
            questLog.classList.add('hidden');
            if (questToggleButton) questToggleButton.textContent = 'View Quest Log';
        }
    };

    if (questToggleButton) {
        questToggleButton.addEventListener('pointerdown', event => {
            event.preventDefault();
            toggleQuestLog();
        });
    }
    if (restartButton) {
        restartButton.addEventListener('pointerdown', event => {
            event.preventDefault();
            resetGame();
        });
    }
    if (questCloseButton) {
        questCloseButton.addEventListener('pointerdown', event => {
            event.preventDefault();
            if (questLog) questLog.classList.add('hidden');
            if (questToggleButton) questToggleButton.textContent = 'View Quest Log';
        });
    }
    currentLevelData = generateLevelMap(0);
    startOverworld();
    showKingDialogue();
    window.requestAnimationFrame(gameLoop);
});
