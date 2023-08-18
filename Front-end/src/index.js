import StudioSDK from "@chili-publish/studio-sdk";
import { defaultJSON } from "./default-doc";
require("dotenv").config();
import axios from 'axios';

let authToken;

let templateBody ;
let currentTemplateId;

async function fetchAuthToken() {
  try {
    const response = await fetch('http://localhost:3000/token');
    const data = await response.json();
    authToken = data.token;
  } catch (error) {
    console.error('Error:', error);
  }
}


async function initEditor(authToken) {
    const SDK = new StudioSDK({
      editorId: "studio-editor"
    });
  
    SDK.loadEditor();
    window.SDK = SDK;
  
    await loadDocument(defaultJSON, authToken);
}




async function loadDocument(docJSON, authToken) {
    const environmentAPI = window.SDK.utils.createEnvironmentBaseURL({type: "sandbox", environment: "internship-marian"})
    window.SDK.configuration.setValue("ENVIRONMENT_API", environmentAPI);

    if (docJSON) {
        await window.SDK.document.load(docJSON);
    } else {
        await window.SDK.document.load("{}");
    }

    if (authToken){
        await window.SDK.connector.configure('grafx-media', async function(configurator){
            await configurator.setChiliToken(authToken);
        });
        await window.SDK.connector.configure('grafx-font', async function(configurator){
            await configurator.setChiliToken(authToken);
        });
    }
}

async function getDocumentJSON() {
  const parsedData = (await SDK.document.getCurrentState()).data;
  return parsedData;
}



window.downloadDocument = async function() {
    const documentJSON = await getDocumentJSON();
    const documentData = "data:text/json;charset=utf-8," + encodeURIComponent(documentJSON);
    const downloadAnchor = document.getElementById('downloadAnchor');
    downloadAnchor.setAttribute("href", documentData);
    downloadAnchor.setAttribute("download", "document.json");
    downloadAnchor.click();
}



window.toggleDropdownFile = async function() {
  const downloadfile = document.querySelector('#file-dropdown');
  downloadfile.style.display = (downloadfile.style.display === 'block') ? 'none' : 'block';
}




window.setTool = async function(tool) {
    await window.SDK.tool.setTool(tool);
  }



window.toggleDropdown = async function() {
    const dropdownContent = document.querySelector('.dropdown-content');
    dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
}

window.toggleDropdownPointer = async function() {
    const pointerDropdown = document.querySelector('#pointer-dropdown');
    pointerDropdown.style.display = (pointerDropdown.style.display === 'block') ? 'none' : 'block';
}

window.toggleDropdownEdit = async function() {
    const editDropdown = document.querySelector('#edit-dropdown');
    editDropdown.style.display = (editDropdown.style.display === 'block') ? 'none' : 'block';
}

window.toggleDropdownImage = async function() {
    const imageDropdown = document.querySelector('#image-dropdown');
    imageDropdown.style.display = (imageDropdown.style.display === 'block') ? 'none' : 'block';
}

window.remove = async function() {
    const jsonString = (await window.SDK.frame.getSelected()).data;
    const jsonArray = JSON.parse(jsonString);
    const idAsString = jsonArray[0].id;
    await window.SDK.frame.remove(idAsString);
}

window.removeall = async function() {
    const jsonString = (await window.SDK.frame.getAll()).data;
    const jsonArray = JSON.parse(jsonString);

    for (const frame of jsonArray) {
        const idAsString = frame.id;
        await window.SDK.frame.remove(idAsString);
    }
} 



window.updateImage = async function() {
    const jsonString = (await window.SDK.frame.getSelected()).data;
    const jsonArray = JSON.parse(jsonString);
    const frameID = jsonArray[0].id;
    const inputField = await document.getElementById('inputField');
    const assetID = await inputField.value;
    await window.SDK.frame.setImageFromConnector(frameID, 'grafx-media', assetID);
    inputField.value = '';
    closePopup();
}

window.showPopup = async function() {
    const popup = await document.getElementById('popup');
    popup.style.display = 'block';
}

window.closePopup = async function() {
    const popup = await document.getElementById('popup');
    popup.style.display = 'none';
}


async function getImageData(){
  try {
    const response = await fetch('http://localhost:3000/get-image-data');
    return response.json();
  }
  catch (error) {
    console.error("Error fetching image data:", error);
  }

}

import axios from 'axios';


window.createImageExport = async function () {
    try {
        const apiUrl = "https://internship-marian.chili-publish-sandbox.online/grafx/api/v1/environment/internship-marian/output/image?outputType=png&layoutToExport=0&pixelRatio=1"
        const state = await (window.SDK.document.getCurrentState());
        const jsonData = JSON.parse(state.data);
        Response = await axios.post(apiUrl, jsonData,
            {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const taskId = Response.data.data.taskId;
        setTimeout(() => {
          downloadImage(taskId);
        }, 2000);
            

        

    } catch (error) {
        console.error(error);
    }
}

window.downloadImage = async function (taskId) {
  const apiUrl = `https://internship-marian.chili-publish-sandbox.online/grafx/api/v1/environment/internship-marian/output/tasks/${taskId}/download`;
  const response = await axios.get(apiUrl, {
    responseType: 'blob',
      headers: {
          accept: "*/*",
          Authorization: `Bearer ${authToken}`
      }
  });

  if (response.status === 200) {
    
    const blob = new Blob([response.data], { type: 'image/png' });

    
    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = "downloaded_image.png";
    downloadLink.textContent = "Download Image";
    downloadLink.style.display = "none";

    
    document.body.appendChild(downloadLink);

    
    downloadLink.click();

    
    window.URL.revokeObjectURL(downloadLink.href);
  
  } else {
      console.error("Failed to download image:", response.statusText);
  }
}




// Function to save a template 
window.saveTemplate = async function(){
    try{
      templateId = currentTemplateId;
      const apiUrl = `https://internship-marian.chili-publish-sandbox.online/grafx/api/v1/environment/internship-marian/templates/${templateId}`
      const state = await (window.SDK.document.getCurrentState());
      const jsonData = JSON.parse(state.data);
      await axios.put(apiUrl, jsonData, {
          headers:{
            'accept': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
      });

      const popup = document.getElementById('popup3');
      popup.style.display = 'block';
      setTimeout(() => {
        popup.style.display = 'none';
      }, 2500);
    } catch (error) {
      console.error("Error saving template:", error);
      throw error;
    }
  
}

async function downloadTemplate(templateId) {
  currentTemplateId = templateId;
  try{
    const url = `https://internship-marian.chili-publish-sandbox.online/grafx/api/v1/environment/internship-marian/templates/${templateId}/download`;
    const response = await axios.get(url, {
      headers:{
        accept: "*/*",
        Authorization : `Bearer ${authToken}`
      },
    });
    
    templateBody = await response.data;
    loadDocument(templateBody, authToken);
    const popup = document.getElementById('popup2');
    popup.style.display = 'block';
    const templatePreview = document.getElementById("template-preview");
    templatePreview.style.display = "none";
    

    
    setTimeout(() => {
      popup.style.display = 'none';
    }, 2500);
  } catch (error) {
    console.error("Error downloading template:", error);
    throw error;
  }
}

async function getTemplateData(){
  try {
    const response = await fetch('http://localhost:3000/get-template-data');
    return response.json();
  }
  catch (error) {
    console.error("Error fetching templates data:", error);
  }
}

//loading all templates previews
window.loadTemplatePreview = async function () {
  const templatePreview = document.getElementById("template-preview");
  const imagePreview = document.getElementById("image-preview");

  if (imagePreview.style.display === "block"){
    imagePreview.style.display = "none";
  }

  if (templatePreview.style.display === "flex") {
    templatePreview.style.display = "none";
    return;
  }
  templatePreview.innerHTML = "";

  try {
    const data = await getTemplateData();

    const row = document.createElement("div");
    row.classList.add("row");

    for (const template of data.data) {
      const templateContainer = document.createElement("div");
      templateContainer.classList.add("template-container");

      const imageUrl = `https://internship-marian.chili-publish-sandbox.online/grafx/api/v1/environment/internship-marian/templates/${template.id}/preview?previewType=thumbnail`;
      const thumbnailResponse = await fetch(imageUrl, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (thumbnailResponse.ok) {
        const blob = await thumbnailResponse.blob();
        const objectUrl = URL.createObjectURL(blob);
        const templateElement = document.createElement("div");
        templateElement.classList.add("template-preview-item");
        templateElement.style.backgroundImage = `url(${objectUrl})`;

        templateElement.setAttribute("data-template-id", template.id);
        templateContainer.appendChild(templateElement);

        const templateName = document.createElement("p");
        templateName.classList.add("template-name");
        templateName.textContent = template.name;

        templateElement.addEventListener("click", async () => {
          const templateId = template.id;
          await downloadTemplate(templateId);
        });

        
        templateContainer.appendChild(templateElement);
        templateContainer.appendChild(templateName);

        row.appendChild(templateContainer);

        
      } else {
        console.error(`Failed to fetch thumbnail for template: ${template.id}`);
      }
    }

    templatePreview.appendChild(row);
    templatePreview.style.display = "flex";
  } catch (error) {
    console.error("Error fetching template data:", error);
  }
};





// Loading all images previews
window.showImagePreview = async function () {
  const imagePreview = document.getElementById("image-preview");
  const templatePreview = document.getElementById("template-preview");
  
  if (templatePreview.style.display === "flex"){
    templatePreview.style.display = "none";
  }

  if (imagePreview.style.display === "block") {
    imagePreview.style.display = "none";
    return;
  }
  imagePreview.innerHTML = "";

  try {
    const data = await getImageData();

    // create a div to contain the image previews (the row)
    const row = document.createElement("div");
    row.classList.add("row");

    
    for (const image of data.data) {
      const imageUrl = `https://internship-marian.chili-publish-sandbox.online/grafx/api/v1/environment/internship-marian/media/${image.id}/preview?previewType=medium`;

      try {
        const thumbnailResponse = await fetch(imageUrl, {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${authToken}`,
          }
        });

        if (thumbnailResponse.ok) {
          const blob = await thumbnailResponse.blob();
          const objectUrl = URL.createObjectURL(blob);
          const imgElement = document.createElement("img");
          imgElement.src = objectUrl;
          imgElement.classList.add("preview-image");

          imgElement.setAttribute("data-image-id", image.id);

          // add drag and drop event listener to each image
          imgElement.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("image-id", image.id);
          });

          // add each div to the row
          row.appendChild(imgElement);
        } else {
          console.error(`Failed to fetch thumbnail for image: ${image.id}`);
        }
      } catch (error) {
        console.error(`Failed to fetch thumbnail for image: ${image.id}`, error);
      }
    }

    // add the row to the image preview container
    imagePreview.appendChild(row);
    imagePreview.style.display = "block";
  } catch (error) {
    console.error("Error fetching image data:", error);
  }
};

  

document.getElementById("preview-button").addEventListener("click", function () {
  const imagePreview = document.getElementById("image-preview");
  imagePreview.style.display = "none";
});


// get html elements
const dropdiv = document.getElementById("dropdiv");
const imagePreviewContainer = document.getElementById("image-preview");

function setdropdivSize(width, height) {
  dropdiv.style.width = width;
  dropdiv.style.height = height;
}

function handleDragStart(){
  setdropdivSize("100%", "100%");
  const dropdiv = document.getElementById("dropdiv");
  dropdiv.textContent = "Drag and drop an image here"; 
}

function handleDragEnd() {
  setdropdivSize("0%", "0%");
  const dropdiv = document.getElementById("dropdiv");
  dropdiv.textContent = "";
  
}

imagePreviewContainer.addEventListener("dragstart", () => {
  handleDragStart();
});

const handleImageDrop = async (event) => {
  event.preventDefault();
  const imageId = event.dataTransfer.getData("image-id");
  

  try {
    const SelectedTest = (await window.SDK.frame.getSelected()).data;
    
    if (SelectedTest === "[]") {
      window.SDK.frame.create("image", 100, 75, 100, 100)
      const jsonString = (await window.SDK.frame.getSelected()).data;
      const jsonArray = JSON.parse(jsonString);
      const frameID = jsonArray[0].id;
      await window.SDK.frame.setImageFromConnector(frameID, 'grafx-media', imageId);
      handleDragEnd();
    } else {
      const jsonString = (await window.SDK.frame.getSelected()).data;
      const jsonArray = JSON.parse(jsonString);
      const frameID = jsonArray[0].id;
      await window.SDK.frame.setImageFromConnector(frameID, 'grafx-media', imageId);
      handleDragEnd();
    }
  } catch (error) {
    console.error("Error adding image to frame:", error);
  }
};

const dropZone = document.getElementById("drop-zone"); 
dropZone.addEventListener("drop", handleImageDrop);
imagePreviewContainer.addEventListener("drop", handleDragEnd);

imagePreviewContainer.addEventListener("dragover", (event) => {
  event.preventDefault();
});

dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
});



async function startApp() {
  try {
    await fetchAuthToken();
    initEditor(authToken);
  } catch (error) {
    console.error('Error:', error);
  }
}

startApp();

