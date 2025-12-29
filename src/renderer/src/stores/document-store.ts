// src/renderer/src/stores/document-store.ts
import { create } from 'zustand'
import { Document, DocumentUpload } from '../types/document'

interface DocumentState {
  documents: Document[]
  uploads: DocumentUpload[]
  isLoading: boolean

  loadDocuments: () => Promise<void>
  addDocument: (document: Document) => void
  removeDocument: (documentId: string) => Promise<void>
  updateUploadProgress: (fileName: string, progress: number) => void
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  uploads: [],
  isLoading: false,

  loadDocuments: async () => {
    set({ isLoading: true })
    // Fetch from Supabase via electron IPC
    set({ isLoading: false })
  },

  addDocument: (document) =>
    set((state) => ({
      documents: [...state.documents, document]
    })),

  removeDocument: async (documentId) => {
    // await window.electron.deleteDocument(documentId);
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== documentId)
    }))
  },

  updateUploadProgress: (fileName, progress) =>
    set((state) => ({
      uploads: state.uploads.map((u) => (u.file.name === fileName ? { ...u, progress } : u))
    }))
}))
