var header  = document.querySelector('header');
var section = document.querySelector('section');
var genre = document.querySelector('genre');
var category = document.querySelector('category');
var random = document.querySelector('random');

let myKey = "14qErICaQmH8qifkhSEFeKpgjdDrJWYAGk-IZVAe-1DI"; // 스프레드시트 KEY

let noCover = `https://cdn.discordapp.com/attachments/1158397408514932746/1160924994839248926/0_.png`;
let gid = "1303736034" // 목록이 있는 시트의 gid

var announcements;

var musicbook;
var addOrdered;
var artistOrdered;
var songOrdered;

var category_selected;
var categories;
let genres = [];
var genre_selected;

google.charts.load("current", { packages: ["corechart"] }).then(() => {
	let query_list = new google.visualization.Query(
		`https://docs.google.com/spreadsheets/d/${myKey}/gviz/tq?gid=${gid}&tqx=out:json`
	);

	query_list.send((response) => {
		if (response.isError()) {
			console.error(
				"Error in query: " + response.getMessage() + " " + response.getDetailedMessage()
			);
			return;
		}

		let dataTable = response.getDataTable().toJSON(); 
		let jsonData = JSON.parse(dataTable);
		console.log(jsonData);
		// let cols = jsonData.cols.map((col) => col.label); console.log("cols: \n", cols);
		let cols = ["order", "artist", "song", "genre", "category", "price", "cover_link"];
		musicbook = jsonData.rows.map((row) => {
			let newRow;
			row.c.forEach((obj, index) => {
				if (obj == null || obj == undefined) return; //빈값이 경우 정지
				obj[cols[index]] = "f" in obj ? obj["f"] : obj["v"];
				["f", "v"].forEach((each) => delete obj[each]);
				
				if (cols[index] == "genre") {
					obj.genre = (obj.genre).split("/");
				}
				// console.log(JSON.stringify(obj.cover_link));
				if (cols[index] == "cover_link") {
					if (obj.cover_link == null) {
						obj.cover_link = noCover;
					}
					else if ((obj.cover_link).substring(0,4) != "http") {
						obj.cover_link = "https://img.youtube.com/vi/" + obj.cover_link + "/maxresdefault.jpg";
					}
				}
				newRow = { ...newRow, ...obj };
			});
			return newRow;
		});

		musicbook.sort((a, b) => {
			a = a.order;
			b = b.order;
			return b - a;
		});
		addOrdered = JSON.parse(JSON.stringify(musicbook));
		// console.log(addOrdered);

		musicbook.sort((a, b) => {
			a = a.song.toLowerCase();
			b = b.song.toLowerCase();
			if (a > b) return 1;
			if (a < b) return -1;
			return 0;
		});
		songOrdered = JSON.parse(JSON.stringify(musicbook));
		// console.log("Song Ordered\n", songOrdered);

		musicbook.sort((a, b) => {
			a = a.artist.toLowerCase();
			b = b.artist.toLowerCase();
			if (a > b) return 1;
			if (a < b) return -1;
			return 0;
		});
		artistOrdered = JSON.parse(JSON.stringify(musicbook));
		// console.log("artist Ordered\n", artistOrdered);

		category_populate(musicbook);
		genre_populate(musicbook);
		random_select(musicbook,6);

		category_selected = "";
		genre_selected = "";
		sortAdded();
	});


	let query_announcement = new google.visualization.Query(
		`https://docs.google.com/spreadsheets/d/${myKey}/gviz/tq?gid=0&tqx=out:json`
	);

	query_announcement.send((response) => {
		if (response.isError()) {
			console.error(
				"Error in query: " + response.getMessage() + " " + response.getDetailedMessage()
			);
			return;
		}

		let dataTable = response.getDataTable().toJSON(); 
		let jsonData = JSON.parse(dataTable);
		//console.log(jsonData);
		// let cols = jsonData.cols.map((col) => col.label); console.log("cols: \n", cols);
		let cols = ["announcement"];
		announcements = jsonData.rows.map((row) => {
			let newRow;
			row.c.forEach((obj, index) => {
				if (obj == null || obj == undefined) return; //빈값이 경우 정지
				obj[cols[index]] = "f" in obj ? obj["f"] : obj["v"];
				["f", "v"].forEach((each) => delete obj[each]);
				newRow = { ...newRow, ...obj };
			});
			return newRow;
		});
		//console.log(announcements);
		populateAnnounce(announcements)
	});

});




function populateAnnounce(jsonObj) {

	//var musiclist = jsonObj;
	/* console.log("populateSection", musiclist); */
	/* 기존 노래들 클리어 */
	const myNode = document.getElementById("introduction_");
	// var announcement = document.querySelector('announcement');
	//while (myNode.lastElementChild) {
	//	myNode.removeChild(myNode.lastElementChild);
	//}

	/* 검색 입력창에 들어와있는거 저장 */
	//const search_value = document.getElementById("inputsearch").value;

	//var i, end;
	//if (direction == 1) {
	//	i = 0;
	//	end = musiclist.length;
	//}
	//else {
	//	i = musiclist.length - 1;
	//	end = -1;
	//}

	var i, end;
	i = 0;
	end = jsonObj.length;
	var ulist = document.createElement('ul');
	for (i; i != end; i = i + 1) {

		if (jsonObj[i].announcement.substring(0,2) == "--") {
			var list_ = document.createElement('ul');
			while (jsonObj[i].announcement.substring(0,2) == "--") {
				var each_ = document.createElement('formatted-string');
				each_.classList.add("announcement-sub");
				each_.textContent = jsonObj[i].announcement.substring(2);
				list_.appendChild(each_);
				i = i + 1;
			}
			list.appendChild(list_);
		}
		
		var list = document.createElement('li');
		var each = document.createElement('formatted-string');
		each.classList.add("introduction-text"); 

		

		each.textContent = jsonObj[i].announcement;
		list.appendChild(each);
		ulist.appendChild(list);
	}
	myNode.appendChild(ulist);
}



function genre_populate(jsonObj) {

	//categories = Array.from(new Set(jsonObj.map(item => item.genre)));

	// console.log(jsonObj);
	jsonObj.forEach(
		(item) => {
			item.genre.forEach(
				(gen) => {
					if (!genres.includes(gen)) {
						genres.push(gen);
					}
				}
			)
		}
	);

	var cateDiv = document.createElement('div');
	cateDiv.classList.add("genre-select");
	genre.appendChild(cateDiv);

	for (var i = 0; i < genres.length; i++) {
		var cateName = document.createElement('button');
		var cateString = document.createElement('formatted-string');

		cateString.textContent = genres[i];
		cateString.classList.add("genre-text");
		cateName.appendChild(cateString);

		cateName.classList.add("genre-button");
		cateName.classList.add("clickable");
		cateName.setAttribute("id", "genre-" + i);

		cateName.addEventListener('click', function () {
			var prev_sel = document.getElementsByClassName("genre-button");
			if ( this.classList.contains("button-selected") ) {
				for( var i = 0; i < prev_sel.length; i++ ){
					prev_sel.item(i).classList.remove("button-selected");
				}
				genre_selected = "";
				populateSection(musicbook, 1);
			}
			else {
				for( var i = 0; i < prev_sel.length; i++ ){
					prev_sel.item(i).classList.remove("button-selected");
				}
				this.classList.add("button-selected");
				genre_selected = this.textContent;
				populateSection(musicbook, 1);
			}
		});

		cateDiv.appendChild(cateName);
	}
}



function category_populate(jsonObj) {

	categories = Array.from(new Set(jsonObj.map(item => item.category)));

	var cateDiv = document.createElement('div');
	cateDiv.classList.add("category-select");
	category.appendChild(cateDiv);

	for (var i = 0; i < categories.length; i++) {
		var cateName = document.createElement('button');
		var cateString = document.createElement('formatted-string');

		cateString.textContent = categories[i];
		cateString.classList.add("category-text");
		cateName.appendChild(cateString);

		cateName.classList.add("category-button");
		cateName.classList.add("clickable");
		cateName.setAttribute("id", "category-" + i);

		cateName.addEventListener('click', function () {
			var prev_sel = document.getElementsByClassName("category-button");
			if ( this.classList.contains("button-selected") ) {
				for( var i = 0; i < prev_sel.length; i++ ){
					prev_sel.item(i).classList.remove("button-selected");
				}
				category_selected = "";
				populateSection(musicbook, 1);
			}
			else {
				for( var i = 0; i < prev_sel.length; i++ ){
					prev_sel.item(i).classList.remove("button-selected");
				}
				this.classList.add("button-selected");
				category_selected = this.textContent;
				populateSection(musicbook, 1);
			}
		});

		cateDiv.appendChild(cateName);
	}
}

function timeout(myDiv, dly) {
	setTimeout(function () {
		// Do Something Here
		// Then recall the parent function to
		// create a recursive loop.
		myDiv.style.opacity = `1`;
		myDiv.style.transition = `1s`;
		timeout(myDiv, dly);
	}, dly * 500);
}
function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min;
}
function random_select(jsonObj, num) {

	var musiclist = jsonObj;

	/* 기존 노래들 클리어 */
	const myNode = document.getElementById("musicListRandom");
	while (myNode.lastElementChild) {
		myNode.removeChild(myNode.lastElementChild);
	}

	var dup = [];
	dup[0] = 0;
	var i = 0;

	for (i; i < num; i = i + 1) {
		var rnd = getRndInteger(1, musiclist.length);

		for (var j = 0; j < i; j = j + 1) { 
			while (dup[j] == rnd) {
				rnd = rnd + 1;
				if (rnd == musiclist.length) { rnd = 1; }
				j = 0;
				// console.log("Random Colide!");
			}
		}
		dup[i] = rnd; 

		var myDiv = document.createElement('div');

		var coverDiv = document.createElement('div');
		var coverImg = document.createElement('img');

		var infoDiv = document.createElement('div');
		var infoSong = document.createElement('formatted-string');
		var infoArtist = document.createElement('formatted-string');
		var infoPrice = document.createElement('formatted-string');

		myDiv.classList.add("random-song");
		
		coverDiv.classList.add("random-cover-div");
		coverImg.classList.add("random-cover-img");
		if (musiclist[rnd].cover_link == null) coverImg.src = noCover;
		else coverImg.src = musiclist[rnd].cover_link;

		infoDiv.classList.add("random-info-div");
		infoArtist.classList.add("random-artist-name");
		infoSong.classList.add("random-song-name");
		infoArtist.textContent = musiclist[rnd].artist;
		infoSong.textContent = musiclist[rnd].song;

		infoPrice.classList.add("song-price");
		infoPrice.textContent = musiclist[i].price;

		coverDiv.appendChild(coverImg);
		infoDiv.appendChild(infoSong);
		infoDiv.appendChild(infoArtist);
		myDiv.appendChild(coverDiv);
		myDiv.appendChild(infoDiv);
		myDiv.appendChild(infoPrice);

		myDiv.classList.add("clickable");
		myDiv.addEventListener('click', function () {
			var song = this.childNodes[1].childNodes[0];
			var artist = this.childNodes[1].childNodes[1];
			var text = song.textContent + " - " + artist.textContent;
			window.navigator.clipboard.writeText(text).then(() => {
				toast("복사완료");
			});
		});
		myDiv.style.opacity = `0`;
		
		timeout(myDiv, i);
		
		random.appendChild(myDiv);
	}
}

function populateSection(jsonObj, direction) {

	var musiclist = jsonObj;
	/* console.log("populateSection", musiclist); */
	/* 기존 노래들 클리어 */
	const myNode = document.getElementById("musicList");
	while (myNode.lastElementChild) {
		myNode.removeChild(myNode.lastElementChild);
	}

	/* 검색 입력창에 들어와있는거 저장 */
	const search_value = document.getElementById("inputsearch").value;

	var i, end;
	if (direction == 1) {
		i = 0;
		end = musiclist.length;
	}
	else {
		i = musiclist.length - 1;
		end = -1;
	}

	for (i; i != end; i = i + direction) {
		if ( search_value != "" ) {
			if (musiclist[i].artist.indexOf(search_value)==-1 && 
				musiclist[i].song.indexOf(search_value)==-1 ) {
				continue; 
			}
		}
		if ( (category_selected != "") && (musiclist[i].category != category_selected) ) {
			continue;
		}
		var temp_gen= false;
		musiclist[i].genre.forEach(
			(item) => {
				if(item == genre_selected) {
					temp_gen = true;
				}
				
			}
		);
		if ( (genre_selected != "") && !temp_gen ) {
			continue;
		}

		var myDiv = document.createElement('div');

		var coverDiv = document.createElement('div');
		var coverImg = document.createElement('img');

		var infoDiv = document.createElement('div');
		var infoSong = document.createElement('formatted-string');
		var infoArtist = document.createElement('formatted-string');
		var infoPrice = document.createElement('formatted-string');

		myDiv.classList.add("song-div");
		
		coverDiv.classList.add("album-cover-div");
		coverImg.classList.add("album-cover-img");
		if (musiclist[i].cover_link == null) coverImg.src = noCover;
		else coverImg.src = musiclist[i].cover_link;

		infoDiv.classList.add("info-div");
		infoArtist.classList.add("artist-name");
		infoSong.classList.add("song-name");
		infoPrice.classList.add("song-price");
		infoArtist.textContent = musiclist[i].artist; 
		infoSong.textContent = musiclist[i].song;
		infoPrice.textContent = musiclist[i].price;

		coverDiv.appendChild(coverImg);
		infoDiv.appendChild(infoSong);
		infoDiv.appendChild(infoArtist);
		myDiv.appendChild(coverDiv);
		myDiv.appendChild(infoDiv);
		myDiv.appendChild(infoPrice);

		myDiv.classList.add("clickable");
		myDiv.addEventListener('click', function () {
			var song = this.childNodes[1].childNodes[0];
			var artist = this.childNodes[1].childNodes[1];
			var text = song.textContent + " - " + artist.textContent;
			window.navigator.clipboard.writeText(text).then(() => {
				toast("복사완료");
			});
		});

		section.appendChild(myDiv);
	}
}
