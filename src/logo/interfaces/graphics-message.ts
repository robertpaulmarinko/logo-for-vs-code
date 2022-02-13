/**
 * Types used to tell the Logo WebView what graphics to draw.
 */
export type CommandValues = 'drawPoint';

export interface GraphicsMessage {
    command: CommandValues;
    x: number;
    y: number;
}