import React from 'react';

export default class PullRequestDetails extends React.Component {
  render() {
    return <div className="pr-title">
        <a href={this.props.pullRequest.href}>{ this.props.pullRequest.number } {this.props.pullRequest.repo.name}</a>
    </div>;
  }
}
