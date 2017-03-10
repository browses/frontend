import { h } from 'hyperapp'

import Nav from '../views/nav'
import Header from '../views/header'
import Browses from '../views/browses'

export default (m,a) =>
  <default->
    <Nav m={m} a={a} />
    <Header m={m} a={a} />
    <Browses m={m} a={a} />
  </default->
