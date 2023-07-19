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


initEditor();
