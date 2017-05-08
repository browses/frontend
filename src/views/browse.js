import { h } from 'hyperapp'
import { timeSince } from '../helpers/time'
export default ({user, browse, a}) =>
  <browse->
    <a href={browse.url} target='_blank'>
      <screenshot-
        onclick={() => a.browse.view(browse.key)}
        style={{ backgroundImage: `url(${browse.image})` }}
      ></screenshot->
    </a>
    <meta->
      <a href={'/'+browse.browser}>
        <img
          class='avatar'
          src={`https://graph.facebook.com/${browse.browser}/picture?type=square`}
        />
      </a>
      <col->
        <title->{browse.title}</title->
        <row->
          <browsers->{ Object.keys(browse.browsers || {}).map(id =>
            <a href={'/'+id}>
              <img src={`https://graph.facebook.com/${id}/picture?type=square`} />
            </a>
          )}</browsers->
          <time->{timeSince(browse.published)}</time->
        </row->
      </col->
      { user && user.fbid === browse.browser ?
        <button class='delete' onclick={() => a.browse.delete(browse.key)}>
          <svg viewBox='0 0 32 32' fill='none' stroke='currentcolor' stroke-linecap='round' stroke-linejoin='round' stroke-width='6.25%' xmlns='http://www.w3.org/2000/svg'>
            <path d='M28 6 L6 6 8 30 24 30 26 6 4 6 M16 12 L16 24 M21 12 L20 24 M11 12 L12 24 M12 6 L13 2 19 2 20 6'></path>
          </svg>
        </button> : ''
      }
    </meta->
  </browse->
