let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchesFound = 0;
let attempts = 0;

const gameBoard = document.getElementById('game-board');
const attemptsCountSpan = document.getElementById('attempts-count');
const matchesCountSpan = document.getElementById('matches-count');
const gameMessageDiv = document.getElementById('game-message');
const categorySelect = document.getElementById('category-select');
const startGameBtn = document.getElementById('start-game-btn');

const categories = {
    "politicians": [
        {
            "id": "ambedkar-10",
            "img1": "https://static.toiimg.com/thumb/msid-96019398,width-400,resizemode-4/96019398.jpg",
            "img2": "https://i.kym-cdn.com/photos/images/original/000/388/245/f4b.jpg",
            "name": "Ambedkar"
        },
        {
            "id": "modi-11",
            "img1": "https://www.india.com/wp-content/uploads/2017/05/PM-Modi-coy.jpg",
            "img2": "https://www.hindustantimes.com/ht-img/img/2025/06/27/1600x900/Screenshot_2025-06-27_153002_1751018416204_1751018423944.png",
            "name": "Modi"
        },
        {
            "id": "trump-12",
            "img1": "https://media.wired.com/photos/64e8dfe4cedb032afb4ceccd/master/w_2560%2Cc_limit/Donald-Trump-Mugshot-Depth-Of-Field-Culture-1621335357.jpg",
            "img2": "https://www.aljazeera.com/wp-content/uploads/2025/01/AFP__20250120__36UX28A__v2__HighRes__TopshotUsPoliticsTrumpInauguration-1737420954.jpg?resize=770%2C513&quality=80",
            "name": "Trump"
        },
        {
            "id": "yogi-15",
            "img1": "https://images.assettype.com/nationalherald/2018-10/e91d9685-71a0-45bc-a0dd-a149a6d66084/yogi_adityanath_allahabad_prayagraj_social_media.jpg",
            "img2": "https://i.imgflip.com/8v603n.jpg",
            "name": "Yogi"
        },
        {
            "id": "nirmala-17",
            "img1": "https://im.indiatimes.in/content/2024/Dec/popcorn-tax_6767ad8b74065.jpeg?w=1200&h=900&cc=1&webp=1&q=75",
            "img2": "https://i.pinimg.com/736x/e4/3d/fc/e43dfc3421f73c2983ea9aa68d5e5e3c.jpg",
            "name": "Nirmala"
        },
        {
            "id": "xi-jinping-13",
            "img1": "https://pics.craiyon.com/2023-08-02/344d748371ce43beb514565b305c43ad.webp",
            "img2": "https://en.meming.world/images/en/thumb/f/f0/Winnie_the_Pooh_Reading.jpg/300px-Winnie_the_Pooh_Reading.jpg",
            "name": "Xi jinping"
        },
        {
            "id": "imran-khan-14",
            "img1": "https://i.pinimg.com/736x/43/f9/cf/43f9cfa6e5fd78b9bc93d9151366a344.jpg",
            "img2": "https://content.imageresizer.com/images/memes/Jail-meme-3.jpg",
            "name": "Imran khan"
        },
        {
            "id": "jay-shah-16",
            "img1": "https://pbs.twimg.com/media/F93MpqUaEAI3mjE.jpg",
            "img2": "https://nichefilmfarm.com/blogs/wp-content/uploads/2023/02/How-to-Write-a-Movie-Script-1024x576.jpg",
            "name": "Jay shah"
        }
    ],
    "celebrities": [
        {
            "id": "salman-khan-0",
            "img1": "https://i.pinimg.com/736x/32/2b/39/322b392e54dcef3e00ed2ea5f4a26f11.jpg",
            "img2": "https://st1.photogallery.ind.sh/wp-content/uploads/indiacom/a-meme-on-salman-khans-acquittal-from-black-buck-case-201607-1469619098-650x510.jpg",
            "name": "Salman khan"
        },
        {
            "id": "sanjay-dutt-1",
            "img1": "https://allmemetemplates.wordpress.com/wp-content/uploads/2020/03/img_20200802_130855.jpg",
            "img2": "https://preview.redd.it/we-have-ak-at-home-v0-jusrurc0iymb1.jpg?width=640&crop=smart&auto=webp&s=b195ae0e259121eaba0ab2a15c7530e431c6bc42",
            "name": "Sanjay dutt"
        },
        {
            "id": "hritik--2",
            "img1": "https://i.pinimg.com/736x/67/42/c8/6742c869b332eebe26572c9a7ffee336.jpg",
            "img2": "https://c8.alamy.com/comp/EMJD0M/double-like-thumbs-up-vector-web-icon-EMJD0M.jpg",
            "name": "Hritik "
        },
        {
            "id": "akshay-3",
            "img1": "https://i.imgflip.com/6g5xo1.png",
            "img2": "https://thunderdungeon.com/wp-content/uploads/2024/10/canada-memes-26-20241011.jpg",
            "name": "Akshay"
        },
        {
            "id": "ranvir-4",
            "img1": "https://assets.rebelmouse.io/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbWFnZSI6Imh0dHBzOi8vYXNzZXRzLnJibC5tcy8zMDE4MTQ5Mi9vcmlnaW4uanBnIiwiZXhwaXJlc19hdCI6MTc5MTE1OTY3MX0.rhbabB-YRQCHYdcFLz36ov_xoEMPpsaWgt68IwoHD8U/img.jpg?width=1200&height=800&quality=100&coordinates=0%2C165%2C0%2C0",
            "img2": "https://static.gofugyourself.com/uploads/2023/01/Van-Beirendonck-m-F23-001-1674094972.jpg",
            "name": "Ranvir"
        },
        {
            "id": "emraan-hashmi-5",
            "img1": "https://memes.co.in/Uploads/Media/May25/Sat31/1568/4bdf721e.jpg",
            "img2": "https://ih1.redbubble.net/image.777674259.7114/raf,360x360,075,t,fafafa:ca443f4786.jpg",
            "name": "Emraan hashmi"
        },
        {
            "id": "tiger-shroff-6",
            "img1": "https://i.pinimg.com/736x/1c/96/d2/1c96d267de9b4be60b653031d1290964.jpg",
            "img2": "https://dudewipes.com/cdn/shop/articles/why-do-we-fart.jpg?v=1703723732&width=2048",
            "name": "Tiger shroff"
        },
        {
            "id": "ajay-7",
            "img1": "https://indianmemetemplates.com/wp-content/uploads/sad-ajay-devgn.jpg",
            "img2": "https://guptagoesgreek.com/wp-content/uploads/2016/12/73605318.jpg",
            "name": "Ajay"
        },
        {
            "id": "amber-8",
            "img1": "https://static.mothership.sg/1/2022/05/beecover.jpeg",
            "img2": "https://img.artpal.com/424512/184-21-5-7-18-44-23m.jpg",
            "name": "Amber"
        },
    ]
};

const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

const initGame = () => {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matchesFound = 0;
    attempts = 0;
    updateGameInfo();
    gameMessageDiv.textContent = '';

    //clearing prev cards
    gameBoard.replaceChildren();

    const selectedCategory = categorySelect.value;
    const allPairs = categories[selectedCategory];

    //picking random 6 pairs
    const shuffledPairs = [...allPairs];
    shuffle(shuffledPairs);
    const selectedPairs = shuffledPairs.slice(0, 6);

    cards = [];
    selectedPairs.forEach(pair => {
        cards.push({
            imgSrc: pair.img1,
            pairId: pair.id,
            isFlipped: false,
            isMatched: false,
            element: null
        });
        cards.push({
            imgSrc: pair.img2,
            pairId: pair.id,
            isFlipped: false,
            isMatched: false,
            element: null
        });
    });

    //shuffling the 12 cards for arrangement
    shuffle(cards);
    cards.forEach((cardData, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.index = index;
        cardElement.dataset.pairId = cardData.pairId;

        const front = document.createElement('div');
        front.classList.add('front-face');
        front.textContent = "?"
        const back = document.createElement('div');
        back.classList.add('back-face');
        const img = document.createElement('img');
        img.src = cardData.imgSrc;
        img.alt = cardData.name;

        back.appendChild(img);
        cardElement.appendChild(front);
        cardElement.appendChild(back);

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
        cardData.element = cardElement;
    });
}

const flipCard = (event) => {
    if (lockBoard) return;

    const clickedCardElement = event.currentTarget;
    const cardData = cards[clickedCardElement.dataset.index];

    if (cardData.isFlipped || cardData.isMatched) return;

    cardData.isFlipped = true;
    clickedCardElement.classList.add('flipped');

    if (!firstCard) {
        firstCard = cardData;
    } else {
        secondCard = cardData;
        attempts++;
        updateGameInfo();
        lockBoard = true;
        checkForMatch();
    }
}

const checkForMatch = () => {
    if (firstCard.pairId === secondCard.pairId) {
        disableCards();
    } else {
        unflipCards();
    }
}

const disableCards = () => {
    matchesFound++;
    updateGameInfo();

    firstCard.isMatched = true;
    secondCard.isMatched = true;
    firstCard.element.classList.add('matched');
    secondCard.element.classList.add('matched');

    firstCard.element.removeEventListener('click', flipCard);
    secondCard.element.removeEventListener('click', flipCard);

    resetBoard();
    checkWin();
}

const unflipCards = () => {
    gameMessageDiv.textContent = 'No match! Try again.';
    setTimeout(() => {
        firstCard.isFlipped = false;
        secondCard.isFlipped = false;
        firstCard.element.classList.remove('flipped');
        secondCard.element.classList.remove('flipped');
        gameMessageDiv.textContent = '';
        resetBoard();
    }, 1000);
}

const resetBoard = () => {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

const updateGameInfo = () => {
    attemptsCountSpan.textContent = attempts;
    matchesCountSpan.textContent = matchesFound;
}

const checkWin = () => {
    if (matchesFound === cards.length / 2) { // Total pairs = total cards / 2
        gameMessageDiv.textContent = `Congratulations! You found all pairs in ${attempts} attempts!`;
    }
}

startGameBtn.addEventListener('click', initGame);
document.addEventListener('DOMContentLoaded', initGame);
