// CSS HANDLER
// select filter handler
$('select').on('focus', function() {
    return $(this).siblings('.fa-angle-down').addClass('arrow-selected');
});

$('select').on('blur change', function() {
    return $(this).siblings('.fa-angle-down').removeClass('arrow-selected');
});

// poster hover handler
$(document).on('mouseover', '.poster-block' ,function() {
    $(this).find('img').addClass('poster-image-hovered');
    $(this).find('.poster-title--vi a').addClass('poster-title-hovered');
});

$(document).on('mouseout', '.poster-block', function() {
    $(this).find('img').removeClass('poster-image-hovered');
    $(this).find('.poster-title--vi a').removeClass('poster-title-hovered');
});

// navbar on scroll handler
$(window).scroll(function() {
    $(window).scrollTop() >= 58 ? $('.navbar-container').addClass('navbar-on-scroll') : $('.navbar-container').removeClass('navbar-on-scroll');
});

// box display function
const boxDisplaying =  (box, onClickTarget) => {
    onClickTarget.on('click', function() {
        box.slideDown();
        $('.body-section').addClass('body-section-on-blur');
    });

    $(document).on('mouseup', function(e) {
        e.stopPropagation();
        if(!box.is(e.target) && box.has(e.target).length === 0) {
            box.slideUp();
            $('.body-section').removeClass('body-section-on-blur');
        }
    });
}

// search box display handler
const searchBox = $('.navbar__item--search-box');
const searchBoxDisplayTarget = $('.navbar__item:first-child');
boxDisplaying(searchBox, searchBoxDisplayTarget);

// login box display handler
const loginBox = $('.navbar__login-box');
const loginBoxDisplayTarget = $('.navbar__wrapper_end');
boxDisplaying(loginBox, loginBoxDisplayTarget);

// menu box display handler
const menuBox = $('.navbar__user-menu-box');
boxDisplaying(menuBox, loginBoxDisplayTarget);

// carousel pagination handler
const rowWidth = $('.carousel__body-container').width();

// casts carousel pagination declaring
const leftyCastPaginationButton = $('.carousel__cast-paginate-button--left');
const rightyCastPaginationButton = $('.carousel__cast-paginate-button--right');
let carouselCastRowIndex = 0;

// trailers carousel pagination declaring
const carouselTrailerRow = $('.carousel__trailers-row');
const leftyTrailerPaginationButton = $('.carousel__trailer-paginate-button--left');
const rightyTrailerPaginationButton = $('.carousel__trailer-paginate-button--right');
let carouselTrailerRowIndex = 0;

// pagination button onClick function
const carouselToLeft = (leftyPaginationButton, rightyPaginationButton, carouselRow, numOfRow, index) => {
    index++;
    carouselRow.css('transform', `translate3d(-${rowWidth * index}px, 0, 0)`);
    leftyPaginationButton.removeClass('disable-pagination');
    if (index === numOfRow - 1) {
        rightyPaginationButton.addClass('disable-pagination');
    }
    return index;
}
const carouselToRight = (leftyPaginationButton, rightyPaginationButton, carouselRow, index) => {
    index--;
    carouselRow.css('transform', `translate3d(-${rowWidth * index}px, 0, 0)`);
    rightyPaginationButton.removeClass('disable-pagination');
    if (index === 0) {
        leftyPaginationButton.addClass('disable-pagination');
    }
    return index;
}

// casts carousel pagination onClick handler
leftyCastPaginationButton.addClass('disable-pagination').on('click', function() {
    carouselCastRowIndex = carouselToRight(leftyCastPaginationButton, rightyCastPaginationButton, $(document).find('.carousel__casts-row'), carouselCastRowIndex);
});
rightyCastPaginationButton.on('click', function() {
    carouselCastRowIndex = carouselToLeft(leftyCastPaginationButton, rightyCastPaginationButton, $(document).find('.carousel__casts-row'), $(document).find('.carousel__casts-row').length, carouselCastRowIndex);
});

// trailers carousel pagination onClick handler
leftyTrailerPaginationButton.addClass('disable-pagination').on('click', function() {
    carouselTrailerRowIndex = carouselToRight(leftyTrailerPaginationButton, rightyTrailerPaginationButton, $(document).find('.carousel__trailers-row'), carouselTrailerRowIndex);
});
rightyTrailerPaginationButton.on('click', function() {
    carouselTrailerRowIndex = carouselToLeft(leftyTrailerPaginationButton, rightyTrailerPaginationButton, $(document).find('.carousel__trailers-row'), $(document).find('.carousel__trailers-row').length, carouselTrailerRowIndex);
});