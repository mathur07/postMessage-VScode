'use strict';
import * as vscode from 'vscode';
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('catCoding.start', () => {
			const panel = vscode.window.createWebviewPanel(
				'catCoding',
				'Cat Coding',
				vscode.ViewColumn.One,
				{
					enableScripts: true
				}
			);

			panel.webview.html = getWebviewContent();
			// Handle messages from the webview
			panel.webview.onDidReceiveMessage(
				message => {
					switch (message.command) {
						case 'info':
							vscode.window.showInformationMessage(message.text);
							vscode.env.openExternal(vscode.Uri.parse(message.text));
							return;
					}
				},
				undefined,
				context.subscriptions
			);
		})
	);
}
function getWebviewContent() {
	return `
	<!DOCTYPE html>
	<html lang="en">
	
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<style>
			html,
			body {
				height: 100%;
				background-color: #96a2ad;
			}
	
			html {
				display: table;
				margin: auto;
			}
	
			body {
				display: table-cell;
				vertical-align: middle;
			}
		</style>
	</head>
	
	<body>
		<iframe id="frame" width="100%" height="100%" frameborder="0" src="http://127.0.0.1:5500/src/iframetest.html"
			sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"></iframe>

		<script>

		var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
		var eventer = window[eventMethod];
		var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
		const vscode = acquireVsCodeApi();

		// Listen to message from child window
		eventer(messageEvent,function(e) {
			console.log('parent received message!:  ',e.data);
			vscode.postMessage({
				command: 'info',
				text: e.data
			});  

		},false);

		</script>
	</body>
	
	</html>
	`;
}