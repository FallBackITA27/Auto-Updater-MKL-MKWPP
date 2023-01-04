let chadsoftTrackNames=["Luigi Circuit","Moo Moo Meadows","Mushroom Gorge","Toad's Factory","Mario Circuit","Coconut Mall","DK Summit","Wario's Gold Mine","Daisy Circuit","Koopa Cape","Maple Treeway","Grumble Volcano","Dry Dry Ruins","Moonview Highway","Bowser's Castle","Rainbow Road","GCN Peach Beach","DS Yoshi Falls","SNES Ghost Valley 2","N64 Mario Raceway","N64 Sherbet Land","GBA Shy Guy Beach","DS Delfino Square","GCN Waluigi Stadium","DS Desert Hills","GBA Bowser Castle 3","N64 DK's Jungle Parkway","GCN Mario Circuit","SNES Mario Circuit 3","DS Peach Gardens","GCN DK Mountain","N64 Bowser's Castle"];
let mkwppTrackNames=["Luigi Circuit","Moo Moo Meadows","Mushroom Gorge","Toad's Factory","Mario Circuit","Coconut Mall","DK's Snowboard Cross","Wario's Gold Mine","Daisy Circuit","Koopa Cape","Maple Treeway","Grumble Volcano","Dry Dry Ruins","Moonview Highway","Bowser's Castle","Rainbow Road","GCN Peach Beach","DS Yoshi Falls","SNES Ghost Valley 2","N64 Mario Raceway","N64 Sherbet Land","GBA Shy Guy Beach","DS Delfino Square","GCN Waluigi Stadium","DS Desert Hills","GBA Bowser Castle 3","N64 DK's Jungle Parkway","GCN Mario Circuit","SNES Mario Circuit 3","DS Peach Gardens","GCN DK Mountain","N64 Bowser's Castle"];
let mklTrackNames=["Luigi Circuit","Moo Moo Meadows","Mushroom Gorge","Toad's Factory","Mario Circuit","Coconut Mall","DK's Snowboard Cross","Wario's Gold Mine","Daisy Circuit","Koopa Cape","Maple Treeway","Grumble Volcano","Dry Dry Ruins","Moonview Highway","Bowser's Castle","Rainbow Road","GCN Peach Beach","DS Yoshi Falls","SNES Ghost Valley 2","N64 Mario Raceway","N64 Sherbet Land","GBA Shy Guy Beach","DS Delfino Square","GCN Waluigi Stadium","DS Desert Hills","GBA Bowser Castle 3","N64 DK's Jungle Parkway","GCN Mario Circuit","SNES Mario Circuit 3","DS Peach Gardens","GCN DK Mountain","N64 Bowser's Castle"];
let mkwppTrackAbbr=["LC","MMM","MG","TF","MC","CM","DKSC","WGM","DC","KC","MT","GV","DDR","MH","BC","RR","rPB","rYF","rGV2","rMR","rSL","rSGB","rDS","rWS","rDH","rBC3","rDKJP","rMC","rMC3","rPG","rDKM","rBC"];
let cdCategories=[['0'],['0'],['2','0','1'],['2','0'],['0','1'],['2','0','1'],['0'],['0','1'],['0'],['0','1'],['0','1'],['2','0','1'],['0'],['0'],['2','0'],['0','1'],['0','1'],['0'],['0','1'],['0'],['0','1'],['0','1'],['0'],['0','1'],['2','0'],['2','0'],['2','0','1'],['2','0'],['0'],['0','1'],['2','0'],['2','1']];
let cdCategoriesTranslated=[['Normal'],['Normal'],['Normal','Shortcut','Glitch'],['Normal','Shortcut'],['Normal','Glitch'],['Normal','Shortcut','Glitch'],['Normal'],['Normal','Glitch'],['Normal'],['Normal','Glitch'],['Normal','Glitch'],['Normal','Shortcut','Glitch'],['Normal'],['Normal'],['Normal','Shortcut'],['Normal','Glitch'],['Normal','Glitch'],['Normal'],['Normal','Glitch'],['Normal'],['Normal','Glitch'],['Normal','Glitch'],['Normal'],['Normal','Glitch'],['Normal','Shortcut'],['Normal','Shortcut'],['Normal','Shortcut','Glitch'],['Normal','Shortcut'],['Normal'],['Normal','Glitch'],['Normal','Shortcut'],['Normal','Glitch']];
let cdCatstoMKWPP={"Normal":"nosc","Shortcut":"","Glitch":""};
let cdCatstoMKL={"Normal":"mkw_nonsc_world","Shortcut":"mkw_sc_world","Glitch":"mkw_altsc_world"};
let mths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
let isMKLfunctionRunning = false;
async function sleep(milliseconds){const date=Date.now();let currentDate=null;do{currentDate=Date.now();}while(currentDate-date<milliseconds);}
function convertTimeToMS(timeString){let mins=parseInt(timeString.split(":")[0])*60000;let secandms=parseInt(timeString.split(":")[1].replace(".",""));return(mins)+secandms};function convertMSToTime(milliseconds){let minutes=Math.trunc(milliseconds/60/1000).toString();let seconds=Math.trunc(milliseconds/1000%60).toString();let ms=(milliseconds%1000).toString();return minutes.padStart(2,0)+":"+seconds.padStart(2,0)+"."+ms.padStart(3,0);};
async function crossCheckChadsoftOUTJSON(outJSON){
    for (let track of Object.keys(outJSON)) {
        let categories = Object.keys(outJSON[track]);
        if (categories.length===1) continue;
        let x, y, z;
        if (categories.includes("Normal")) x = true;
        if (categories.includes("Shortcut")) y = true;
        if (categories.includes("Glitch")) z = true;
        if (y&&z) if (outJSON[track]["Shortcut"]["finishTimeinMS"]<=outJSON[track]["Glitch"]["finishTimeinMS"]) { 
            delete outJSON[track]["Glitch"];
            z = false;
        }
        if (x&&y) if (outJSON[track]["Normal"]["finishTimeinMS"]<=outJSON[track]["Shortcut"]["finishTimeinMS"]) delete outJSON[track]["Shortcut"];
        if (x&&z) if (outJSON[track]["Normal"]["finishTimeinMS"]<=outJSON[track]["Glitch"]["finishTimeinMS"]) delete outJSON[track]["Glitch"];
    }
    return outJSON;
}

/* ==== Time Grabbers ==== */
async function grabTimesFromMKWPP(url){
    let outJSON = {};
    let outJSONFlap = {}
    await fetch(url).then(r=>r.text()).then(htmltxt=>{
        let parser = new DOMParser();
	    let doc = parser.parseFromString(htmltxt, 'text/html');
        sessionStorage.setItem("mkwppUsername",doc.getElementsByClassName("profr")[0].innerHTML);
        let noscTable;
        let scTable;
        for (let i of doc.getElementsByTagName("table")) {
            if (i.getAttribute("class")==="c") scTable = i.getElementsByTagName("tbody")[0];
            if (i.getAttribute("class")==="k") noscTable = i.getElementsByTagName("tbody")[0];
        }
        for (let category of [noscTable,scTable]) {
            let catRows = category.getElementsByTagName("tr");
            for (let i = 1; i < catRows.length; i+=2){
                if (catRows[i].getElementsByTagName("a")[1].innerHTML === "NT") continue;
                let trackName = mkwppTrackAbbr[mkwppTrackNames.indexOf(catRows[i].getElementsByTagName("a")[0].innerHTML)];
                if (trackName===undefined) continue;
                if (category === noscTable) {
                    outJSON[trackName] = {"Normal":{"finishTimeinMS":convertTimeToMS(catRows[i].getElementsByTagName("a")[1].innerHTML.replace("\'",":").replace("\"","."))}};
                    outJSONFlap[trackName] = {"Normal":{"finishTimeinMS":convertTimeToMS(catRows[i+1].getElementsByTagName("a")[0].innerHTML.replace("\'",":").replace("\"","."))}};
                } else if (category === scTable) {
                    for (let n = 0; n<2; n++){
                        let categoryName = "Jolly";
                        if (cdCategoriesTranslated[mkwppTrackAbbr.indexOf(trackName)].includes("Glitch")&&!cdCategoriesTranslated[mkwppTrackAbbr.indexOf(trackName)].includes("Shortcut")) categoryName = "Glitch";
                        else if (cdCategoriesTranslated[mkwppTrackAbbr.indexOf(trackName)].includes("Shortcut")&&!cdCategoriesTranslated[mkwppTrackAbbr.indexOf(trackName)].includes("Glitch")) categoryName = "Shortcut";
                        // n === 0 3lap, n === 1 flap
                        if (n === 0) {
                            if (outJSON[trackName]===undefined)outJSON[trackName]={};
                            let finishTimeinMS = convertTimeToMS(catRows[i].getElementsByTagName("a")[1].innerHTML.replace("\'",":").replace("\"","."));
                            if (finishTimeinMS==="NT") continue;
                            if (outJSON[trackName]["Normal"]["finishTimeinMS"]===finishTimeinMS) continue;
                            outJSON[trackName][categoryName] = {};
                            outJSON[trackName][categoryName]["finishTimeinMS"] = finishTimeinMS;
                        }
                        else if (n === 1) {
                            if (outJSONFlap[trackName]===undefined)outJSON[trackName]={};
                            let finishTimeinMS = convertTimeToMS(catRows[i+1].getElementsByTagName("a")[0].innerHTML.replace("\'",":").replace("\"","."));
                            if (finishTimeinMS==="NT") continue;
                            if (outJSONFlap[trackName]["Normal"]["finishTimeinMS"]===finishTimeinMS) continue;
                            outJSONFlap[trackName][categoryName] = {};
                            outJSONFlap[trackName][categoryName]["finishTimeinMS"] = finishTimeinMS;
                        }
                    }
                }
            }
        }
    })
    return [outJSON,outJSONFlap];
}
async function grabTimesFromChadsoft(cdUrl){
    if (cdUrl === undefined) {
        alert(chrome.i18n.getMessage("noChadErr"));
        return;
    }
    let rqurl = "https://tt.chadsoft.co.uk/players/" + cdUrl + ".json";
    let outJSON = {};
    let outJSONFlap = {};
    await fetch(rqurl).then(res=>res.json()).then(data=>{
        for (let i = 0; i < data.ghosts.length; i++){
            let ghost = data.ghosts[i];
            if (!chadsoftTrackNames.includes(ghost["trackName"])) continue;
            if (ghost["200cc"]) continue;
            let currTrack = mkwppTrackAbbr[chadsoftTrackNames.indexOf(ghost["trackName"])];
            let categoryName = cdCategoriesTranslated[chadsoftTrackNames.indexOf(ghost["trackName"])][cdCategories[chadsoftTrackNames.indexOf(ghost["trackName"])].indexOf(ghost._links.leaderboard.href.split("/")[ghost._links.leaderboard.href.split("/").length-1].split(".")[0].substring(1))];
            if (ghost["playersFastest"]) {
                if (outJSON[currTrack]===undefined) outJSON[currTrack] = {};
                outJSON[currTrack][categoryName] = {
                    "cdRunLink":"https://chadsoft.co.uk/time-trials"+ghost["href"].replace(".rkg",".html"),
                    "finishTime":ghost.finishTimeSimple,
                    "finishTimeinMS":convertTimeToMS(ghost.finishTimeSimple),
                    "date":Math.floor(new Date(ghost.dateSet)/86400)*86400
                }
            }
            if (outJSONFlap[currTrack]===undefined) outJSONFlap[currTrack] = {};
            if (outJSONFlap[currTrack][categoryName]===undefined) {
                outJSONFlap[currTrack][categoryName] = {
                    "cdRunLink":"https://chadsoft.co.uk/time-trials"+ghost["href"].replace(".rkg",".html"),
                    "finishTime":ghost.bestSplitSimple,
                    "finishTimeinMS":convertTimeToMS(ghost.bestSplitSimple),
                    "date":Math.floor(new Date(ghost.dateSet)/86400)*86400
                }
            } else if (outJSONFlap[currTrack][categoryName]["finishTimeinMS"] > convertTimeToMS(ghost.bestSplitSimple)){
                outJSONFlap[currTrack][categoryName] = {
                    "cdRunLink":"https://chadsoft.co.uk/time-trials"+ghost["href"].replace(".rkg",".html"),
                    "finishTime":ghost.bestSplitSimple,
                    "finishTimeinMS":convertTimeToMS(ghost.bestSplitSimple),
                    "date":Math.floor(new Date(ghost.dateSet)/86400)*86400
                }
            }
        }
    });
    return [await crossCheckChadsoftOUTJSON(outJSON),await crossCheckChadsoftOUTJSON(outJSONFlap)];
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
            else if (category === "Alternate") category = "Shortcut";
            else category = cdCategoriesTranslated[mkwppTrackAbbr.indexOf(trackName)][cdCategoriesTranslated[mkwppTrackAbbr.indexOf(trackName)].length-1];
            if (outJSON[trackName][category]!==undefined) continue;
            let finishTime = time.getElementsByTagName("b")[0].innerHTML.trim();
            if (!finishTime.includes(":")) finishTime = "00:" + finishTime;
            outJSON[trackName][category] = {"finishTimeinMS":convertTimeToMS(finishTime)};
        }
    });
    return outJSON;
}
async function preFilterforMKWPP(cdJSONs,mkwppJSONs){
    for (let j = 0; j < 2; j++){
        for (let i of Object.keys(mkwppJSONs[j])) if (Object.keys(mkwppJSONs[j][i]).includes("Jolly")) {
            let pass = false;
            if (cdJSONs[j][i]["Shortcut"]!==undefined) {
                if (mkwppJSONs[j][i]["Jolly"]["finishTimeinMS"] > cdJSONs[j][i]["Shortcut"]["finishTimeinMS"]) delete mkwppJSONs[j][i]["Jolly"];
                else if (mkwppJSONs[j][i]["Jolly"]["finishTimeinMS"] === cdJSONs[j][i]["Shortcut"]["finishTimeinMS"]) {
                delete cdJSONs[j][i]["Shortcut"];
                delete mkwppJSONs[j][i]["Jolly"];
                }
                else if (mkwppJSONs[j][i]["Jolly"]["finishTimeinMS"] < cdJSONs[j][i]["Shortcut"]["finishTimeinMS"]){
                    pass = true
                    delete cdJSONs[j][i]["Shortcut"];
                }
            }
            if (!pass) continue;
            if (cdJSONs[j][i]["Glitch"]!==undefined) {
                if (mkwppJSONs[j][i]["Jolly"]["finishTimeinMS"] > cdJSONs[j][i]["Glitch"]["finishTimeinMS"]) delete mkwppJSONs[j][i]["Jolly"];
                else if (mkwppJSONs[j][i]["Jolly"]["finishTimeinMS"] <= cdJSONs[j][i]["Glitch"]["finishTimeinMS"]) {
                    delete cdJSONs[j][i]["Glitch"];
                    delete mkwppJSONs[j][i]["Jolly"];
                }
            }
        }
    }
    return [cdJSONs,mkwppJSONs];
}
async function compareTimesJSON(cdJSON,siteJSON){
    let outJSON = {};
    for (let i of Object.keys(cdJSON)){
        if (!Object.keys(siteJSON).includes(i)) outJSON[i] = cdJSON[i];
        else for (let cat of Object.keys(cdJSON[i])){
            if (siteJSON[i][cat] === undefined) {
                if (outJSON[i] === undefined) outJSON[i]={};
                outJSON[i][cat] = {};
                outJSON[i][cat] = cdJSON[i][cat];
            }
            else if (cdJSON[i][cat]["finishTimeinMS"]<siteJSON[i][cat]["finishTimeinMS"]) {
                if (outJSON[i]===undefined) outJSON[i] = {};
                outJSON[i][cat] = cdJSON[i][cat];
            }
        }
    }
    return outJSON;
}
async function mergeJSONs(json1,json2){
    for (let i of Object.keys(json2)) {
        if (json1[i]===undefined) { json1[i] = json2[i]; continue; }
        for (let j of Object.keys(json2[i])) if (json1[i][j]===undefined) json1[i][j] = json2[i][j];
    }
    return json1;
}

function getDateString(unixTimestamp){
    let date = new Date(unixTimestamp);
    let day = date.getDate();
    let dayTxt;
    if (day.toString().substring(day.toString().length-1)==="1") dayTxt = "st";
    else if (day.toString().substring(day.toString().length-1)==="2") dayTxt = "nd";
    else if (day.toString().substring(day.toString().length-1)==="3") dayTxt = "rd";
    else dayTxt = "th";
    return `${mths[date.getMonth()]} ${day}${dayTxt}, ${date.getFullYear()}`;
}

/**
 * @param {{}} json1 3lap json from CD
 * @param {{}} json2 flap json from CD
 * @returns a merged json for the MKWPP script.
 */
async function mergeJSONsByDates(json1,json2){
    let outJSON = {};
   
    for (let track of Object.keys(json1)) for (let category of Object.keys(json1[track])) outJSON[getDateString(json1[track][category]["date"])] = {};
    for (let track of Object.keys(json2)) for (let category of Object.keys(json2[track])) outJSON[getDateString(json2[track][category]["date"])] = {};
    for (let track of Object.keys(json1)) for (let category of Object.keys(json1[track])) {
        let date = getDateString(json1[track][category]["date"]);
        if (outJSON[date][track] === undefined) outJSON[date][track] = {};
        outJSON[date][track][category] = {};
        outJSON[date][track][category]["3lap"] = json1[track][category];
    }
    for (let track of Object.keys(json2)) for (let category of Object.keys(json2[track])) {
        let date = getDateString(json2[track][category]["date"]);
        if (outJSON[date][track] === undefined) outJSON[date][track] = {};
        if (outJSON[date][track][category]===undefined) outJSON[date][track][category] = {};
        outJSON[date][track][category]["flap"] = json2[track][category];
    }
    return outJSON;
}
function invasiveCopytoClipboard(txt){
    navigator.permissions.query({name:'clipboard-write'}).then((result) => {
    if (result.state === 'granted') navigator.clipboard.writeText(txt);
    else if (result.state === "prompt"||result.state === "denied") invasiveCopytoClipboard(txt);
  });
}
async function mkwppbehavior(mkwppurl,cdUrl){
    if (mkwppurl === undefined||mkwppurl === null) {
        alert(chrome.i18n.getMessage("noMKWPPErr"));
        return;
    }
    let url = window.location.href;
    if (!url.includes("mariokart64.com")) {
        let st = confirm(chrome.i18n.getMessage("notMKWPPpage"));
        if (st) window.open("https://www.mariokart64.com/mkw/", '_blank').focus();
        return; /* The content script is running on the Tab that you called it on, even if you accept the prompt you'd have to call it again regardless */
    }
    let allJSONs = await preFilterforMKWPP(await grabTimesFromChadsoft(cdUrl), await grabTimesFromMKWPP(mkwppurl));
    console.log(allJSONs)
    let courseJSON = await compareTimesJSON(allJSONs[0][0],allJSONs[1][0]);
    let flapJSON = await compareTimesJSON(allJSONs[0][1],allJSONs[1][1]);
    let finalJSON = await mergeJSONsByDates(courseJSON,flapJSON);
    let usernameLine = `Name: ${sessionStorage.getItem("mkwppUsername")}\n\n`
    let finaltext = "";
    for (let date of Object.keys(finalJSON)){
        finaltext+=`Date: ${date}\n${usernameLine}`
        for (let track of Object.keys(finalJSON[date])) for (let category of Object.keys(finalJSON[date][track])){
            let writecat = "";
            if (category==="Normal") writecat = "nosc "
            if (Object.keys(finalJSON[date][track][category]).includes("3lap")) {
                finaltext += `${track} ${writecat}${finalJSON[date][track][category]["3lap"]["finishTime"].substring(1)}`;
                if (Object.keys(finalJSON[date][track][category]).includes("flap")) finaltext += ` / ${finalJSON[date][track][category]["flap"]["finishTime"].substring(1)}\n`;
                else finaltext += "\n";
            } else if (Object.keys(finalJSON[date][track][category]).includes("flap")) finaltext += `${track} ${writecat}flap ${finalJSON[date][track][category]["flap"]["finishTime"].substring(1)}\n`;
        }
        finaltext += "\n"
    }
    invasiveCopytoClipboard(finaltext);
    alert(chrome.i18n.getMessage("clipboardSuccess"));
}
async function mklbehavior(cdUrl){
    if (isMKLfunctionRunning) return;
    let url = window.location.href;
    if (url!=="https://www.mkleaderboards.com/submit") {
        let st = confirm(chrome.i18n.getMessage("notMKLpage"));
        if (st) window.open("https://www.mkleaderboards.com/submit", '_blank').focus();
        return; /* The content script is running on the Tab that you called it on, even if you accept the prompt you'd have to call it again regardless */
    }

    isMKLfunctionRunning = true;
    let mklMKWprofile;
    for (let i of document.getElementById("navigation_user").getElementsByTagName("a")){
        if (i.innerHTML === "MKW Profile") mklMKWprofile = i.href;
    }
    let mergedJSON = await mergeJSONs(await grabTimesFromMKLsubmitted("https://www.mkleaderboards.com/my_submissions"),await grabTimesFromMKL(mklMKWprofile))
    let cdJSONs = await grabTimesFromChadsoft(cdUrl);
    let finalJSON = await compareTimesJSON(cdJSONs[0],mergedJSON);
    let catVal; 
    setInterval(async()=>{
        if (!["mkw_nonsc_world","mkw_sc_world","mkw_altsc_world"].includes(document.getElementById("category").value)) return;
        if (catVal === document.getElementById("category").value) return;
        catVal = document.getElementById("category").value;
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
            if (tempcat === "Jolly") tempcat = cdCategoriesTranslated[mkwppTrackAbbr.indexOf(trackName)][cdCategoriesTranslated[mkwppTrackAbbr.indexOf(trackName)].length-1];
            if (!Object.keys(finalJSON[trackName]).includes(tempcat)) continue;
            let timeInsert = inputs[i];
            let ghostInsert = inputs[i+1];
            timeInsert.value = finalJSON[trackName][tempcat]["finishTime"].substring(1);
            ghostInsert.value = finalJSON[trackName][tempcat]["cdRunLink"];
        }
    },1000);
}

chrome.runtime.onMessage.addListener(
    async function(request) {
        if (request.mode === "mkwpp") mkwppbehavior(request.url,request.cdUrl);
        else if (request.mode === "mkl") mklbehavior(request.cdUrl);
});
