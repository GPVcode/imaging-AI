Today I asked about building a loader while my ai generates images based on user input.
I found that I can create an img element within a div element. I attributed hidden to the img's class and an arbitrary label for the id. I then found an svg to use for my loader and set that as the img src.
I then set hidden class to display none in css. I also made inital CSS setup for the loader container.
Then I created a function to load the icon, as well as a function to hide the icon. To hide and show the icons, I added and removed the class .hidden to manage DOM results.
Next, I placed the show loading icon immediately in my try block placed the hide loading icon in a finally block. This is where I learned about the finally block.
The finally block is commonly used for cleanup, resource release, and finalization tasks.