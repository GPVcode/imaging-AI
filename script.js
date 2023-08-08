// NAVBAR
// grab expanded toggle element
const toggler = document.getElementById('navbar-toggle');
// get toggle element's expanded state
let expandState = toggler.getAttribute('aria-expanded') === 'true';

// create function to toggle expand state
const stateToggle = async () => {
        expandState = !expandState;
        //  get element, then set target attribute to new attribute
        toggler.setAttribute('aria-expanded', expandState)
}
// toggle the expanded state. See stateToggle.
toggler.addEventListener('click', stateToggle) 

// stop click propagation so that any clicks on .navbar-links don’t bubble up and trigger a close.
const navbarMenu = document.querySelector('#navbar-menu');
const navbarLinksContainer = navbarMenu.querySelector('.navbar-links');
navbarLinksContainer.addEventListener('click', (e) => e.stopPropagation());
navbarMenu.addEventListener('click', stateToggle);
// END OF NAVBAR


// URL Mothership
const openaiUrl = "https://api.openai.com/v1/images/generations";
const unsplashUrl = "UNSPLASH URL GOES HERE"

// Unsplash API call
    //  access
    // const accessKey = 'iDW0up-G96bkDL8ycJLkys72YWv5JLImF3DOcL2Nbk8';
const UnsplashFetchAPI = async (inputValue) => {
    console.log("Input Value: ", inputValue);
} 
// END OF UNSPLASH API

// API Toggle Manger
let apiChoice = ""
const openAiBtn = document.querySelector('.openai-btn');
const unsplashBtn = document.querySelector('.unsplash-btn');

openAiBtn.addEventListener('focus', () => {
    openAiBtn.style.boxShadow = '0 1px #05616d';
    openAiBtn.style.backgroundColor = '#0491a3';
    openAiBtn.style.transform = 'translateY(1px)';
    openAiBtn.style.color = 'gold';
})
openAiBtn.addEventListener('blur', () => {
    openAiBtn.style.boxShadow = '';
    openAiBtn.style.backgroundColor = '';
    openAiBtn.style.transform = '';
    openAiBtn.style.color = '';
    apiChoice = 'OPENAIAPI';
})
unsplashBtn.addEventListener('focus', () => {
    unsplashBtn.style.boxShadow = '0 1px #05616d';
    unsplashBtn.style.backgroundColor = '#0491a3';
    unsplashBtn.style.transform = 'translateY(1px)';
    unsplashBtn.style.color = 'gold';
})
unsplashBtn.addEventListener('blur', () => {
    unsplashBtn.style.boxShadow = '';
    unsplashBtn.style.backgroundColor = '';
    unsplashBtn.style.transform = '';
    unsplashBtn.style.color = '';
    apiChoice = 'UNSPLASHAPI';
})
// END OF TOGGLE MANAGER

// AI API
const OpenaiFetchAPI = async (inputValue) => {
    const imgContainer = document.querySelector(".api-container")
    const imgFiller = document.querySelector(".api-filler");

    // while children, remove each child
    while(imgFiller[0]){
        imgFiller[0].parentNode.removeChild(imgFiller[0]);
    }

    try{
    const apiKey = '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';
    const bearer = 'Bearer ' + apiKey;

    const response = await fetch(openaiUrl, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "prompt": `${inputValue}`,
            "n": 6,
            "size": "256x256",
        })
    });

    const data = await response.json();
    const myImages = data.data;

    // after API is successful
    // loop through myImages array, and for each loop
    // create new img element, set src attribute to url
    // and append this newImg element to imgContainer
    for(let i = 0; i < myImages.length; i++){
        let newImg = document.createElement("img");
        newImg.setAttribute('src', myImages[i].url);
        newImg.setAttribute('class', "api-img");

        imgContainer.appendChild(newImg)
    }

    console.log("type of data:", typeof data);
    console.log("Objec keys of data", Object.keys(data));

    } catch(error){
        console.error('Something bad happened:', error)
    }
}
// END OF AI API

// FORM MIDDLEWARE
// button triggers api call
const searchBtn = document.querySelector('.Icon');
// manage input contents
const searchInput = document.querySelector('.search-input');


searchBtn.addEventListener('click', () => {

    searchInput.setAttribute('value', searchInput.value)
    const inputValue = searchInput.value;

    if(apiChoice === "OPENAIAPI"){
        OpenaiFetchAPI(inputValue);
    } else if(apiChoice === "UNSPLASHAPI"){
        UnsplashFetchAPI(inputValue)
    } else {
        console.log("Please select API source")
    }
})
// END OF FORM MIDDLWARE
// Show more button API