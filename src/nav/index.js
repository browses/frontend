import { h } from "hyperapp";
import './index.scss';
export default ({user, actions}) =>
  <nav>
    <row->
      <a href='/' onClick={e => actions.changeFilter(0)}><img src='/icon.png' /></a>
      <a href='/recent' onClick={e => actions.changeFilter(0)}>Recent</a>
      <a href='/popular' onClick={e => actions.changeFilter(1)}>Popular</a>
    </row->
    { user ?
      <a className='user' href={'/' + user.fbid} onClick={e => actions.changeFilter(user.fbid)}>
        <name->{user.displayName}</name->
        <avatar->
          <img src={user.photoURL} />
        </avatar->
      </a> :
      <a href='https://chrome.google.com/webstore/detail/browses/fpijpjkcpkhbkeiinkphbiaapekmfgdo'>Install Extension</a>
    }
  </nav>
