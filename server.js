var express = require('express');
var octonode = require('octonode');
var jsonfile = require('jsonfile');
var app = express();

// load config file
var config = jsonfile.readFileSync('./config.json');

/**
 * Serve the web folder as static assets
 */
app.use(express.static('web'));

/**
 * /api/pull-requests route
 */
app.get('/api/pull-requests', function (req, res) {
  var github = octonode.client(config.githubToken);
  var search = github.search();

  // repo.prs(function(err, pulls, headers) {
  search.issues({
    q: config.githubSearch,
    sort: 'created',
    order: 'desc'
  }, function(err, data, headers) {
    pulls = data.items;
    // console.log(pulls);
    if (err) {
      console.log(err);
      return;
    }
    var response = {
      meta: {
        pullRequestCount: pulls.length,
        users: {}
      },
      pullRequests: []
    };
    var statusesReturned = 0;

    if (pulls.length === 0) {
      res.send(response);
      return;
    }

    pulls.forEach(function(pull) {
      var item = {
        number: pull.number,
        title: pull.title,
        user: {
          login: pull.user.login,
          avatar_url: pull.user.avatar_url,
          href: pull.user.html_url
        },
        href: pull.html_url,
        repo: {
          name: '...'
        },
        // pull: pull,
        // TODO: need to perform another request to get the pull request state
        status: 'success'
      };

      if (!response.meta.users[pull.user.login]) {
        response.meta.users[pull.user.login] = {
          login: pull.user.login,
          avatar_url: pull.user.avatar_url,
          count: 0
        };
      }

      response.meta.users[pull.user.login].count++;

      // very basic filter to only show certain repos in search results
      var repo_name;
      if (typeof config.repos != "undefined" && config.repos != null && config.repos.length > 0) {
        repo_name = config.repos.find(function(item){return pull.repository_url.endsWith(item)})
      }
      else {
        repo_name = pull.repository_url.split('/').slice(-2).join('/');
      }
      if (repo_name) {
        item.repo.name = repo_name;
        item.repo.url = pull.repository_url;
        response.pullRequests.push(item);
      }

      // repo.statuses(pull.head.sha, function(err, statuses, headers) {
      //   if (statuses.length > 0) {
      //     item.status = statuses[0].state;
      //   }
      //
        statusesReturned++;
        if (statusesReturned === pulls.length) {
          res.send(response);
        }
      // });

    });
  });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Pull request dashboard listening at http://%s:%s', host, port);
});
