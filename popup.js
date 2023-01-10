function onload(){
    /* Grabs from localStorage (as the Popup is treated as a tab that is closed once you click off) the currently saved values and sets them on the input fields. */
    let playersChadsoft = localStorage.getItem("chadsoftSavedPlayerLink");
    if (playersChadsoft !== undefined) document.getElementsByClassName("ChadsoftInput")[0].setAttribute("value","https://chadsoft.co.uk/time-trials/players/"+playersChadsoft+".html");
    let mkwpp = localStorage.getItem("savedMKWPPacc");
    if (mkwpp !== undefined) document.getElementsByClassName("MKWPPinput")[0].setAttribute("value","https://www.mariokart64.com/mkw/profile.php?pid="+mkwpp);
    /* Translations */
    document.getElementsByTagName("title")[0].innerHTML = chrome.i18n.getMessage("manifestName");
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
    let index = url.split("/").indexOf("players"); /* Needed in case the url isn't exactly copied from the bar but rather is only a part. */
    let player = url.split("/")[index+1]+"/"+url.split("/")[index+2].split(".")[0];
    localStorage.setItem("chadsoftSavedPlayerLink",player);
}

async function saveMKWPPLink(){
    let url = document.getElementsByClassName("MKWPPinput")[0].value;
    if (url === undefined||url === "") return; /* For users that don't use the players' page */
    if (!url.includes("pid")||!url.includes("profile")||!url.includes(".php")||!url.includes("mkw")) {
        alert(chrome.i18n.getMessage("wrongMKWPPErr"));
        return;
    }
    localStorage.setItem("savedMKWPPacc",url.split("=")[1]);
}

async function lookForUpdates(mode = 0){
    /* Checks if the Manifest file uploaded to Github is the same version as the current file */
    let manifest = await fetch("https://raw.githubusercontent.com/FallBackITA27/Auto-Updater-MKL-MKWPP/main/manifest.json").then(r=>r.json());
    if (manifest.version !== "1.1.3") { // VERSION HERE (Comment for CTRL+F)
        let c = confirm(chrome.i18n.getMessage("updateFound"));
        if (c) window.open("https://github.com/FallBackITA27/Auto-Updater-MKL-MKWPP/","_blank").focus()
    }
    else if (mode===1) alert(chrome.i18n.getMessage("noUpdates"));
    localStorage.setItem("lastUpdateCheck",Date.now());
    return;
}

async function startMKWPPscript(){
    chrome.tabs.query({active: true, currentWindow: true}, async(tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id, {mode:"mkwpp",url:"https://www.mariokart64.com/mkw/profile.php?pid=" + localStorage.getItem("savedMKWPPacc"),cdUrl:localStorage.getItem("chadsoftSavedPlayerLink")})
    })
}
async function startMKLscript(){
    chrome.tabs.query({active: true, currentWindow: true}, async(tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id, {mode:"mkl",cdUrl:localStorage.getItem("chadsoftSavedPlayerLink")})
    })
}

onload();

document.getElementsByClassName("saveSett")[0].addEventListener("click",()=>{saveChadsoftLink();saveMKWPPLink()});
document.getElementsByClassName("startMKWPP")[0].addEventListener("click",async()=>{await startMKWPPscript()});
document.getElementsByClassName("startMKL")[0].addEventListener("click",async()=>{await startMKLscript()});
document.getElementsByClassName("updates")[0].addEventListener("click",async()=>{await lookForUpdates(1)});

if (localStorage.getItem("lastUpdateCheck")===undefined||localStorage.getItem("lastUpdateCheck")-Date.now()>86400) lookForUpdates();
