import React, {useReducer} from 'react'
import axios from 'axios'
import {FirebaseContext} from './firebaseContext'
import {firebaseReducer} from './firebaseReducer'
import {ADD_NOTE, FETCH_NOTES, REMOVE_NOTE, SHOW_LOADER} from '../types'

const url = process.env.REACT_APP_DB_URL

export const FirebaseState = ({children}) => {
  const initialState = {
    notes: [],
    loading: false
  }
  const [state, dispatch] = useReducer(firebaseReducer, initialState)

  const showLoader = () => dispatch({type: SHOW_LOADER})

  const fetchNotes = async () => {
    showLoader()
    const res = await axios.get(`${url}/notes.json`)

    const payload = Object.keys(res.data).map(key => {
      return {
        ...res.data[key],
        id: key
      }
    })

    dispatch({type: FETCH_NOTES, payload})
  }

  const addNote = async title => {
    const note = {
      title, date: new Date().toJSON()
    }

    try {
      const res = await axios.post(`${url}/notes.json`, note)
      const payload = {
        ...note,
        id: res.data.name
      }

      dispatch({type: ADD_NOTE, payload})

    } catch (e) {
      throw new Error(e.message)
    }
  }

  const removeNote = async id => {
    await axios.delete(`${url}/notes/${id}.json`)

    dispatch({
      type: REMOVE_NOTE,
      payload: id
    })
  }

  return (
    <FirebaseContext.Provider value={{
      showLoader, addNote, removeNote, fetchNotes,
      loading: state.loading,
      notes: state.notes
    }}>
      {children}
    </FirebaseContext.Provider>
  )
}
