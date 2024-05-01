export interface ITask {
    id: string,
    isEdit: boolean,
    isComplete: boolean,
    title: string,
    subTask?: ITask[];
}

export const ItemTypes = {
    Task: 'task',
}