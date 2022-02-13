import { parseCode } from "./code-parser";
import { GraphicsMessage } from "./interfaces/graphics-message";
import { runLogoCode } from "./logo-interpreter";

export function runCode(code: string, sendMessage: (message: GraphicsMessage) => void): void {
    if (!code) {
        console.log('No code to run');
        return;
    }
    console.log('running code');

    const codeLines = parseCode(code);
    console.log(`Found ${codeLines.length} lines of code`);

    runLogoCode(codeLines, (turtleMessage) => {
        console.log(`got command ${turtleMessage.command}`);

        if (turtleMessage.command === 'forward') {
            if (turtleMessage.distance) {
                for (let i = 0; i < turtleMessage.distance; i++) {
                    sendMessage({ command: 'drawPoint', x: 5, y: i });
                }
            }
        } else if (turtleMessage.command === 'error') {
            console.log(`Error: ${turtleMessage.errorMessage}`);
        }
    });
}