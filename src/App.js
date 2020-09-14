import React from 'react'
import './App.css'
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      communities: [],
      active: 'discover',
    }
    this.subscribe = this.subscribe.bind(this)
  }
  async componentDidMount() {
    let url = 'http://10.1.1.20:3000/api/collections/community/list';
    let response = await fetch(url, 
    { headers: { userid: localStorage.getItem('userId') !== null ? localStorage.getItem('userId') : '' } })

    let com = await response.json();

    this.setState({
      communities: com.data,
    })


    if (com.success === true) { 
    

      localStorage.setItem('userId', response.headers.get('userid'));

    }
  }
  async subscribe(i) {
    const response = await fetch('http://10.1.1.20:3000/api/users/userapi/subscribe',
      {
        method: 'POST',
        headers: {
          userid: localStorage.getItem('userId') !== 'null' ? localStorage.getItem('userId') : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          communityId: this.state.communities[i].id
        }),
      })
    let com = await response.json();
    console.log(com)

    let url  = 'http://10.1.1.20:3000/api/collections/community/list';
    let response1 = await fetch(url, { headers: { userid: localStorage.getItem('userId') !== null ? localStorage.getItem('userId') : '' } })

    let com1 = await response1.json();

    this.setState({
      communities: com1.data,
    })
  }

  render() {
    return (

      <div className="main_container">
        <div className="nav">
          <ul>
            <li>
              <a className={"discover " + (this.state.active === 'discover' ? 'active' : "")}
                href="/#">Discover</a>
            </li>
            <li>
              <a className="myComms" href="/#">My communities</a>
            </li>
          </ul>
          <hr />
        </div>
        <UserContainer subscribe={this.subscribe} communities={this.state.communities} />

      </div>

    )
  }
}

function UserContainer(props) {
  return <div className="user_container">

    {props.communities.map((value, index) => {
      return <div key={value.id} className="userCard">
        <div className="userPicture">
          <img src={value.image} alt="userPic" className="image" />
        </div>
        <div className="userContent">
          <div className="userName">
            {value.name}
          </div>
          <div className="userInfo">
            {`${value.type} • ${value.followersAmount} Followers • ${value.postsAmount} Posts `}
          </div>
        </div>
        <button className={value.isFollow ? 'unfollowButton' : 'followButton'}
          onClick={() => props.subscribe(index)}>Follow</button>

      </div>
    })}

  </div>
}
export default App