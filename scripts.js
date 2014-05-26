/* general feedback 
* --------------------------------------------------
* Looks great! Neat idea incorporating your old 
* project with the new API.
* Let me know what functionality you had envisioned
* for "watched" and "coming soon" and I can help
* you with how to implement them.
* If you wanted a modal box for each movie, you'll
* need to treat the one modal in your HTML like a template -
* the same way we had a template star rating fieldset - 
* and create a modal with a matching ID for each movie
* within your displayMovies function.
*/


// namespace for movieApp
// m = movieApp
var m = {}; // blank object

m.api_key = 'a4673502a009e3f8aceb03cc7808e56a';
m.modalElem = $('#openModal');
m.movieCount = 0;

var movies = [15, 238, 289, 1578, 872, 770, 426, 947, 424, 630, 901, 3114, 11, 539, 62, 599, 37247, 16885, 654, 1585, 829, 239, 596, 601, 595, 3083, 288, 705, 996, 28, 963, 240, 510, 408, 703, 826, 887, 3090, 935, 15121, 254, 239471, 3116, 981, 3110, 3078, 702, 567, 3059, 120, 1725, 103, 11778, 651, 213, 578, 1366, 962, 3121, 3063, 16305, 838, 10784, 10774, 488, 85, 396, 33, 9576, 185, 857, 278, 642, 274, 10633, 13, 891, 3082, 576, 284, 967, 631, 597, 624, 37719, 792, 389, 900, 745, 20325, 15764, 769, 1051, 680, 25188, 925, 78, 3087, 862, 665];

m.init = function() {
	m.grabConfig();

	/* feedback comment:
	* --------------------------------------------------	
	* since this getMovie function hands off to displayMovie,
	* which depends on the config data, you might want to 
	* call it inside the grabConfig success callback - just
	* in case! 
	*/
	m.getMovie();

	/* feedback comment:
	* --------------------------------------------------
	* if you don't intend to use the rating system, best
	* to comment out or remove this code . Same goes for
	* the ratingHandler function definition on line 117+
	*/
	// listen for a click on our star ratings
	$('body').on('change','input[type=radio]',function() {
		var rating = $(this).val();
		var movieId = $(this).attr('id').split('-')[0].replace('movie','');
		m.ratingHandler(rating,movieId);
	}); // end listen function on star ratings

	$('.content').on('click','.movie a',function(e) {
		e.preventDefault();
		var id = $(this).data('id');
		var title = $(this).data('title');
		var rank = $(this).data('rank');		
		var plot = $(this).data('overview');
		var imageSrc = $(this).children('img.poster').attr('src');
		m.modalElem.find('img.modalPoster').attr('src',imageSrc);
		m.modalElem.find('h3').text(rank + ". " + title);
		m.modalElem.find('p.plot').text(plot);
		m.modalElem.addClass('visible');
	});

	$('a.close').on('click',function(e) {
		e.preventDefault();
		m.modalElem.removeClass('visible');
	});

	/* feedback comment:
	* --------------------------------------------------
	* If you get a modal for each movie setup, you can 
	* add a click handler on each movie div to trigger
	* open the modal here:
	* $('body').on('click', '.movie', function(){
		//get the modal ID from the clicked item
	* 	//open the corresponding modal box
	* }); 
	*/

}; // end m.init

// this function will go to the moviedb api and get the config data we require
// when it finishes it will put the data it gets onto m.config
m.grabConfig = function() {
	var configUrl = 'http://api.themoviedb.org/3/configuration';
	$.ajax(configUrl, {
		type : 'GET',
		dataType : 'jsonp',
		data : {
			api_key : m.api_key
		},
		success : function(config) {
			m.config = config;
		}
	}); // end config ajax request
}; // end m.grabConfig function

m.getMovie = function() {

		$.ajax('http://api.themoviedb.org/3/movie/' + movies[m.movieCount], {
			type : 'GET',
			dataType : 'jsonp',
			data : {
				api_key : m.api_key,
			},
			success : function(result) {

				/* feedback comment:
				* --------------------------------------------------
				* comment out your log messages for production */
				// console.log(result);
				m.displayMovie(result, m.movieCount + 1);
				m.movieCount++;
				if (m.movieCount < 100) {
					// get the next movie
					m.getMovie();
				}

			}
		}); // end search ajax request

}; // end m.getMovie

m.displayMovie = function(movie, rank) {
	// this is where i will insert a single movie 
	// keep adding data attributes for additional modal info - ex. year, description, etc.
	var imageWrap = $('<a>').attr('href','#openModal').attr('data-title',movie.title).attr('data-rank',rank).attr('data-overview',movie.overview);
	var image = $('<img>').attr('src',m.config.images.base_url + "w500" + movie.poster_path).addClass('poster');

	/* feedback comment:
	* --------------------------------------------------
	* instead of creating a new rating div for each movie,
	* here's where you want to create  a modal box for each.
	* You can append them to the end of your doc (instead of
	* at the end of each movie div), just make sure they have 
	* unique IDs that match the href you wrap around the poster
	* image (see comment below).
	*/
	// var rating = $('fieldset.rateMovie')[0].outerHTML;
	// rating = rating.replace(/star/g,'movie'+ movie.id+'-star');
	// rating = rating.replace(/rating/g, 'rating-' + movie.id);

	var movieWrap = $('<div>').addClass('movie');
	imageWrap.append(image);
	movieWrap.append(imageWrap);

	//movieWrap.append(image,title,rating);

	$('.content').append(movieWrap);

	/* feedback comment:
	* --------------------------------------------------
	* right idea here, you just want that href to be 
	* uniqe for each movie, so make the href something
	* like "#openModal" + movie.id */
	// $('img.poster').wrap('<a href="#openModal"></a>');
}	

m.displayAll = function(movies) {
	for (var i = 0; i < movies.length; i++) {
		var title = $('<h2>').text(movies[i].title);
		var image = $('<img>').attr('src',m.config.images.base_url + "w500" + movies[i].poster_path);
		var rating = $('fieldset.rateMovie')[0].outerHTML;
		rating = rating.replace(/star/g,'movie'+ movies[i].id+'-star');
		rating = rating.replace(/rating/g, 'rating-' + movies[i].id);

		var movieWrap = $('<div>').addClass('movie');

		movieWrap.append(image,title,rating);

		$('.content').append(movieWrap);
	};
}; // end m.displayMovies function

m.ratingHandler = function(rating,movieId) {
	$.ajax('http://api.themoviedb.org/3/movie/' + movieId + '/rating',{
		type : 'POST',
		data : {
			api_key : m.api_key,
			guest_session_id : m.session_id,
			value : rating * 2
		},
		success : function(response) {
			if(response.status_code) {
				alert('Thanks for the vote!');
			} else {
				alert(response.status_message);
			}
		}
	});
}; // end ratingHandler function

// getting guest session id
m.getSessionId = function() {
	$.ajax('http://api.themoviedb.org/3/authentication/guest_session/new',{
			/* feedback comment:
			* --------------------------------------------------
			* this block of code is indented one tab too far */
			data : {
				api_key : m.api_key
			},
			type : 'GET',
			dataType : 'jsonp',
			success : function(session) {
				// store the guest session id for later use
				m.session_id = session.guest_session_id;
				console.log(session);
			}
	}); // end guest session ajax request
}; // end m.getSessionId function

// document ready
$(function() {
	
	m.init();

}); // end doc ready