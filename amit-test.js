//define ml variables
let featureExtractor;
let classifier;
let video;
let loss;
let imagesOfFunnel = 0;
let imagesOfFrasco = 0;
let classificationResult;
let confidence = 0; 
let switchState = '';
let triggeredA = false; 
let triggeredB = false; 

//define funnel variables
let topFunnelPositionX;
let topFunnelPositionY; 
let topFunnelHeight;
let topFunnelWidth;
let bottomFunnelX1;
let bottomFunnelY1; 
let bottomFunnelX2;
let bottomFunnelY2; 
let bottomFunnelX3;
let bottomFunnelY3; 
let bottomFunnelX4;
let bottomFunnelY4; 
let funnelColor;

//define frasco variables
let frascoX1;
let frascoY1;
let frascoX2;
let frascoY2;
let frascoX3;
let frascoY3;
let frascoX4;
let frascoY4;
let frascoX5;
let frascoY5;
let frascoX6;
let frascoY6;
let frascoX7;
let frascoY7;
let frascoX8;
let frascoY8;
let frascoColor;

//define handler variables
let handlerPositionX;
let handlerPositionY; 
let handlerHeight;
let handlerWidth;
let handlerColor;
let handlerMovement = 1;
let handlerMaxWidth = 90;
let handlerMinWidth = 50;


function setup() {
  createCanvas(windowWidth, windowHeight);
  
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();
  // Extract the already learned features from MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
    // Create a new classifier using those features and give the video we want to use
  const options = { numLabels: 2 }; //Specify the number of classes/labels
  classifier = featureExtractor.classification(video, options);
  
  // set up the UI buttons
  setupButtons();
  textAlign(CENTER);
  textSize(64);
  fill(0,255,0);
  
  //setup funnel
  topFunnelWidth = windowWidth/25;
  topFunnelHeight =  windowHeight/4;
  topFunnelPositionX = windowWidth/2 - topFunnelWidth/2; //center
  topFunnelPositionY  = windowHeight/15;
  bottomFunnelX1= topFunnelPositionX +topFunnelWidth/3;
  bottomFunnelY1= topFunnelPositionY*4; 
  bottomFunnelX2= bottomFunnelX1 +topFunnelWidth/3;
  bottomFunnelY2= bottomFunnelY1; 
  bottomFunnelX3= bottomFunnelX2;
  bottomFunnelY3= bottomFunnelY1 *2; 
  bottomFunnelX4= bottomFunnelX1;
  bottomFunnelY4= bottomFunnelY3 -5; 
  funnelColor = color(92,193,204);
  
  //setup frasco
  frascoX1 = topFunnelPositionX -10;
  frascoY1 = bottomFunnelY4 +100;
  frascoX2 = frascoX1 +50;
  frascoY2 = frascoY1;
  frascoX3 = frascoX2 +20;
  frascoY3 = frascoY1 +60;
  frascoX4 = frascoX1+ ((frascoX2 - frascoX1) /2);
  frascoY4 = frascoY4 +10;
  frascoX5 = frascoX1 -20;
  frascoY5 = frascoY3;
  frascoColor = color(216,214,214);
  
  //setup handler
  handlerWidth = windowWidth/12;
  handlerHeight =  windowHeight/40;
  handlerPositionX = bottomFunnelX2 + 10
  handlerPositionY  = bottomFunnelY1 + (bottomFunnelY3 - bottomFunnelY1)/3;
  handlerColor = color(255,255,255);
  
}

function draw() {
   //If you want to show video image, uncomment the following line
   //image(video, 0, 0);
   if (switchState == "funnel") {
    fill(funnelColor);
    noStroke();
    //top funnel
    rect(topFunnelPositionX,topFunnelPositionY, topFunnelWidth, topFunnelHeight, 0, 0, 10, 10);
    //bottom funnel
    quad(bottomFunnelX1,bottomFunnelY1,bottomFunnelX2,bottomFunnelY2,bottomFunnelX3,bottomFunnelY3,bottomFunnelX4,bottomFunnelY4);
  
  } else if (switchState == "frasco") {
    fill(frascoColor);
    noStroke();
    beginShape();
     vertex(frascoX1, frascoY1);
     vertex(frascoX2, frascoY2);
     vertex(frascoX3, frascoY3);
     vertex(frascoX4, frascoY4);
     vertex(frascoX5, frascoY5);
    endShape(CLOSE);
    arc(frascoX4, frascoY5, 90, 35, 0, PI);
  }else if (switchState == "funnelAndFrasco") {
    fill(funnelColor);
    noStroke();
    //top funnel
    rect(topFunnelPositionX,topFunnelPositionY, topFunnelWidth, topFunnelHeight, 0, 0, 10, 10);
    //bottom funnel
    quad(bottomFunnelX1,bottomFunnelY1,bottomFunnelX2,bottomFunnelY2,bottomFunnelX3,bottomFunnelY3,bottomFunnelX4,bottomFunnelY4);
    
    fill(frascoColor);
    noStroke();
    beginShape();
     vertex(frascoX1, frascoY1);
     vertex(frascoX2, frascoY2);
     vertex(frascoX3, frascoY3);
     vertex(frascoX4, frascoY4);
     vertex(frascoX5, frascoY5);
    endShape(CLOSE);
    arc(frascoX4, frascoY5, 90, 35, 0, PI);
  
    //handler
    fill(handlerColor);
    strokeWeight(1);
    stroke(51);
    rect(handlerPositionX,handlerPositionY, handlerWidth, handlerHeight);
    
    if (handlerWidth >= handlerMaxWidth) {
      handlerMovement = -handlerMovement;
    }
    else if (handlerWidth <= handlerMinWidth) {
      handlerMovement = -handlerMovement;
    }

    handlerWidth = handlerWidth + handlerMovement;
  }

  
  //switch image based on gesture
  if(classificationResult == 'A' && triggeredA == false) {
   switchState = "funnel";
   triggeredA = true;
  }else if(classificationResult == "B"&& triggeredB == false){
   switchState = "frasco";
   triggeredB = true;
  }else if(triggeredA&&triggeredB){
   switchState = "funnelAndFrasco";
  }
  
  print('cState:'+switchState+',tA:'+triggeredA+',tB:'+triggeredB+',move:'+handlerMovement);
  
}


// A function to be called when the model has been loaded
function modelReady() {
  select('#modelStatus').html('Base Model (MobileNet) loaded!');
}

// A function to be called when the video has loaded
function videoReady() {
  select('#videoStatus').html('Video ready!');
}

// Classify the current frame.
function classify() {
  classifier.classify(getResults);
}

// A util function to create UI buttons
function setupButtons() {
  // When the A button is pressed, add the current frame
  // from the video with a label of "A" to the classifier
  buttonA = select('#ButtonA');
  buttonA.mousePressed(function() {
    classifier.addImage('A');
    select('#amountOfAImages').html(imagesOfFunnel++);
  });
  
  // When the B button is pressed, add the current frame
  // from the video with a label of "B" to the classifier
  buttonB = select('#ButtonB');
  buttonB.mousePressed(function() {
    classifier.addImage('B');
    select('#amountOfBImages').html(imagesOfFrasco++);
  });

  // Train Button
  train = select('#train');
  train.mousePressed(function() {
    classifier.train(function(lossValue) {
      if (lossValue) {
        loss = lossValue;
        select('#loss').html('Loss: ' + loss);
      } else {
        select('#loss').html('Done Training! Final Loss: ' + loss);
      }
    });
  });

  // Predict Button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(classify);
  
  // Save model
  saveBtn = select('#saveModel');
  saveBtn.mousePressed(function() {
    classifier.save();
  });

  // Load model
  loadBtn = select('#load');
  loadBtn.changed(function() {
    classifier.load(loadBtn.elt.files, function(){
      select('#modelStatus').html('Custom Model Loaded!');
    });
  });
}

// Show the results
function getResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }
  select('#result').html(result[0].label);
  select('#confidence').html(result[0].confidence);

  classificationResult = result[0].label;
  confidence = result[0].confidence;

  classify();
}