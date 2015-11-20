/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function loadWordPressData(){

var wordPressUrl = 'https://public-api.wordpress.com/rest/v1.1/sites/howmon.wordpress.com/posts/';  //rest url to wordpress account

     //http request || response contains site information
       jQuery.get( wordPressUrl, function( response ) {
       
	   //iterate over response to get each post object
	$.each(response.posts, function( index, value ) {
      
	  var wordPressPost = value;
	 
	  //check post type 
	  if(wordPressPost.type == 'post'){
	   
	   //load post content to html page here	  
	  $('body').append(wordPressPost.content); //this is just a test to load wordpress content in the body element of an html file
	  
	  }	  
	  
});
} );
}