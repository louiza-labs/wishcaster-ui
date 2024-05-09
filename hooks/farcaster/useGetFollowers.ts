import { fetchFarcasterFollowers } from "@/app/actions";
import { UserInfo } from "@/types";
import React from "react";

import useLocalStorage from "@/hooks/localStorage";

const useGetFollowers = () => {
	const [fetchingUsersFollowers, setFetchingUsersFollowers] = React.useState(false);
	const [errorFetchingUsersFollowers, setErrorFetchingUsersFollowers] = React.useState(false);
	const [lookupFID, setLookupFID] = React.useState(0);
	const [loggedInUsersFollowers, setLoggedInUsersFollowers] = React.useState([]);
	const [user] = useLocalStorage<UserInfo>("user");
	const { fid: loggedInUsersFID } = user;

	const handleLookupFIDChange = (e) => {
		setLookupFID(e.target.value);
	};

	const handleFetchLoggedInUsersFollowers = async () => {
		try {
			setFetchingUsersFollowers(true);
			setErrorFetchingUsersFollowers(false);
			const followers = await fetchFarcasterFollowers(loggedInUsersFID, lookupFID);
			setFetchingUsersFollowers(false);
			setLoggedInUsersFollowers(followers);
			return followers;
		} catch (e) {
			setErrorFetchingUsersFollowers(true);
			setFetchingUsersFollowers(false);
		}
	};

	React.useEffect(() => {
		if (loggedInUsersFID) {
			handleFetchLoggedInUsersFollowers();
		}
	}, [loggedInUsersFID]);

	return {
		handleFetchLoggedInUsersFollowers,
		handleLookupFIDChange,
		loggedInUsersFID,
		loggedInUsersFollowers,
		errorFetchingUsersFollowers,
		fetchingUsersFollowers,
		lookupFID,
	};
};

export default useGetFollowers;
