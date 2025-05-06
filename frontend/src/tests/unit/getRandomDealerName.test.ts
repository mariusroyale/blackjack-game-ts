import { dealerNames,getRandomDealerName } from "../../shared/utils/getRandomDealerName";

describe("getRandomDealerName", () => {
    it("should return the provided dealer name when providing one", () => {
        const dealerName = "Test Name";
        const result = getRandomDealerName(dealerName);
        expect(result).toBe(dealerName);
    });

    it("should return a random dealer name when not providing one", () => {
        const result = getRandomDealerName();
        expect(dealerNames).toContain(result);
    });
});