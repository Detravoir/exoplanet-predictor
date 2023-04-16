import { DecisionTree } from './libraries/decisiontree.js';
import { VegaTree } from './libraries/vegatree.js';
// import Papa from 'papaparse';


//data inladen
const csvFile = "data/exoplanet.csv";
//waarop getraind wordt
const trainingLabel = 'planet_type';
//ignored comlumns

//name,distance,stellar_magnitude,planet_type,discovery_year,mass_multiplier,mass_wrt,radius_multiplier,radius_wrt,orbital_radius,orbital_period,eccentricity,detection_method
// mass_multiplier  radius_multiplier   orbital_radius
const ignored = ['name', 'distance','stellar_magnitude','discovery_year','mass_wrt','radius_wrt','orbital_period', 'eccentricity', 'detection_method']
let amountCorrect = 0;
let totalAmount = 0;
let decisionTree;

function loadData() {
  Papa.parse(csvFile, {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: results => {console.log(results.data) 
        trainModel(results.data) }
  })
}

function trainModel(data) {
  //data rond shuffelen
  data.sort(() => (Math.random() - 0.5));
  //splits data in traindata en testdata
  let trainingData = data.slice(0, Math.floor(data.length * 0.8));
  let testingData = data.slice(Math.floor(data.length * 0.8) + 1);

console.log(testingData);

decisionTree = new DecisionTree({
  ignoredAttributes: ignored,
  trainingSet: trainingData,
  categoryAttr: trainingLabel
})

  
  // Model opslaan als JSON
  let json = decisionTree.stringify();
  console.log(json);

//   let blob = new Blob([json], {type: "application/json"});

// // // Create a download link for the Blob object
// let url = URL.createObjectURL(blob);
// let link = document.createElement("a");
// link.download = "model.json";
// link.href = url;

// // Trigger the download
// document.body.appendChild(link);
// link.click();
// document.body.removeChild(link);

  let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())
  predictAll(testingData)

  calculateAccuracy()
}

function predictAll(testingData){
  amountCorrect = 0
  totalAmount = testingData.length

  let actualPositive = 0
  let actualNegative = 0
  let predictedWrongPositive = 0
  let predictedWrongNegative = 0
  
  for (const planet of testingData) {
    let testDataNoLabel = Object.assign({}, planet)
    delete testDataNoLabel[trainingLabel]

    let prediction = decisionTree.predict(testDataNoLabel)

    if(prediction == planet[trainingLabel]) {
      amountCorrect++

      if(prediction == 0){
        actualNegative++
      }

      if(prediction == 1){
        actualPositive++
      }
    }
    if(prediction == 0 && planet[trainingLabel] == 1){
      console.log("predicted having planets correctly")
      predictedWrongNegative++
    }
    if(prediction == 1 && planet[trainingLabel] == 0){
      console.log("predicted no planets but was wrong")
      predictedWrongPositive++
    }
  }
  
  showMatrix(actualPositive,actualNegative,predictedWrongPositive,predictedWrongNegative)
}

function showMatrix(actualPositive,actualNegative,predictedWrongNegative,predictedWrongPositive){
    document.getElementById("total").innerHTML = totalAmount +" tested in total."
    document.getElementById("total-correct").innerHTML = amountCorrect +" predicted correctly!"

    document.getElementById("actual-d").innerHTML = actualPositive
    document.getElementById("actual-no-d").innerHTML = actualNegative
    document.getElementById("predicted-wrong-no-d").innerHTML = predictedWrongNegative
    document.getElementById("predicted-wrong-d").innerHTML = predictedWrongPositive
}

    function calculateAccuracy(){
        let accuracy = (amountCorrect / totalAmount) * 100
        console.log("Accuracy:" + accuracy)
        let accDiv = document.getElementById("accuracy")
        accDiv.innerHTML = `Accuracy: ${accuracy}`
}


loadData() 