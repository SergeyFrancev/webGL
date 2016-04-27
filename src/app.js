import {GL} from './lib/GL/GL';
import {Shader} from './lib/GL/Shader';

function startApp(){
	let $canvas = document.createElement('canvas');
	document.body.appendChild($canvas);
	$canvas.width = window.innerWidth - 20;
	$canvas.height = window.innerHeight - 20;
	let gl = new GL($canvas);
	var fragmentShader = new Shader(gl.GL, "shader-fs");
	var vertexShader = new Shader(gl.GL, "shader-vs");
	gl.initProgram(vertexShader, fragmentShader);
}

document.addEventListener("DOMContentLoaded", startApp);

