// export const ItemTypes = {
//     CARD: "card"
// };

export interface ItemTLine {
  id: number,
  index: number,
  time: ItemTime,
}

interface ItemTime {
  start: string,
  end: string,
  thing: string,
}

export const ItemTypes = {
  TLINE: 'timeline',
}

export interface Label {
  value: string;
  minute: number;
}