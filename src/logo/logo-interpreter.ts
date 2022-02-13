import { CodeLine } from "./interfaces/token";
import { TurtleMessage } from "./interfaces/turtle-messages";

type SendTurtleMessage = (turtleMessage: TurtleMessage) => void;

export function runLogoCode(codeLines: CodeLine[], sendTurtleMessage: SendTurtleMessage): void {

    for(const codeLine of codeLines) {
        const result = runOneCodeLine(codeLine, sendTurtleMessage);
        if (!result.success) {
            sendTurtleMessage({
                command: 'error',
                errorMessage: result.errorMessage,
            });
            return;
        }
    }
}

interface RunResult {
    success: boolean;
    nextIndex?: number;
    errorMessage?: string;
}

function runOneCodeLine(codeLine: CodeLine, sendTurtleMessage: SendTurtleMessage): RunResult {
    let index = 0;

    while(index < codeLine.tokens.length) {
        const token = codeLine.tokens[index];
        if (Array.isArray(token.token)) {
            return {
                success: false,
                errorMessage: 'A line cannot start with a list',
            };
        }

        let runResult: RunResult;
        switch(token.token) {
            case 'forward':
                runResult = runForwardCommand(codeLine, index, sendTurtleMessage);
                break;
            default:
                runResult = {
                    success: false,
                    errorMessage: `${token.token} is an invalid command.`,
                };
        }

        if (!runResult.success) {
            return runResult;            
        }

        if (runResult.nextIndex) {
            index = runResult.nextIndex;
        } else {
            // This should never happen
            index++;
        }
    }
    return {
        success: true,
    };
}

function runForwardCommand(codeLine: CodeLine, index: number, sendTurtleMessage: SendTurtleMessage): RunResult {
    if (codeLine.tokens.length <= index + 1) {
        return {
            success: false,
            errorMessage: "The 'forward' command should be followed by the distance.",
        };
    }
    const distanceToken = codeLine.tokens[index + 1];
    if (Array.isArray(distanceToken.token)) {
        return {
            success: false,
            errorMessage: "The distance parameter cannot be a list.",
        };
    }
    // TODO - need to handle variables and expressions

    const distanceAsInt = filterInt(distanceToken.token)
    if (isNaN(distanceAsInt)) {
        console.log(`Invalid distance, ${distanceToken.token}`);
        return {
            success: false,
            errorMessage: "The distance parameter is not a valid  number.",
        };
    }

    // Format is correct, do the command
    sendTurtleMessage({
        command: 'forward',
        distance: distanceAsInt,
    });
    return {
        success: true,
        nextIndex: index + 2,
    };

}

function filterInt(value: string) {
    if (/^[-+]?(\d+|Infinity)$/.test(value)) {
      return Number(value);
    } else {
      return NaN;
    }
  }