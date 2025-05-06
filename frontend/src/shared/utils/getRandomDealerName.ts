export const dealerNames = [
    "Ace Dealer Bot",
    "CardMaster 9000",
    "LuckyByte",
    "Blackjackzilla",
    "VegasPulse",
    "JackBot Royale",
    "The Algorithm",
    "Mr. CardSharp",
];

export function getRandomDealerName(currentName?: string): string {
    return currentName || dealerNames[Math.floor(Math.random() * dealerNames.length)];
}