import React from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
	const { repos } = React.useContext(GithubContext);
	// console.log(repos);
	let languages = repos.reduce((total, item) => {
		const { language, stargazers_count } = item;
		if (!language) return total;
		// console.log(language);
		total[language] = total[language]
			? {
					...total[language],
					value: total[language].value + 1,
					stars: total[language].stars + stargazers_count
			  }
			: { label: language, value: 1, stars: stargazers_count };
		// console.log(total);
		return total;
	}, {});
	const mostUsed = Object.values(languages)
		.sort((a, b) => {
			return b.value - a.value;
		})
		.slice(0, 5);
	const mostPopular = Object.values(languages)
		.sort((a, b) => {
			return b.stars - a.stars;
		})
		.map((item) => {
			return { label: item.label, value: item.stars };
		})
		.slice(0, 5);
	const mostForks = repos
		.reduce((total, item) => {
			const { forks, name, stargazers_count } = item;

			total = [
				...total,
				{ label: name, value: forks, stars: stargazers_count }
			];

			return total;
		}, [])
		.sort((a, b) => {
			return b.value - a.value;
		})
		.slice(0, 5);
	let mostStars = mostForks
		.map((item) => {
			return { label: item.label, value: item.stars };
		})
		.sort((a, b) => {
			return b.value - a.value;
		})
		.slice(0, 5);
	return (
		<section className="section">
			<Wrapper className="section-center">
				<Pie3D data={mostUsed} />
				<Column3D data={mostStars} />
				<Doughnut2D data={mostPopular} />
				<Bar3D data={mostForks} />
			</Wrapper>
		</section>
	);
};

const Wrapper = styled.div`
	display: grid;
	justify-items: center;
	gap: 2rem;
	@media (min-width: 800px) {
		grid-template-columns: 1fr 1fr;
	}

	@media (min-width: 1200px) {
		grid-template-columns: 2fr 3fr;
	}

	div {
		width: 100% !important;
	}
	.fusioncharts-container {
		width: 100% !important;
	}
	svg {
		width: 100% !important;
		border-radius: var(--radius) !important;
	}
`;

export default Repos;
