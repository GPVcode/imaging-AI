import fetch from 'node-fetch';

const generatePhotos = async (inputValue) => {
    console.log("touch test")
    const openaiUrl = "https://api.openai.com/v1/images/generations";
    const apiKey = process.env.Openai_Access_Key;
    const bearer = 'Bearer ' + apiKey;
    try {
        console.log("touch test in try block")
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

        if (!response.ok) {
            throw new Error(`Network response was not ok from server: ${response.status}`);
        }

        const data = await response.json();
        const myImages = data.data;

        return myImages;
    } catch (error) {
        console.error('Something bad happened:', error);
        throw error; // Re-throw the error to be handled at the higher level
    }
};


const getPhotos = async (inputValue, page) => {
    console.log("touch test")
    const accessKey =  process.env.Unsplash_Access_Key
    try{
        console.log("touch test in try block")
        const response = await fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${inputValue}&client_id=${accessKey}`)
        const data = await response.json();
        const results = data.results;

        return results;
    } catch (error){
        console.error('Something bad happened:', error);
        throw error; // Re-throw the error to be handled at the higher level
    }
};

export default {
    generatePhotos,
    getPhotos
};