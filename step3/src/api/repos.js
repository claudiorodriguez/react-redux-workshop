export const fetchByOrg = async (organization) => {
  const endpoint = `https://api.github.com/orgs/${organization}/repos`;
  const response = await fetch(endpoint);
  const json = await response.json();

  if (response.status < 200 || response.status >= 400) {
    const error = new Error(json && json.message || response.statusText);

    error.response = response;
    throw error;
  }

  return json.map(
    // eslint-disable-next-line id-match
    ({name, html_url}) => ({
      name,
      url: html_url
    })
  );
};
