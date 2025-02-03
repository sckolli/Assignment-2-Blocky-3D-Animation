let canvas, gl;
let a_Position, u_FragColor, u_ModelMatrix, u_GlobalRotateMatrix;
let g_seconds = 0, g_startTime = 0;
let g_globalAngle = 0, g_legAngle = 0, g_tailAngle = 0;
let g_animation = false;
let g_animationSpeed = 300;

class Dog {
  constructor() {
    this.colors = {
      body: [0.6, 0.4, 0.2, 1.0],
      legs: [0.3, 0.2, 0.1, 1.0],
      tail: [0.7, 0.5, 0.3, 1.0],
      nose: [0.1, 0.1, 0.1, 1.0]
    };
  }

  render(legAngle, tailAngle) {
    const body = new Cube();
    body.color = this.colors.body;
    body.matrix
      .translate(0, -0.25, 0)
      .scale(0.5, 0.5, 1.0);
    body.render();

    const head = new Cube();
    head.color = this.colors.body;
    head.matrix
      .translate(0, 0.25, 0.6)
      .scale(0.4, 0.4, 0.4);
    head.render();

    const nose = new Cube();
    nose.color = this.colors.nose;
    nose.matrix
      .translate(0, 0.15, 0.8)
      .scale(0.1, 0.1, 0.1);
    nose.render();

    this._renderLegs(legAngle);

    const tail = new Cube();
    tail.color = this.colors.tail;
    tail.matrix
      .translate(0, -0.1, -0.7)
      .rotate(tailAngle, 0, 1, 0)
      .scale(0.1, 0.1, 0.3);
    tail.render();
  }

  _renderLegs(angle) {
    const legPositions = [
      [0.2, -0.7, 0.4],
      [-0.2, -0.7, 0.4],
      [0.2, -0.7, -0.4],
      [-0.2, -0.7, -0.4]
    ];

    legPositions.forEach(pos => {
      const leg = new Cube();
      leg.color = this.colors.legs;
      leg.matrix
        .translate(pos[0], pos[1], pos[2])
        .rotate(angle, 1, 0, 0)
        .scale(0.1, 0.3, 0.1);
      leg.render();
    });
  }
}

function main() {
  canvas = document.getElementById('webgl');
  gl = canvas.getContext('webgl');
  if (!gl) {
    alert('WebGL unavailable');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.9, 0.9, 0.9, 1.0);

  const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    void main() {
      gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    }`;

  const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
      gl_FragColor = u_FragColor;
    }`;

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    alert('Shader error');
    return;
  }

  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');

  document.getElementById('globalRotateSlide').oninput = e => g_globalAngle = e.target.value;
  document.getElementById('legRotateSlide').oninput = e => g_legAngle = e.target.value;
  document.getElementById('tailRotateSlide').oninput = e => g_tailAngle = e.target.value;
  document.getElementById('animateOn').onclick = () => g_animation = true;
  document.getElementById('animateOff').onclick = () => g_animation = false;
  document.getElementById('speedInput').onchange = e => g_animationSpeed = parseInt(e.target.value);

  g_startTime = performance.now() / 1000;
  tick();
}

function tick() {
  g_seconds = performance.now() / 1000 - g_startTime;
  updateAnimation();
  renderAll();
  requestAnimationFrame(tick);
}

function updateAnimation() {
  if (g_animation) {
    const speedFactor = 1000 / g_animationSpeed * 0.3;
    g_legAngle = 25 * Math.sin(g_seconds * 1.2 * speedFactor);
    g_tailAngle = 20 * Math.sin(g_seconds * 1.5 * speedFactor);
    document.getElementById('legRotateSlide').value = g_legAngle;
    document.getElementById('tailRotateSlide').value = g_tailAngle;
  }
}

function renderAll() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  const globalRotMat = new Matrix4().setRotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  const dog = new Dog();
  dog.render(g_legAngle, g_tailAngle);
}