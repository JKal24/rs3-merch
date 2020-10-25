import { api, graph_api } from './api';
import axios from 'axios'

// Commands functions for inputting and retrieving data from the database

const CancelToken = axios.CancelToken;
let source;

export async function initInfo(filter, keyword) {
    try {
        // Cancels existing token
        if (source) { source.cancel() };
        source = CancelToken.source();

        // Creates the api for axios requests with the cancel token
        const apiCancellable = axios.create({
            baseURL: 'http://localhost:8000',
            cancelToken: source.token
        });

        switch (filter) {
            case 'buylimit':
                await apiCancellable.get(`/BuyLimitInit/${keyword}`);
                return;
            case 'type':
                await apiCancellable.get(`/InitByType/${keyword}`);
                return;
            case 'invest':
                await apiCancellable.get('/InvestmentInit');
                return;
            case 'stable':
                await apiCancellable.get('/StableItemInit');
                return;
            case 'input':
                await apiCancellable.get(`/SearchText/${keyword.trim()}`);
                return;
            default:
                return;
        }
    } catch (error) {
        if (axios.isCancel(error)) {
            // Handle if request was cancelled
            console.log('Request cancelled', error.message);
        } else {
            // Handle usual errors
            console.log('Something went wrong: ', error.message)
        }
    }
}

export async function getInfo(filter='N/A') {
    try {
        if (source) { source.cancel() };
        source = CancelToken.source();

        const apiCancellable = axios.create({
            baseURL: 'http://localhost:8000',
            cancelToken: source.token
        });

        switch (filter) {
            case 'buylimit':
                return await apiCancellable.get('/BuyLimitSearch');
            case 'type':
                return await apiCancellable.get('/SearchByTypes');
            case 'invest':
                return await apiCancellable.get('/InvestmentSearch');
            case 'stable':
                return await apiCancellable.get('/StableItemSearch');
            case 'input':
                return await apiCancellable.get('/SearchByKeyword');
            default:
                return await apiCancellable.get('/FavoritesInit');
        }
    } catch (error) {
        if (axios.isCancel(error)) {
            // Handle if request was cancelled
            console.log('Request cancelled', error.message);
        } else {
            // Handle usual errors
            console.log('Something went wrong: ', error.message)
        }
    }
}

// Nav handlers

export async function getBuyLimits() {
    return (await api.get('/BuyLimitListing')).data;
}

export async function getTypes() {
    return (await api.get('/TypeListing')).data;
}

// Favorite handlers

export async function addFavorite(item) {
    return await api.post('/FavoritesInsert', item);
}

export async function removeFavorite(item_name) {
    return await api.post('/FavoritesDelete', { item_name });
}

// Graph handler

export async function getGraph(item_id) {
    return await graph_api.get(`/${item_id}`);
}
