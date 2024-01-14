import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "javatools" is now active!');

	let disposable = vscode.commands.registerCommand(
		"javatools.builderClass",
		() => {
			const editor = vscode.window.activeTextEditor;

			if (editor) {

				const builder = crearBuilder(editor?.document.getText());

				editor?.edit((editBuilder) => {
					editBuilder.insert(
						new vscode.Position(editor.document.lineCount + 1, 0), builder);
				});

				vscode.commands.executeCommand('editor.action.formatDocument');
			} else {

			}
		}
	);

	let disposable1 = vscode.commands.registerCommand(
		"javatools.builderSelection",
		() => {
			vscode.window.showInformationMessage("Hello World from javatools!");
		}
	);

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable1);
}

function crearBuilder(clase: string) {

	const nombreClase = extraerNombreClase(clase);

	const propiedades: string[] = [];
	const atributos: string[] = [];
	const funciones: string[] = [];

	const regexAtributosClase = new RegExp('(?:public|private)\\s(?<type>\\w+)\\s(?<parameter>\\w+);', 'gm');

	let m;

	while ((m = regexAtributosClase.exec(clase)) !== null) {
		if (m.index === regexAtributosClase.lastIndex) {
			regexAtributosClase.lastIndex++;
		}

		console.log(m);

		m.forEach((match, groupIndex) => {
			console.log(`Found match, group ${groupIndex}: ${match}`);

		});

		propiedades.push(m[2]);

		atributos.push(crearAtributoBuilder(m));

		funciones.push(crearFuncionBuilder(m));
	}

	return `${crearConstructor(nombreClase, propiedades)} ${crearMetodoBuilder()}public static class Builder { ${atributos} ${funciones} }`;

}

function extraerNombreClase(texto: string) {

	let nombreClase = '';

	const regexNombreClase = new RegExp('(public)\\s(class|interface|enum)\\s(?<clase>\\w+)\\s{', 'gsi');

	let m;

	console.log(texto);

	while ((m = regexNombreClase.exec(texto)) !== null) {

		if (m.index === regexNombreClase.lastIndex) {
			regexNombreClase.lastIndex++;
		}

		console.log(m);

		nombreClase = m[3];

		console.log(nombreClase);

		m.forEach((match, groupIndex) => {
			console.log(`Found match, group ${groupIndex}: ${match}`);
		});
	}

	return nombreClase;

}

function crearConstructor(nombreClase: string, propiedades: string[]) {

	const atributos: string[] = [];

	propiedades.forEach((propiedad) => {
		atributos.push(`this.${propiedad} = ${propiedad};`);

	});

	console.log(nombreClase);

	return `private ${nombreClase}(Builder builder) { ${atributos} }`;
}

function crearMetodoBuilder() {
	return "public static Builder builder() { return new Builder();}";
}

function crearAtributoBuilder(m: string[]) {
	return `private ${m[1]} ${m[2]};`;
}

function crearFuncionBuilder(m: string[]) {
	return `public Builder ${m[2]}(${m[1]} ${m[2]}){this.${m[2]} = this.${m[2]}; return this;}`;
}

export function deactivate() { }
