import { GraphicsMessage } from "./interfaces/graphics-message";

export function runCode(code: string): GraphicsMessage[] {
    const graphicsMessages: GraphicsMessage[] = [];

    if (!code) {
        return graphicsMessages;
    }

    for (var i = 0; i < 50; i++) {
         graphicsMessages.push({ command: 'drawPoint', x: i, y: i });
    }

    return  graphicsMessages;
}