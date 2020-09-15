import React, { Component } from "react";
import "./App.css";
import { url } from "./consts";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      active: "discover",
    };
    this.subscribe = this.subscribe.bind(this);
  }
  componentDidMount = async () => {
    // let url = "http://10.1.1.20:3000/api/collections/community/list";
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
  };
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
  subscribe = async (i) => {
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
      active: "discover",
    });
  };

  showFollowers = async () => {
    {
      const comData = await this.fetchComunityList();
      this.setState({
        communities: comData.data,
        active: "myComms",
      });
    }
  };

  render() {
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
              {" "}
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
            <input type="text" id="search" size="70" placeholder=" &#128269;   Search" />
          </label>
        </div>

        <UserContainer subscribe={this.subscribe} active={this.state.active} communities={this.state.communities} />
      </div>
    );
  }
}
// dropContent = () => {
//   return <button className="dropContent">Follow</button>;
// };
class UserContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: null,
    };
  }

  render() {
    return (
      <div className="user_container">
        {this.props.communities.map((value, index) => {
          return (
            <div key={value.id} className="userCard">
              <div className="userPicture">
                <img src={value.image} alt="userPic" className="image" />
              </div>
              <div className="userContent">
                <div className="userName">{value.name}</div>
                <div className="userInfo">{`${value.type} • ${value.followersAmount} Followers • ${value.postsAmount} Posts `}</div>
              </div>

              <button
                className={
                  this.props.active === "myComms" ? "dropbtn" : value.isFollow ? "unfollowButton" : "followButton"
                }
                onClick={(e) => {
                  this.props.subscribe(index);

                  this.setState({
                    open: value.id,
                  });
                  console.log(123);
                  // this.state.open = !this.state.open
                }}
              >
                {this.props.active === "myComms" ? (
                  this.state.open === value.id ? (
                    <button className="dropContent">Follow</button>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
                {this.props.active === "myComms" ? "• • •" : value.isFollow ? "Unfollow" : "Follow"}
              </button>
            </div>
          );
        })}
      </div>
    );
  }
}
export default App;
