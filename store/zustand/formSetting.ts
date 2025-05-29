import { create } from 'zustand'


const initialState = {
    toggle: false,
    editMode: false,
    filterSearchText: "",
    showData: {},
    params: {
        page: 1,
        limit: 20,
        sortBy: "",
        orderBy: "DESC"
    },
    searchField:""
}

const formSettingStore = create(() => ({ ...initialState }))

export const formToggle = () => {
    formSettingStore.setState((state: any) => ({ toggle: !state.toggle }))
}

export const closeFormToggle = () => {
    formSettingStore.setState((state: any) => ({ showData: {}, editMode: false, toggle: false }))
}

export const editData = (data: any) => {
    formSettingStore.setState((state: any) => ({ showData: data, editMode: true, toggle: true }))
}

export const pageChange = (getValue: any) => {
    formSettingStore.setState((state: any) => ({ params: { ...state.params, page: getValue } }));
}

export const perPageChange = (getValue: any) => {
    formSettingStore.setState((state: any) => ({ params: { ...state.params, limit: Number(getValue) } }));
}

export const pageChangeNext = (getValue: any) => {
    formSettingStore.setState((state: any) => ({ params: { ...state.params, page: getValue } }));
}

export const pageChangePrev = (getValue: any) => {
    formSettingStore.setState((state: any) => ({ params: { ...state.params, page: getValue } }));
}

export const setFilterSearchText = (getValue: any) => {
    formSettingStore.setState((state: any) => ({ ...state.params, filterSearchText: getValue }));
}

export const setSearchFieldName = (getValue: any) => {
    formSettingStore.setState((state: any) => ({ ...state.params, searchField: getValue }));
}

export const sortByChange = (getValue: any) => {
    formSettingStore.setState((state: any) => ({ params: { ...state.params, sortBy: getValue } }));
}

export const orderByChange = (getValue: any) => {
    formSettingStore.setState((state: any) => ({ params: { ...state.params, orderBy: getValue } }));
}


export default formSettingStore