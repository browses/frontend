import { h } from "hyperapp"
import Browse from "./browse"
export default ({m,a}) =>
  <browses->{m.browses.list.map(x =>
    <Browse user={m.user} browse={x} a={a} />)}
  </browses->
