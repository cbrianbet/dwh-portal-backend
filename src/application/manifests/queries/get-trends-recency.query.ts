export class GetTrendsRecencyQuery {
    county?: string;
    agency?: string;
    partner?: string;

    constructor(public docket: string, public period = `${new Date().getFullYear()},${new Date().getMonth()}`) {
    }
}
