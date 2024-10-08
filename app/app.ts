import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'winds-mobi-client-web/config/environment';
import './app.css';
import '@glint/environment-ember-loose'; // Because: https://typed-ember.gitbook.io/glint/environments/ember/installation
import { setBuildURLConfig } from '@ember-data/request-utils';

setBuildURLConfig({
  host: 'https://winds.mobi/api',
  namespace: '2.3',
});

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
