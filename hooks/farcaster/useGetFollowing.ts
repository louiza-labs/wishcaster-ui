import { fetchFarcasterFollowing } from "@/app/actions";
import { UserInfo } from "@/types";
import React from "react";

import useLocalStorage from "@/hooks/localStorage";

const useGetFollowing = () => {
	const [fetchingUsersFollowing, setFetchingUsersFollowing] = React.useState(false);
	const [errorFetchingUsersFollowing, setErrorFetchingUsersFollowing] = React.useState(false);
	const [lookupFID, setLookupFID] = React.useState(0);
	const [loggedInUsersFollowing, setLoggedInUsersFollowing] = React.useState([]);
	const [user] = useLocalStorage<UserInfo>("user");
	const { fid: loggedInUsersFID } = user;

	const handleLookupFIDChange = (e) => {
		setLookupFID(e.target.value);
	};

	const handleFetchLoggedInUsersFollowing = async () => {
		try {
			setFetchingUsersFollowing(true);
			setErrorFetchingUsersFollowing(false);
			const following = await fetchFarcasterFollowing(loggedInUsersFID, lookupFID);
			setFetchingUsersFollowing(false);
			setLoggedInUsersFollowing(following);
			return following;
		} catch (e) {
			setErrorFetchingUsersFollowing(true);
			setFetchingUsersFollowing(false);
		}
	};

	React.useEffect(() => {
		if (loggedInUsersFID) {
			handleFetchLoggedInUsersFollowing();
		}
	}, [loggedInUsersFID]);

	return {
		handleFetchLoggedInUsersFollowing,
		handleLookupFIDChange,
		loggedInUsersFID,
		loggedInUsersFollowing,
		errorFetchingUsersFollowing,
		fetchingUsersFollowing,
		lookupFID,
	};
};

export default useGetFollowing;
