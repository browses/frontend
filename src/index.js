import { h, app, router } from "hyperapp";
import { getBrowsesUser, getLatestBrowses, putBrowseBrowser, putBrowseView, deleteBrowse } from './browse';
import './index.scss';

import Nav from './nav';

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

const removeDuplicatesBy = (keyFn, array) => {
  var mySet = new Set();
  return array.filter(function(x) {
    var key = keyFn(x), isNew = !mySet.has(key);
    if (isNew) mySet.add(key);
    return isNew;
  });
}

const model = {
  user: null,
  browses: [],
  filter: 'Most Recent',
  extensionURL: 'https://chrome.google.com/webstore/detail/browses/fpijpjkcpkhbkeiinkphbiaapekmfgdo',
}

const view = (model, actions) =>
  <app->
    <Nav user={model.user} extensionURL={model.extensionURL} />
    <header>
      <title->{model.filter}</title->
      <wordmark->BROWSES</wordmark->
    </header>
    <browses->{model.browses.map(({
        image,url,browser,title,browsers={},published,uid,key
      }) =>
      <browse->
        <a href={url} target='_blank'>
          <screenshot- onClick={e => actions.logView(key)} style={{ backgroundImage: `url(${image})` }}></screenshot->
        </a>
        <meta->
          <a href={'/' + browser}>
            <img className='avatar' src={`https://graph.facebook.com/${browser}/picture?type=square`} />
          </a>
          <col->
            <title->{title}</title->
            <row->
              <browsers->{ Object.keys(browsers).map(id =>
                <a href={'/' + id}>
                  <img src={`https://graph.facebook.com/${id}/picture?type=square`} />
                </a>
              )}</browsers->
              <time->{timeSince(published) + ' ago'}</time->
            </row->
          </col->
          { model.user && model.user.fbid === browser ?
            <button className='delete' onClick={e => actions.logRemove(key)}>x</button> : ''
          }
        </meta->
      </browse->
    )}</browses->
  </app->

const update = {
  removeBrowse: (model, value) => ({
    browses: model.browses.filter(
      x => x.key !== value
    )
  }),
  viewBrowse: (model, value) => ({
    browses: model.browses.map(x => {
      if(x.key === value) x.browsers = Object.assign({}, x.browsers, {
        [model.user.fbid]: true
      });
      return x
    })
  }),
  addBrowse: (model, value) => ({
    browses: removeDuplicatesBy(x => x.key,
    model.browses.concat(value).sort((a, b) => {
      if (a.published > b.published) return -1;
      if (a.published < b.published) return 1;
      return 0;
    }))
  }),
  setUser: (model, value) => ({ user: value }),
}

const effects = {
  fetchBrowses: (model, actions) =>
    getLatestBrowses([...model.browses].pop())
    .then(browses => browses.forEach(b =>
      actions.addBrowse(b.val())
    )),
  logView: (model, actions, data) => {
    putBrowseView(data)
    putBrowseBrowser(model.user.fbid, data)
    .then(browse => actions.viewBrowse(data))
  },
  logRemove: (model, actions, data) => {
    deleteBrowse(model.user.uid, data)
    .then(browse => actions.removeBrowse(data))
  },
}

const subscriptions = [
  (model, actions) =>
    getBrowsesUser()
    .then(user => actions.setUser({
      displayName: user.displayName,
      photoURL: user.providerData[0].photoURL,
      uid: user.uid,
      fbid: user.providerData[0].uid,
    })),
  (model, actions) =>
    getLatestBrowses()
    .then(browses => browses.forEach(browse => {
      actions.addBrowse(browse.val());
    })),
  (model, actions) =>
    window.onscroll = (e) => {
      if(document.body.scrollTop > 0
        && (window.innerHeight + window.scrollY)
        >= document.body.scrollHeight) {
        actions.fetchBrowses();
      }
    }
]

const hooks = {
  onUpdate: (last, model) => console.log(model)
}

app({ router, model, view, update, effects, subscriptions, hooks })
