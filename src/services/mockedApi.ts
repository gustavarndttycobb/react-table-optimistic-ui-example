import { v4 as uuidv4 } from 'uuid';
import type { Item } from '../models/item.model';

export const mockedApi = {
    getItems: (): Promise<Item[]> => {
        return new Promise((resolve) =>
            setTimeout(() => resolve([{ id: '1', name: 'Saved Item', status: 'saved' }]), 1000)
        );
    },
    createItem: (item: Omit<Item, 'id'>): Promise<{ id: string }> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                Math.random() > 0.2
                    ? resolve({ id: uuidv4() })
                    : reject(new Error('Failed to save'));
            }, 1000);
        });
    },
    deleteItem: (id: string): Promise<void> => {
        return new Promise((resolve) => setTimeout(resolve, 500));
    },
};
