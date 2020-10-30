// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React from 'react'

function useLocalStorageState(key, initialState) {
  const statePair = React.useState(
    () => window.localStorage.getItem(key) || initialState,
  )

  const [state] = statePair

  React.useEffect(
    function persistState() {
      window.localStorage.setItem(key, state)
    },
    [key, state],
  )

  return statePair
}

function Greeting({initialName = ''}) {
  // const [name, setName] = React.useState(
  //   () => window.localStorage.getItem('name') || initialName,
  // )

  // React.useEffect(
  //   function persistName() {
  //     window.localStorage.setItem('name', name)
  //   },
  //   [name],
  // )
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} value={name} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
