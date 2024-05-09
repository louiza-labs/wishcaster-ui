import { useApp } from "@/context";
import useLocalStorage from "@/hooks/localStorage";
import { UserInfo } from "@/types";
import { ErrorRes } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const useSendCast = () => {
	const [user] = useLocalStorage<UserInfo>("user");
	const { displayName, pfp } = useApp();
	const [castText, setCastText] = useState("");
	async function handlePublishCast() {
		const { signerUuid } = user;
		try {
			const {
				data: { message },
			} = await axios.post<{ message: string }>("/api/cast", {
				signerUuid,
				castText,
			});
			toast(message, {
				type: "success",
				theme: "dark",
				autoClose: 3000,
				position: "bottom-right",
				pauseOnHover: true,
			});
			setCastText("");
		} catch (err) {
			const { message } = (err as AxiosError).response?.data as ErrorRes;
			toast(message, {
				type: "error",
				theme: "dark",
				autoClose: 3000,
				position: "bottom-right",
				pauseOnHover: true,
			});
		}
	}

	return {
		handlePublishCast,
		castText,
		setCastText,
	};
};

export default useSendCast;
