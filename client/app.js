const fruitDiv = document.getElementById("fruit")

const fruitBtn = document.getElementById("get-fruit")
      fruitBtn.addEventListener('click', getRandomFruit)

const eatBtn = document.getElementById("eat-fruit")
      eatBtn.addEventListener('click', eatFruit)

async function getAFruit(random) {
    const response = await fetch(`http://localhost:3000/fruits/${random}`)
    return response
}

async function getRMStuff() {
    const response = await fetch('https://rickandmortyapi.com/api/character')
    return response
}

const RMStuff = () => {
    getRMStuff()
    .then((response) => {
        // Error handling and parsing of the response
        return response.text()
    })
    .then((data) => {
        // Use the handled data
        console.log(JSON.parse(data).results)
    })
}

console.log('hi')
RMStuff()

async function deleteFruit(fruitName) {
    const response = await fetch(
        `http://localhost:3000/fruits`,
        {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: fruitName
            })
        }
    )

    return response
}

function getRandomFruit() {
    const random = Math.floor(Math.random() * 4 + 1)
    
    getAFruit(random)
    .then((response) => {
        const fruitData = response.json()
        return fruitData
    })
    .then((data) => {
        if(data.name) {
            fruitDiv.innerText = data.name
        }
        else {
            return 'Some server error'
        }
    })
}

function eatFruit() {
    const fruit = fruitDiv.innerText
    console.log(fruit)
    deleteFruit(fruit)
    .then((response) => {
        const fruitData = response.json()
        return fruitData
    })
    .then((data) => {
        console.log(data)
        window.location.reload();
    })
}