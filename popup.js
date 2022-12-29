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
}

async function saveChadsoftLink(){
    let url = document.getElementsByClassName("ChadsoftInput")[0].value;
    if (!url.includes("players")||!url.includes("chadsoft.co.uk")||!url.includes(".html")||!url.includes("time-trials")) {
        alert("Not a valid Chadsoft link!");
        return;
    }
    let player = url.split("/")[5]+"/"+url.split("/")[6].split(".")[0];
    chrome.storage.local.set({chadsoftSavedPlayerLink:player});
}

async function saveMKWPPLink(){
    let url = document.getElementsByClassName("MKWPPinput")[0].value;
    if (!url.includes("pid")||!url.includes("profile")||!url.includes(".php")||!url.includes("mkw")) {
        alert("Not a valid MKWPP link!");
        return;
    } 
    chrome.storage.local.set({savedMKWPPacc:url.split("=")[1]});
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

onload().then(()=>{
    document.getElementsByClassName("saveSett")[0].addEventListener("click",()=>{saveChadsoftLink();saveMKWPPLink()});
    document.getElementsByClassName("startMKWPP")[0].addEventListener("click",async()=>{await startMKWPPscript()});
    document.getElementsByClassName("startMKL")[0].addEventListener("click",async()=>{await startMKLscript()});
});