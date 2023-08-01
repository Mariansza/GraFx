import StudioSDK from "@chili-publish/studio-sdk";
import { defaultJSON } from "./default-doc";
require("dotenv").config();

const authToken = process.env.AUTH_TOKEN ;

async function initEditor(authToken) {
    const SDK = new StudioSDK({
      editorId: "studio-editor"
    });
  
    SDK.loadEditor();
    window.SDK = SDK;
  
    await loadDocument(defaultJSON, authToken);
}




async function loadDocument(docJSON, authToken) {
    const environmentAPI = window.SDK.utils.createEnvironmentBaseURL({type: "production", environment: "GraFx-Training-ST22"})
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


// function to show the image preview popup
window.showImagePreview = async function () {
    const imagePreview = document.getElementById("image-preview");
    imagePreview.innerHTML = "";
  const apiUrl =
    "https://prdqanzos.chili-publish.online/grafx/api/v1/environment/GraFx-Training-ST22/media?limit=100&sortBy=name&sortOrder=asc";
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InIzTzViUFFqV2pBWjNsd1pLd1FSaSJ9.eyJodHRwczovL2NoaWxpLXB1Ymxpc2guY29tL2Vudmlyb25tZW50SWQiOiJhNGMwYWM0Yi1hZWJmLTQ3MTAtYjQ1NC1iZmNlMTk2ZTg0MmUiLCJpc3MiOiJodHRwczovL2xvZ2luLmNoaWxpZ3JhZnguY29tLyIsInN1YiI6Ik1zV1hKeVUxVFMycEliQXBYQ25aR2J5ZkxWT3VEa2xzQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2NoaWxpZ3JhZnguY29tIiwiaWF0IjoxNjkwNzg4Nzc4LCJleHAiOjE2OTA4NzUxNzgsImF6cCI6Ik1zV1hKeVUxVFMycEliQXBYQ25aR2J5ZkxWT3VEa2xzIiwic2NvcGUiOiJmb250Omxpc3QgZm9udDpyZWFkIG1lZGlhOmxpc3QgbWVkaWE6cmVhZCBteXByb2plY3Q6bGlzdCBteXByb2plY3Q6cmVhZCBvdXRwdXQ6YW5pbWF0ZWQgb3V0cHV0OnN0YXRpYyB0ZW1wbGF0ZV9jb2xsZWN0aW9uOmxpc3QgdGVtcGxhdGVfY29sbGVjdGlvbjpyZWFkIHRlbXBsYXRlOmxpc3QgdGVtcGxhdGU6cmVhZCIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.s55iABfbBpfu5uyNIGsrFZM_YV2WnvFaJaNIc6KPfOX8uSZJcLWzzSjgHzZ_k6WaBi_uP8ZOkBpno5HQyp8mttm1OqsWxZM_iGSKebwxkppNQ_hit_MzAePd-xOWU8WQG2Bq1nNA0wYwGQD5ItXL5bjhb1-fvyhv1f455CXECLaQ7z6RPOUGAuwu3hAMDrOju2J4KdVpcT0KwklkQbdjJFI6AYxVNAqU6D8PGXJINjTMYjt00zpMAu3h7FRiWjEKmSnkkDdTfDfgBeGEaEiIep-NDnasqmIGvG0APJ7wNjcc07NHUsv9T2JmCPZHPnjvcJ6Ueg651eTOKj9pWu5mgw",
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch image data.");
    return;
  }

  const data = await response.json();

  const row = document.createElement("div");
  row.classList.add("row");

  // Create and append image elements to the preview popup
  data.data.forEach(async (image) => {
    const imageUrl = `https://prdqanzos.chili-publish.online/grafx/api/v1/environment/GraFx-Training-ST22/media/${image.id}/preview/medium`;

    // Fetch thumbnail image individually for each image
    try {
      const thumbnailResponse = await fetch(imageUrl, {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization:
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InIzTzViUFFqV2pBWjNsd1pLd1FSaSJ9.eyJodHRwczovL2NoaWxpLXB1Ymxpc2guY29tL2Vudmlyb25tZW50SWQiOiJhNGMwYWM0Yi1hZWJmLTQ3MTAtYjQ1NC1iZmNlMTk2ZTg0MmUiLCJpc3MiOiJodHRwczovL2xvZ2luLmNoaWxpZ3JhZnguY29tLyIsInN1YiI6Ik1zV1hKeVUxVFMycEliQXBYQ25aR2J5ZkxWT3VEa2xzQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2NoaWxpZ3JhZnguY29tIiwiaWF0IjoxNjkwNzg4Nzc4LCJleHAiOjE2OTA4NzUxNzgsImF6cCI6Ik1zV1hKeVUxVFMycEliQXBYQ25aR2J5ZkxWT3VEa2xzIiwic2NvcGUiOiJmb250Omxpc3QgZm9udDpyZWFkIG1lZGlhOmxpc3QgbWVkaWE6cmVhZCBteXByb2plY3Q6bGlzdCBteXByb2plY3Q6cmVhZCBvdXRwdXQ6YW5pbWF0ZWQgb3V0cHV0OnN0YXRpYyB0ZW1wbGF0ZV9jb2xsZWN0aW9uOmxpc3QgdGVtcGxhdGVfY29sbGVjdGlvbjpyZWFkIHRlbXBsYXRlOmxpc3QgdGVtcGxhdGU6cmVhZCIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.s55iABfbBpfu5uyNIGsrFZM_YV2WnvFaJaNIc6KPfOX8uSZJcLWzzSjgHzZ_k6WaBi_uP8ZOkBpno5HQyp8mttm1OqsWxZM_iGSKebwxkppNQ_hit_MzAePd-xOWU8WQG2Bq1nNA0wYwGQD5ItXL5bjhb1-fvyhv1f455CXECLaQ7z6RPOUGAuwu3hAMDrOju2J4KdVpcT0KwklkQbdjJFI6AYxVNAqU6D8PGXJINjTMYjt00zpMAu3h7FRiWjEKmSnkkDdTfDfgBeGEaEiIep-NDnasqmIGvG0APJ7wNjcc07NHUsv9T2JmCPZHPnjvcJ6Ueg651eTOKj9pWu5mgw"
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
};

  

initEditor(authToken);