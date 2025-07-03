import { atom } from 'jotai'
import type { ChatMessage } from '../types/chat'

export const chatMessagesAtom = atom<ChatMessage[]>([]);

export const inputAtom = atom<string>('')

export const isLoadingAtom = atom<boolean>(false)
