
const TYPE_FRAGMENT = 'FRAGMENT';
const TYPE_VERTEX = 'VERTEX';

export class Shader{
	constructor(GL, elementId){
		let shaderScript = document.getElementById(elementId);
		if (!shaderScript)
			throw new Error("Shader element not exist");

		this._shader = null; this._type = undefined;

		if (shaderScript.type == "x-shader/x-fragment"){
			this._shader = GL.createShader(GL.FRAGMENT_SHADER);
			this._type = TYPE_FRAGMENT;
		}
		else if (shaderScript.type == "x-shader/x-vertex"){
			this._shader = GL.createShader(GL.VERTEX_SHADER);
			this._type = TYPE_VERTEX;
		}
		else
			throw new Error("Shader type is undefined");

		GL.shaderSource(this._shader, Shader._getCodeShader(shaderScript));
		// скомпилировать шейдерную программу
		GL.compileShader(this._shader);

		// Проверить успешное завершение компиляции
		if (!GL.getShaderParameter(this._shader, GL.COMPILE_STATUS))
			throw new Error("An error occurred compiling the shaders: " + GL.getShaderInfoLog(this._shader));
	}

	static get TYPE_FRAGMENT(){return TYPE_FRAGMENT};
	static get TYPE_VERTEX(){return TYPE_VERTEX};

	get type() {return this._type};
	get shader() {return this._shader};

	static _getCodeShader(shaderScript){
		let theSource = "";
		let currentChild = shaderScript.firstChild;
		while(currentChild) {
			if (currentChild.nodeType == currentChild.TEXT_NODE)
				theSource += currentChild.textContent;
			currentChild = currentChild.nextSibling;
		}

		return theSource;
	}
}