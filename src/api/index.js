import request from './request'
const BASE_URL = 'http://192.168.1.14:3001'

export const reqAddDocment = (doc) => (request(BASE_URL + '/admin/docment/add', { ...doc }, "POST"))

export const reqAllDocument = () => (request(BASE_URL + '/docment/all'))

export const reqDocumentDetail = (id) => (request(BASE_URL + '/docment/detail', { id }))

export const reqDeleteDoc = (id) => (request(BASE_URL + '/admin/docment/delete', { id }, 'POST'))

export const reqUpdateDoc = (id, doc) => (request(BASE_URL + '/admin/docment/update', { id, doc }, 'POST'))

export const reqSearch = (keyword) => (request(BASE_URL + '/search', { keyword }))

export const reqSearchByTag = (keyword) => (request(BASE_URL + '/search/tag', { keyword }))

export const reqLogin = (username, password) => (request(BASE_URL + '/login', { username, password }, 'POST'))

export const reqAddResourcesCate = (name) => (request(BASE_URL + '/admin/resources/add_cate', { name }, 'POST'))

export const reqResourcesCate = () => (request(BASE_URL + '/admin/resources/cate'))

export const reqResourcesDeleteCate = (name) => (request(BASE_URL + '/admin/resources/delete_cate', { name }, "POST"))

export const reqAddResources = (resource) => (request(BASE_URL + '/admin/resources/add', { resource }, "POST"))

export const reqDeleteResources = (cate, id) => (request(BASE_URL + '/admin/resources/delete', { cate, id }, "POST"))

export const reqUpdateResources = (resource) => (request(BASE_URL + '/admin/resources/update', { resource }, "POST"))

