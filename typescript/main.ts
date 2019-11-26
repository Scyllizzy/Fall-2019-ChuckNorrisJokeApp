/**
 * Represents a single joke about Chuck Norris from icbn.com
 */
class ChuckNorrisJoke {
    /**
     * The unique id of the joke.
     */
    id:Number;
    /**
     * The text of the joke.
     */
    joke:string;
    /**
     * The categories the joke falls under.
     * NOTE: Some jokes are not categorized.
     */
    categories:string[];
}


window.onload = function() {
    let jokeBtn = document.getElementById("get-joke");

    jokeBtn.onclick = fetchJoke;

    populateCategories();
}

function fetchJoke() {
    let jokeBtn = <HTMLButtonElement>this;
    jokeBtn.disabled = true;

    let loaderImg = document.getElementById("loader");
    loaderImg.classList.add("loader");

    let request = new XMLHttpRequest();
    request.onreadystatechange = handleJokeResponse;

    let url = "https://api.icndb.com/jokes/random";

    if (isCategorySelected()) {
        url += "?limitTo=" + getSelectedCategory();
    }

    //Set URL to send request
    request.open("GET", url);
    //Init request
    request.send();
}

function isCategorySelected():boolean {
    let selIndex = (<HTMLSelectElement>document.getElementById("cat-list")).selectedIndex;

    if (selIndex > 0) {
        return true;
    } 

    return false;
}

/**
 * Return the single category that is selected.
 */
function getSelectedCategory():string {
    let index = (<HTMLSelectElement>document.getElementById("cat-list")).selectedIndex;
    return (<HTMLSelectElement>document.getElementById("cat-list")).options[index].text
}

function handleJokeResponse() {
    let request = <XMLHttpRequest>this;

    //readyState 4 means request is finished 
    //status 200 means "OK" / successful
    if (request.readyState == 4 && request.status == 200) {
        //Hold the json response from the server
        let responseData = JSON.parse(request.responseText);
        let myJoke = <ChuckNorrisJoke>responseData.value;
        displayJoke(myJoke);
        //alert(myJoke.joke);
        //console.log(myJoke);
    }
    else if (request.readyState == 4 && request.status != 200) {
        alert("Please try again later. Something bad happened.");
    }
}

function displayJoke(joke:ChuckNorrisJoke) {
    document.getElementById("joke-display").innerHTML = joke.joke;

    document.getElementById("joke-id").innerHTML = "ID: " + joke.id.toString();

    let categorieList = document.getElementById("categories");
    categorieList.innerHTML = ""; //Clear out categories from any previous joke.

    for (let i = 0; i < joke.categories.length; i++) {
        let item = document.createElement("li");
        item.innerHTML = joke.categories[i];
        categorieList.appendChild(item);
    }

    let catDisplay = document.getElementById("category-display");
    if (joke.categories.length == 0) {
        catDisplay.style.display = "none";
    }
    else {
        catDisplay.style.display = "block";
    }

    let loaderImg = document.getElementById("loader");
    loaderImg.classList.remove("loader");

    //re-enable joke btn so user can get another joke
    (<HTMLButtonElement>document.getElementById("get-joke")).disabled = false;
}

/**
 * Display categories in a drop down list.
 */
function populateCategories() {
    let request = new XMLHttpRequest();
    request.open("GET", "https://api.icndb.com/categories");

    request.onreadystatechange = function() {
        //Request has finished (4) successfully (200)
        if (this.readyState == 4 && this.status == 200) {
            let categories:string[] = JSON.parse(this.responseText).value;
            console.log(categories);
            populateCategoryDropdown(categories);
        }
    }

    request.send();
}

function populateCategoryDropdown(categories:string[]):void {
    let list = document.getElementById("cat-list");
    for (let i = 0; i < categories.length; i++) {
        let option = document.createElement("option");
        option.text = categories[i];
        list.appendChild(option); // Add <option> to the select
    }
}