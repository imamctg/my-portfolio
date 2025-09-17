'use client'

import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'
import { ScrollArea } from 'components/ui/scroll-area'
import { useSelector } from 'react-redux'
import { RootState } from 'features/redux/store'
import { Trash2, CheckCheck, Clock } from 'lucide-react'
import { Message } from 'types/chatWindowMessage'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
export interface ChatWindowProps {
  currentUserId: string
  receiverId: string
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  currentUserId,
  receiverId,
}) => {
  const token = useSelector((state: RootState) => state.auth.token)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // ✅ Fetch messages + mark as seen
  useEffect(() => {
    if (!receiverId || !token) return

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `${baseURL}/messages/conversation/${receiverId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setMessages(data || [])

        // ✅ Mark as seen
        await axios.put(
          `${baseURL}/messages/mark-seen/${receiverId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } catch (error) {
        console.error('❌ Error fetching messages:', error)
      }
    }

    fetchMessages()
  }, [receiverId, token])

  // ✅ Scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ✅ Send message
  const sendMessage = async () => {
    const trimmed = newMessage.trim()
    if (!trimmed || !receiverId || !token) return

    try {
      const { data } = await axios.post(
        `${baseURL}/messages`,
        { receiverId, content: trimmed },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setMessages((prev) => [...prev, data])
      setNewMessage('')
    } catch (error) {
      console.error('❌ Error sending message:', error)
    }
  }

  // ✅ Delete single message
  const deleteMessage = async (id: string) => {
    try {
      await axios.delete(`${baseURL}/messages/single/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMessages((prev) => prev.filter((msg) => msg._id !== id))
    } catch (err) {
      console.error('Failed to delete message', err)
    }
  }

  // ✅ Delete all messages
  const deleteAllMessages = async () => {
    if (!confirm('Are you sure you want to delete all messages?')) return

    try {
      await axios.delete(`${baseURL}/messages/all/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMessages([])
    } catch (err) {
      console.error('Failed to delete all messages', err)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className='flex flex-col h-full border rounded-lg p-4 relative'>
      {/* Header */}
      <div className='flex justify-between items-center mb-2'>
        <h3 className='text-lg font-semibold'>Conversation</h3>
        <button
          onClick={deleteAllMessages}
          className='text-sm text-red-600 hover:underline'
        >
          Delete All
        </button>
      </div>

      {/* Message Area */}
      <ScrollArea className='flex-1 overflow-y-auto mb-2'>
        <div className='space-y-2'>
          {messages.map((msg) => {
            const isOwn = msg.senderId === currentUserId
            return (
              <div
                key={msg._id}
                className={`relative max-w-sm px-4 py-2 rounded-lg ${
                  isOwn
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-gray-200 text-black mr-auto'
                }`}
              >
                {/* Message content and delete */}
                <div className='flex justify-between items-center'>
                  <span>{msg.content}</span>
                  {isOwn && (
                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className='ml-2 text-white hover:text-red-200'
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Timestamp + Seen/Sent */}

                <div className='text-xs text-right opacity-70 flex justify-end items-center gap-1 mt-1'>
                  {formatDistanceToNow(new Date(msg.createdAt), {
                    addSuffix: true,
                  })}

                  {isOwn && (
                    <div className='ml-1 text-xs flex items-center gap-1 justify-end'>
                      {msg.seen ? (
                        <>
                          <CheckCheck size={14} className='text-green-300' />
                          <span>Seen</span>
                        </>
                      ) : (
                        <>
                          <Clock size={14} className='text-yellow-400' />
                          <span>Sent but not seen</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input box */}
      <div className='flex mt-2'>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className='flex-1 border rounded-l px-3 py-2'
          placeholder='Type a message...'
        />
        <button
          onClick={sendMessage}
          className='bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600'
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatWindow
