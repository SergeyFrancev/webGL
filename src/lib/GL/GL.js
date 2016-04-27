export class GL {
	constructor(canvasElement){
		this.GL = GL.initWebGL(canvasElement);
		this.viewPort = [canvasElement.width, canvasElement.height];
		this.clearScene();
	}

	set viewPort(size){
		this.GL.viewport(0, 0, size[0], size[1]);
	}

	clearScene(){
		// установить в качестве цвета очистки буфера цвета черный, полная непрозрачность
		this.GL.clearColor(0.0, 0.0, 0.0, 1.0);
		// включает использование буфера глубины
		this.GL.enable(this.GL.DEPTH_TEST);
		// определяет работу буфера глубины: более ближние объекты перекрывают дальние
		this.GL.depthFunc(this.GL.LEQUAL);
		// очистить буфер цвета и буфер глубины.
		this.GL.clear(this.GL.COLOR_BUFFER_BIT|this.GL.DEPTH_BUFFER_BIT);
	}

	/**
	 * @param vertexShader {Shader}
	 * @param fragmentShader {Shader}
	 */
	initProgram(vertexShader, fragmentShader){
		let shaderProgram = this.GL.createProgram();
		this.GL.attachShader(shaderProgram, vertexShader.shader);
		this.GL.attachShader(shaderProgram, fragmentShader.shader);
		this.GL.linkProgram(shaderProgram);

		// Если создать шейдерную программу не удалось, вывести предупреждение
		if (!this.GL.getProgramParameter(shaderProgram, this.GL.LINK_STATUS)) {
			alert("Unable to initialize the shader program.");
		}
		this.GL.useProgram(shaderProgram);
		let vertexPositionAttribute = this.GL.getAttribLocation(shaderProgram, "aVertexPosition");
		this.GL.enableVertexAttribArray(vertexPositionAttribute);
	}

	static initWebGL(canvasElement){
		// Попытаться получить стандартный контекст. Если не получится, попробовать получить экспериментальный.
		return canvasElement.getContext("webgl") || canvasElement.getContext("experimental-webgl");
	}
}
