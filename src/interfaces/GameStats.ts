export interface IGameStats {
    turnsPlayed: number;
    winner: string;
    playerScore: {
        player: number;
        dealer: number;
    }
}