// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { runCode } from './logo/code-runner';

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
	context.subscriptions.push(
		vscode.commands.registerCommand('logo-for-vs-code.open', () => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			//vscode.window.showInformationMessage('Hello World from Logo For VS Code!');

			const activeTextEditor = vscode.window.activeTextEditor;
			
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
					{
						// Enable scripts in the webview
						enableScripts: true
					}
				);

				if (activeTextEditor) {
					currentPanel.webview.html = getWebviewContent();
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
		})
	);


	context.subscriptions.push(
		vscode.commands.registerCommand('logo-for-vs-code.run', () => {
			if (!currentPanel) {
				return;
			}
			const codeToRun = vscode.window.activeTextEditor?.document.getText() || '';
			runCode(codeToRun, (graphicsMessage) => {
				if (!currentPanel) {
					return;
				}
	
				currentPanel.webview.postMessage(graphicsMessage);
			});
		})
	);
}

// this method is called when your extension is deactivated
export function deactivate() { }

function getWebviewContent() {
	return `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Logo</title>
	</head>
  	<script>
	  	function initMessageHandler() {
			var canvas = document.getElementById('canvas');
			var ctx = null;
			if (canvas.getContext) {
				ctx = canvas.getContext('2d');
				console.log('got context');
			}
			window.addEventListener('message', event => {
				if (!ctx) return;

				const message = event.data; // The JSON data our extension sent
				switch (message.command) {
					case 'drawPoint':
						ctx.fillStyle = 'rgb(200, 0, 0)';
						ctx.fillRect(message.x, message.y, 5, 5);
						break;
				}
			});		  
		}
  	</script>
  	<body onload="initMessageHandler();">
  		<h1>Logo</h1>
  	  	<canvas id="canvas" width="150" height="150"></canvas>
  	</body>
</html>`;
}

