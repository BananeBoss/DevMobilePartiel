const API_KEY = 'f60dc1588d1b92e483f83fa137b9f5ab';

///discover/movie?sort_by=popularity.desc

export async function getActors() {
    try {
      const myHeaders = new Headers({ 'user-key': API_KEY });
      const url = `https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&language=fr-FR`;
      const response = await fetch(url, { headers: myHeaders });
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(`Error with function getActors ${error.message}`);
      throw error;
    }
  };

export async function getActorDetails(actorID) {
  try {
    const myHeaders = new Headers({ 'user-key': API_KEY });
    const url = `https://api.themoviedb.org/3/person/${actorID}?api_key=${API_KEY}&language=fr-FR`;
    const response = await fetch(url, { headers: myHeaders });
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(`Error with function getActorDetails ${error.message}`);
    throw error;
  }
};

export async function getSearch(search) {
    try {
      const myHeaders = new Headers({ 'user-key': API_KEY });
      const url = ` https://api.themoviedb.org/3/find/${search}?api_key=${API_KEY}&language=en-US&external_source=imdb_id`;
      const response = await fetch(url, { headers: myHeaders });
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(`Error with function getActorDetails ${error.message}`);
      throw error;
    }
  };