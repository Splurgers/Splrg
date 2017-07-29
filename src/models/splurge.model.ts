type period =
    "DAY"
    | "WEEK"
    | "MONTH"
    | "YEAR";
    
export interface SPLURGE {
    description: string,
    period: period,
    number: number,
    use_dates?: Array<string>,
    id?: string
};

export const PERIOD_OPTIONS = [
    {
        'DISPLAY' : 'Day',
        'VALUE' : 'DAY'
    },
    {
        'DISPLAY' : 'Week',
        'VALUE' : 'WEEK'
    },
    {
        'DISPLAY' : 'Month',
        'VALUE' : 'MONTH'
    },
    {
        'DISPLAY' : 'Year',
        'VALUE' : 'YEAR'
    }
];