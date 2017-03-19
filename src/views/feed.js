import { h } from 'hyperapp'
import Browse from './browse'

const toArray = o => Object.keys(o).map(k => o[k])
const firstItem = o => o[Object.keys(o)[0]]

export default ({m,a}) =>
  <feed->
    <header>
      <title->{
        m.browses.filter === 0 ? 'Most Recent' :
          firstItem(m.browses.list) ? firstItem(m.browses.list).name :
            <span>EVERYONE</span>
      }</title->
      <wordmark->BROWSES</wordmark->
    </header>
    <browses->{toArray(m.browses.list).map(x =>
      <Browse user={m.user} browse={x} a={a} />)
    }</browses->
  </feed->
