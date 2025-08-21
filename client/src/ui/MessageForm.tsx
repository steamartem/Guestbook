import { FormEvent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { createMessage } from '../store/messagesSlice'
import type { AppDispatch } from '../store'

export const MessageForm = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (text.trim() === '') {
      setError('Сообщение обязательно')
      return
    }
    setError(null)
    await dispatch(createMessage({ author: author.trim() || undefined, text: text.trim(), image })).unwrap()
    setText('')
    setAuthor('')
    setImage(null)
    const input = document.getElementById('image-input') as HTMLInputElement | null
    if (input) input.value = ''
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="row">
        <label>
          Автор (необязательно)
          <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Ваше имя" />
        </label>
        <label>
          Изображение (необязательно)
          <input id="image-input" type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        </label>
      </div>
      <label>
        Сообщение*
        <textarea value={text} onChange={(e) => setText(e.target.value)} required placeholder="Ваше сообщение" />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit">Отправить</button>
    </form>
  )
}


