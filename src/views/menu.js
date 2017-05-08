import { h } from 'hyperapp'
export default ({m}) =>
  <nav>
    <a href='/'>
      <svg viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'>
        <polygon points='28.199 10.547 28.199 22.103 32.507 17.774 35.802 17.89 28.199 10.547'></polygon><line x1='32.39893' y1='17.77388' x2='34.98541' y2='22.60162' fill='none' stroke='#000' stroke-miterlimit='10' stroke-width='1.79071'></line><path d='M47,1V47H1V1H47m1-1H0V48H48V0Z'></path>
      </svg>
    </a>
    { m.user.fbid ?
      <a class='user' href={'/'+m.user.fbid}>
        <name->{m.user.displayName}</name->
        <avatar->
          <img src={m.user.photoURL} />
        </avatar->
      </a> :
      <button
        class='install'
        onclick={() => chrome.webstore.install('fpijpjkcpkhbkeiinkphbiaapekmfgdo')}
      >+ Add to Chrome</button>
    }
  </nav>