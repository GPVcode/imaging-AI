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

// Elements
const imgContainer = document.querySelector(".api-container");
const imgFiller = document.querySelector(".api-filler");
const openAiBtn = document.querySelector('.openai-btn');
const unsplashBtn = document.querySelector('.unsplash-btn');
const showMoreBtn = document.querySelector(".show-more-btn");
const outerContainer = document.querySelector('.outer-container');
const alertContainer = document.querySelector('.alert-container');
const alertMessage = document.querySelector('.alert-message');
const loadingImg = document.getElementById('loading-img');

// Unsplash API call
let currentPage = 1;
const displayPhotos = async (inputValue, currentPage) => {

    try{
        console.log("right after try display Photo")

        const results = await UnsplashFetchAPI(inputValue, currentPage);

        if(currentPage === 1) imgContainer.innerHTML = '';

        results.forEach((result) => {
            const newImg = document.createElement('img');
            newImg.src = result.urls.small_s3;
            newImg.classList.add('api-img');
            newImg.alt = result.alt_description;

            imgContainer.appendChild(newImg);
        });        

    } catch (error){
        console.error('Fetch error:', error);
    }
}
const UnsplashFetchAPI = async (inputValue, currentPage) => {

    try{
        console.log("right after try Unsplash")
        const response = await fetch(`https://imagingai.onrender.com/get-photos?query=${inputValue}&page=${currentPage}`);

        if (!response.ok) {
            console.error(`Network response was not ok: ${response.status}`);
            throw new Error(`Network response was not ok: ${response.status}`);
        };
        const results = await response.json();
        console.log("API response:", results); // Log the response for debugging
        return results;
    } catch(err){
        console.log(`Fetch error: `, err)
        throw err;
    }
}
// END OF UNSPLASH API

// create functions to show and hide loading icon
// place show loading icon right after try and hide loading after catch using finally
const showLoadingIcon = () => {
    loadingImg.classList.remove('hidden');
}
const hideLoadingIcon = () => {
    loadingImg.classList.add('hidden')
}

// AI API
const OpenaiFetchAPI = async (inputValue) => {
    const currentCont = document.querySelector('.alert-container');
    if(currentCont){
        if(alertMessage){
            alertMessage.remove()
        }
        currentCont.remove();
    }
    try{
        console.log("right after try OpenAI")

        showLoadingIcon();
        const response = await fetch('https://imagingai.onrender.com/generate-photos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputValue: inputValue
            })
        });
        if(!response.ok){
            throw new Error(`Network response was not ok from client: ${response.status}`)
        }
        const myImages = await response.json()
        imgContainer.innerHTML = ''; // Clear previous Images

        for(const image of myImages){
            const newImg = document.createElement('img');
            newImg.src = image.url;
            newImg.classList.add('api-img');

            imgContainer.appendChild(newImg);
        }

    } catch(error){
        console.error('Fetch error:', error);
    } finally {
        hideLoadingIcon();
    }
}

const checkForElement = async () => {
    const currentCont = document.querySelector('.alert-container');
    if(!currentCont){
        await createAlert();
    } else {
        () => {}
    }
}

const createAlert = async () => {

        // create div element
        const alertCont = document.createElement('div');
        const alertMsg = document.createElement('p');
        alertCont.setAttribute('class', 'alert-container');
        alertMsg.setAttribute('class', 'alert-message');
        alertMsg.textContent = `Please select an image source.`

        alertCont.appendChild(alertMsg);
        outerContainer.appendChild(alertCont);

}
// END OF AI API

// API Toggle Manger
let apiChoice = ""

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
    showMoreBtn.hidden = true;
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
    showMoreBtn.hidden = false;
})
// END OF TOGGLE MANAGER


// FORM MIDDLEWARE
// button triggers api call
const searchBtn = document.querySelector('.Icon');
// manage input contents
const searchInput = document.querySelector('.search-input');

searchBtn.addEventListener('click', async () => {
    searchInput.setAttribute('value', searchInput.value)
    const inputValue = searchInput.value;

    if(apiChoice === "OPENAIAPI"){
        await OpenaiFetchAPI(inputValue);
    } 
    else if(apiChoice === "UNSPLASHAPI"){
        currentPage = 1;
        await displayPhotos(inputValue, currentPage);
    }
    else {
       await checkForElement();
    }
})
// END OF FORM MIDDLWARE

showMoreBtn.addEventListener('click', async () => {
    const inputValue = searchInput.value;
    currentPage += 1;
    await displayPhotos(inputValue, currentPage);
})

