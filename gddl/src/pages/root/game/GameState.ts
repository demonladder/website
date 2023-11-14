class State {
    showHitboxes: boolean;
    
    constructor() {
        this.showHitboxes = false;
    }

    toggleHitboxes() {
        this.showHitboxes = !this.showHitboxes;
    }
}

const GameState = new State();
export default GameState;