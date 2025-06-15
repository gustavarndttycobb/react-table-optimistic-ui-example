export type TempItemStatus = 'saved' | 'saving' | 'error';

export type Item = {
    id: string;
    name: string;
    status?: TempItemStatus;
};
