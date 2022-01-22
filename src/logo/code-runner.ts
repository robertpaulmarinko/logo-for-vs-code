import { GraphicsMessage } from "./interfaces/graphics-message";

export function runCode(code: string, sendMessage: (message: GraphicsMessage) => void): void {
    if (!code) {
        console.log('No code to run');
        return;
    }

    for (var i = 0; i < 50; i++) {
         sendMessage({ command: 'drawPoint', x: i, y: i });
    }
}