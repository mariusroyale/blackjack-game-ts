import { ILeaderboards } from "./Leaderboards"
import { DateRangeTypes } from "./Leaderboards"

export interface IStatsService {
    getLeaderboards(dateRange: DateRangeTypes): Promise<ILeaderboards[] | null | undefined>
    addStatsToLeaderboards(data: ILeaderboards): Promise<number | undefined>
}