import React from 'react';
import PullRequestDetails from './PullRequestDetails';
import jQuery from 'jquery';

export default class PullRequest extends React.Component {
  render() {
    var status = this.state ? this.state.status : "loading";

    return <li className={ status }>
      <div className="header">
        <PullRequestDetails pullRequest={this.props.pullRequest} status={status} />
      </div>
      <div className="body">
        <a href={ this.props.pullRequest.user.href }><img className="user-avatar" src={ this.props.pullRequest.user.avatar_url } /></a>
        <div className="title">{ this.props.pullRequest.title }</div>
      </div>
    </li>;
  }

  componentDidMount() {
    var self = this;
    jQuery.ajax({
      url: '/api/pull-request/' + this.props.pullRequest.repo.name + '/' + this.props.pullRequest.number,
      dataType: 'json',
      success(response) {
        self.setState(response);
      }
    });
  }
}
