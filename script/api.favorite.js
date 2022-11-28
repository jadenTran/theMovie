section = $(".main-view__section--favorite");
// favorite movies
const favoriteAPICreator = (page = 1) => {
  const sessionId = sessionStorage.getItem("session_id");
  const userInfo = JSON.parse(sessionStorage.getItem("user_info"));

  return `https://api.themoviedb.org/3/account/${userInfo.id}/favorite/movies?api_key=${apiKey}&session_id=${sessionId}&language=vi-VN&sort_by=created_at.asc&page=${page}`;
};

const getFavoriteList = async () => {
  const favoriteListAPI = favoriteAPICreator();

  await callAPI(favoriteListAPI);
};

// load favorite movies
getFavoriteList();