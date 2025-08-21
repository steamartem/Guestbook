import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { fetchMessages } from '../store/messagesSlice'
import { MessageForm } from './MessageForm'
import { MessageList } from './MessageList'

export const App = () => {
  const dispatch = useDispatch<AppDispatch>()
  const loading = useSelector((s: RootState) => s.messages.loading)

  useEffect(() => {
    dispatch(fetchMessages())
  }, [dispatch])

  return (
    <div className="container">
      <h1>Guestbook</h1>
      <MessageForm />

      {loading && <p>Loading…</p>}
      <MessageList />
    </div>
  )
}


