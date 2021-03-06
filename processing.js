var model;

async function loadModel() {
  model = await tf.loadGraphModel('TFJS/model.json');
};

function predictImage() {

  let image = cv.imread(canvas);
  cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0);
  cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);

  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  // You can try more different parameters
  cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

  let cnt = contours.get(0);
  let rect = cv.boundingRect(cnt);
  image = image.roi(rect);

  let height = image.rows;
  let width = image.cols;

  if (height < width) {
    height =20;
    const scaleFactor = image.rows/ height;
    width = Math.round(image.cols / scaleFactor);
  } else {
    width = 20;
    const scaleFactor = image.cols/width;
    height = Math.round(image.rows/scaleFactor);
  }

  let newSize = new cv.Size(width,height);
  cv.resize(image,image,newSize,0,0,cv.INTER_AREA);

  const left = Math.ceil(4 + (20 - width)/2);
  const right = Math.floor(4 + (20 - width)/2);
  const top = Math.ceil(4 + (20 - height)/2);
  const bottom = Math.floor(4 + (20 - height)/2);

  const BLACK = new cv.Scalar(0,0,0,0);

  cv.copyMakeBorder (image,image,top,bottom,left,right,cv.BORDER_CONSTANT,BLACK);


// Center of Mass
  cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
  cnt = contours.get(0);
  const moments = cv.moments(cnt,false);

  const cx = moments.m10/moments.m00;
  const cy = moments.m01/moments.m00;
//  console.log(`M00=${moments.m00}, cx=${cx}, cy=${cy}`);

  const xShift = Math.round(image.cols/2.0 - cx);
  const yShift = Math.round(image.rows/2.0 - cy);

  newSize = new cv.Size(image.cols,image.rows);
  const M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, xShift, 0, 1, yShift]);
  cv.warpAffine(image, image, M, newSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, BLACK);


  let pixelValues  = image.data;
  //console.log(`pixelValues: ${pixelValues}`);

  pixelValues = Float32Array.from(pixelValues);

  pixelValues = pixelValues.map(function(item){
    return item/255.0;
  });

//  console.log(`scaled array: ${pixelValues}`);

  const X = tf.tensor([pixelValues]);
  //console.log(`Shape of tensor ${X.shape}`);
  //console.log(`dtype of tensor ${X.dtype}`);

  const result = model.predict(X);
  result.print();



  //console.log(tf.memory());

  const output = result.dataSync()[0];





  //cleanup
  image.delete();
  contours.delete();
  cnt.delete();
  hierarchy.delete();
  M.delete();
  X.dispose();
  result.dispose();



  return output;
}
