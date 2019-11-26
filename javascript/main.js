var ChuckNorrisJoke = (function () {
    function ChuckNorrisJoke() {
    }
    return ChuckNorrisJoke;
}());
window.onload = function () {
    var jokeBtn = document.getElementById("get-joke");
    jokeBtn.onclick = fetchJoke;
    populateCategories();
};
function fetchJoke() {
    var jokeBtn = this;
    jokeBtn.disabled = true;
    var loaderImg = document.getElementById("loader");
    loaderImg.classList.add("loader");
    var request = new XMLHttpRequest();
    request.onreadystatechange = handleJokeResponse;
    var url = "https://api.icndb.com/jokes/random";
    if (isCategorySelected()) {
        url += "?limitTo=" + getSelectedCategory();
    }
    request.open("GET", url);
    request.send();
}
function isCategorySelected() {
    var selIndex = document.getElementById("cat-list").selectedIndex;
    if (selIndex > 0) {
        return true;
    }
    return false;
}
function getSelectedCategory() {
    var index = document.getElementById("cat-list").selectedIndex;
    return document.getElementById("cat-list").options[index].text;
}
function handleJokeResponse() {
    var request = this;
    if (request.readyState == 4 && request.status == 200) {
        var responseData = JSON.parse(request.responseText);
        var myJoke = responseData.value;
        displayJoke(myJoke);
    }
    else if (request.readyState == 4 && request.status != 200) {
        alert("Please try again later. Something bad happened.");
    }
}
function displayJoke(joke) {
    document.getElementById("joke-display").innerHTML = joke.joke;
    document.getElementById("joke-id").innerHTML = "ID: " + joke.id.toString();
    var categorieList = document.getElementById("categories");
    categorieList.innerHTML = "";
    for (var i = 0; i < joke.categories.length; i++) {
        var item = document.createElement("li");
        item.innerHTML = joke.categories[i];
        categorieList.appendChild(item);
    }
    var catDisplay = document.getElementById("category-display");
    if (joke.categories.length == 0) {
        catDisplay.style.display = "none";
    }
    else {
        catDisplay.style.display = "block";
    }
    var loaderImg = document.getElementById("loader");
    loaderImg.classList.remove("loader");
    document.getElementById("get-joke").disabled = false;
}
function populateCategories() {
    var request = new XMLHttpRequest();
    request.open("GET", "https://api.icndb.com/categories");
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var categories = JSON.parse(this.responseText).value;
            console.log(categories);
            populateCategoryDropdown(categories);
        }
    };
    request.send();
}
function populateCategoryDropdown(categories) {
    var list = document.getElementById("cat-list");
    for (var i = 0; i < categories.length; i++) {
        var option = document.createElement("option");
        option.text = categories[i];
        list.appendChild(option);
    }
}
