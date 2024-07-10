// export const ItemTypes = {
//     CARD: "card"
// };

export interface ItemTLine {
  id: number,
  index: number,
  time: ItemTime,
}

interface ItemTime {
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
  thing: string,
}

export const ItemTypes = {
  TLINE: 'timeline',
}

export interface Label {
  thing: string;
  minute: number;
}

export interface ScheduleDto {
  id: number;
  startTime: string;
  endTime: string;
  thing: string;
}