
export type TFiles = {
    name: string;
    children: Dictionary<TFiles>;
    size: number;
    type: FileType;
}

export interface Dictionary<T> {
    [Key: string]: T;
}

export enum FileType {
    DIR = "dir",
    FILE = "file"
}


