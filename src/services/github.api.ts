const token = import.meta.env.VITE_GITHUB_ACCESS_KEY;

interface SearchParams {
	q: string,
	per_page: number,
	page: number
}

export async function githubApi<T>(params: SearchParams): Promise<T> {
	const url = new URL('https://api.github.com/search/repositories');

	const query = new URLSearchParams;
	query.append('q', params.q);
	query.append('per_page', `${params.per_page}`);
	query.append('page', `${params.page}`);

	url.search = query.toString();

  return fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(token ? {'Authorization': `Bearer ${token}`} : {})
		},
	})
    .then((response) => response.json() as Promise<T>)
		.catch((error) => error)
}