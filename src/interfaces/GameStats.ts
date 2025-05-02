export interface IGameStats {
    turnsPlayed: number;
    playerTurnsPlayed: number;
    dealerTurnsPlayed: number;
    playerEndedTurn: boolean;
    dealerEndedTurn: boolean;
    winner: string;
    playerScore: {
        player: number;
        dealer: number;
    }
}