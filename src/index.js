import StudioSDK from "@chili-publish/studio-sdk";
import { defaultJSON } from "./default-doc";


async function initEditor() {
    const SDK = new StudioSDK({
      editorId: "studio-editor"
    });
  
    SDK.loadEditor();
    window.SDK = SDK;
  
    await loadDocument(defaultJSON);
}


async function loadDocument(docJSON) {
    if (docJSON) {
        await window.SDK.document.load(docJSON);
    } else {
        await window.SDK.document.load("{}");
    }

}

async function getDocumentJSON() {
    const documentJSON = (await SDK.document.getCurrentState()).data
    return JSON.stringify(documentJSON)
}

window.download = async function() {
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

function toggleDropdown() {
    const dropdownContent = document.querySelector('.dropdown-content');
    dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
}

function toggleDropdownPointer() {
    const pointerDropdown = document.querySelector('#pointer-dropdown');
    pointerDropdown.style.display = (pointerDropdown.style.display === 'block') ? 'none' : 'block';
}


window.toggleDropdownPointer = toggleDropdownPointer;
window.toggleDropdown = toggleDropdown;


initEditor();
