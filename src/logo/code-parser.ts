import { CodeLine, Token } from "./interfaces/token";

export function parseCode(code: string): CodeLine[] {
    if (!code) {
        return [];
    }

    const codeLineStrings = code.split(/\r?\n/);
    const codeLines = codeLineStrings.map(codeLineString => parseCodeLine(codeLineString).codeLine);

    return codeLines;
}

interface ParseCodeLineResult {
    codeLine: CodeLine;
    lastIndex: number;
}

function parseCodeLine(codeLineString: string, startIndex: number = 0): ParseCodeLineResult {
    const codeLine: CodeLine = {
        tokens: [],
    };

    let currentToken: Token | null = null;
    let index = startIndex;
    while(index < codeLineString.length) {
        const char = codeLineString[index];
        if (isWhiteSpace(char)) {
            if (currentToken) {
                // Save the current token to the list
                codeLine.tokens.push(currentToken);
                currentToken = null;
            }
        } else {
            if (char === '[') {
                // starting a list of tokens
                if (currentToken) {
                    // Save the current token to the list
                    codeLine.tokens.push(currentToken);
                }

                // create a token that is a list of sub-tokens
                const parseSubListResult = parseCodeLine(codeLineString, index + 1);
                codeLine.tokens.push({
                    token: parseSubListResult.codeLine.tokens,
                });
                index = parseSubListResult.lastIndex + 1;
            } else if (char === ']') {
                if (currentToken) {
                    // Save the current token to the list
                    codeLine.tokens.push(currentToken);
                }
                // stop processing and return results
                return {
                    codeLine: codeLine,
                    lastIndex: index,
                };
            } else {
                if (!currentToken) {
                    // staring a new token
                    currentToken = {
                        token: char,
                    };
                } else {
                    // add to existing token
                    currentToken.token += char;
                }
            }
        }
        index++;
    }
    if (currentToken) {
        codeLine.tokens.push(currentToken);
    }
    
    return {
        codeLine: codeLine,
        lastIndex: index - 1,
    };
}

function isWhiteSpace(char: string) {
    return char === ' ';
}