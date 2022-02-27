import { createStore, Action } from './index'
import { toast } from "@zerodevx/svelte-toast";
import gun from "../gun"

export enum Actions {
	CLIENT_USER_LOGIN,
	CLIENT_USER_REGISTER,
	CLIENT_USER_LOGOUT,
	CLIENT_USER_PROFILE_UPDATE,
	UPDATE_CHAT_LOG,
	GET_USERS
}

export interface UserAction extends Action {
	action: Actions
	payload: any
}

export interface State {
	user: {
		authenticated: boolean;
		publicKey: string | null;
	}
}

export const INITIAL_STATE: State = {
	user: {
		authenticated: false,
		publicKey: null
	}
}

export const reducer = async (state, { action, payload }: UserAction) => {
	if (payload.message) {
		toast.push(payload.message);
	}
	console.log(Actions[action], "NEW ACTION", payload);
	switch (action) {
		case Actions.CLIENT_USER_LOGIN:
			if (payload.success) {
				// Update gun
				console.log(payload.pub)

				const userInformation = await gun.user(payload.pub);
				const { alias, pub, online } = userInformation;
				await gun.get("users").get(payload.pub).get("online").put(true);
				await gun.get("users").get(payload.pub).put({
					alias,
					pub,
					online
				});

				return {
					...(await state),
					user: {
						...state.user,
						...userInformation,
						authenticated: true,
						online: await gun.get("users").get(payload.pub).get("online"),
					}
				};
			}
		case Actions.CLIENT_USER_REGISTER:
			return await state;
		case Actions.CLIENT_USER_PROFILE_UPDATE:
			return await state;
		case Actions.GET_USERS:
			const gunUsers = await gun.get("users").once((r) => r);
			const userPromises = Object.keys(gunUsers)
				.filter((userPub) => userPub !== "_")
				.map(async (userPub) => await gun.get('users').get(`${userPub}`));
			const userProfiles = await Promise.all(userPromises);
			const users = userProfiles.reduce(
				(obj, userObject) => ({
					...obj,
					[userObject.alias]: userObject
				}),
				{}
			);
			return {
				...(await state),
				users
			};
		default:
			return await state;
	}
};

const store = createStore(reducer, INITIAL_STATE);
export default store;
