const button = document.querySelector(".button__class");
const resultDiv = document.querySelector(".result_div");
const signin = document.getElementById("signin_tag");
signin.style.display = 'none';

// function getJwtCookies() {
//     return new Promise((resolve, reject) => {
//         chrome.cookies.getAll({
//             url: "https://localhost/", name: "j_w_t"
//         }, (cookies) => {
//             if (chrome.runtime.lastError) {
//                 reject(chrome.runtime.lastError);
//             } else {
//                 resolve(cookies);
//             }
//         });
//     });
// }
// const getJwt = async () => {
//     const jwtRes = await getJwtCookies();
//     return jwtRes;
// }

// console.log(getJwt());

signin.addEventListener('click', (event) => {

    event.preventDefault(); // Prevent the default link behavior

    // Replace 'https://example.com' with the URL you want to open
    const urlToOpen = 'http://localhost:3000/';

    // Create a new tab to open the URL
    chrome.tabs.create({ url: urlToOpen });
});

const getQuestionDetails = () => {

    const questionTitle = document.querySelector(`#app>div>div.main__2_tD>div.content__3fR6>div>div.side-tools-wrapper__1TS9>div>div.css-1gd46d6-Container.e5i1odf0>div.css-jtoecv>div>div.tab-pane__ncJk.css-1eusa4c-TabContent.e5i1odf5>div>div.css-101rr4k>div.css-v3d350`).innerHTML;


    let questionDifficulty = document.querySelector(`#timer-difficulty > div`);


    questionDifficulty = questionDifficulty.innerHTML;

    const userNameHTML = document.querySelector(`#headlessui-menu-items-6 > div > div.flex.shrink-0.items-center.px-4.pb-4.pt-1.md\\:px-\\[1px\\]>div > a`);
    const userName = userNameHTML.innerHTML;
    const questiontitleArray = questionTitle.split(".");
    const url = document.URL;

    const questionId = parseInt(questiontitleArray[0]);
    const questionTitleString = questiontitleArray[1].trim();
    console.log({ userName, questionId, questionTitleString, questionDifficulty, url })
    return { userName, questionId, questionTitleString, questionDifficulty, url };
}
button.addEventListener("click", async () => {
    chrome.cookies.getAll({
        url: "https://localhost/", name: "j_w_t"
    }, (cookie) => {
        console.log(cookie);
        chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
            const tab = tabs[0];

            const questionObj = await chrome.scripting.executeScript({
                target: { tabId: tab.id, allFrames: true },
                func: getQuestionDetails,
            });
            const question = questionObj[0].result;
            if (cookie.length === 0) {
                signin.style.display = "block";
            } else if (question === null) {
                resultDiv.innerHTML = "Some error occured";
            } else {

                try {
                    fetch(`http://localhost:5000/api/users/${question.userName}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            'Cookie': cookie

                        },
                        body: JSON.stringify(question)
                    }).then((res) => {
                        return res.text();
                    }).then((text) => {
                        resultDiv.innerHTML = text;
                    })
                } catch (error) {
                    resultDiv.innerHTML = "error occured";
                }
            }

        });
    });

})

