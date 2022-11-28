// DETAIL API SCRIPT
const movieId = parameters.get("movie-id");
const userInfo = JSON.parse(sessionStorage.getItem("user_info"));
const sessionId = sessionStorage.getItem("session_id");

// check if movie in favorite list
const checkFavoriteStatus = async () => {
  try {
    const favoriteStatusAPI = `https://api.themoviedb.org/3/movie/${movieId}/account_states?api_key=${apiKey}&session_id=${sessionId}`;
    const status = await $.get(favoriteStatusAPI);
    return status.favorite;
  } catch (error) {
    console.log("Fetching error: " + error);
  }
};

let favoriteStatus = sessionId && checkFavoriteStatus();

// loading movie detail
const loadMovieDetailFromAPI = async () => {
  try {
    const movieDetailAPI = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=vi-VN`;
    const data = await $.get(movieDetailAPI);
    const genresGroup = $(".body-section__group").eq(1).find(".row");
    favoriteStatus = sessionId && (await checkFavoriteStatus());
    const favoriteButton = $(".add-to-favorite-button");

    favoriteStatus
      ? favoriteButton.html('<i class="fas fa-trash"></i> Xoá khỏi yêu thích')
      : favoriteButton.html('<i class="fas fa-plus"></i> Yêu thích');
    $(".body-section__cover").prop(
      "style",
      `background-image: url(https://image.tmdb.org/t/p/original${data.backdrop_path})`
    );
    $(".body-section__poster").prop(
      "src",
      `${
        data.poster_path
          ? `https://image.tmdb.org/t/p/original${data.poster_path}`
          : "../resources/images/default-poster.png"
      }`
    );
    $(".body-section__main-title").html(data.title);
    $(".body-section__sub-title").html(data.original_title);
    $(".body-section__movie-duration").html(`${data.runtime} phút`);
    $(".body-section__IMDb-score").html(data.vote_average);
    $(".country-dd")
      .find("a")
      .html(
        data.spoken_languages[0]
          ? data.spoken_languages[0].english_name
          : "Đang cập nhật"
      )
      .prop(
        "href",
        `/index.html?country-id=${
          data.spoken_languages[0] && data.spoken_languages[0].iso_639_1
        }`
      );
    $(".released-dd").html(data.release_date);
    $(".body-section__movie-description").html(data.overview);
    genresGroup.html("");
    data.genres.forEach((item) => {
      genresGroup.append(`<div class="col"><button type="button" class="btn btn-outline-light btn-sm text-nowrap">
      <a href='/index.html?genre-id=${item.id}'>${item.name}</a>
    </button></div>`);
    });
  } catch (error) {
    console.log("Fetching error: " + error);
  }
};

loadMovieDetailFromAPI();

// loading movie credits
const castCarouselItem = (cast) => {
  return `<div class='col'>
    <div class='carousel__cast-item'>
      <div class='cast-item__image-container'>
        <img src='${
          cast.profile_path
            ? "https://image.tmdb.org/t/p/w138_and_h175_face/" +
              cast.profile_path
            : "../resources/images/default-avatar.jpg"
        }' alt='${cast.name}' class='cast-item__image'>
      </div>
      <p class='cast-item__cast-name'>${cast.name}</p>
      <p class='cast-item__cast-role'>${cast.character}</p>
    </div>
  </div>`;
};

const loadMovieCreditFromAPI = async () => {
  try {
    const movieCreditAPI = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=vi-VN`;
    const { cast, crew } = await $.get(movieCreditAPI);

    $(".director-dd")
      .find("a")
      .html(
        crew.find((item) => item.job === "Director")
          ? crew.find((item) => item.job === "Director").name
          : "Đang cập nhật"
      );
    $(".writing-dd")
      .find("a")
      .html(
        crew.find(
          (item) => item.job === "Original Film Writer" || "Screenstory"
        )
          ? crew.find(
              (item) => item.job === "Original Film Writer" || "Screenstory"
            ).name
          : "Đang cập nhật"
      );

    const castCarousel = $(".carousel__body-container--cast");
    const castLength = cast.length;
    castCarousel.empty();
    if (castLength === 0) {
      castCarousel.append("<span>Đang cập nhật</span>");
    } else {
      for (let i = 0; i < Math.ceil(castLength / 6); i++) {
        const castRow = `<div class="row flex-nowrap gx-5 carousel__casts-row"></div>`;
        castCarousel.append(castRow);
        cast
          .splice(0, 6)
          .forEach((item) =>
            $(".carousel__casts-row").eq(i).append(castCarouselItem(item))
          );
      }
    }

    //disable cast carousel buttons
    if ($(document).find(".carousel__casts-row").length <= 1) {
      $(".carousel__cast-paginate-button--right").addClass(
        "disable-pagination"
      );
    }
  } catch (error) {
    console.log("Fetching error: " + error);
  }
};

loadMovieCreditFromAPI();

// loading movie trailers
const trailerCarouselItem = (trailer) => {
  return `<div class="col">
  <div class="carousel__trailer-item">
    <div class="trailer-item__image-container">
      <a href="
      https://www.youtube.com/watch?v=${trailer.key}" target="_blank">
        <img src="https://img.youtube.com/vi/${trailer.key}/mqdefault.jpg" alt="${trailer.name}" class="trailer-item__image">
      </a>
    </div>
  </div>
</div>`;
};

const loadingMovieTrailerFromAPI = async () => {
  try {
    const movieTrailerAPI = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`;
    const data = await $.get(movieTrailerAPI);
    const trailerCarousel = $(".carousel__body-container--trailer");
    const trailerLength = data.results.length;

    trailerCarousel.empty();
    if (trailerLength === 0) {
      trailerCarousel.append("<span>Đang cập nhật</span>");
    } else {
      for (let i = 0; i < Math.ceil(trailerLength / 3); i++) {
        const trailerRow = `<div class="row flex-nowrap gx-5 carousel__trailers-row"></div>`;
        trailerCarousel.append(trailerRow);
        data.results
          .splice(0, 3)
          .forEach((item) =>
            $(".carousel__trailers-row").eq(i).append(trailerCarouselItem(item))
          );
      }
    }

    //disable trailer carousel buttons
    if ($(document).find(".carousel__trailers-row").length <= 1) {
      $(".carousel__trailer-paginate-button--right").addClass(
        "disable-pagination"
      );
    }
  } catch (error) {
    console.log("Fetching error: " + error);
  }
};

loadingMovieTrailerFromAPI();

// loading movie reviews
const movieReviewComponent = (review) => {
  return `<div class="d-flex flex-row">
  <div class="reviews__user-avatar-container py-3">
    <img src="${
      review.author_details.avatar_path
        ? review.author_details.avatar_path.startsWith("/https")
          ? review.author_details.avatar_path.substr(1)
          : "https://image.tmdb.org/t/p/w138_and_h175_face/" +
            review.author_details.avatar_path
        : "../resources/images/default-avatar.jpg"
    }" alt="${review.author_details.username}-avatar">
  </div>
  <div class="p-3 flex-grow-1 reivews__user-review-container">
    <p class="review__user-name">${review.author_details.username}</p>
    <p class="review__user-rate">Điểm đánh giá: <em>${
      review.author_details.rating || "Chưa đánh giá"
    }</em></p>
    <p class="review__review-content">${review.content}</p>
  </div>
</div>`;
};

const loadingMovieReviewFromAPI = async () => {
  try {
    const movieReviewsAPI = `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${apiKey}&language=en-US&page=1`;
    const data = await $.get(movieReviewsAPI);
    const reviewContainer = $(".reviews-container").find(".d-grid");
    const reviewsLength = data.results.length;

    reviewContainer.empty();
    if (reviewsLength === 0) {
      reviewContainer.append("<span>Chưa có đánh giá</span>");
    } else {
      data.results
        .slice(0, 10)
        .forEach((item) => reviewContainer.append(movieReviewComponent(item)));
    }
  } catch (error) {
    console.log("Fetching error: " + error);
  }
};

loadingMovieReviewFromAPI();

// add to favorite function
const addMovieToFavorite = async (favoriteAPI) => {
  const favoriteButton = $(".add-to-favorite-button");
  const bodyObject = {
    media_type: "movie",
    media_id: movieId,
    favorite: true,
  };
  await $.ajax({
    url: favoriteAPI,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(bodyObject),
  });

  favoriteButton.html('<i class="fas fa-trash"></i> Xoá khỏi yêu thích');
  favoriteStatus = true;
};

// remove from favorite function
const removeMovieFromFavorite = async (favoriteAPI) => {
  const favoriteButton = $(".add-to-favorite-button");
  const bodyObject = {
    media_type: "movie",
    media_id: movieId,
    favorite: false,
  };
  await $.ajax({
    url: favoriteAPI,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(bodyObject),
  });

  favoriteButton.html('<i class="fas fa-plus"></i> Yêu thích');
  favoriteStatus = false;
};

// add to favorite button clicked handler
$(".add-to-favorite-button").on("click", async function () {
  // check if user logged in or not
  if (!userInfo) {
    return $("#messageModal").modal("show");
  }
  const favoriteAPI = `https://api.themoviedb.org/3/account/${userInfo.id}/favorite?api_key=${apiKey}&session_id=${sessionId}`;
  try {
    favoriteStatus
      ? await removeMovieFromFavorite(favoriteAPI)
      : await addMovieToFavorite(favoriteAPI);
  } catch (error) {
    console.log("Posting error: " + error);
  }
});
