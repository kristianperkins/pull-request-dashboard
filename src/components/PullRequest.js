import React from 'react';

export default class PullRequest extends React.Component {
  render() {
    return <li className={ this.props.pullRequest.status }>
      <div className="header">
        <div class="pr-title"><a href={this.props.pullRequest.href}>{ this.props.pullRequest.number } {this.props.pullRequest.repo.name}</a></div>
      </div>
      <div className="body">
        <a href={ this.props.pullRequest.user.href }><img className="user-avatar" src={ this.props.pullRequest.user.avatar_url } /></a>
        <div className="title">{ this.props.pullRequest.title }</div>
      </div>
    </li>;
  }
}
