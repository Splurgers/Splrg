// type period =
//     "DAY"
//     | "WEEK"
//     | "MONTH"
//     | "YEAR";

export interface SPLURGE {
    description: string,
    period: string, // TODO: Figure out how to use PERIOD type period without breaking all instances where we're using SPLURGE interface
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