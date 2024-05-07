export interface ITask {
    id: number,
    title: string,
    index: number,
    isEdit: boolean,
    isComplete: boolean,
    subTask?: ITask[],
}

export const ItemTypes = {
    TASK: 'task',
}