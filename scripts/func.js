
var sort_selected = "byAdd";

function searchEnter() {
	if (window.event.keyCode==13) {               
		populateSection(musicbook, 1);
	}
}
function searchUpdate() {
	const search_update = document.getElementById("inputsearch");
	search_update.setAttribute("value", search_update.value);
}

function sortArtist() {
	document.getElementById(sort_selected).classList.remove("button-selected");
	document.getElementById("byArtist").classList.add("button-selected");
	sort_selected = "byArtist";
	musicbook = artistOrdered;
	populateSection(musicbook, 1);
}
function sortSong() {
	document.getElementById(sort_selected).classList.remove("button-selected");
	document.getElementById("bySong").classList.add("button-selected");
	sort_selected = "bySong";
	musicbook = songOrdered;
	populateSection(musicbook, 1);
}
function sortAdded() {
	document.getElementById(sort_selected).classList.remove("button-selected");
	document.getElementById("byAdd").classList.add("button-selected");
	sort_selected = "byAdd";
	musicbook = addOrdered;
	populateSection(musicbook, 1);
}

function new_random() {
	random_select(musicbook,6);
}

document.getElementById("openMenu").onclick = function() {
	var idLeft = document.getElementById("sidebar-id");
	if (idLeft.classList.contains("sidebar-hide")) {
		idLeft.classList.remove("sidebar-hide");
		document.getElementById("mainContent").classList.add("main-hide");
	}
	else {
		idLeft.classList.add("sidebar-hide");
		document.getElementById("mainContent").classList.remove("main-hide");
	}

	idLeft = document.getElementById("sidebar-wrapper-id");
	if (idLeft.classList.contains("sidebar-wrapper-hide")) {
		idLeft.classList.remove("sidebar-wrapper-hide");
	}
	else {
		idLeft.classList.add("sidebar-wrapper-hide");
	}
};        


let removeToast;

function toast(string) {
    const toast = document.getElementById("toast");

    toast.classList.contains("reveal") ?
        (clearTimeout(removeToast), removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 1000)) :
        removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 3000)
    toast.classList.add("reveal"),
        toast.innerText = string
}