const getThatPokemon = document.querySelector('button')
const errorMsg = document.querySelector('.place_for_errormsg')
const inputForPokemon = document.querySelector('.pokemon_Input')
const pokemonName = document.querySelector('.pokemon_Name')
const pokemonHeight = document.querySelector('.pokemon_height')
const pokemonAbility = document.querySelector('.pokemon_ability')
const pokemonImg = document.querySelector('.pokemon_Pic')

function clearUI() {
    pokemonAbility.innerText = ''
    pokemonHeight.innerText = ''
    pokemonName.innerText = ''
    pokemonImg.src = ''
    errorMsg.innerText = ''
}

const setTimer = (duration) => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, duration)
    })
    return promise
}

async function fetchPokemonData() {
    try {
        clearUI()
        getThatPokemon.innerText = 'Loading...'
        errorMsg.style.display = 'none'
        
        await setTimer(3000)
        
        const fetchPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputForPokemon.value}`)
        
        if (fetchPokemon.status !== 200) {
            //throw new Error (alert('You entered wrong Pokemon name'))
            errorMsg.innerText = 'Hey, that pokemon does not exist'
            errorMsg.style.display = 'block'
            getThatPokemon.innerText = 'Get that Pokemon'
            inputForPokemon.value = ""
        }
        
        const pokemon = await fetchPokemon.json()
        
        //pokemonInfo
        
        pokemonName.innerText = pokemon.name
        
        pokemonHeight.innerText = `height: ${pokemon.height}`
        pokemonHeight.style.display = 'block'
        
        pokemonAbility.innerText = `abilities: ${pokemon.abilities.map(ability => ability.ability.name)}`
        pokemonAbility.style.display = 'block'
        
        pokemonImg.src = pokemon.sprites.front_default
        
        getThatPokemon.innerText = 'Get that Pokemon'
        inputForPokemon.value = ''
        
        console.log(pokemon)
    }
    catch(error) {
        console.error('Wrong Pokemon name')
    }
}

inputForPokemon.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && inputForPokemon.value.trim() !== '') {
        e.preventDefault()
        fetchPokemonData()
    }
})

getThatPokemon.addEventListener('click', () => {
    if (inputForPokemon.value.trim() !== '') {
        fetchPokemonData}
})