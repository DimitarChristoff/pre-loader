import { normal, parallel, dom }  from './examples';

const { search }                  = window.location;

search.indexOf('parallel') !== -1 ?
  parallel() : search.indexOf('dom') !== -1 ?
    dom() :
    normal()
