const getThatPokemon = document.querySelector('button')

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
        getThatPokemon.innerText = 'Loading...'
        
        await setTimer(3000)

        const inputForPokemon = document.querySelector('.pokemon_Input')
        const fetchPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputForPokemon.value}`)
        
        if (fetchPokemon.status !== 200) {
            throw new Error('You entered wrong Pokemon name')
        }
        
        const pokemon = await fetchPokemon.json()
        
        //pokemonInfo

        const pokemonName = document.querySelector('.pokemon_Name')
        pokemonName.innerText = pokemon.name

        const pokemonHeight = document.querySelector('.pokemon_height')
        pokemonHeight.innerText = `height: ${pokemon.height}`
        pokemonHeight.style.display = 'block'

        const pokemonAbility = document.querySelector('.pokemon_ability')
        pokemonAbility.innerText = `abilities: ${pokemon.abilities.map(ability => ability.ability.name)}`
        pokemonAbility.style.display = 'block'

        const pokemonImg = document.querySelector('.pokemon_Pic')
        pokemonImg.src = pokemon.sprites.front_default

        getThatPokemon.innerText = 'Get that Pokemon'
        inputForPokemon.value = ''

        console.log(pokemon)
    }
    catch(error) {
        console.error(error)
    }
}

getThatPokemon.addEventListener('click', fetchPokemonData)

document.querySelector('.pokemon_Input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        fetchPokemonData()
    }
})