// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon'

// LESSONS:
// 1. React can't batch state updates in an asynchronous callback (like our promise success and error handlers).

function PokemonInfo({pokemonName}) {
  // Extra 3
  const [{pokemon, status, error}, setState] = React.useState({status: 'idle'})

  // const [pokemon, setPokemon] = React.useState(null)

  // // Extra 1
  // const [error, setError] = React.useState(null)

  // // Extra 2
  // const [status, setStatus] = React.useState('idle')

  React.useEffect(() => {
    if (!pokemonName) return

    // setStatus('pending')
    setState({status: 'pending'})

    fetchPokemon(pokemonName).then(
      pokemonData => {
        // Order matters
        // setPokemon(pokemonData)
        // setStatus('resolved')

        setState({pokemon: pokemonData, status: 'resolved'})
      },
      error => {
        // setError(error)
        // setStatus('rejected')

        setState({error, status: 'rejected'})
      },
    )
  }, [pokemonName])

  switch (status) {
    case 'idle':
      return 'Submit a pokemon'

    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />

    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />

    case 'rejected':
      // return (
      //   <div role="alert">
      //     There was an error:{' '}
      //     <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      //   </div>
      // )

      // Extra 4
      throw error

    default:
      throw new Error(`Status ${status} not supported`)
  }

  // Extra 1
  // if (error) {
  //   return (
  //     <div role="alert">
  //       There was an error:{' '}
  //       <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
  //     </div>
  //   )
  // }

  // return !pokemonName ? (
  //   'Submit a pokemon'
  // ) : !pokemon ? (
  //   <PokemonInfoFallback name={pokemonName} />
  // ) : (
  //   <PokemonDataView pokemon={pokemon} />
  // )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName("")
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
