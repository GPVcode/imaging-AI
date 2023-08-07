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

// FORM MIDDLEWARE
    // button triggers api call
    const searchBtn = document.querySelector('.Icon');
    // manage input contents
    const searchInput = document.querySelector('.search-input');

    searchBtn.addEventListener('click', () => {
        searchInput.setAttribute('value', searchInput.value)
        // inputValue = searchInput.value;
        const inputValue = searchInput.value;

        OpenaiFetchAPI(inputValue);
    })
    
// END OF FORM MIDDLWARE

// Unsplash API call

// END OF UNSPLASH API
    //  access
    // const accessKey = 'iDW0up-G96bkDL8ycJLkys72YWv5JLImF3DOcL2Nbk8';

    // const showMore = document.getElementById("show-more-container")
// AI API
const OpenaiFetchAPI = async (inputValue) => {
    const imgContainer = document.querySelector(".api-container")
    const imgFiller = document.getElementsByClassName("api-filler");

    // while children, remove each child
    while(imgFiller[0]){
        imgFiller[0].parentNode.removeChild(imgFiller[0]);
    }

    try{
    const url = "https://api.openai.com/v1/images/generations";
    const apiKey = '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';
    const bearer = 'Bearer ' + apiKey;

    const response = await fetch(url, {
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
    // console.log(data['choices'][0].url);

    } catch(error){
        console.error('Something bad happened:', error)
    }
       
}
