export type CommandValues = 'drawPoint';

export interface GraphicsMessage {
    command: CommandValues;
    x: number;
    y: number;
}