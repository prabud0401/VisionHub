import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { GeneratedImage, GeneratedVideo } from '@/lib/types';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  username?: string;
  credits?: number;
  showAds?: boolean;
  storageLimit?: number;
}

export interface GenerationState {
  isGenerating: boolean;
  isEnhancing: boolean;
  isAnalyzing: boolean;
  progress: 'idle' | 'generating' | 'saving' | 'done';
  error: string | null;
  generatedImages: GeneratedImage[] | null;
  selectedImage: string | null;
}

export interface GalleryState {
  images: GeneratedImage[];
  videos: GeneratedVideo[];
  isLoading: boolean;
  currentPage: number;
  sortOrder: 'newest' | 'oldest';
  viewMode: 'small' | 'medium' | 'large';
  selectedGroup: any | null;
  selectedMediaIndex: number | null;
}

export interface UIState {
  isAuthModalOpen: boolean;
  isMobileMenuOpen: boolean;
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
}

interface AppStore {
  // User state
  user: User | null;
  loading: boolean;
  
  // Generation state
  generation: GenerationState;
  
  // Gallery state
  gallery: GalleryState;
  
  // UI state
  ui: UIState;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  
  // Generation actions
  setGenerating: (isGenerating: boolean) => void;
  setGenerationProgress: (progress: GenerationState['progress']) => void;
  setGenerationError: (error: string | null) => void;
  setGeneratedImages: (images: GeneratedImage[] | null) => void;
  setSelectedImage: (imageUrl: string | null) => void;
  resetGeneration: () => void;
  
  // Gallery actions
  setGalleryImages: (images: GeneratedImage[]) => void;
  setGalleryVideos: (videos: GeneratedVideo[]) => void;
  setGalleryLoading: (loading: boolean) => void;
  setGallerySortOrder: (order: 'newest' | 'oldest') => void;
  setGalleryViewMode: (mode: 'small' | 'medium' | 'large') => void;
  setSelectedGroup: (group: any | null) => void;
  setSelectedMediaIndex: (index: number | null) => void;
  
  // UI actions
  setAuthModalOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleTheme: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const initialGenerationState: GenerationState = {
  isGenerating: false,
  isEnhancing: false,
  isAnalyzing: false,
  progress: 'idle',
  error: null,
  generatedImages: null,
  selectedImage: null,
};

const initialGalleryState: GalleryState = {
  images: [],
  videos: [],
  isLoading: false,
  currentPage: 1,
  sortOrder: 'newest',
  viewMode: 'medium',
  selectedGroup: null,
  selectedMediaIndex: null,
};

const initialUIState: UIState = {
  isAuthModalOpen: false,
  isMobileMenuOpen: false,
  theme: 'dark',
  sidebarCollapsed: false,
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        loading: true,
        generation: initialGenerationState,
        gallery: initialGalleryState,
        ui: initialUIState,

        // User actions
        setUser: (user) => set({ user }),
        setLoading: (loading) => set({ loading }),

        // Generation actions
        setGenerating: (isGenerating) =>
          set((state) => ({
            generation: { ...state.generation, isGenerating },
          })),
        
        setGenerationProgress: (progress) =>
          set((state) => ({
            generation: { ...state.generation, progress },
          })),
        
        setGenerationError: (error) =>
          set((state) => ({
            generation: { ...state.generation, error },
          })),
        
        setGeneratedImages: (generatedImages) =>
          set((state) => ({
            generation: { ...state.generation, generatedImages },
          })),
        
        setSelectedImage: (selectedImage) =>
          set((state) => ({
            generation: { ...state.generation, selectedImage },
          })),
        
        resetGeneration: () =>
          set((state) => ({
            generation: initialGenerationState,
          })),

        // Gallery actions
        setGalleryImages: (images) =>
          set((state) => ({
            gallery: { ...state.gallery, images },
          })),
        
        setGalleryVideos: (videos) =>
          set((state) => ({
            gallery: { ...state.gallery, videos },
          })),
        
        setGalleryLoading: (isLoading) =>
          set((state) => ({
            gallery: { ...state.gallery, isLoading },
          })),
        
        setGallerySortOrder: (sortOrder) =>
          set((state) => ({
            gallery: { ...state.gallery, sortOrder },
          })),
        
        setGalleryViewMode: (viewMode) =>
          set((state) => ({
            gallery: { ...state.gallery, viewMode },
          })),
        
        setSelectedGroup: (selectedGroup) =>
          set((state) => ({
            gallery: { ...state.gallery, selectedGroup },
          })),
        
        setSelectedMediaIndex: (selectedMediaIndex) =>
          set((state) => ({
            gallery: { ...state.gallery, selectedMediaIndex },
          })),

        // UI actions
        setAuthModalOpen: (isAuthModalOpen) =>
          set((state) => ({
            ui: { ...state.ui, isAuthModalOpen },
          })),
        
        setMobileMenuOpen: (isMobileMenuOpen) =>
          set((state) => ({
            ui: { ...state.ui, isMobileMenuOpen },
          })),
        
        toggleTheme: () =>
          set((state) => ({
            ui: { 
              ...state.ui, 
              theme: state.ui.theme === 'light' ? 'dark' : 'light' 
            },
          })),
        
        setSidebarCollapsed: (sidebarCollapsed) =>
          set((state) => ({
            ui: { ...state.ui, sidebarCollapsed },
          })),
      }),
      {
        name: 'visionhub-store',
        partialize: (state) => ({
          ui: {
            theme: state.ui.theme,
            sidebarCollapsed: state.ui.sidebarCollapsed,
          },
        }),
      }
    ),
    { name: 'VisionHub Store' }
  )
); 