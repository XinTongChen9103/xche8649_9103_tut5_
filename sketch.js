let x;
let y;
let rad;
let firstframe = true;

let pos=[];//store the central position of the pattern
let spaceBetween=0;
let isRotate=[];//use an array to record rotate direction of every circle respectively
let isMouseClick=false;//before mouseClick rotation will not happend.

function setup() {
  createCanvas(600, 600);
  background(0, 91, 130);
  rad = 70;
  spaceBetween = rad * 3;
  makeDate();
}

function draw() {
  
  background(0, 91, 130);
  translate(width / 2, height / 2);
  rotate(-PI / 12);
  
  frameRate(20);
  getMouseClickID();
  
  for(let i=0;i<pos.length;i++)
  { 
    drawPattern(pos[i].x, pos[i].y, rad, isRotate[i]);//input the rotetion when drawing the pattern
  }

}

//record the date of every circle
function makeDate()
{
   for (let j = -height; j < height; j += spaceBetween) {
    let offsetX = 0;
    
    // determine if the row odd or even
    if ((j + height) / spaceBetween % 2 == 1) {
      offsetX = rad; //If it's an odd row, move to the right by one radius of a circle.
    }

    for (let i = -width + offsetX; i < width; i += spaceBetween) 
    {
      pos.push(createVector(i, j)); 
      isRotate.push(false);//keep all the circle rotate status anticlockwise
    }
    
  }

}



function getMouseClickID()
{
  if(mouseIsPressed)
  {
    for(let i=0;i<pos.length;i++)
    {
       if(dist(mouseX-width / 2,mouseY-height/2,pos[i].x,pos[i].y) < rad)//if the mouseclick in the range of pos[i], change the direction of rotate.
         isRotate[i]=!isRotate[i]; 
         isMouseClick=true;//if the presses the mouse is pressed the first prerequisite 
       }
    }
  }
 



function drawPattern(centerX, centerY, rad,isRotate) {
  
  push();
  translate(centerX, centerY);
  centerX=0;
  centerY=0;
  /*dafault of isRotate is false, the first click on one of the circle will make this prerequisite true,
   all the circle except the one which is clicked (its isRotate value has been changed in getMouseClickID function)thus begin to anticlockwise rotate*/
  if(isMouseClick){
    if(isRotate)
    {
      rotate(frameCount/20);
      scale(1.2);
    }
    else
    {
     rotate(-frameCount/20); 
    }
  }

  drawOuterRing(centerX, centerY, rad * 1.35);

  let outerLayerChoice = random(1);
  if (outerLayerChoice < 0.5) {
    drawTriangleStripLayer(centerX, centerY, rad * 1.25, 80);
  } else {
    drawDottedLayer(centerX, centerY, rad * 0.65, 8, 20);
  }

  let middleLayerChoice = random(1);
  if (middleLayerChoice < 0.5) {
    drawDottedLayer(centerX, centerY, rad * 0.5, 8, 20);
  } else {
    drawRingLayer(centerX, centerY, rad * 0.55, 4, rad * 0.05);
  }
  drawCore(centerX, centerY, rad);

  drawRandomLine(centerX, centerY, rad * 1.5);
  pop();
}


function getRandomPastelColor() {
  let r = random(50, 255);
  let g = random(50, 255);
  let b = random(50, 255);
  return color(r, g, b);
}


function drawCore(x, y, rad) {
  noStroke(); 
  for (let i = 0; i < 5; i++) {
    let col = getRandomPastelColor();  //use random color
    fill(col);
    let currentRad = rad * (1 - i * 0.2);  // Gradually reduce the radius, starting from the larger ones to avoid overlap.
    ellipse(x, y, currentRad);
  }
}


function drawDottedLayer(x, y, rad, numLayers, dotsPerLayer) {
  let layerOffset = rad / numLayers;  // the distance between every layer
  let angleOffset;
  let dotColor = getRandomPastelColor(); 
  
  // calculate the radius of outerlayer
  let outerLayerRad = rad + (numLayers - 1) * layerOffset;

  fill(getRandomPastelColor());
  ellipse(x, y, outerLayerRad * 2);
  noStroke();
  for (let i = 1; i <= numLayers; i++) {
    let currentRad = rad + (i - 1) * layerOffset;  // radius of current layer
    angleOffset = TWO_PI / (dotsPerLayer * i);  // Angle offset for each point in the current layer.
    let currentDotSize = rad * 0.08;  //Control the size of the dots.
    for (let j = 0; j < TWO_PI; j += angleOffset) {
      let dotX = x + currentRad * cos(j);
      let dotY = y + currentRad * sin(j);
      fill(dotColor);
      ellipse(dotX, dotY, currentDotSize);  
    }
  }
}

//draw ring in middle layer
function drawRingLayer(x, y, rad, numLayers, ringWidth) {
  let layerOffset = rad / numLayers;  // distance between every layer
  
  noStroke();

  for (let i = numLayers; i >= 1; i--) {  //Note the change in loop order here.
    let currentRad = rad + (i - 1) * layerOffset;  //  radius of current layer
    
    fill(getRandomPastelColor()); 
    ellipse(x, y, currentRad * 2, currentRad * 2);  
  }
}

//draw the trangle strip pattern
function drawTriangleStripLayer(x, y, rad, numTriangles) {
  let angleOffset = TWO_PI / numTriangles;  // Angle offset for each triangle.
  
  
  fill(getRandomPastelColor());
  noStroke();
  ellipse(x, y, rad * 2);
  
  let innerRad = rad * 0.8;  // setting the radius of innercircle
  strokeWeight(1);
  stroke(getRandomPastelColor());

  for (let i = 0; i < TWO_PI; i += angleOffset) {
    noFill();
    
    // the centre of the circle
    let centerX = x;
    let centerY = y;
    
    // the first vertex of the trangle, start from the innercircle
    let firstX = centerX + innerRad * cos(i);
    let firstY = centerY + innerRad * sin(i);
    
    // the second vertex of the trangle, extend to outercircle
    let secondX = centerX + rad * cos(i);
    let secondY = centerY + rad * sin(i);
    
    // the third  vertex of the trangle, back to the innercircle
    let thirdX = centerX + innerRad * cos(i + angleOffset);
    let thirdY = centerY + innerRad * sin(i + angleOffset);
    
    beginShape();
    vertex(firstX, firstY);    
    vertex(secondX, secondY);    
    vertex(thirdX, thirdY);      
    endShape(CLOSE);
  }
}


//draw the outerRing surrunding the main circle
function drawOuterRing(centerX, centerY, maxRadius) {
  let angleOffset = radians(15); // setting the interval between every element

  for (let angle = 0; angle < TWO_PI; angle += angleOffset) {
    //draw the shortline between 
    let nextAngle = angle + angleOffset;
    let startX = centerX + maxRadius * cos(angle);
    let startY = centerY + maxRadius * sin(angle);
    let endX = centerX + maxRadius * cos(nextAngle);
    let endY = centerY + maxRadius * sin(nextAngle);
    stroke(getRandomPastelColor());
    strokeWeight(1.5);
    line(startX, startY, endX, endY);
    // draw the circles with white,black and orange
    drawColoredRing(centerX + maxRadius * cos(angle), centerY + maxRadius * sin(angle), maxRadius * 0.05);

    // calculate the position of the ellipse
    let ellipseX = centerX + maxRadius * cos(angle + angleOffset / 2);
    let ellipseY = centerY + maxRadius * sin(angle + angleOffset / 2);
    
    fill(getRandomPastelColor()); 
    noStroke();
    ellipse(ellipseX, ellipseY, maxRadius * 0.08, maxRadius * 0.06); // draw the small ellipses in different color
  }
}

function drawColoredRing(x, y, rad) {
  const colors = ['white', 'black', 'orange'];
  for (let i = 0; i < colors.length; i++) {
    fill(colors[i]);
    noStroke();
    ellipse(x, y, rad * (3 - i), rad * (3 - i));
  }
}

//draw the bezier
function drawRandomLine(x, y, rad) {
  noFill();
  stroke(getRandomPastelColor());
  strokeWeight(4);

  //let angle1 = random(TWO_PI);
  let angle1 = 30/30;
  
  let controlX1 = x + rad * 0.5 * cos(angle1);
  let controlY1 = y + rad * 0.5 * sin(angle1);
  let angle2 = angle1 + 1.4;
  let controlX2 = x + rad * 0.75 * cos(angle2);
  let controlY2 = y + rad * 0.75 * sin(angle2);
  let angle3 =angle2 +0.6;
  let endX = x + rad * cos(angle3);
  let endY = y + rad * sin(angle3);

  bezier(x, y, controlX1, controlY1, controlX2, controlY2, endX, endY);
}
