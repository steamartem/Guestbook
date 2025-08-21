import { useSelector } from 'react-redux'
import type { RootState } from '../store'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function resolveImageUrl(image?: string): string | undefined {
  if (!image) return undefined
  return image.startsWith('http') ? image : `${API_URL}${image}`
}

export const MessageList = () => {
  const messages = useSelector((s: RootState) => s.messages.items)

  return (
    <div className="list">
      {messages.map((m) => (
        <div key={m.id} className="card">
          <div className="card-header">
            <span className="author">{m.author || 'Anonymous'}</span>
            <span className="date">{new Date(m.createdAt).toLocaleString()}</span>
          </div>
          <p className="text">{m.text}</p>
          {resolveImageUrl(m.image) && (
            <img src={resolveImageUrl(m.image)} alt="attachment" className="image" />
          )}
        </div>
      ))}
    </div>
  )
}


