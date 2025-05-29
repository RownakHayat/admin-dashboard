import { create } from 'zustand'

const useLayoutStore = create((set) => ({
    collapse: true,
    toggleMenu: false,
    collapseToggle: () => set((state: any) => ({ collapse: !state.collapse })),
    setToggleMenu: () => set((state: any) => ({ toggleMenu: !state.toggleMenu })),
}))

export default useLayoutStore