import { h } from 'hyperapp'
import Browse from './browse'
export default ({m,a}) =>
  <feed->
    <header>
      <title->{
        m.browses.filter === 0 ? 'Most Recent' :
          m.browses.list[0] ? m.browses.list[0].name :
            <span>EVERYONE</span>
      }</title->
      <wordmark->BROWSES</wordmark->
    </header>
    <browses->{m.browses.list.map(x =>
      <Browse user={m.user} browse={x} a={a} />)}
    </browses->
  </feed->
