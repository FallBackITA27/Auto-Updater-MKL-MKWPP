let chadsoftTrackNames=["Luigi Circuit","Moo Moo Meadows","Mushroom Gorge","Toad's Factory","Mario Circuit","Coconut Mall","DK Summit","Wario's Gold Mine","Daisy Circuit","Koopa Cape","Maple Treeway","Grumble Volcano","Dry Dry Ruins","Moonview Highway","Bowser's Castle","Rainbow Road","GCN Peach Beach","DS Yoshi Falls","SNES Ghost Valley 2","N64 Mario Raceway","N64 Sherbet Land","GBA Shy Guy Beach","DS Delfino Square","GCN Waluigi Stadium","DS Desert Hills","GBA Bowser Castle 3","N64 DK's Jungle Parkway","GCN Mario Circuit","SNES Mario Circuit 3","DS Peach Gardens","GCN DK Mountain","N64 Bowser's Castle"];
let mkwppTrackNames=["Luigi Circuit","Moo Moo Meadows","Mushroom Gorge","Toad's Factory","Mario Circuit","Coconut Mall","DK's Snowboard Cross","Wario's Gold Mine","Daisy Circuit","Koopa Cape","Maple Treeway","Grumble Volcano","Dry Dry Ruins","Moonview Highway","Bowser's Castle","Rainbow Road","GCN Peach Beach","DS Yoshi Falls","SNES Ghost Valley 2","N64 Mario Raceway","N64 Sherbet Land","GBA Shy Guy Beach","DS Delfino Square","GCN Waluigi Stadium","DS Desert Hills","GBA Bowser Castle 3","N64 DK's Jungle Parkway","GCN Mario Circuit","SNES Mario Circuit 3","DS Peach Gardens","GCN DK Mountain","N64 Bowser's Castle"];
let mklTrackNames=["Luigi Circuit","Moo Moo Meadows","Mushroom Gorge","Toad's Factory","Mario Circuit","Coconut Mall","DK's Snowboard Cross","Wario's Gold Mine","Daisy Circuit","Koopa Cape","Maple Treeway","Grumble Volcano","Dry Dry Ruins","Moonview Highway","Bowser's Castle","Rainbow Road","GCN Peach Beach","DS Yoshi Falls","SNES Ghost Valley 2","N64 Mario Raceway","N64 Sherbet Land","GBA Shy Guy Beach","DS Delfino Square","GCN Waluigi Stadium","DS Desert Hills","GBA Bowser Castle 3","N64 DK's Jungle Parkway","GCN Mario Circuit","SNES Mario Circuit 3","DS Peach Gardens","GCN DK Mountain","N64 Bowser's Castle"];
let mkwppTrackAbbr=["LC","MMM","MG","TF","MC","CM","DKSC","WGM","DC","KC","MT","GV","DDR","MH","BC","RR","rPB","rYF","rGV2","rMR","rSL","rSGB","rDS","rWS","rDH","rBC3","rDKJP","rMC","rMC3","rPG","rDKM","rBC"];
let cdCategories=[['0'],['0'],['2','0','1'],['2','0'],['0','1'],['2','0','1'],['0'],['0','1'],['0'],['0','1'],['0','1'],['2','0','1'],['0'],['0'],['2','0'],['0','1'],['0','1'],['0'],['0','1'],['0'],['0','1'],['0','1'],['0'],['0','1'],['2','0'],['2','0'],['2','0','1'],['2','0'],['0'],['0','1'],['2','0'],['2','1']];
let cdCategoriesTranslated=[['Normal'],['Normal'],['Normal','Shortcut','Glitch'],['Normal','Shortcut'],['Normal','Glitch'],['Normal','Shortcut','Glitch'],['Normal'],['Normal','Glitch'],['Normal'],['Normal','Glitch'],['Normal','Glitch'],['Normal','Shortcut','Glitch'],['Normal'],['Normal'],['Normal','Shortcut'],['Normal','Glitch'],['Normal','Glitch'],['Normal'],['Normal','Glitch'],['Normal'],['Normal','Glitch'],['Normal','Glitch'],['Normal'],['Normal','Glitch'],['Normal','Shortcut'],['Normal','Shortcut'],['Normal','Shortcut','Glitch'],['Normal','Shortcut'],['Normal'],['Normal','Glitch'],['Normal','Shortcut'],['Normal','Glitch']];
let cdCatstoMKWPP={"Normal":"nosc","Shortcut":"","Glitch":""};
let cdCatstoMKL={"Normal":"mkw_nonsc_world","Shortcut":"mkw_sc_world","Glitch":"mkw_altsc_world"};
async function sleep(milliseconds){const date=Date.now();let currentDate=null;do{currentDate=Date.now();}while(currentDate-date<milliseconds);}
function convertTimeToMS(timeString){let mins=parseInt(timeString.split(":")[0])*60000;let secandms=parseInt(timeString.split(":")[1].replace(".",""));return(mins)+secandms};function convertMSToTime(milliseconds){let minutes=Math.trunc(milliseconds/60/1000).toString();let seconds=Math.trunc(milliseconds/1000%60).toString();let ms=(milliseconds%1000).toString();return minutes.padStart(2,0)+":"+seconds.padStart(2,0)+"."+ms.padStart(3,0);};
async function grabTimesFromMKWPP(){
    let noscTable;
    let scTable;
    for (let i of document.getElementsByTagName("table")) {
        if (i.getAttribute("class")==="c") scTable = i.getElementsByTagName("tbody")[0];
        if (i.getAttribute("class")==="k") noscTable = i.getElementsByTagName("tbody")[0];
    }
    let outJSON = {}
    for (let category of [noscTable,scTable]) {
        let catRows = category.getElementsByTagName("tr");
        for (let i = 1; i < catRows.length; i+=2){
            if (catRows[i].getElementsByTagName("a")[1].innerHTML === "NT") continue;
            let trackName = mkwppTrackAbbr[mkwppTrackNames.indexOf(catRows[i].getElementsByTagName("a")[0].innerHTML)];
            if (trackName===undefined) continue;
            if (category === noscTable) outJSON[trackName] = {"Normal":{"finishTimeinMS":convertTimeToMS(catRows[i].getElementsByTagName("a")[1].innerHTML.replace("\'",":").replace("\"","."))}};
            if (category === scTable) {
                if (outJSON[trackName]===undefined)outJSON[trackName]={};
                let finishTimeinMS = convertTimeToMS(catRows[i].getElementsByTagName("a")[1].innerHTML.replace("\'",":").replace("\"","."));
                if (outJSON[trackName]["Normal"]["finishTimeinMS"]===finishTimeinMS) continue;
                let categoryName;
                if (cdCategoriesTranslated[mkwppTrackAbbr.indexOf(trackName)].includes("Glitch")) categoryName = "Glitch";
                else categoryName = "Shortcut";
                outJSON[trackName][categoryName] = {};
                outJSON[trackName][categoryName]["finishTimeinMS"] = finishTimeinMS;
            }
        }
    }
    return outJSON;
}
async function grabTimesFromChadsoft(){
    let playersChadsoft = await chrome.storage.local.get(["chadsoftSavedPlayerLink"]).then(r=>r.chadsoftSavedPlayerLink);
    if (playersChadsoft === undefined) {
        alert(chrome.i18n.getMessage("noChadErr"));
        return;
    }
    let rqurl = "https://tt.chadsoft.co.uk/players/" + playersChadsoft + ".json?times=pb";
    let outJSON = {};
    await fetch(rqurl).then(res=>res.json()).then(data=>{
        for (let i = 0; i < data.ghosts.length; i++){
            let ghost = data.ghosts[i];
            if (!chadsoftTrackNames.includes(ghost["trackName"])) continue;
            if (ghost["200cc"]) continue;
            let currTrack = mkwppTrackAbbr[chadsoftTrackNames.indexOf(ghost["trackName"])];
            let categoryName = cdCategoriesTranslated[chadsoftTrackNames.indexOf(ghost["trackName"])][cdCategories[chadsoftTrackNames.indexOf(ghost["trackName"])].indexOf(ghost._links.leaderboard.href.split("/")[ghost._links.leaderboard.href.split("/").length-1].split(".")[0].substring(1))];
            if (outJSON[currTrack]===undefined) outJSON[currTrack] = {};
            outJSON[currTrack][categoryName] = {
                "cdRunLink":"https://chadsoft.co.uk/time-trials"+ghost["href"].replace(".rkg",".html"),
                "finishTime":ghost.finishTimeSimple,
                "finishTimeinMS":convertTimeToMS(ghost.finishTimeSimple),
            };
        }
    });
    return outJSON;
}
async function grabTimesFromMKL(url){
    let outJSON = {};
    await fetch(url).then(r=>r.text()).then(htmltxt=>{
        let parser = new DOMParser();
	    let doc = parser.parseFromString(htmltxt, 'text/html');
        let boards = doc.getElementsByClassName("panel centered");
        for (let j of [1,2,0]){
            let currentBoard = boards[j].getElementsByTagName("tbody")[0];
            let rows = currentBoard.getElementsByTagName("tr");
            for (let i = 0; i<rows.length; i++){
                let row = rows[i];
                if (row.getAttribute("class")==="header") continue;
                let trackName = row.getElementsByTagName("td")[1].getElementsByTagName("a")[0].innerHTML;
                let tmpmkwppTrackAbbr = mkwppTrackAbbr[mklTrackNames.indexOf(trackName)];
                let finishTime;
                if (row.getElementsByTagName("td")[2].getElementsByTagName("a").length>0) finishTime = row.getElementsByTagName("td")[2].getElementsByTagName("a")[0].innerHTML.split("&")[0];
                else finishTime = row.getElementsByTagName("td")[2].innerHTML.split("&")[0];
                if (finishTime === "—") continue;
                if (outJSON[tmpmkwppTrackAbbr] === undefined) outJSON[tmpmkwppTrackAbbr] = {};
                let cat;
                if (finishTime.includes("°")) cat = cdCategoriesTranslated[mklTrackNames.indexOf(trackName)][cdCategoriesTranslated[mklTrackNames.indexOf(trackName)].length-1];
                else cat = "Normal";
                if (j === 2) cat = "Shortcut";
                if (!finishTime.includes(":")) finishTime = "00:" + finishTime;
                outJSON[tmpmkwppTrackAbbr][cat] = {};
                outJSON[tmpmkwppTrackAbbr][cat]["finishTimeinMS"] = convertTimeToMS(finishTime);
            }
        }
    });
    return outJSON;
}
async function grabTimesFromMKLsubmitted(url){
    let outJSON = {};
    await fetch(url).then(r=>r.text()).then(htmltxt=>{
        let parser = new DOMParser();
	    let doc = parser.parseFromString(htmltxt, 'text/html');
        let submittedTimes = Array.from(doc.getElementsByClassName("centered")[1].getElementsByClassName("panel centered inline_box")).map(r=>r.getElementsByTagName("td")[1]).filter(r=>r.getElementsByTagName("span")[0].innerHTML.split(" ")[0]==="MKW");
        for (time of submittedTimes){
            let trackName = mkwppTrackAbbr[mklTrackNames.indexOf(time.innerHTML.split("<br>")[1].trim())];
            if (outJSON[trackName]===undefined) outJSON[trackName] = {};
            let category = time.getElementsByTagName("span")[0].innerHTML.split(" ")[1];
            if (category === "Non-SC") category = "Normal";
            else if (category === "Alt-SC") category = "Shortcut";
            else category = cdCategoriesTranslated[mkwppTrackAbbr.indexOf(trackName)][cdCategoriesTranslated[mkwppTrackAbbr.indexOf(trackName)].length-1];
            if (outJSON[trackName][category]!==undefined) continue;
            let finishTime = time.getElementsByTagName("b")[0].innerHTML.trim();
            if (!finishTime.includes(":")) finishTime = "00:" + finishTime;
            outJSON[trackName][category] = {"finishTimeinMS":convertTimeToMS(finishTime)};
        }
    });
    return outJSON;
}
async function compareTimesJSON(cdJSON,siteJSON,mode){
    let outJSON = {};
    for (let i of Object.keys(cdJSON)){
        if (!Object.keys(siteJSON).includes(i)) {
            if (mode = "mkl") outJSON[i] = cdJSON[i];
            else outJSON[i] = cdJSON[i];
        }
        else for (let cat of Object.keys(cdJSON[i])){
            if (siteJSON[i][cat] === undefined) {
                if (outJSON[i]===undefined) outJSON[i]={};
                outJSON[i][cat] = {};
                if (mode = "mkl") outJSON[i][cat] = cdJSON[i][cat];
                else outJSON[i][cat] = cdJSON[i][cat];
            }
            else if (cat === "Normal") if (cdJSON[i][cat]["finishTimeinMS"]<siteJSON[i][cat]["finishTimeinMS"]) {
                if (outJSON[i]===undefined) outJSON[i] = {};
                if (mode = "mkl") outJSON[i][cat] = cdJSON[i][cat];
                else outJSON[i][cat] = cdJSON[i][cat];
            }
            else if (cat === "Shortcut") {
                if (mode === "mkwpp") {
                    if(Object.keys(cdJSON[i]).includes("Glitch")&&cdJSON[i]["Glitch"]["finishTimeinMS"]<cdJSON[i][cat]["finishTimeinMS"])continue;
                    else if(cdJSON[i][cat]["finishTimeinMS"]<siteJSON[i][cat]["finishTimeinMS"]) {
                        if (outJSON[i]===undefined) outJSON[i] = {};
                        outJSON[i][cat] = cdJSON[i][cat];
                    }
                } else if (mode = "mkl") if (cdJSON[i][cat]["finishTimeinMS"]<siteJSON[i][cat]["finishTimeinMS"]) outJSON[i][cat] = cdJSON[i][cat];
            }
            else if (cat === "Glitch") {
                if (mode === "mkwpp") {
                    if(Object.keys(cdJSON[i]).includes("Shortcut")&&cdJSON[i]["Shortcut"]["finishTimeinMS"]<cdJSON[i][cat]["finishTimeinMS"])continue;
                    else if(cdJSON[i][cat]["finishTimeinMS"]<siteJSON[i][cat]["finishTimeinMS"]) {
                        if (outJSON[i]===undefined) outJSON[i] = {};
                        outJSON[i][cat] = cdJSON[i][cat];
                    }
                } else if (mode = "mkl") if (cdJSON[i][cat]["finishTimeinMS"]<siteJSON[i][cat]["finishTimeinMS"]) outJSON[i][cat] = cdJSON[i][cat];
            }
        }
    }
    return outJSON;
}
async function saveChadsoftLink(url){
    let player = url.split("/")[5]+"/"+url.split("/")[6].split(".")[0];
    chrome.storage.local.set({chadsoftSavedPlayerLink:player});
}
async function mkwppbehavior(url){
    if (!url.includes("?pid=")) return;
    let startScript = confirm(chrome.i18n.getMessage("startScriptMSG"));
    if (!startScript) return;
    let finalJSON = await compareTimesJSON(await grabTimesFromChadsoft(),await grabTimesFromMKWPP(),"mkwpp");
    let finaltext = `Date: ${new Date().toDateString().split(" ").splice(1).join(" ")}\nPlayer: ${document.getElementsByClassName("profr")[0].innerHTML}\n\n`
    for (let i of Object.keys(finalJSON)){
        for (let j of Object.keys(finalJSON[i])){
            if (j!=="Normal") finaltext += `${[i]}: ${finalJSON[i][j]["finishTime"].substring(1)}\n`
            if (j==="Normal") {
                if (!cdCategoriesTranslated[mkwppTrackAbbr.indexOf(i)].includes("Glitch")&&!cdCategoriesTranslated[mkwppTrackAbbr.indexOf(i)].includes("Shortcut")) finaltext += `${[i]}: ${finalJSON[i][j]["finishTime"].substring(1)}\n`
                if (cdCategoriesTranslated[mkwppTrackAbbr.indexOf(i)].includes("Glitch")||cdCategoriesTranslated[mkwppTrackAbbr.indexOf(i)].includes("Shortcut")) finaltext += `${[i]} nosc: ${finalJSON[i][j]["finishTime"].substring(1)}\n`
            }
        }
    }
    console.log(finaltext);
    // await navigator.clipboard.writeText(finaltext)
}
async function mklbehavior(url){
    if (!url.includes("submit")) return;
    let startScript = confirm(chrome.i18n.getMessage("startScriptMSG"));
    if (!startScript) return;

    let mklMKWprofile;
    for (let i of document.getElementById("navigation_user").getElementsByTagName("a")){
        if (i.innerHTML === "MKW Profile") mklMKWprofile = i.href;
    }
    let finalJSON = await compareTimesJSON(compareTimesJSON(await grabTimesFromChadsoft(),await grabTimesFromMKLsubmitted("https://www.mkleaderboards.com/my_submissions"),"mkl"),await grabTimesFromMKL(mklMKWprofile),"mkl");
    console.log(finalJSON)
    setInterval(async()=>{
        console.log("executed")
        if (!["mkw_nonsc_world","mkw_sc_world","mkw_altsc_world"].includes(document.getElementById("category").value)) return;
        let category;
        if (document.getElementById("category").value === "mkw_nonsc_world") category = "Normal";
        else if (document.getElementById("category").value === "mkw_altsc_world") category = "Shortcut";
        else category = "Jolly";
        let inputs = Array.from(document.getElementsByTagName("input")).filter(r=>r.name.includes("score")||r.name.includes("ghost"));
        let trackNames = inputs.map(r=>mkwppTrackAbbr[mklTrackNames.indexOf(r.parentElement.getElementsByTagName("b")[0].innerHTML)]);
        if (trackNames.includes(undefined)) return;
        for (let i = 0; i < inputs.length; i+=2){
            let trackName = trackNames[i];
            if (!Object.keys(finalJSON).includes(trackName)) continue;
            let tempcat = category;
            if (tempcat === "Jolly") {
                if (Object.keys(finalJSON[trackName]).includes("Glitch")) tempcat = "Glitch";
                else if (Object.keys(finalJSON[trackName]).includes("Shortcut")) tempcat = "Shortcut";
                else continue;
            }
            if (!Object.keys(finalJSON[trackName]).includes(tempcat)) continue;
            let timeInsert = inputs[i];
            let ghostInsert = inputs[i+1];
            timeInsert.value = finalJSON[trackName][tempcat]["finishTime"].substring(1);
            ghostInsert.value = finalJSON[trackName][tempcat]["cdRunLink"];
        }
    },1000);
}
async function loadCorrectMKpage(url){
    console.log(url);
    if (typeof url !== "string") return "typeError";
    console.log("Script loaded");
    if (url.includes("mkleaderboards")) mklbehavior(url);
    if (url.includes("mariokart64.com")) mkwppbehavior(url);
    if (url.includes("chadsoft")) {
        if (url.includes("players")){
            let saveUrl = confirm(chrome.i18n.getMessage("saveChadURLConfirm"));
            if (saveUrl) saveChadsoftLink(url);
        }
    }
};
loadCorrectMKpage(window.location.href);