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
  ).then(function(){
    process.nextTick(cb)}
  );
  //process.nextTick(cb); // Remove if you pass `cb` to an async function yourself
};
