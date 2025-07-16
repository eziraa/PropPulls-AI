import React from 'react'
import { Provider } from 'react-redux'
import { store } from '../redux/store'

const GlobalProvider = ({children}:{children: React.ReactNode}) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}

export default GlobalProvider