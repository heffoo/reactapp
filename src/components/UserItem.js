import React, { Component } from "react";
class UserItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.toggleContainer = React.createRef();
    this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
  }

  dropContent = () => {
    console.log(12);
    const isOpen = this.state.open;
    this.setState({
      open: !isOpen,
    });
  };
  componentDidMount() {
    window.addEventListener("click", this.onClickOutsideHandler);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.onClickOutsideHandler);
  }
  onClickOutsideHandler(event) {
    if (!this.toggleContainer.current.contains(event.target)) {
      if (this.state.open) {
        this.setState({ open: false });
      }
    }
  }
  render() {
    return (
      <div className="userCard">
        <div className="userPicture">
          <img src={this.props.value.image} alt="userPic" className="image" />
        </div>
        <div className="userContent">
          <div className="userName">{this.props.value.name}</div>
          <div className="userInfo">{`${this.props.value.type} • ${this.props.value.followersAmount} Followers • ${this.props.value.postsAmount} Posts `}</div>
        </div>

        <button
          ref={this.toggleContainer}
          className={
            this.props.active === "myComms" ? "dropbtn" : this.props.value.isFollow ? "unfollowButton" : "followButton"
          }
          onClick={
            this.props.active !== "discover" ? () => this.dropContent() : (id) => this.props.subscribe(this.props.index)
          }
        >
          {/* {this.props.active === "myComms"
                      ? this.props.open === value.id && (
                          
                        )
                      : ""} */}
          {this.props.active === "myComms" ? "• • •" : this.props.value.isFollow ? "Unfollow" : "Follow"}
        </button>

        {this.props.active !== "discover" && this.state.open ? (
          <div className="dropContent" onClick={(id) => this.props.subscribe(this.props.index)}>
            Follow
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
export default UserItem;
