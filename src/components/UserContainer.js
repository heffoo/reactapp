import React, { Component } from "react";
import UserItem from "./UserItem";

class UserContainer extends Component {
  constructor(props) {
    super(props);
    // this.toggleContainer = React.createRef();
  }

  render() {
    return (
      <div ref={this.toggleContainer}>
        <div className="user_container">
          {this.props.communities.map((value, index) => {
            return (
              <UserItem
                value={value}
                index={index}
                key={value.id}
                active={this.props.active}
                subscribe={this.props.subscribe}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default UserContainer;
