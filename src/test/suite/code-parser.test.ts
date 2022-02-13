import * as assert from 'assert';
import { parseCode } from '../../logo/code-parser';
import { Token } from '../../logo/interfaces/token';

suite('code-parser', () => {
	test('code is empty string should return empty array', () => {
        const code = '';
        const codeLines = parseCode(code);
        assert.strictEqual(codeLines.length, 0);
	});

	test('code contains one line with one word should return one line with a single token', () => {
        const code = 'forward';
        const codeLines = parseCode(code);
        assert.strictEqual(codeLines.length, 1, 'Should have 1 code line');
        assert.strictEqual(codeLines[0].tokens.length, 1, 'Should have 1 token');
        assert.strictEqual(codeLines[0].tokens[0].token, 'forward');
	});

	test('code contains one line with two words should return one line with two tokens', () => {
        const code = 'forward 100';
        const codeLines = parseCode(code);
        assert.strictEqual(codeLines.length, 1, 'Should have 1 code line');
        assert.strictEqual(codeLines[0].tokens.length, 2, 'Should have 2 tokens');
        assert.strictEqual(codeLines[0].tokens[0].token, 'forward');
        assert.strictEqual(codeLines[0].tokens[1].token, '100');
	});

    test('code contains multiple lines should return each line', () => {
        const code = `forward 100
        right 90
        stop`;
        const codeLines = parseCode(code);
        assert.strictEqual(codeLines.length, 3, 'Should have 3 code line');
        assert.strictEqual(codeLines[0].tokens.length, 2, 'Should have 2 tokens');
        assert.strictEqual(codeLines[0].tokens[0].token, 'forward');
        assert.strictEqual(codeLines[0].tokens[1].token, '100');

        assert.strictEqual(codeLines[1].tokens.length, 2, 'Should have 2 tokens');
        assert.strictEqual(codeLines[1].tokens[0].token, 'right');
        assert.strictEqual(codeLines[1].tokens[1].token, '90');

        assert.strictEqual(codeLines[2].tokens.length, 1, 'Should have 1 tokens');
        assert.strictEqual(codeLines[2].tokens[0].token, 'stop');
    });

	test('code contains extra white spaces should ignore white spaces', () => {
        const code = '  forward    100  ';
        const codeLines = parseCode(code);
        assert.strictEqual(codeLines.length, 1, 'Should have 1 code line');
        assert.strictEqual(codeLines[0].tokens.length, 2, 'Should have 2 tokens');
        assert.strictEqual(codeLines[0].tokens[0].token, 'forward');
        assert.strictEqual(codeLines[0].tokens[1].token, '100');
	});

    test('code contains one list should return list of items', () => {
        const code = 'repeat 4 [forward 100 right 90]';
        const codeLines = parseCode(code);

        assert.strictEqual(codeLines.length, 1, 'Should have 1 code line');
        assert.strictEqual(codeLines[0].tokens.length, 3, 'Should have 3 tokens');
        assert.strictEqual(codeLines[0].tokens[0].token, 'repeat');
        assert.strictEqual(codeLines[0].tokens[1].token, '4');
        assert.strictEqual(Array.isArray(codeLines[0].tokens[2].token), true, '3rd token is an array');
        assert.strictEqual(codeLines[0].tokens[2].token.length, 4, 'nested token contains 4 tokens');
        assert.strictEqual((codeLines[0].tokens[2].token[0] as Token).token, 'forward', '1st nested token is correct');
        assert.strictEqual((codeLines[0].tokens[2].token[1] as Token).token, '100', '2nd nested token is correct');
        assert.strictEqual((codeLines[0].tokens[2].token[2] as Token).token, 'right', '3rd nested token is correct');
        assert.strictEqual((codeLines[0].tokens[2].token[3] as Token).token, '90', '4th nested token is correct');
	});

    test('code contains two nested lists should return nested lists', () => {
        const code = 'repeat 4 [repeat 2 [ right 90]]';
        const codeLines = parseCode(code);

        assert.strictEqual(codeLines.length, 1, 'Should have 1 code line');
        assert.strictEqual(codeLines[0].tokens.length, 3, 'Should have 3 tokens');
        assert.strictEqual(codeLines[0].tokens[0].token, 'repeat');
        assert.strictEqual(codeLines[0].tokens[1].token, '4');

        assert.strictEqual(Array.isArray(codeLines[0].tokens[2].token), true, '3rd token is an array');
        assert.strictEqual(codeLines[0].tokens[2].token.length, 3, '1st nested token contains 4 tokens');
        assert.strictEqual((codeLines[0].tokens[2].token[0] as Token).token, 'repeat', '1st nested token is correct');
        assert.strictEqual((codeLines[0].tokens[2].token[1] as Token).token, '2', '2nd nested token is correct');

        assert.strictEqual(Array.isArray((codeLines[0].tokens[2].token[2] as Token).token), true, '3rd nested token is an array');
        assert.strictEqual((codeLines[0].tokens[2].token[2] as Token).token.length, 2, '3rd tested token has 2 tokens');
        assert.strictEqual(((codeLines[0].tokens[2].token[2] as Token).token[0] as Token).token, 'right', '3rd tested token, 1st token is correct');
        assert.strictEqual(((codeLines[0].tokens[2].token[2] as Token).token[1] as Token).token, '90', '3rd tested token, 2nd token is correct');
	});

});
