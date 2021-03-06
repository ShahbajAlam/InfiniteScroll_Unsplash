const API_KEY = "YE7vZmIFpnmCHaKnfqGKSkZJEEvhFYpB_4_oXotwqI0";
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
        count = 25;
    } else {
        count = 15;
    }
    try {
        apiURL = `https://api.unsplash.com/photos/random?client_id=${API_KEY}&count=${count}&crop=faces,center`;
        const data = await fetch(apiURL);
        if (!data.ok) {
            if (data.status == 403) {
                throw new Error(
                    `Fetch limit exceeded, please try again later!!\n
                    (current maximum API request count is 50 / hour)`
                );
            }
        }
        const response = await data.json();
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
        console.log(error);
        errorDiv.style.top = "1rem";
        errorDiv.style.opacity = "1";
        const errorMessage = document.createElement("h3");
        errorMessage.innerHTML = error.message;
        errorMessage.style.textAlign = "center";
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
