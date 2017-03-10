import { h } from "hyperapp"

const timeSince = (date) => {
  const z = (x, y) => x > 1 ? `${x} ${y}s` : `${x} ${y}`;
  const x = Math.floor((new Date() - date) / 1000);
  var i = Math.floor(x / 31536000); if (i >= 1) return z(i, 'year');
  i = Math.floor(x / 2592000); if (i >= 1) return z(i, 'month');
  i = Math.floor(x / 86400); if (i >= 1) return z(i, 'day');
  i = Math.floor(x / 3600); if (i >= 1) return z(i, 'hour');
  i = Math.floor(x / 60); if (i >= 1) return z(i, 'minute');
  return z(Math.floor(x), 'second');
}

export default ({user, browse, a}) =>
  <browse->
    <a href={browse.url} target='_blank'>
      <screenshot-
        onclick={e => a.browse.view(browse.key)}
        style={{ backgroundImage: `url(${browse.image})`
      }}></screenshot->
    </a>
    <meta->
      <a href={'/'+browse.browser}>
        <img
          className='avatar'
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
          <time->{timeSince(browse.published) + ' ago'}</time->
        </row->
      </col->
      { user && user.fbid === browse.browser ?
        <button className='delete' onclick={e => a.browse.delete(browse.key)}>
          <svg
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentcolor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="6.25%"
            xmlns="http://www.w3.org/2000/svg">
      		  <path d="M28 6 L6 6 8 30 24 30 26 6 4 6 M16 12 L16 24 M21 12 L20 24 M11 12 L12 24 M12 6 L13 2 19 2 20 6"></path>
      		</svg>
        </button> : ''
      }
    </meta->
  </browse->
