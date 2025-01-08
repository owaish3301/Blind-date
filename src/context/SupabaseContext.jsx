import { createContext, useContext, useEffect } from 'react'
import { supabase } from '../utils/supabase'

const SupabaseContext = createContext()

export function SupabaseProvider({ children }) {
  useEffect(() => {
    const channel = supabase
      .channel('card-updates')
      .on('presence', { event: 'sync' }, () => {
        console.log('Presence sync')
      })
      .on('broadcast', { event: 'card-update' }, payload => {
        console.log('Card update:', payload) 
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => useContext(SupabaseContext)