var openlpChannel = new BroadcastChannel("obs_openlp_channel");
var currentLines;
var lastDisplayedIndex;

var autoResize = true;

var max_saved_lines = 5;
var pastLines = [];
var pastPreviews = [];
var historyIndex = 0;

var hiding = false;
var fadeDuration = 900;

var autoSplitLongLines = true;
var maxCharacters = 60;
var minWords = 3;

openlpChannel.onmessage = function (ev) {
    var data = JSON.parse(ev.data);
    var type = data.type;
    if (type === "init") {
        openlpChannel.postMessage(JSON.stringify({type: "hideOnBlank", value: $("#auto-hide-checkbox").prop("checked")}));
        openlpChannel.postMessage(JSON.stringify({type: "fadeDuration", value: fadeDuration}));
        openlpChannel.postMessage(JSON.stringify({type: "hide", value: hiding}));
        openlpChannel.postMessage(JSON.stringify({type: "resize", value: autoResize}));
        openlpChannel.postMessage(JSON.stringify({type: "font", value: $("#lyrics-font-size-spinner").val()}));
        openlpChannel.postMessage(JSON.stringify({type: "superscriptedVerseNumbers", value: $("#superscripted-verse-numbers-checkbox").prop("checked")}));
    } else if (type === "lyrics") {
        
        lastDisplayedIndex = -1;

        if ( autoSplitLongLines ) {
            currentLines = Array();
            $.each(data.lines, function (idx, longLine) {
                currentLines = currentLines.concat(splitLines(longLine).split(/\n/g));
            });
        } else {
            currentLines = data.lines;
        }

        if ($("#auto-update-checkbox").prop("checked")) {
            if ($("#display-all-checkbox").prop("checked")) {
                displayNext(currentLines.length);
            } else {
                displayNext(Number($("#increment-spinner-1").val()));
            }
        } else {
            var lines = "";
            for (var i = 0; i < currentLines.length; i++) {
                lines += currentLines[i] + "<br>";
            }
            $("#slide-text").html(lines);
        }
    }
};

// Split lines into smaller ones that are no longer than maxCharacters, but at least minWords long
// If minWords results in more than maxCharacters on a given line, that line will have fewer than minWords
// If a word is longer than maxCharacters, it will be on its own line
function splitLines(text) {
    minWords=Math.max(1,minWords);

    if ( text === undefined )
        return "";
    
    var words = text.split(" ");
    var lines = Array();
    var line_words = Array();

    
    // Create the lines of words within the character constraint
    for ( var i = 0; i < words.length; i++) {
        new_word = Array(words[i]);
        
        // Add at least one word per line; otherwise no more words than allowed by maxCharactersr
        if ( line_words.length > 1 && line_words.concat(new_word).join(" ").length > maxCharacters ) {
            lines.push(line_words);
            line_words = new_word;
        } else {
            line_words.push(words[i]);
        }
    }
    lines.push(line_words);

    var shifted=true;
    // Work backwards to ensure we have enough words per line
    for ( i = lines.length-1; i > 1 && shifted; i-- ) {
        console.log("i: %s\nline: %s", i, lines[i].join("/"))
        var shifted=false;
        while ( lines[i].length < minWords ) {
            if (lines[i-1].length == 0) {
                window.alert("found an empty line!")
                lines.splice(i-1,1);
                i--;
                if ( i < 1 ) break;
            }

            new_word=lines[i-1][lines[i-1].length-1];

            if ( lines[i].join(" ").length + new_word.length + 1 < maxCharacters ) {
                lines[i].unshift(lines[i-1].pop());
                shifted=true;
            } else {
                break;
            }
        }
    }


    var lines_of_words=Array();
    for ( i = 0; i<lines.length; i++) {
        lines_of_words.push(lines[i].join(" "));
    }

    return lines_of_words.join("\n");
}

function displayNext(amount) {
    if (amount <= 0) {
        return;
    }

    //send lines to stage
    var linesToDisplay = "";
    for (var i = lastDisplayedIndex + 1; i <= lastDisplayedIndex + amount && i < currentLines.length; i++) {
        linesToDisplay += currentLines[i] + "<br>";
    }
    if (linesToDisplay.length <= 0) {
        return;
    }
    openlpChannel.postMessage(JSON.stringify({type: "lyrics", value: linesToDisplay}));

    //update preview
    var preview = "";
    for (var i = 0; i < lastDisplayedIndex + 1 && i < currentLines.length; i++) {
        preview += currentLines[i] + "<br>";
    }
    preview += "<b>" + linesToDisplay + "</b>";
    lastDisplayedIndex += amount;
    for (var i = lastDisplayedIndex + 1; i < currentLines.length; i++) {
        preview += currentLines[i] + "<br>";
    }
    $("#slide-text").html(preview);

    //update previous lines
    for (var i = max_saved_lines - 1; i > 0; i--) {
        if (pastLines[i - 1] !== undefined) {
            pastLines[i] = pastLines[i - 1];
        }
        if (pastPreviews[i - 1] !== undefined) {
            pastPreviews[i] = pastPreviews[i - 1];
        }
    }
    pastLines[0] = linesToDisplay;
    pastPreviews[0] = preview;
    historyIndex = 0;
}

function displaySaved(index) {
    if (index < 0
            || index > max_saved_lines
            || pastLines[index] === undefined) {
        return;
    }
    openlpChannel.postMessage(JSON.stringify({type: "lyrics", value: pastLines[index]}));
    $("#slide-text").html(pastPreviews[index]);
    historyIndex = index;
}

function updateFontSize(font) {
    $("*").css({"font-size": font + "pt"});
}
function updateButtonSize(opt) {
    if (opt === "Normal") {
        $("button").css({"padding-top": "4px", "padding-bottom": "4px"});
    } else if (opt === "Large") {
        $("button").css({"padding": "10px", "padding-bottom": "10px"});
    } else {
        $("button").css({"padding": "20px", "padding-bottom": "20px"});
    }
}
function loadSettings() {
    var loadedLineIncrement1 = window.localStorage.getItem("lineIncrement1");
    if (loadedLineIncrement1 !== null) {
        $("#increment-spinner-1").val(Number(loadedLineIncrement1));
    }
    var loadedLineIncrement2 = window.localStorage.getItem("lineIncrement2");
    if (loadedLineIncrement2 !== null) {
        $("#increment-spinner-2").val(Number(loadedLineIncrement2));
    }
    var loadedAutoUpdate = window.localStorage.getItem("autoUpdate");
    if (loadedAutoUpdate !== null) {
        $("#auto-update-checkbox").prop("checked", loadedAutoUpdate === "true");
    }
    var loadedAutoHide = window.localStorage.getItem("autoHide");
    if (loadedAutoHide !== null) {
        $("#auto-hide-checkbox").prop("checked", loadedAutoHide === "true");
    }
    var loadedResize = window.localStorage.getItem("autoResize");
    if (loadedResize !== null) {
        $("#resize-checkbox").prop("checked", loadedResize === "true");
    }
    var loadedDisplayAll = window.localStorage.getItem("displayAll");
    if (loadedDisplayAll !== null) {
        $("#display-all-checkbox").prop("checked", loadedDisplayAll === "true");
    }
    var loadedControlFont = window.localStorage.getItem("controlFont");
    if (loadedControlFont !== null) {
        updateFontSize(loadedControlFont);
        $("#control-font-size-spinner").val(Number(loadedControlFont));
    }
    var loadedLyricsFont = window.localStorage.getItem("lyricsFont");
    if (loadedLyricsFont !== null) {
        $("#lyrics-font-size-spinner").val(Number(loadedLyricsFont));
    }
    var loadedAutoSplitLongLines = window.localStorage.getItem("autoSplitLongLines");
    if (loadedAutoSplitLongLines !== null) {
        autoSplitLongLines = loadedAutoSplitLongLines;
        $("#auto-split-long-lines-checkbox").prop("checked", loadedAutoSplitLongLines === "true");
    }
    var loadedMaxCharacters = window.localStorage.getItem("maxCharacters");
    if (loadedMaxCharacters !== null) {
        maxCharacters = loadedMaxCharacters;
        $("#split-max-characters-spinner").val(Number(loadedMaxCharacters));
    }
    var loadedMinWords = window.localStorage.getItem("minWords");
    if (loadedMinWords !== null) {
        minWords = loadedMinWords;
        $("#split-min-words-spinner").val(Number(loadedMinWords));
    }
    var loadedSuperscriptedVerseNumbers = window.localStorage.getItem("superscriptedVerseNumbers");
    if (loadedSuperscriptedVerseNumbers !== null) {
        $("#superscripted-verse-numbers-checkbox").prop("checked", loadedSuperscriptedVerseNumbers === "true");
    }
    var loadedFadeDuration = window.localStorage.getItem("fadeDuration");
    if (loadedFadeDuration !== null) {
        fadeDuration = loadedFadeDuration;
        $("#fade-duration-spinner").val(Number(fadeDuration));
    }
    var loadedButtonSize = window.localStorage.getItem("buttonSize");
    if (loadedButtonSize !== null) {
        updateButtonSize(loadedButtonSize);
        $("#button-height-select").val(loadedButtonSize);
    }
}
$(function () {
    loadSettings();

    //add listeners
    $("#increment-spinner-1").change(function () {
        window.localStorage.setItem("lineIncrement1", $(this).val());
    });
    $("#increment-spinner-2").change(function () {
        window.localStorage.setItem("lineIncrement2", $(this).val());
    });
    $("#auto-update-checkbox").change(function () {
        window.localStorage.setItem("autoUpdate", $(this).prop("checked"));
    });
    $("#auto-hide-checkbox").change(function () {
        var checked = $(this).prop("checked");
        window.localStorage.setItem("autoHide", checked);
        openlpChannel.postMessage(JSON.stringify({type: "hideOnBlank", value: checked}));
    });
    $("#resize-checkbox").change(function () {
        var checked = $(this).prop("checked");
        window.localStorage.setItem("autoResize", checked);
        openlpChannel.postMessage(JSON.stringify({type: "resize", value: checked}));
    });
    $("#display-all-checkbox").change(function () {
        window.localStorage.setItem("displayAll", $(this).prop("checked"));
    });
    $("#control-font-size-spinner").change(function () {
        var font = $(this).val();
        updateFontSize(font);
        window.localStorage.setItem("controlFont", font);
    });
    $("#auto-split-long-lines-checkbox").change(function () {
        autoSplitLongLines = $(this).prop("checked");
        window.localStorage.setItem("autoSplitLongLines", autoSplitLongLines);
        if (autoSplitLongLines) {
            $("#split-max-characters").show();
            $("#split-min-words").show();
        } else {
            $("#split-max-characters").hide();
            $("#split-min-words").hide();
        }
    });
    $("#split-max-characters-spinner").change(function () {
        maxCharacters = $(this).val();
        window.localStorage.setItem("maxCharacters", maxCharacters);
    });
    $("#split-min-words-spinner").change(function () {
        minWords = $(this).val();
        window.localStorage.setItem("minWords", minWords);
    });
    $("#superscripted-verse-numbers-checkbox").change(function () {
        var checked = $(this).prop("checked");
        window.localStorage.setItem("superscriptedVerseNumbers", checked);
        openlpChannel.postMessage(JSON.stringify({type: "superscriptedVerseNumbers", value: checked}));
    });
    $("#lyrics-font-size-spinner").change(function () {
        var font = $(this).val();
        window.localStorage.setItem("lyricsFont", font);
        openlpChannel.postMessage(JSON.stringify({type: "font", value: font}));
    });
    $("#fade-duration-spinner").change(function () {
        fadeDuration = $(this).val();
        window.localStorage.setItem("fadeDuration", fadeDuration);
        openlpChannel.postMessage(JSON.stringify({type: "fadeDuration", value: fadeDuration}));
    });
    $("#button-height-select").change(function () {
        var opt = $(this).val();
        updateButtonSize(opt);
        window.localStorage.setItem("buttonSize", opt);
    });
    $("#increment-button-1").click(function () {
        displayNext(Number($("#increment-spinner-1").val()));
    });
    $("#increment-button-2").click(function () {
        displayNext(Number($("#increment-spinner-2").val()));
    });
    $("#remaining-button").click(function () {
        displayNext(currentLines.length - (lastDisplayedIndex + 1));
    });
    $("#undo-button").click(function () {
        displaySaved(historyIndex + 1);
    });
    $("#redo-button").click(function () {
        displaySaved(historyIndex - 1);
    });
    $("#next-button").click(function () {
        openlpChannel.postMessage(JSON.stringify({type: "nextSlide"}));
    });
    $("#previous-button").click(function () {
        openlpChannel.postMessage(JSON.stringify({type: "previousSlide"}));
    });
    $("#hide-button").click(function () {
        if (!hiding) {
            $(this).addClass("activeButton");
            hiding = true;
        } else {
            $(this).removeClass("activeButton");
            hiding = false;
        }
        openlpChannel.postMessage(JSON.stringify({type: "hide", value: hiding}));
    });
});
