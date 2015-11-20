/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var 
tumblrURL   =   '******.tumblr.com',
consumerKey   =   '',

lightbox    =   document.querySelector('#lightbox'),

nav       =   document.querySelector('#nav'),
contentWrapper  =   document.querySelector('#content'),
sectionHome   =   document.querySelector('#content #home'),
socialFeed    =   document.querySelector('#content #home .social-feed'),
sectionAbout  =   document.querySelector('#content #about'),
sectionMusic  =   document.querySelector('#content #music'),
sectionLive   =   document.querySelector('#content #live'), 
sectionVideos =   document.querySelector('#content #videos'),
sectionPhotos =   document.querySelector('#content #photos'), 
sectionNews   =   document.querySelector('#content #news'),
newsArray     =   [],

tweetsLoaded  = 'false',
instagramsLoaded= 'false',
tweetArray    = [],
instagramArray  = [],
postArray   = [],


mobile      =   '',
hash = window.location.hash
;
function initialize(){
   loadAsyncScript('http://api.tumblr.com/v2/blog/'+tumblrURL+'/posts?tag=about&callback=handleTumblrText&api_key=');
   loadAsyncScript('http://api.tumblr.com/v2/blog/'+tumblrURL+'/posts?tag=music&callback=handleTumblrMusic&api_key=');
    loadAsyncScript('http://api.tumblr.com/v2/blog/'+tumblrURL+'/posts?tag=news&callback=handleTumblrNews&api_key=');    
   loadAsyncScript('http://api.tumblr.com/v2/blog/'+tumblrURL+'/posts/video?limit=20&callback=handleTumblrVideos&api_key=');
   loadAsyncScript('http://api.tumblr.com/v2/blog/'+tumblrURL+'/posts/photo?limit=10&callback=handleTumblrPhotos&api_key=');

   loadAsyncScript('http://columbiarecords.com/feeds/v2/instagram/user/?userId=643848163&count=12&callback=loadInstagrams');
   loadAsyncScript('http://columbiarecords.com/feeds/twitter/?username=itssaly&count=14&callback=loadTweets');


   if(hash == "#thankyou") {       
    document.forms['Signup'].style.display = 'none';
    document.getElementById('submitted').style.display = 'block';       
  }

  checkMobile();
  openLightbox();     

}
window.onresize = function(event) { checkMobile(); };

function checkMobile(){

 if (document.documentElement.clientWidth < 1272 || document.body.clientWidth < 1272)
  { mobile = 'true'; }
else  {mobile =  'false'; }

}
function handleTumblrPhotos(oResponse) {  
 var
 oDate,
 elemWrapper = document.createElement('div'),
 arrTempPosts = [],
 photo = ''
 ;

 for(var i = 0, n = oResponse.response.posts.length; i < n; i++) {        
  photo += '<img src="'+ oResponse.response.posts[i].photos[0].original_size.url+'"/>';
}
sectionPhotos.innerHTML += photo;   
}

function handleTumblrVideos(oResponse) {
 var
 elemWrapper = document.createElement('div'),
 original = '',
 modified = '',
 videos = ''
 ;
 for(var i = 0, n = oResponse.response.posts.length; i < n; i++) {          
  original = oResponse.response.posts[i].player[2].embed_code;

  if(original.indexOf('?feature=oembed') != -1){
   modified = original.replace("?feature=oembed", "?feature=oembed&controls=0&autohide=1");
   videos += modified;
 }
 else{
   videos += original;  
 }  
} 
sectionVideos.innerHTML += videos;  
}
function handleTumblrMusic(oResponse){
  var
  elemWrapper = document.createElement('div'),
  music ='',
  title =''
  ;
   for(var i = 0, n = oResponse.response.posts.length; i < n; i++) {
   
    //Handle Music    
    if(oResponse.response.posts[i].tags.indexOf("music") != -1){
      music +='<div class="post">';
      if(oResponse.response.posts[i].title){
        title = oResponse.response.posts[i].title;
        music += '<h2>'+title+'</h2>';   
      }     
      music += oResponse.response.posts[i].body;
      music +='</div>';
    }
  }  
  sectionMusic.innerHTML += music;
}
function handleTumblrText(oResponse) {
  var
  elemWrapper = document.createElement('div'),
  bio = '' 
  ;

  for(var i = 0, n = oResponse.response.posts.length; i < n; i++) {
    //Handle About
    if(oResponse.response.posts[i].tags.indexOf("about") != -1){
      bio += oResponse.response.posts[i].body;
      console.log(oResponse.response.posts[i].body);
    }   
  }
  
  sectionAbout.innerHTML += bio;  
}
function handleTumblrNews(oResponse){
  var
  elemWrapper = document.createElement('div'),
  title       = '',
  body        = '',
  image       = '',
  date        = '',
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  ;
  for(var i = 0, n = oResponse.response.posts.length; i < n; i++) {
    if(oResponse.response.posts[i].tags.indexOf("news") != -1){

      date = new Date(oResponse.response.posts[i].timestamp * 1000);

      //Text
      if(oResponse.response.posts[i].type == 'text'){
        body += '<div class="post text"><div class="date">'+ months[date.getMonth()] + ' ' + date.getDate() +'</div>';
        if(oResponse.response.posts[i].title){
          title = oResponse.response.posts[i].title;
          body += '<h2>'+title+'</h2>'; 
        }
        body += oResponse.response.posts[i].body + '</div>';
      }
      //Photo
      else if(oResponse.response.posts[i].type == 'photo'){
        body += '<div class="post photo"><div class="date">'+ months[date.getMonth()] + ' ' + date.getDate() +'</div>';
        body += '<img src="'+ oResponse.response.posts[i].photos[0].original_size.url +'" />' + oResponse.response.posts[i].caption + '</div>';
      }

      //Link
      else if(oResponse.response.posts[i].type == 'link'){
        body += '<div class="post link"><div class="date">'+ months[date.getMonth()] + ' ' + date.getDate() +'</div>';
        if(oResponse.response.posts[i].title){
          title = oResponse.response.posts[i].title;
          body += '<a href="'+oResponse.response.posts[i].url+'" target="_blank" class="title">'+title+'</a>';
        }
        if(oResponse.response.posts[i].link_image){
          body += '<a href="'+oResponse.response.posts[i].url+'" target="_blank"><img src="'+oResponse.response.posts[i].link_image+'"/></a>';
        } 
        body += oResponse.response.posts[i].description + ' ' + '<a href="'+oResponse.response.posts[i].url+'" target="_blank">'+oResponse.response.posts[i].url+'</a>';
        body += '</div>'
      }

      //Video
      else if(oResponse.response.posts[i].type == 'video'){
       body += '<div class="post video"><div class="date">'+ months[date.getMonth()] + ' ' + date.getDate() +'</div>';
       body += oResponse.response.posts[i].player[2].embed_code + oResponse.response.posts[i].caption + '</div>';
     }

      //Audio
      else if(oResponse.response.posts[i].type == 'audio'){
        body += '<div class="post video"><div class="date">'+ months[date.getMonth()] + ' ' + date.getDate() +'</div>';
        body += oResponse.response.posts[i].player + oResponse.response.posts[i].caption;
        body +='</div>';
      }
    }
  }
  sectionNews.innerHTML += body;
}

function loadAsyncScript(strSource) {
  var elemScript = document.createElement('script');
  elemScript.async = true;
  elemScript.src = strSource;
  document.body.appendChild(elemScript);
}
function toggleNav(){ 
  if(nav.className.indexOf('expanded') == -1){
    nav.className = ' expanded';
    contentWrapper.className ='';
    document.getElementById('nav-trigger').className = ' open'
  }
  else{
    nav.className= '';
    document.getElementById('nav-trigger').className = '';  
  } 
}

function setSection(sectionName){

  if (sectionName == 'videos'){   
    contentWrapper.className = ' videos-active';
  } 
  else if(sectionName == 'about'){
    contentWrapper.className = ' about-active';
  }
  else if(sectionName == 'live'){
    contentWrapper.className = ' live-active';
  }
  else if(sectionName == 'photos'){
    contentWrapper.className = ' photos-active';
  }
  else if(sectionName == 'music'){
    contentWrapper.className = ' music-active';
  }
  else if(sectionName == 'home'){
    contentWrapper.className = 'home-active';
  }
  else if(sectionName == 'newsletter'){
    contentWrapper.className = 'newsletter-active';
  }
  else if(sectionName == 'news'){
    contentWrapper.className = 'news-active';
  }

  checkMobile();
  if(mobile == "true") { nav.className= '';
  document.getElementById('nav-trigger').className = '';   }

}

function openLightbox() {

  if(lightbox.className.indexOf('open') == -1) {

   lightbox.className += ' open';

 }

 return false;

}

function closeLightbox() {

  if(lightbox.className.indexOf('open') > -1) {

   lightbox.className = lightbox.className.replace(/ ?open/, '');

 }

 return false;

}


initialize();



