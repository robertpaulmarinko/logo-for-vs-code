// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "logo-for-vs-code" is now active!');

	// Track currently webview panel
	let currentPanel: vscode.WebviewPanel | undefined = undefined;	

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('logo-for-vs-code.logoRunner', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello World from Logo For VS Code!');

		const activeTextEditor = vscode.window.activeTextEditor;
		vscode.window.activeTextEditor?.document.getText();
		const columnToShowIn = activeTextEditor
			? vscode.ViewColumn.Two
			: vscode.ViewColumn.One;

		if (currentPanel) {
			// If we already have a panel, show it in the target column
			currentPanel.reveal(columnToShowIn);
		} else {
			// Otherwise, create a new panel
			currentPanel = vscode.window.createWebviewPanel(
				'logoRunner',
				'Logo Runner',
				columnToShowIn,
				{}
			);

			if (activeTextEditor) {
				currentPanel.webview.html = `<div>Logo</div><pre>${ activeTextEditor.document.getText() }</pre>`;
			} else {
				currentPanel.webview.html = "<div>Logo - no document</div>";
			}

			// Reset when the current panel is closed
			currentPanel.onDidDispose(
				() => {
					currentPanel = undefined;
				},
				null,
				context.subscriptions
			);
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
