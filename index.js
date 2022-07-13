const API_KEY = "VLmzKksVIFJ0zoWXZy37POmJf9bKt8HK06JzYf20zxg";
const imageContainer = document.querySelector(".image__container");
const loading = document.querySelector(".loading");
const errorDiv = document.querySelector(".error__div");
const backdrop = document.querySelector(".backdrop");

let ready = false;
let loadedImages = 0;
let apiURL, count;

const imageLoaded = () => {
    loadedImages++;
    ready = loadedImages === count ? true : false;
};

const showLoading = () => {
    loading.classList.remove("hidden");
};

const hideLoading = () => {
    loading.classList.add("hidden");
};

const showBackdrop = () => {
    backdrop.classList.remove("hidden");
};

const hideBackdrop = () => {
    backdrop.classList.add("hidden");
};

async function getImages() {
    showLoading();
    ready = false;
    loadedImages = 0;

    const mediaQuery = window.matchMedia("(min-width: 60rem)");
    if (mediaQuery.matches) {
        count = 20;
    } else {
        count = 10;
    }
    try {
        apiURL = `https://api.unsplash.com/photos/random?client_id=${API_KEY}&count=${count}&crop=faces,center`;
        const data = await fetch(apiURL);
        const response = await data.json();
        console.log(response);
        response.forEach((photo) => {
            const description = photo.description;
            const hotlink = photo.links.html;
            const imageURL = photo.urls.regular;
            let firstName = photo.user.first_name;
            let lastName = photo.user.last_name;
            if (!lastName) {
                lastName = "";
            }

            const image = document.createElement("img");
            image.setAttribute("src", imageURL);
            image.setAttribute("alt", description);
            image.setAttribute(
                "title",
                `Photo by ${firstName} ${lastName} on Unsplash`
            );
            image.addEventListener("click", () => {
                window.open(hotlink, "_blank");
            });
            image.addEventListener("load", imageLoaded);
            imageContainer.appendChild(image);
        });
    } catch (error) {
        showBackdrop();
        errorDiv.style.top = "1rem";
        errorDiv.style.opacity = "1";
        const errorMessage = document.createElement("h3");
        errorMessage.innerHTML = error;
        errorDiv.appendChild(errorMessage);
    }
    hideLoading();
}

backdrop.addEventListener("click", () => {
    errorDiv.style.top = "-10rem";
    errorDiv.style.opacity = "0";
    hideBackdrop();
});

window.addEventListener("scroll", () => {
    if (
        window.scrollY + window.innerHeight >=
            imageContainer.scrollHeight - 700 &&
        ready
    ) {
        getImages();
    }
});

setTimeout(() => {
    getImages();
}, 3500);
