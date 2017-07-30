'use strict';

module.exports = function(app, cb) {
  /*
   * The `app` object provides access to a variety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * http://docs.strongloop.com/display/public/LB/Working+with+LoopBack+objects
   * for more info.
   */
  // REMOVE DUMMY DATA when needed
  app.models.SplurgeData.create(
    [
      {
        description: 'Eat Chocolate',
        uses_per_period: 3,
        period: 'DAY'
      },
      {
        description: 'Cheat Meal',
        uses_per_period: 1,
        period: 'WEEK'
      },
      {
        description: 'Fancy Vacation',
        uses_per_period: 2,
        period: 'YEAR'
      },
      {
        description: 'Delicious Steak Dinner',
        uses_per_period: 3,
        period: 'MONTH'
      }
    ]

  ).then(function() {
    return app.models.Post.create(
      [
        {
          user_id: '2',
          name: 'Charles Shaw',
          profile_url: 'http://static.buzznet.com/uploads/2011/10/msg-13175062972.jpg',
          description: 'Drink a glass of wine',
          status: 'Mmmm... do I taste notes of, uh, red?',
          timestamp: new Date(),
          photo_url: 'https://s-media-cache-ak0.pinimg.com/736x/af/7f/f2/af7ff2bec6283f929f2dcd66b806e656.jpg',
          likes: ['2', '3']
        },
        {
          user_id: '3',
          name: 'Ace P. Seeyay',
          profile_url: 'http://www.thedogtrainingsecret.com/blog/wp-content/uploads/2012/06/look-like-dog-1024x768.jpg',
          description: 'Adopt another puppy',
          status: 'Can\'t resist these lil guys!',
          timestamp: '2017-07-30T03:57:44.717Z',
          photo_url: 'https://scontent.fsnc1-1.fna.fbcdn.net/v/t31.0-8/13416829_1758238581066609_2769570180642789973_o.jpg?oh=80d795dee6eba3ba99f1e50d4e78d5fd&oe=5A35A342',
          likes: ['1']
        },
        {
          user_id: '5',
          name: 'Tay Steer',
          profile_url: 'http://i3.kym-cdn.com/photos/images/newsfeed/000/848/178/9f9.png',
          description: 'Enjoy a cheat meal',
          status: 'DEEEEEEELICIOUS!!',
          timestamp: '2017-07-30T04:14:22.914Z',
          photo_url: 'http://s.eatthis-cdn.com/media/images/ext/832643962/bbq-sauce-sandwich.jpg'
        }
      ]
    )
  }).then(function(){
    process.nextTick(cb)
  });
};
