import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export type Message = {
  id: string
  author: string
  text: string
  image?: string
  createdAt: string
}

export type NewMessagePayload = {
  author?: string
  text: string
  image?: File | null
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const fetchMessages = createAsyncThunk<Message[]>(
  'messages/fetchAll',
  async () => {
    const { data } = await axios.get<Message[]>(`${API_URL}/messages`)
    return data
  }
)

export const createMessage = createAsyncThunk<Message, NewMessagePayload>(
  'messages/create',
  async (payload) => {
    const form = new FormData()
    if (payload.author) form.append('author', payload.author)
    form.append('text', payload.text)
    if (payload.image) form.append('image', payload.image)
    const { data } = await axios.post<Message>(`${API_URL}/messages`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  }
)

type MessagesState = {
  items: Message[]
  loading: boolean
  error?: string
}

const initialState: MessagesState = {
  items: [],
  loading: false,
}

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true
        state.error = undefined
      })
      .addCase(fetchMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to load messages'
      })
      .addCase(createMessage.pending, (state) => {
        state.error = undefined
      })
      .addCase(createMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.items.push(action.payload)
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create message'
      })
  },
})

export default messagesSlice.reducer


