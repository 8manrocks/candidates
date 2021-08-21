export interface Employee {
    id: number;
    name: string;
    department: string;
    joining_date: Date;
    [index: string]: string|Date|number;
}