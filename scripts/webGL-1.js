(function(){
	'use strict';

	var GL, $canvas, program, shaders = {};
	const VERTEX = 'vertex', FRAGMENT = 'fragment';

	function init(){
		// Инициализация canvas и получение из него WebGL контекста
		$canvas = document.createElement('canvas');
		document.body.appendChild($canvas);
		GL = $canvas.getContext('webgl') || $canvas.getContext('experimental-webgl');

		// Устанавливаем размеры canvas и вьюпорт у WebGL
		var size = Math.min(window.innerWidth, window.innerHeight);
		$canvas.width = $canvas.height = size;
		GL.viewport(0, 0, size, size);

		shaders[VERTEX] = initShader('vertexShader', GL.VERTEX_SHADER);
		shaders[FRAGMENT] = initShader('fragmentShader', GL.FRAGMENT_SHADER);
		program = initProgram();

		var positionBuffer = createBuffer([0, 0, 0, 0.5, 1, 0, 1, 0, 0]),
			colorBuffer = createBuffer([1, 0, 0, 0, 1, 0, 0, 0, 1]);

		// Получим местоположение переменных в программе шейдеров
		var uPosition = GL.getUniformLocation(program, 'u_position');
		var aPosition = GL.getAttribLocation(program, 'a_position');
		var aColor = GL.getAttribLocation(program, 'a_color');

		// Укажем какую шейдерную программу мы намерены далее использовать
		GL.useProgram(program);

		// Передаем в uniform-переменную положение треугольника
		GL.uniform3fv(uPosition, [0, 0, 0]);

		// Связываем данные цветов
		GL.bindBuffer(GL.ARRAY_BUFFER, colorBuffer);
		GL.enableVertexAttribArray(aColor);
		// Вторым аргументом передаём размерность, RGB имеет 3 компоненты
		GL.vertexAttribPointer(aColor, 3, GL.FLOAT, false, 0, 0);

		// И вершин
		GL.bindBuffer(GL.ARRAY_BUFFER, positionBuffer);
		GL.enableVertexAttribArray(aPosition);
		GL.vertexAttribPointer(aPosition, 3, GL.FLOAT, false, 0, 0);

		// Очищаем сцену, закрашивая её в белый цвет
		GL.clearColor(1.0, 1.0, 1.0, 1.0);
		GL.clear(GL.COLOR_BUFFER_BIT);

		// Рисуем треугольник
		// Третьим аргументом передаём количество вершин геометрии
		GL.drawArrays(GL.TRIANGLES, 0, 3);
	}

	// Инициализация данных
	function createBuffer(data){
		var buffer = GL.createBuffer();
		GL.bindBuffer(GL.ARRAY_BUFFER, buffer);
		GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(data), GL.STATIC_DRAW);
		return buffer;
	}

	// Инициализация шейдеров
	function initShader(id, type){
		var shader = GL.createShader(type);
		GL.shaderSource(shader, document.getElementById(id).text);
		GL.compileShader(shader);

		if(!GL.getShaderParameter(shader, GL.COMPILE_STATUS))
			console.error('Shader "' + id + '" not init', GL.getShaderInfoLog(shader));

		return shader;
	}

	function initProgram(){
		var _program = GL.createProgram();
		GL.attachShader(_program, shaders[VERTEX]);
		GL.attachShader(_program, shaders[FRAGMENT]);
		GL.linkProgram(_program);

		if(!GL.getProgramParameter(_program, GL.LINK_STATUS)){
			console.error('Could not initialize shaders');
		}
		return _program;
	}

	document.addEventListener("DOMContentLoaded", init);
})();
