export interface ITask {
    id: any,
    title: string,
    index: number,
    isEdit: boolean,
    isComplete: boolean,
    subTask?: ITask[],
}

export const ItemTypes = {
    TASK: 'task',
}