const backGroundColor = '#000000';
const lineColor = '#ffffff';
const lineWidth = 15;

let currentX = 0;
let currentY = 0;
let previousY = 0;
let previousX = 0;

let canvas;
let context;

function prepareCanvas() {
  //console.log('Success!');
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');

  context.fillStyle = backGroundColor;
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  context.strokeStyle = lineColor;
  context.lineWidth = lineWidth;
  context.lineJoin = "round";

  let isPainting = false;

  document.addEventListener('mousedown', function(event) {
    //console.log('Mouse Pressed');
    isPainting = true;
    currentX = event.clientX - canvas.offsetLeft;
    currentY = event.clientY - canvas.offsetTop;

  });

  document.addEventListener('mousemove', function(event) {

    if (isPainting) {
      previousX = currentX;
      currentX = event.clientX - canvas.offsetLeft;

      previousY = currentY;
      currentY = event.clientY - canvas.offsetTop;

      draw();
    }
  });

  document.addEventListener('mouseup', function(event) {
    //console.log("Mouse Released");
    isPainting = false;

  });

  canvas.addEventListener('mouseleave', function(event) {
  //  console.log("Mouse Released");
    isPainting = false;

  });

  //Touch Events

  canvas.addEventListener('touchstart', function(event) {
    //console.log('Touch down');
    isPainting = true;
    currentX = event.touches[0] - canvas.offsetLeft;
    currentY = event.touches[0] - canvas.offsetTop;

  });

  canvas.addEventListener('touchend', function(event) {
    isPainting = false;
  });

  canvas.addEventListener('touchcancel', function(event) {
    isPainting = false;

  });

  canvas.addEventListener('touchmove', function(event) {

    if (isPainting) {
      previousX = currentX;
      currentX = event.touches[0].clientX - canvas.offsetLeft;

      previousY = currentY;
      currentY = event.touches[0].clientY - canvas.offsetTop;

      draw();
    }
  });

};

function draw() {
  context.beginPath();
  context.moveTo(previousX, previousY);
  context.lineTo(currentX, currentY);
  context.closePath();
  context.stroke();
}

function clearCanvas() {
  context = canvas.getContext('2d');

  currentX = 0;
  currentY = 0;
  previousY = 0;
  previousX = 0;

  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

}
