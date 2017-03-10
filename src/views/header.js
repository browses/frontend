import { h } from "hyperapp"
export default ({m,a}) =>
  <header>
    <title->{
      m.browses.filters[m.browses.filter] ||
      (m.browses.list[0] ? m.browses.list[0].name :
        '___________')
    }</title->
    <wordmark->BROWSES</wordmark->
  </header>
