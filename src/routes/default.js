import { h } from 'hyperapp'

import Menu from '../views/menu'
import Feed from '../views/feed'

export default (m,a) =>
  <default->
    <Menu m={m} a={a} />
    <Feed m={m} a={a} />
  </default->
