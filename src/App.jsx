import React, { Component } from "react";
import "./App.css";
import { url } from "./consts";

class App extends Component {
  constructor() {
    super();
    this.state = {
      communities: [],
      filteredComs: [],
      active: "discover",
      open: false,
    };
  }

  componentDidMount = async () => {
    const urlList = url + "collections/community/list";
    let response = await fetch(urlList, {
      headers: {
        userid: localStorage.getItem("userId") !== null ? localStorage.getItem("userId") : "",
      },
    });

    let com = await response.json();

    this.setState({
      communities: com.data,
    });

    if (com.success === true) {
      localStorage.setItem("userId", response.headers.get("userid"));
    }
    // window.addEventListener("click", this.closeMenu);
  };
  // closeMenu(e) {
  //   if (this.state.open && !this.toggleContainer.current.contains(e.target)) {
  //     this.setState({ open: null });
  //   }
  // }
  fetchDataList = async () => {
    const urlList = url + "collections/community/list";
    let response = await fetch(urlList, {
      headers: {
        userid: localStorage.getItem("userId") !== null ? localStorage.getItem("userId") : "",
      },
    });
    return await response.json();
  };

  fetchComunityList = async () => {
    const urlList = url + "collections/user-community";
    let response = await fetch(urlList, {
      headers: {
        userid: localStorage.getItem("userId") !== null ? localStorage.getItem("userId") : "",
      },
    });

    return await response.json();
  };

  //    = (id) => {
  //   this.setState({
  //     open: id,
  //   });
  // };

  subscribe = async (i) => {
    console.log(123);
    const response = await fetch(url + "users/userapi/subscribe", {
      method: "POST",
      headers: {
        userid: localStorage.getItem("userId") !== "null" ? localStorage.getItem("userId") : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        communityId: this.state.communities[i].id,
      }),
    });
    let com = await response.json();
    let comData = [];
    if (this.state.active === "discover") {
      comData = await this.fetchDataList();
    } else {
      comData = await this.fetchComunityList();
    }
    console.log(comData);
    this.setState({
      communities: comData.data,
    });
  };

  showAll = async () => {
    const comData = await this.fetchDataList();

    this.setState({
      communities: comData.data,
      filteredComs: [],
      active: "discover",
    });
  };

  showFollowers = async () => {
    {
      const comData = await this.fetchComunityList();
      this.setState({
        communities: comData.data,
        filteredComs: [],
        active: "myComms",
      });
    }
  };

  search = (value) => {
    const searchText = value.toLowerCase();

    let filtered = [];
    if (!this.isFollow) {
      filtered = this.state.communities.filter(function (user) {
        return user.name.toLowerCase().includes(searchText);
      });
    } else {
      const followList = this.state.communities.filter((item) => item.isFollow);
      filtered = followList.filter((user) => {
        return user.name.toLowerCase().includes(searchText);
      });
    }
    this.setState({
      filteredComs: filtered,
    });
  };

  render() {
    const isDiscover = this.state.filteredComs.length ? this.state.filteredComs : this.state.communities;
    return (
      <div className="main_container">
        <div className="nav">
          <ul>
            <li>
              <a
                onClick={this.showAll}
                className={"discover " + (this.state.active === "discover" ? "active" : "")}
                href="/#"
              >
                Discover
              </a>
            </li>
            <li>
              <a
                onClick={this.showFollowers}
                className={"myComms " + (this.state.active === "myComms" ? "active" : "")}
                href="/#"
              >
                My communities
              </a>
            </li>
          </ul>
          <hr />
          <label>
            <input
              type="text"
              onChange={(e) => this.search(e.target.value)}
              id="search"
              size="70"
              placeholder=" &#128269;   Search"
            />
          </label>
        </div>

        <UserContainer
          subscribe={this.subscribe}
          dropContent={this.dropContent}
          active={this.state.active}
          communities={isDiscover}
        />
      </div>
    );
  }
}

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
export default App;
