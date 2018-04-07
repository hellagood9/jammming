import variables from '../variables';

/*
Use your own credentials as follows:
const clientId = '9cc105d6011643f08d035bf70b62185a';
const redirectUriDev = 'http://localhost:3000/';
const redirectUriProd = 'https://jammmingwithmax.surge.sh/';
*/

let accessToken;
let expiresIn;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    let expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {

      accessToken = accessTokenMatch[1];
      expiresIn = Number(expiresInMatch[1]);

      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      console.log('Access token retrieved!');
      return accessToken;
    } else {
      /*
        ${variables.xxx} works because we imported 'variables.js' (added into .gitignore and therefore not visible to you).
        If you have cloned or downloaded the project from github... Remove 'variables.' so you can use it with your own variables declared above.
      */
      const SpotifyUri = `https://accounts.spotify.com/authorize?client_id=${variables.clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${variables.redirectUriDev}`;
      window.location = SpotifyUri;
    }
  },

  async search(term) {
    try {
      const accessToken = Spotify.getAccessToken();

      let response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        let jsonResponse = await response.json();

        if (!jsonResponse.tracks) {
          return [];
        }

        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
      }

    } catch (error) {
      console.log(error);
    }
  },

  async savePlaylist(playlistName, playlistTracks) {
    try {
      if (!playlistName || !playlistTracks || playlistTracks.length === 0) {
        return;
      }

      let userId;
      let accessToken = this.getAccessToken();
      let headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      let playlistId;

      let response = await fetch('https://api.spotify.com/v1/me', { headers });

      if (response.ok) {
        let jsonResponse = await response.json();
        userId = jsonResponse.id;

        let responseUser = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers,
          method: 'POST',
          body: JSON.stringify({ name: playlistName }),
        });

        if (responseUser.ok) {
          let jsonResponse = await responseUser.json();
          playlistId = jsonResponse.id;

          let result = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
            headers,
            method: 'POST',
            body: JSON.stringify({
              uris: playlistTracks,
            }),
          });

          return result;
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
};

export default Spotify;
