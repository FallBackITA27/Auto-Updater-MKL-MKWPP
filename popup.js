async function onload(){
    document.getElementsByTagName("title")[0].innerHTML = chrome.i18n.getMessage("manifestName");
    let playersChadsoft = await chrome.storage.local.get(["chadsoftSavedPlayerLink"]).then(r=>r.chadsoftSavedPlayerLink)
    if (playersChadsoft !== undefined) {
        document.getElementsByClassName("ChadsoftInput")[0].value = "https://chadsoft.co.uk/time-trials/players/" + playersChadsoft + ".html";
    }
    let mkwpp = await chrome.storage.local.get(["savedMKWPPacc"]).then(r=>r.savedMKWPPacc)
    if (mkwpp !== undefined) {
        document.getElementsByClassName("MKWPPinput")[0].value = "https://www.mariokart64.com/mkw/profile.php?pid=" + mkwpp;
    }
    /* Translations */
    document.getElementsByClassName("textInputs")[0].getElementsByTagName("div")[0].innerHTML = document.getElementsByClassName("textInputs")[0].getElementsByTagName("div")[0].innerHTML.replace("_",chrome.i18n.getMessage("popupSavedChadsoft"));
    document.getElementsByClassName("textInputs")[0].getElementsByTagName("div")[1].innerHTML = document.getElementsByClassName("textInputs")[0].getElementsByTagName("div")[1].innerHTML.replace("_",chrome.i18n.getMessage("popupSavedMKWPP"));
    document.getElementsByClassName("startMKWPP")[0].value = chrome.i18n.getMessage("popupSubmitMKWPP");
    document.getElementsByClassName("startMKL")[0].value = chrome.i18n.getMessage("popupSubmitMKL");
    document.getElementsByClassName("updates")[0].value = chrome.i18n.getMessage("popupUpdatesBtn");
    document.getElementsByClassName("saveSett")[0].value = chrome.i18n.getMessage("popupSaveSettings");
}

async function saveChadsoftLink(){
    let url = document.getElementsByClassName("ChadsoftInput")[0].value;
    if (!url.includes("players")||!url.includes("chadsoft.co.uk")||!url.includes(".html")||!url.includes("time-trials")) {
        alert(chrome.i18n.getMessage("wrongChadErr"));
        return;
    }
    let player = url.split("/")[5]+"/"+url.split("/")[6].split(".")[0];
    chrome.storage.local.set({chadsoftSavedPlayerLink:player});
}

async function saveMKWPPLink(){
    let url = document.getElementsByClassName("MKWPPinput")[0].value;
    if (!url.includes("pid")||!url.includes("profile")||!url.includes(".php")||!url.includes("mkw")) {
        alert(chrome.i18n.getMessage("wrongMKWPPErr"));
        return;
    } 
    chrome.storage.local.set({savedMKWPPacc:url.split("=")[1]});
}

async function lookForUpdates(){
    let manifest = await fetch("https://raw.githubusercontent.com/FallBackITA27/Auto-Updater-MKL-MKWPP/main/manifest.json").then(r=>r.json());
    if (manifest.version !== "1.0.1") {
        let c = confirm(chrome.i18n.getMessage("updateFound"));
        if (c) window.open("https://github.com/FallBackITA27/Auto-Updater-MKL-MKWPP/","_blank").focus()
    }
    else alert(chrome.i18n.getMessage("noUpdates"))
}

async function startMKWPPscript(){
    let url = "https://www.mariokart64.com/mkw/profile.php?pid=" + await chrome.storage.local.get(["savedMKWPPacc"]).then(r=>r.savedMKWPPacc);
    chrome.tabs.query({active: true, currentWindow: true}, async(tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id, {mode:"mkwpp",url:url})
    })
}

async function startMKLscript(){
    chrome.tabs.query({active: true, currentWindow: true}, async(tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id, {mode:"mkl"})
    })
}

onload();

document.getElementsByClassName("saveSett")[0].addEventListener("click",()=>{saveChadsoftLink();saveMKWPPLink()});
document.getElementsByClassName("startMKWPP")[0].addEventListener("click",async()=>{await startMKWPPscript()});
document.getElementsByClassName("startMKL")[0].addEventListener("click",async()=>{await startMKLscript()});
document.getElementsByClassName("updates")[0].addEventListener("click",async()=>{await lookForUpdates()});