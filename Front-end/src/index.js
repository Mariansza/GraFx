import StudioSDK from "@chili-publish/studio-sdk";
import { defaultJSON } from "./default-doc";
require("dotenv").config();
import axios from 'axios';



let authToken ;

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
    const documentJSON = (await SDK.document.getCurrentState()).data
    return JSON.stringify(documentJSON)
}

window.downloadDocument = async function() {
    const documentJSON = await getDocumentJSON();
    const documentData = "data:text/json;charset=utf-8," + encodeURIComponent(documentJSON);
    const downloadAnchor = document.getElementById('downloadAnchor');
    downloadAnchor.setAttribute("href", documentData);
    downloadAnchor.setAttribute("download", "document.json");
    downloadAnchor.click();
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

window.showImagePreview = async function () {
  const imagePreview = document.getElementById("image-preview");
  if (imagePreview.style.display === "block") {
    imagePreview.style.display = "none";
    return;
  }

  imagePreview.innerHTML = "";

  try {
    const data = await getImageData();

    const row = document.createElement("div");
    row.classList.add("row");

    // Create and append image elements to the preview popup
    data.data.forEach(async (image) => {
      const imageUrl = `https://internship-marian.chili-publish-sandbox.online/grafx/api/v1/environment/internship-marian/media/${image.id}/preview?previewType=medium`;

      // Fetch thumbnail image individually for each image
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
          row.appendChild(imgElement);
        } else {
          console.error(`Failed to fetch thumbnail for image: ${image.id}`);
        }
      } catch (error) {
        console.error(`Failed to fetch thumbnail for image: ${image.id}`, error);
      }
    });

    // Show the preview window
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



async function startApp() {
  try {
    await fetchAuthToken();
    initEditor(authToken);
  } catch (error) {
    console.error('Error:', error);
  }
}

  startApp();