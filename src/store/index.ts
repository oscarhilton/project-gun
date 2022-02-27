import { writable } from "svelte/store";

export interface Action {
	action: number;
	payload: any;
};

export const createStore = (reducer, initialState) => {
	const { subscribe, update } = writable(initialState);
	const dispatch = (action: Action) =>
		update((state) => reducer(state, action));
	return { subscribe, dispatch };
};
