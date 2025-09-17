/// <reference path="../../types/index.d.ts" />

// src/modules/message/message.controller.ts

import { Request, Response } from 'express'
import * as MessageService from './message.service'

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const senderId = req.user!._id.toString()
    const { receiverId, content } = req.body

    const message = await MessageService.sendMessage(
      senderId,
      receiverId,
      content
    )
    res.status(201).json(message)
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message' })
  }
}

export const getMessages = async (req: Request, res: Response) => {
  try {
    const senderId = req.user!._id.toString()
    const { receiverId } = req.params

    const messages = await MessageService.getMessagesBetweenUsers(
      senderId,
      receiverId
    )
    res.status(200).json(messages)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages' })
  }
}

// export const deleteMessages = async (req: Request, res: Response) => {
//   try {
//     const { messageIds } = req.body
//     await MessageService.deleteMessages(messageIds)
//     res.status(200).json({ message: 'Messages deleted' })
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to delete messages' })
//   }
// }

export const deleteSingleMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params
    await MessageService.deleteSingleMessage(messageId)
    res.status(200).json({ message: 'Message deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete message' })
  }
}

export const deleteAllMessagesWithUser = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user!._id.toString()
    const { userId: otherUserId } = req.params
    await MessageService.deleteAllMessagesBetweenUsers(userId, otherUserId)
    res.status(200).json({ message: 'All messages deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete messages' })
  }
}

export const getAvailableUsers = async (req: Request, res: Response) => {
  try {
    console.log(req.user, 'controller .....')
    const users = await MessageService.getAvailableUsers(req.user!)
    console.log(users, 'users 181')
    res.status(200).json({ users })
  } catch (err) {
    console.error(err, '184')
    res.status(500).json({ message: 'Failed to fetch available users' })
  }
}

export const markMessagesAsSeen = async (req: Request, res: Response) => {
  try {
    const senderId = req.params.receiverId
    const receiverId = req.user!._id.toString()
    await MessageService.markMessagesAsSeen(senderId, receiverId)
    res.status(200).json({ message: 'Messages marked as seen' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update seen status' })
  }
}
