import { h } from "hyperapp";
import './index.scss';
export default ({user, extensionURL}) =>
  <nav>
    <a className='icon' href='/'>
      <svg>
        <use xlinkHref="#i-browses-icon"></use>
      </svg>
    </a>
    { user ?
      <a className='user' href={'/' + user.fbid}>
        <name->{user.displayName}</name->
        <avatar->
          <img src={user.photoURL} />
        </avatar->
      </a> :
      <a href={extensionURL}>Install Extension</a>
    }
  </nav>
