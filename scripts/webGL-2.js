(function(){
	'use strict';

	var shaders = {};
	var GL, $canvas, program, shaders = {};
	const VERTEX = 'vertex', FRAGMENT = 'fragment', SPEED = 1000;

	function deg2rad(deg){
		return deg * (Math.PI/180);
	}

	function init(){
		// Инициализация $canvas и получение из него WebGL контекста
		var $canvas = document.createElement('canvas');
		document.body.appendChild($canvas);
		var GL = $canvas.getContext('webgl');

		// Устанавливаем размеры $canvas и вьюпорт у WebGL
		$canvas.width = window.innerWidth - 100;
		$canvas.height = window.innerHeight - 100;
		GL.viewport(0, 0, window.innerWidth - 100, window.innerHeight - 100);

		// Инициализация шейдеров
		shaders[VERTEX] = initShader('vertexShader', GL.VERTEX_SHADER);
		shaders[FRAGMENT] = initShader('fragmentShader', GL.FRAGMENT_SHADER);

		var program = initProgram();

		// Получим местоположение переменных в программе шейдеров
		var uCube = GL.getUniformLocation(program, 'u_cube');
		var uCamera = GL.getUniformLocation(program, 'u_camera');
		var aPosition = GL.getAttribLocation(program, 'a_position');
		var aColor = GL.getAttribLocation(program, 'a_color');

		var vertexBuffer = GL.createBuffer();
		var vertices = [
			// Передняя грань
			-1, -1, -1,
			1, -1, -1,
			-1, -1, 1,

			1, -1, 1,
			-1, -1, 1,
			1, -1, -1,

			// Задняя грань
			-1, 1, -1,
			-1, 1, 1,
			1, 1, -1,

			1, 1, 1,
			1, 1, -1,
			-1, 1, 1,

			// Нижняя грань
			-1, -1, -1,
			-1, 1, -1,
			1, -1, -1,

			1, 1, -1,
			1, -1, -1,
			-1, 1, -1,

			// Верхняя грань
			-1, -1, 1,
			1, -1, 1,
			-1, 1, 1,

			1, 1, 1,
			-1, 1, 1,
			1, -1, 1,

			// Левая грань
			-1, -1, -1,
			-1, -1, 1,
			-1, 1, -1,

			-1, 1, 1,
			-1, 1, -1,
			-1, -1, 1,

			// Правая грань
			1, -1, -1,
			1, 1, -1,
			1, -1, 1,

			1, 1, 1,
			1, -1, 1,
			1, 1, -1
		];
		GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer);
		GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertices), GL.STATIC_DRAW);

		var colorBuffer = GL.createBuffer();
		var colors = [
			// Передняя грань
			1, 0.5, 0.5,
			1, 0.5, 0.5,
			1, 0.5, 0.5,
			1, 0.5, 0.5,
			1, 0.5, 0.5,
			1, 0.5, 0.5,

			// Задняя грань
			1, 0.5, 0.5,
			1, 0.5, 0.5,
			1, 0.5, 0.5,
			1, 0.5, 0.5,
			1, 0.5, 0.5,
			1, 0.5, 0.5,

			// Нижняя грань
			0.5, 0.7, 1,
			0.5, 0.7, 1,
			0.5, 0.7, 1,
			0.5, 0.7, 1,
			0.5, 0.7, 1,
			0.5, 0.7, 1,

			// Верхняя грань
			0.5, 0.7, 1,
			0.5, 0.7, 1,
			0.5, 0.7, 1,
			0.5, 0.7, 1,
			0.5, 0.7, 1,
			0.5, 0.7, 1,

			// Левая грань
			0.3, 1, 0.3,
			0.3, 1, 0.3,
			0.3, 1, 0.3,
			0.3, 1, 0.3,
			0.3, 1, 0.3,
			0.3, 1, 0.3,

			// right face
			0.3, 1, 0.3,
			0.3, 1, 0.3,
			0.3, 1, 0.3,
			0.3, 1, 0.3,
			0.3, 1, 0.3,
			0.3, 1, 0.3
		];
		GL.bindBuffer(GL.ARRAY_BUFFER, colorBuffer);
		GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(colors), GL.STATIC_DRAW);

		var cameraMatrix = mat4.create();
		mat4.perspective(cameraMatrix, 0.785, window.innerWidth / window.innerHeight, 0.1, 1000);
		mat4.translate(cameraMatrix, cameraMatrix, [0, 0, -10]);

// Создадим единичную матрицу положения куба
		var cubeMatrix = mat4.create();

// Запомним время последней отрисовки кадра
		var lastRenderTime = Date.now();
		var lastRad = 0;
		mat4.translate(cubeMatrix, cubeMatrix, [0, 0, 1]);
		console.log(cubeMatrix);
		//mat4.translate(cubeMatrix, cubeMatrix, [1, 0, 0]);
		//console.log(cubeMatrix);

		function render(){
			// Запрашиваем рендеринг на следующий кадр
			requestAnimationFrame(render);

			// Получаем время прошедшее с прошлого кадра
			var time = Date.now();
			var dt = time - lastRenderTime;
			var modX = 2, modZ = 2, side = 0;

			// Вращаем куб относительно оси Y
			if(deg2rad(90) > lastRad){
				side = side % 4;
				switch(side){
					case 0:
						modZ = -2;
						break;
					case 1:
						modX = -2;
						break;
					case 2:
						modZ = 2;
						break;
					case 3:
						modX = 2;
						break;
				}
				lastRad = 0;
			}
				var ch = dt / SPEED;
				var chS = dt / (SPEED / 2);
				lastRad += ch;
				mat4.rotateY(cubeMatrix, cubeMatrix, chS);
				mat4.rotateZ(cubeMatrix, cubeMatrix, ch);
				//var cof = ((lastRad * 100)/deg2rad(90)/100).toFixed(2);
				//if(cof > 1)
				//	cof = 1;
				//var newPos = [cof,0,(1-cof).toFixed(2)];
				mat4.translate(cubeMatrix, cubeMatrix, [ch*modX, 0, ch*modZ]);
			// Вращаем куб относительно оси Z
			//mat4.rotateZ(cubeMatrix, cubeMatrix, 0);

			// Очищаем сцену, закрашивая её в белый цвет
			GL.clearColor(1.0, 1.0, 1.0, 1.0);
			GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

			// Включаем фильтр глубины
			GL.enable(GL.DEPTH_TEST);

			GL.useProgram(program);

			GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer);
			GL.enableVertexAttribArray(aPosition);
			GL.vertexAttribPointer(aPosition, 3, GL.FLOAT, false, 0, 0);

			GL.bindBuffer(GL.ARRAY_BUFFER, colorBuffer);
			GL.enableVertexAttribArray(aColor);
			GL.vertexAttribPointer(aColor, 3, GL.FLOAT, false, 0, 0);

			GL.uniformMatrix4fv(uCube, false, cubeMatrix);
			GL.uniformMatrix4fv(uCamera, false, cameraMatrix);

			GL.drawArrays(GL.TRIANGLES, 0, 36);

			lastRenderTime = time;
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

		render();
	}
	document.addEventListener("DOMContentLoaded", init);
})();
