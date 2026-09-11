export const COLORS = {
    SAFFRON: '#FF9933',
    GOLD: '#FFD700',
    MAROON: '#800000',
    DEEP_RED: '#B22222',
    WARM_YELLOW: '#FFCC33',
    SUBTLE_GREEN: '#2E8B57',
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    GLOW_GOLD: 'rgba(255, 215, 0, 0.6)',
    BACKGROUND_GRADIENT: ['#FFD700', '#FF9933', '#B22222'], // Gold to Saffron to Red
};

export const GAME_CONFIG = {
    CANVAS_WIDTH: 360,
    CANVAS_HEIGHT: 640,
    PLAYER_SPEED: 300,
    PLAYER_SIZE: 40,
    OBSTACLE_SPEED_BASE: 100,
    COLLECTIBLE_SPEED_BASE: 200,
    SPAWN_RATE_BASE: 1500, // ms
    COMBO_TIMEOUT: 2000, // ms
    LIVES_START: 3,
};

export const COLLECTIBLES = {
    MODAK: { id: 'modak', value: 50, color: '#FFFFFF', label: 'Modak' },
    FLOWER: { id: 'flower', value: 20, color: '#FFC0CB', label: 'Flower' },
    DIYA: { id: 'diya', value: 30, color: '#FFA500', label: 'Diya' },
    DURVA: { id: 'durva', value: 20, color: '#32CD32', label: 'Durva' },
    BLESSING: { id: 'blessing', value: 100, color: '#FFD700', label: 'Blessing Token' },
};

export const POWERUPS = {
    MODAK_POWER: { id: 'modak_power', duration: 5000, label: 'Modak Power' },
    BLESSING: { id: 'blessing', duration: 7000, label: 'Divine Blessing' },
    DIVINE_BELL: { id: 'divine_bell', duration: 6000, label: 'Divine Bell' },
    GOLDEN_MODAK: { id: 'golden_modak', value: 500, label: 'Golden Modak' },
};

export const LEVELS = [
    {
        name: 'The Celebration Begins',
        duration: 60,
        obstacleSpeed: 1,
        spawnRate: 1,
        bg: '#FFD700',
    },
    {
        name: 'The Festival Streets',
        duration: 60,
        obstacleSpeed: 1.5,
        spawnRate: 0.8,
        bg: '#FF9933',
    },
    {
        name: 'The Grand Celebration',
        duration: 60,
        obstacleSpeed: 2,
        spawnRate: 0.6,
        bg: '#B22222',
    },
];

export const GameState = {
    MENU: 'MENU',
    HOW_TO_PLAY: 'HOW_TO_PLAY',
    PLAYING: 'PLAYING',
    LEVEL_COMPLETE: 'LEVEL_COMPLETE',
    GAME_OVER: 'GAME_OVER',
};
