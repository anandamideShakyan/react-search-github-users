import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
	const [githubUser, setGithubUser] = useState(mockUser);
	const [repos, setRepos] = useState(mockRepos);
	const [followers, setFollowers] = useState(mockFollowers);
	const [requests, setRequests] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState({ show: false, msg: "" });

	const searchGithubUser = async (value) => {
		toggleError();
		setLoading(true);
		const response = await axios(
			`https://api.github.com/users/${value}`
		).catch((err) => console.log(err));
		console.log(response);
		if (response) {
			const { login, followers_url } = response.data;
			setGithubUser(response.data);

			await Promise.allSettled([
				axios(
					`https://api.github.com/users/${login}/repos?per_page=100`
				),
				axios(followers_url)
			])
				.then((response) => {
					console.log(response);
					const [repos, followers] = response;
					if (followers.status === "fulfilled")
						setFollowers(followers.value.data);
					if (repos.status === "fulfilled")
						setRepos(repos.value.data);
				})
				.catch((err) => console.log(err));
		} else {
			toggleError(true, "There is no user with that username ");
		}
		setLoading(false);
		checkRequests();
	};
	const checkRequests = () => {
		axios(`${rootUrl}/rate_limit`)
			.then(({ data }) => {
				let {
					rate: { remaining }
				} = data;
				setRequests(remaining);
				if (remaining === 0) {
					toggleError(
						true,
						"sorry,you have exceeded your hourly rate limit!"
					);
				}
			})
			.catch((err) => console.log(err.response));
	};
	function toggleError(show = false, msg = "") {
		setError({ show, msg });
	}
	useEffect(checkRequests, []);
	return (
		<GithubContext.Provider
			value={{
				githubUser,
				repos,
				followers,
				requests,
				error,
				searchGithubUser,
				loading
			}}
		>
			{children}
		</GithubContext.Provider>
	);
};

export { GithubContext, GithubProvider };
