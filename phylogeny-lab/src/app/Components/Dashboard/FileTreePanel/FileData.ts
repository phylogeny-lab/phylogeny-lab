export type TFiles = {
    name: string;
    children?: TFiles[];
    size: number;
}