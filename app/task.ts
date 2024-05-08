export interface ItemTask {
    id: number,
    title: string,
    index: number,
    isEdit: boolean,
    isComplete: boolean,
    subTask?: ItemTask[],
}

export const ItemTypes = {
    TASK: 'task',
}