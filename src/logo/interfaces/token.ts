/**
 * Represents one token in a line of code
 */
export interface Token {
    token: string | Token[];
}

/**
 * Represents one line of code
 */
export interface CodeLine {
    tokens: Token[];
}