import { DecisionTree } from "./libraries/decisiontree.js";
import { VegaTree } from "./libraries/vegatree.js";

function addEventListenerToSubmitButton() {
    let mass_multiplier = document.getElementById("mass_multiplier");
    let radius_multiplier = document.getElementById("radius_multiplier");
    let eccentricity = document.getElementById("eccentricity");
    let submitBtn = document.getElementById("submit-button");
  
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!mass_multiplier.value || !radius_multiplier.value || !eccentricity.value) {
        alert("Please fill out all fields");
      } else {
        let planet = {
        mass_multiplier: mass_multiplier.value, 
        radius_multiplier: radius_multiplier.value, 
        eccentricity: eccentricity.value
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
  
  function modelLoaded(model, planet) {
    let decisionTree = new DecisionTree(model);
    let prediction = decisionTree.predict({
      mass_multiplier: planet.mass_multiplier,
      radius_multiplier: planet.radius_multiplier,
      eccentricity: planet.eccentricity
    });
    console.log("predicted: " + prediction);
  
    let userInput = document.getElementById("userInput");
    let value;
    if(prediction == 'Gas Giant'){
      value = 'It is a Gass Giant';
    } if (prediction == 'Super Earth') {
      value = 'This is a Super Earth';
    } if (prediction == 'Neptune-like'){
      value = 'This is a Neptune Like planet';
    }
    if (userInput !== null && prediction !== undefined) {
        userInput.innerText = `the computer thinks that ${value}`;
      }
      
    let visual = new VegaTree("#view", 900, 500, decisionTree.toJSON());
  }
    loadSavedModel();