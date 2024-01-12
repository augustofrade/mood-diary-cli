import { DailyEntryService } from "../service/DailyEntryService";

export function listEntries() {
    const service = DailyEntryService.instance();
    const entries = service.listEntries();
}