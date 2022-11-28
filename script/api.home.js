// HOME API SCRIPT
const apiKey = "8a38833e26ff2dacb8c1c3486a44b4e2";

const queryString = window.location.search;
const parameters = new URLSearchParams(queryString);
const genreId = parameters.get("genre-id");
const countryId = parameters.get("country-id");

const movieComponent = (movie) => {
  return `<div class='col'>
          <div class='poster-block'>
          <div class='poster-block__poster-image-container'>
          <a href='/detail.html?movie-id=${
            movie.id
          }' class='poster-block__poster-link'>
              <img
              src='${
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : "../resources/images/default-poster.png"
              }'
              alt='${movie.original_title}'
              />
          </a>
          </div>
          <div class='poster-block__poster-title-container'>
          <h3
              class='poster-block__poster-title poster-title--vi'
          >
              <a href='/detail.html?movie-id=${movie.id}'>${movie.title}</a>
          </h3>
          <h3
              class='poster-block__poster-title poster-title--en'
          >
              <a href='/detail.html?movie-id=${movie.id}'>${
    movie.original_title
  }</a>
          </h3>
          </div>
      </div>
    </div>`;
};

// loading movies function
const loadingMovies = async (api, numberOfMovies, selectors) => {
  try {
    const list = await $.get(api);

    list.results.slice(0, numberOfMovies).forEach((movie) => {
      selectors.forEach((item) => {
        item.append(movieComponent(movie));
      });
    });
  } catch (error) {
    console.log("Fetching error: " + error);
  }
};

// get popular movies API
const popularMovieAPI = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=vi-VN&page=1`;
const popularMoviesSelector = $(".section__posters--popular").find(".row");
const popularMoviesSelectorForSearch = $(".search-box__search-results").find(
  ".row"
);

popularMoviesSelector.empty();
popularMoviesSelectorForSearch.empty();
loadingMovies(popularMovieAPI, 5, [
  popularMoviesSelector,
  popularMoviesSelectorForSearch,
]);

// get latest update movies API
const latestUpdateMovieAPI = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=vi-VN&page=1`;
const latestUpdateMoviesSelector = $(".section__posters--latest").find(".row");
latestUpdateMoviesSelector.empty();
loadingMovies(latestUpdateMovieAPI, 10, [latestUpdateMoviesSelector]);

//loading genres
const getGenresAPI = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=vi-VN`;
const loadingGenres = async (getGenresAPI) => {
  try {
    const list = await $.get(getGenresAPI);

    const genresSelect = $("#genres-selector");
    genresSelect.empty();
    genresSelect.append(
      `<option value="0" class="filter__block__option">- Tất cả -</option>`
    );
    list.genres.forEach((item) =>
      genresSelect.append(
        `<option value="${item.id}" class="filter__block__option">${item.name}</option>`
      )
    );

    // check if redirected from movie detail page with genre-id
    if (genreId) {
      $("select")
        .eq(0)
        .find(`option[value=${genreId}]`)
        .prop("selected", true)
        .trigger("change");
    }
  } catch (error) {
    console.log("Fetching error " + error);
  }
};
loadingGenres(getGenresAPI);

//loading countries
const getCountriesAPI = `https://api.themoviedb.org/3/configuration/languages?api_key=${apiKey}`;
const loadingCountries = async (getCountriesAPI) => {
  try {
    const list = await $.get(getCountriesAPI);

    const countriesSelect = $("#countries-selector");
    const listCountries = ["vi", "de", "en", "fr", "ja", "ko", "th"];

    countriesSelect.empty();
    countriesSelect.append(
      `<option value="0" class="filter__block__option">- Tất cả -</option>`
    );
    list.forEach(
      (item) =>
        listCountries.includes(item.iso_639_1) &&
        countriesSelect.append(
          `<option value="${item.iso_639_1}" class="filter__block__option">${item.english_name}</option>`
        )
    );
    // check if redirected from movie detail page with country-id
    if (countryId) {
      $("select")
        .eq(1)
        .find(`option[value=${countryId}]`)
        .prop("selected", true)
        .trigger("change");
    }
  } catch (error) {
    console.log("Fetching error " + error);
  }
};
loadingCountries(getCountriesAPI);

//searching
let timeout;
$("#search").on("keyup input", function () {
  const term = $(this).val();

  clearTimeout(timeout);
  timeout = setTimeout(function () {
    if (term.trim().length) {
      $.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=vi-VN&query=${term.trim()}&page=1&include_adult=false`
      ).done(function (data) {
        popularMoviesSelectorForSearch.empty();
        data.results.length
          ? data.results
              .slice(0, 5)
              .forEach((movie) =>
                popularMoviesSelectorForSearch.append(movieComponent(movie))
              )
          : popularMoviesSelectorForSearch.html(
              `<div class="w-100">Không có kết quả nào cho từ khoá <p class="h4">${term.trim()}</p></div>`
            );
      });
    } else {
      popularMoviesSelectorForSearch.empty();
      loadingMovies(popularMovieAPI, 5, [popularMoviesSelectorForSearch]);
    }
  }, 500);
});

// initialize pagination
const paginationInit = (totalPage) => {
  $(".pagination").empty();
  const page = (index) =>
    `<li class="page-item ${
      1 === index && "active"
    }" data-index=${index}><span class="page-link">${index}</span></li>`;
  for (let i = 0; i < totalPage; i++) {
    $(".pagination").append(page(i + 1));
  }
};

// pagination buttons clicked handler
$(document).on("click", ".page-item", async function () {
  const currentPage = $(this).data("index");
  const api = $(".pagination").hasClass("pagination--filter")
    ? filterAPICreator(
        $("select").eq(3).val() !== "0" ? $("select").eq(3).val() : undefined,
        $("select").eq(2).val() !== "0" ? $("select").eq(2).val() : undefined,
        $("select").eq(0).val() !== "0" ? $("select").eq(0).val() : undefined,
        $("select").eq(1).val() !== "0" ? $("select").eq(1).val() : undefined,
        currentPage
      )
    : favoriteAPICreator(currentPage);

  await loadingListFromAPI(api);

  $(".page-item").removeClass("active");
  $(this).addClass("active");
});

// loading list responded from API and return total pages for pagination
const loadingListFromAPI = async (api) => {
  try {
    const list = await $.get(api);

    $(".main-view__section").addClass("hidden");
    section.removeClass("hidden");
    section.find(".row").empty();
    list.results.length
      ? list.results.forEach((movie) =>
          section.find(".row").append(movieComponent(movie))
        )
      : section.find(".row").append("<span>Không có kết quả nào</span>");

    return list.total_pages;
  } catch (error) {
    console.log("Fetching error " + error);
  }
};

const callAPI = async (api) => {
  try {
    const totalPages = await loadingListFromAPI(api);
    paginationInit(totalPages < 10 ? totalPages : 10);
  } catch (error) {
    console.log("Fetching error " + error);
  }
};

//filter movies
let section = $(".main-view__section--filter").addClass("hidden");
const filterAPICreator = (
  sortOrder = "popularity.desc",
  releasedYear = "",
  genreID = "",
  languageID = "",
  page
) => {
  return `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=vi-VN&sort_by=${sortOrder}&primary_release_year=${releasedYear}&with_genres=${genreID}&with_original_language=${languageID}&page=${page}&with_watch_monetization_types=flatrate`;
};

// filter selects changed handler
$("select").on("change", async function () {
  const filterListAPI = filterAPICreator(
    $("select").eq(3).val() !== "0" ? $("select").eq(3).val() : undefined,
    $("select").eq(2).val() !== "0" ? $("select").eq(2).val() : undefined,
    $("select").eq(0).val() !== "0" ? $("select").eq(0).val() : undefined,
    $("select").eq(1).val() !== "0" ? $("select").eq(1).val() : undefined,
    1
  );

  await callAPI(filterListAPI);
});

// LOGIN HANDLER
const login = (userInfo) => {
  $(".navbar__login-button").addClass("hidden");
  $(".navbar__login-box").slideUp().addClass("hidden");
  $(".body-section").removeClass("body-section-on-blur");

  $(".navbar__user-button").removeClass("hidden");
  $(".navbar__user-menu-box").removeClass("hidden");
  $(".navbar__user-image-container")
    .find("img")
    .prop(
      "src",
      `https://image.tmdb.org/t/p/original${userInfo.avatar.tmdb.avatar_path}`
    );
  $(".navbar__user-name").html(userInfo.username);
};

const logout = async () => {
  const sessionId = sessionStorage.getItem("session_id");
  await $.ajax({
    url: `https://api.themoviedb.org/3/authentication/session?api_key=${apiKey}`,
    type: "DELETE",
    data: { session_id: sessionId },
  });
  sessionStorage.clear();

  window.location.replace("/index.html");
};

const createRequestToken = async () => {
  const token = await $.get(
    `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`
  );
  return token.request_token;
};

const validateToken = async (username = "", password = "", token) => {
  const bodyObject = {
    username: username,
    password: password,
    request_token: token,
  };
  const response = await $.post(
    `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    bodyObject,
    "json"
  );
  return response.success;
};

const createSessionId = async (token) => {
  const response = await $.post(
    `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}`,
    { request_token: token },
    "json"
  );
  return response.success ? response.session_id : null;
};

const getUserInfo = async (sessionId) => {
  const userInfo = await $.get(
    `https://api.themoviedb.org/3/account?api_key=${apiKey}&session_id=${sessionId}`
  );
  return userInfo;
};

// check if user was logged in or not
if (sessionStorage.getItem("login_status")) {
  const userInfo = sessionStorage.getItem("user_info");
  login(JSON.parse(userInfo));
}

// login button click handler
$(".login-box__login-button").on("click", async function () {
  const username = $("#username").val();
  const password = $("#password").val();

  const requestToken = await createRequestToken();
  const status = await validateToken(username, password, requestToken);

  sessionStorage.setItem("login_status", status);

  if (status) {
    const sessionId = await createSessionId(requestToken);
    const userInfo = await getUserInfo(sessionId);

    sessionStorage.setItem("session_id", sessionId);
    sessionStorage.setItem("user_info", JSON.stringify(userInfo));

    login(userInfo);
  }

  location.reload();
});

// logout button clicked handler
$(".logout-button").on("click", async function () {
  await logout();
});
