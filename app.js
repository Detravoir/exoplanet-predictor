import { DecisionTree } from "./libraries/decisiontree.js";
import { VegaTree } from "./libraries/vegatree.js";

function addEventListenerToSubmitButton() {
    let mass_multiplier = document.getElementById("mass_multiplier");
    let radius_multiplier = document.getElementById("radius_multiplier");
    let orbital_radius = document.getElementById("orbital_radius");
    let submitBtn = document.getElementById("submit-button");
  
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!mass_multiplier.value || !radius_multiplier.value || !orbital_radius.value) {
        alert("Please fill out all fields");
      } else {
        let planet = {
        mass_multiplier: mass_multiplier.value, 
        radius_multiplier: radius_multiplier.value, 
        eccentricity: orbital_radius.value
      };
      loadSavedModel(planet);
      }
    });
  }
  
  addEventListenerToSubmitButton();
  
  function loadSavedModel(planet) {
    fetch("model/model.json")
      .then((response) => response.json())
      .then((model) => {
        modelLoaded(model, planet);
        console.log(model);
      });
  }
  
  function modelLoaded(model, patient) {
    let decisionTree = new DecisionTree(model);
    let prediction = decisionTree.predict(patient);

    let userInput = document.getElementById("userInput");
    let resultImage = document.getElementById("resultImage");
    
    let value;
    if(prediction == 'Gas Giant'){
      value = 'It is a Gas Giant';
      resultImage.src = "src/gas-giant.jpg"; // Replace with the actual image filename
    } else if (prediction == 'Super Earth') {
      value = 'This is a Super Earth';
      resultImage.src = "src/super-earth.jpg"; // Replace with the actual image filename
    } else if (prediction == 'Neptune-like'){
      value = 'This is a Neptune Like planet';
      resultImage.src = "src/neptune-like.jpg"; // Replace with the actual image filename
    }
    
    if (userInput !== null && prediction !== undefined) {
        userInput.innerText = `The computer thinks that ${value}`;
    }
      
    let visual = new VegaTree("#view", 900, 500, decisionTree.toJSON());
  }
    loadSavedModel();