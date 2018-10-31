var VSHADER_SOURCE =
	'attribute vec4 a_Position;\n' +
	'attribute vec4 a_Color;\n' +
	'attribute vec4 a_Normal;\n' +
	'uniform mat4 u_MvpMatrix;\n' +
	'uniform mat4 u_NormalMatrix;\n' +
	'uniform vec3 u_LightColor;\n' +
	'uniform vec3 u_LightDirection;\n' +
	'uniform vec3 u_AmbientLight;\n' +
	'varying vec4 v_Color;\n' +
	'void main() {\n' +
	'   gl_Position = u_MvpMatrix*a_Position;\n' +
	'	vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
	'	float nDotL = max(dot(u_LightDirection, normal),0.0);\n' +
	'	vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;\n' +
	'	vec3 ambient = u_AmbientLight * a_Color.rgb;\n'+
	'   v_Color = vec4(diffuse+ambient, a_Color.a);\n' +
	'}\n';

var FSHADER_SOURCE =
	'#ifdef GL_ES\n' +
	'precision mediump float;\n' +
	'#endif\n' +
	'varying vec4 v_Color;\n' +
	'void main(){\n' +
	'   gl_FragColor=v_Color;\n' +
	'}\n';

function main() {
	var canvas = document.getElementById('webgl');

	var gl = getWebGLContext(canvas);
	if (!gl) {
		console.log('Failed to get rendering context for WebGL');
		return;
	}

	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('Failed to initialize shaders');
		return;
	}

	var n = initVertexBuffers(gl);
	if (n < 0) {
		console.log('Failed to set the positions of the verticesColors');
	}

	gl.clearColor(0, 0, 0, 1);
	gl.enable(gl.DEPTH_TEST);

	var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
	var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
	var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
	var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
	var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');

	if (!u_MvpMatrix || !u_LightColor || !u_LightDirection || !u_AmbientLight || !u_NormalMatrix) {
		console.log('Failed to get the storage location of matrices.');
		return;
	}


	gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
	var lightDirection = new Vector3([0.5, 3.0, 4.0]);
	lightDirection.normalize(); 
	gl.uniform3fv(u_LightDirection, lightDirection.elements);
	gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

    var modelMatrix = new Matrix4();
    var MvpMatrix = new Matrix4();
    var normalMatrix = new Matrix4();

    modelMatrix.setTranslate(0, 0.9, 0);
    modelMatrix.rotate(90, 0, 0, 1);
    MvpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
    MvpMatrix.lookAt(modelMatrix);
	gl.uniformMatrix4fv(u_MvpMatrix, false, MvpMatrix.elements);

    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();

    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
	var vertices = new Float32Array([
		1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
		1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
		1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
		-1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
		-1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
		1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0
	]);

	var colors = new Float32Array([
		1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,	
		1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,	
		1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,	
		1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,	
		1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,	
		1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0	
	]);

	var normals = new Float32Array([
		0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,  
		1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 
		0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,  
		-1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 
		0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,  
		0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0


	]);

	var indices = new Uint8Array([
		0, 1, 2, 0, 2, 3,
		4, 5, 6, 4, 6, 7,
		8, 9, 10, 8, 10, 11,
		12, 13, 14, 12, 14, 15,
		16, 17, 18, 16, 18, 19,
		20, 21, 22, 20, 22, 23
	]);

	if (!initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) { return -1; }
	if (!initArrayBuffer(gl, 'a_Color', colors, 3, gl.FLOAT)) { return -1; }
	if (!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) { return -1 };

	var indexBuffer = gl.createBuffer();
	if (!indexBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
	return indices.length;
}

function initArrayBuffer(gl, attribute, data, num, type) {
	var buffer = gl.createBuffer();
	if (!buffer) {
		console.log('Failed to create the buffer object');
		return false;
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	var a_attribute = gl.getAttribLocation(gl.program, attribute);
	if (a_attribute < 0) {
		console.log('Failed to get the storage location of ' + attribute);
		return false;
	}
	gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
	gl.enableVertexAttribArray(a_attribute);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	return true;
}