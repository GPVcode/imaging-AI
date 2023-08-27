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
const loadingImg = document.getElementById('loading-img');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const loginButton = document.getElementById('loginButton');
const loginLink = document.getElementById('loginLink');
const closeButton = document.getElementById('closeButton');
const loginUsernameInput = document.getElementById('username');
const loginPasswordInput = document.getElementById('password');
const backdrop = document.getElementById('backdrop');
const registerLink = document.getElementById('registerLink');
const registerModal = document.querySelector('.registerModal');
const registerCloseButton = document.getElementById('registerCloseButton')
const registerForm = document.getElementById('registerForm');
const registerUsernameInput = document.getElementById('registerUsername');
const registerEmailInput = document.getElementById('registerEmail');
const registerPasswordInput = document.getElementById('registerPassword');


const handleLogin = async (username, password) => {
    try{
        const response = await fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if(response.ok){
            const data = await response.json();
            const token = data.token;

            // Store token in localStorage
            localStorage.setItem('token', token);
            loginModal.style.display = "none"; // close modal after handling form submission
            backdrop.style.display = 'none';
            // window.location.href = '/';
                    
        } else {
             // Registration failes
             const errorData = await response.json();
             if(errorData){
                displayLoginError(errorData)
             }
        }
    } catch (error) {
        console.error('Login error:', error);
        await createLoginAlert()
    }
}
const displayLoginError = (errorData) => {
    const loginErrorContainer = document.getElementById('loginError');
    loginErrorContainer.textContent = errorData.message;
    loginErrorContainer.style.color = 'red';
}
const handleRegister = async (username, email, password) => {
    try {
        const response = await fetch('http://localhost:5000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });
        
        if(response.ok){
            // registration successful
            const data = await response.json();
            console.log('Registration successful.', data.message);
            loginModal.style.display = "flex"; // close modal after handling form submission
            registerModal.style.display = "none"; // close modal after handling form submission
        } else {
            // Registration failes
            const errorData = await response.json();
            if(errorData){
                displayRegistrationError(errorData)
            }
        }
    } catch (error){
        console.error('Register error:', error);
    }
};

const displayRegistrationError = (errorData) => {
    const registrationErrorContainer = document.getElementById('registrationError');
    registrationErrorContainer.textContent = errorData.message;
    registrationErrorContainer.style.color = 'red';
}

const getStoredToken = () => {
   return localStorage.getItem('token');
}
const checkAuthorization = async () => {
    const token = getStoredToken();
    
    // if (token) {
    //     try {
    //         const response = await fetch('http://localhost:5000/auth/check-authorization', {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });

    //         if (response.ok) {
                    // return true;
    //             console.log('User has authorization.');
    //         } else {
    //             console.log('User is not authorized.');
    //             return false;
    //         }
    //     } catch (error) {
    //         console.error('Authorization check error:', error);
            //    return false;
    //     }
    // }
    return true
}
// create authorization and authentication functions. 
// use these functions where API calls are made such as buttons.
// Authentication and Authorizations Functions:
const userIsAuthenticated = () => {
    const token = getStoredToken();
    return !!token // Return true if token is present, indicating an authenticated user
};
const userHasAuthorization = () => {
    const authorization = checkAuthorization();
    console.log("auth debug", authorization)

    return !!authorization;
};

const updateNavbarButton = () => {
    if(userIsAuthenticated()){
        loginButton.textContent = 'Logout';
    } else {
        loginButton.textContent = 'Login';
    }
};
updateNavbarButton();

loginButton.addEventListener('click', async (e) => {
    if(userIsAuthenticated()) {
        handleLogout();
    } else {
        removeAlert();
        loginModal.style.display = 'flex';
        backdrop.style.display = 'block';
    }
    updateNavbarButton();
})

const handleLogout = () => {
    try {
        // Clear token from the client
        localStorage.removeItem('token');
        window.location.href = '/';
    } catch (error) {
        console.error('Logout error:', error);
        // Handle the error, if necessary
    }
};

closeButton.addEventListener('click', (e) => {
    loginModal.style.display = "none";
    backdrop.style.display = 'none';
});

registerCloseButton.addEventListener('click', (e) => {
    console.log("button is clicked")
    registerModal.style.display = 'none';
    backdrop.style.display = 'none';

});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    // handle login form submission
    const username = loginUsernameInput.value;
    const password = loginPasswordInput.value;

    // call handleLogin function to perform API call
    await handleLogin(username, password);
});

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    // handle register form submission
    const username = registerUsernameInput.value;
    const email = registerEmailInput.value;
    const password = registerPasswordInput.value;

    // call registerLogin function to perform API call
    await handleRegister(username, email, password);
    // loginModal.style.display = "flex"; // close modal after handling form submission
    // registerModal.style.display = "none"; // close modal after handling form submission

})
registerLink.addEventListener('click', e => {
    loginModal.style.display = "none";
    registerModal.style.display = "flex";
});

loginLink.addEventListener('click', e => {
    registerModal.style.display = "none";
    loginModal.style.display = "flex";
});

// Unsplash API call
let currentPage = 1;
const displayPhotos = async (inputValue, currentPage) => {
    try{
        const results = await UnsplashFetchAPI(inputValue, currentPage);
        if(currentPage === 1) imgContainer.innerHTML = '';

        results.forEach((result) => {
            const newImg = document.createElement('img');
            newImg.src = result.urls.small_s3;
            newImg.classList.add('api-img');
            newImg.alt = result.alt_description;

            imgContainer.appendChild(newImg);
        });        

        showMoreBtn.hidden = false;

    } catch (error){
        console.error('Fetch error:', error);
    };
};

// common function to remove alert message and container
const removeAlert = () => {
    const currentCont = document.querySelector('.alert-container');
    if(currentCont){
        const alertMessage = currentCont?.querySelector('.alert-message');    
        if(alertMessage){
            alertMessage.remove();
        }
        currentCont.remove();
    }
}

const UnsplashFetchAPI = async (inputValue, currentPage) => {
    try{
        removeAlert();

        if(userIsAuthenticated() && userHasAuthorization()){
            const token = getStoredToken();
            const response = await fetch(`https://imagingai.onrender.com/get-photos?query=${inputValue}&page=${currentPage}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                console.error(`Network response was not ok: ${response.status}`);
                throw new Error(`Network response was not ok: ${response.status}`);
            };
            const results = await response.json();
        
            return results;
        } else {
            // Handle unauthorized action
            console.log('User is not authorized to perform this action.');
            createCredAlert()
        }
    } catch(err){
        console.log(`Fetch error: `, err)
        throw err;
    }
};
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
    try{
        removeAlert();
        showMoreBtn.hidden = true;

        showLoadingIcon();
        if(userHasAuthorization() && userIsAuthenticated()){
            const token = getStoredToken
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
        } else {
            // Handle unauthorized action
            console.log('User is not authorized to perform this action.');
            createCredAlert();
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
    // Create alert elements using template literals
    const alertHTML = `
        <div class="alert-container">
            <p class="alert-message">Please select an image source.</p>
        </div>
    `;
    // create div container element
    const alertCont = document.createElement('div');
    alertCont.innerHTML = alertHTML;
    outerContainer.appendChild(alertCont)
}

const createCredAlert = async () => {
    const alertHTML = `
    <div class="alert-container">
        <p class="alert-message">Please register or log in.</p>
    </div>
    `;
    const alertCont = document.createElement('div');
    alertCont.innerHTML = alertHTML;
    outerContainer.appendChild(alertCont);
}

const createLoginAlert = async () => {
    const alertHTML = `
    <div class="alert-container">
        <p class="alert-message">Login failed. Please try again or register an account. </p>
    </div>
    `;
    const alertCont = document.createElement('div');
    alertCont.innerHTML = alertHTML;
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
})
// END OF TOGGLE MANAGER


// FORM MIDDLEWARE
// button triggers api call
const searchBtn = document.querySelector('.Icon');
// manage input contentscd server
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


const fetchAuthenticatedData = async () => {
    const token = getStoredToken();

    if(token){
        try{
            const response = await fetch('/api/protected-resource', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if(response.ok){
                const data = await response.json();
                // Process the authenticated data
            } else {
                throw new Error('Authentication failed'); // Throw an error to handle authentication error
            }
        } catch (error){
            console.error('Authentication error:', error);
            // Handle the error, e.g., redirect to login page or display an error message
        }
        
    } else {
        // redirect to login page
        window.location.href = '/login';
    }
};

