if (Meteor.isClient) {
  Session.set('limit', 10)
  // Declare the collection; pass null so it won't look for a mongo database

  //var Posts = new Meteor.Collection(null)

  // for debugging and development, we can make this global to query from the console
  Posts = new Meteor.Collection(null)

  Template.allPosts.onCreated(function(){
    // when the template is created, before it is rendered, we make the ajax call
    HTTP.get('https://public-api.wordpress.com/rest/v1/sites/idcdistro.wordpress.com/posts/?callback=ajpRspthis',{
    }, function(err, res){
      if(!err && res && res.statusCode === 200){
        // This is invalid JSON when it comes back. It needs help.
        // It feels dirty to hard code this in such a brittle way

        // We're going to turn this into a client-side only collection so we can query it like we would a database
        JSON.parse(res.content.slice(15, res.content.length -2)).posts.forEach(function(post){Posts.insert(post)})
      } else{
        // FIXME do something with error state
        // What I'd like to do is attempt to render a cached / created HTML file
        // if user has connected, but lost connection or cache the JSON file and
        // load things that way. Instead, this ugly thing
        $('.uk-alert').removeClass('uk-hidden')
      }
    })

    // there is no body scroll event so I have to do this instead
    $(window).on('scroll', function(e) {
      var element = document.body
      if($(window).scrollTop() + $(window).height() > $(document).height() - 150) {
           var limit = Session.get('limit')
           Session.set('limit', limit += 5)
      }
    })
  })

  Template.allPosts.helpers({
    post: function () {
      return Posts.find({},{limit:Session.get('limit')})
    },
    publish:function(){
      if(this.status==='publish'){
         return true
       }else{
         return false
       }
    },
    pretty:function(date){
      return moment(date).from(moment())
    }
  });

  Template.allPosts.events({
    'click img': function (e) {
      e.preventDefault();
      var src = $(e.currentTarget).attr('src').split('?')[0];
      var lightbox = UIkit.lightbox.create([
        {'source': src, 'type':'image'}
      ]);
      lightbox.show();
    }
  });
}




if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
