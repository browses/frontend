import { h, app, router } from "hyperapp";
import { getBrowsesUser, getLatestBrowses, putBrowseBrowser, putBrowseView, deleteBrowse, getPopularBrowses, getUserBrowses, Browse, getBrowses } from './browse';
import './index.scss';

import Nav from './nav';

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
  filter: 0,
  filters: ['Most Recent', 'Most Popular'],
}

const template = (model, actions, params) =>
  <app->
    <Nav user={model.user} actions={actions} />
    <header>
      <title->{
        model.filters[model.filter] ||
        (model.browses[0] ? model.browses[0].name : '')
      }</title->
      <wordmark->BROWSES</wordmark->
    </header>
    <browses->{model.browses.map(x =>
      <Browse user={model.user} browse={x} actions={actions} />)}
    </browses->
  </app->

const view = {
  '/': template,
  '/:uid': template,
}

const update = {
  clearBrowses: (model, value) => ({ browses: [] }),
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
      if(model.filter === 1) {
        if (a.views > b.views) return -1;
        if (a.views < b.views) return 1;
        return 0;
      } else {
        if (a.published > b.published) return -1;
        if (a.published < b.published) return 1;
        return 0;
      }
    }))
  }),
  setUser: (model, value) => ({ user: value }),
  setFilter: (model, value) => ({ filter: value }),
}

const effects = {
  fetchBrowses: (model, actions) =>
    getBrowses(model.filter, [...model.browses].pop())
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
  changeFilter: (model, actions, data) => {
    actions.clearBrowses();
    actions.setFilter(data);
    actions.fetchBrowses();
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
  (model, actions) => {
    const path = window.location.pathname.replace('/','');
    let topic;
    if(path === '' || path === 'recent') topic = 0;
    else if(path === 'popular') topic = 1;
    else topic = path;
    actions.setFilter(topic);
    getBrowses(topic, [...model.browses].pop())
    .then(browses => browses.forEach(browse => {
      actions.addBrowse(browse.val());
    }));
  },
  (model, actions) =>
    window.onscroll = (e) => {
      if(document.body.scrollTop > 0
        && (window.innerHeight + window.scrollY)
        >= document.body.scrollHeight) {
        actions.fetchBrowses();
      }
    },
]

const hooks = {
  onUpdate: (last, model) => console.log(model)
}

app({ router, model, view, update, effects, subscriptions, hooks })
