import { Action, createStore } from "./index";
import { toast } from "@zerodevx/svelte-toast";
import gun from '../gun'

export enum Actions {
	UPDATE_CHAT_LOG,
  GET_LOG,
}

export interface ChatAction extends Action {
	action: Actions;
	payload: any;
}
export interface State {
	room: string,
  log: Object
}

export const INITIAL_STATE: State = {
  room: "public",
  log: {},
};

export const reducer = async (state, { action, payload }: Action) => {
	if (payload.message) {
		toast.push(payload.message);
	}
	console.log(Actions[action], "NEW CHAT ACTION", payload);

  const getState = await state;

	switch (action) {
    case Actions.GET_LOG:
      const log = await gun.get("chats").get(payload).get("log");
      return {
        ...await state,
        log,
      }
		default:
			return await state;
	}
};

const store = createStore(reducer, INITIAL_STATE);
export default store;
