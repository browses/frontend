import { h } from 'hyperapp'
import { timeSince } from '../helpers/time'

const Screenshot = ({ url, image, key, a }) =>
  h('a', { href: url, target: '_blank' },[
    h('screenshot-', {
      style: { backgroundImage: `url(${image})` },
      onclick: _ => a.browse.view(key),
    })
  ])

const FacebookAvatar = id =>
  h('a', { href: '/' + id }, [
    h('img', {
      class: 'avatar',
      src: `https://graph.facebook.com/${id}/picture?type=large`,
    })
  ])

const BrowsersAvatarList = ({
    browser,
    browsers = {},
  }) =>
  h('browsers-', null, Object.keys(browsers)
    .filter(id => id !== browser)
    .map(FacebookAvatar)
  )

const DeleteBrowseButton = ({
    user,
    browser,
    key,
    a
  }) =>
  user !== browser ? null :
  h('button', {
    class: 'delete',
    onclick: _ => a.browse.delete(key),
  },[
    <svg viewBox='0 0 32 32' fill='none' stroke='currentcolor' stroke-linecap='round' stroke-linejoin='round' stroke-width='6.25%' xmlns='http://www.w3.org/2000/svg'>
      <path d='M28 6 L6 6 8 30 24 30 26 6 4 6 M16 12 L16 24 M21 12 L20 24 M11 12 L12 24 M12 6 L13 2 19 2 20 6'></path>
    </svg>
  ])

const Row = xs => h('row-', {}, xs)
const Col = xs => h('col-', {}, xs)
const Meta = xs => h('meta-', {}, xs)
const Browse = (key,xs) => h('browse-', {}, xs)
const Title = text => h('title-', {}, text)
const TimeSince = time => h('time-', {}, timeSince(time))

export default ({
  user = {},
  a = {},
  browse = {},
}) =>
Browse(browse.key, [
  Screenshot({ ...browse, a }),
  Meta([
    FacebookAvatar(browse.browser),
    Col([
      Title(browse.title),
      Row([
        BrowsersAvatarList({ ...browse }),
        TimeSince(browse.published),
      ]),
    ]),
    DeleteBrowseButton({ ...browse, user: user.fbid, a }),
  ]),
])
