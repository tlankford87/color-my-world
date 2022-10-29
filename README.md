Color My World

Color My World is a mini app created to help artists with picking random color palettes. It uses a hard coded randomizer and gives you 5 unique colors every time you press the random button. You do have the ability to lock any swatch you like the color of and keep randomizing the others.

Link to project: https://colormyworld.netlify.app


![screenshotDesktop](https://user-images.githubusercontent.com/18084667/198815241-1dc2434e-39c3-4a7f-b78d-427cee113ee6.png)
![screenshotMobile](https://user-images.githubusercontent.com/18084667/198815244-37806980-fb6e-4606-baf5-38c89e6cc84b.png)


Tech used: HTML, CSS, JavaScript

This actually started off as a mini app using a color palette generating api. It wasn't until I went to host it that I realized I could not have an app access an http api from an https website. Instead of tossing the project out I decided to hard code a randomizer. The color randomizer is actually a simple Math.ceil(Math.random() * 256) that gives you a random number between 1 and 255. This runs 3 times and each time the value is pushed to an array to create the RGB value for the colors.

Optimizations

In the future I plan to add the ability for user accounts, as well as the ability to save custom color palettes and refer back to them at later dates. I also want to add the ability to get grayscale color palettes or color palettes that follow a color scheme. i.e. red, blue, purple, and get 5 colors falling within the range of the color scheme.


Lessons Learned:

Not being a designer I decided to use a template for the layout. I removed what I didn't need and then built from there. This allowed me to practice reading an already established code base. It wasnt until I went to try the app on mobile that I discovered the template had jquery in it that changed the default behavior and clicking on mobile. This was preventing any of the click event listeners from being activated on mobile. So I dove back into the code base and found the jquery that was the issue and removed it. I also learned about onclick in html to do the lock icons for the color swatches.

