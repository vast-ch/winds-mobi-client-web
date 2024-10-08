// eslint-disable-next-line ember/use-ember-data-rfc-395-imports
import RequestManager from '@ember-data/request';
import Fetch from '@ember-data/request/fetch';
import Store, { CacheHandler } from '@ember-data/store';
import { CachePolicy } from '@ember-data/request-utils';
import type { CacheCapabilitiesManager } from '@ember-data/store/-types/q/cache-capabilities-manager';
import type { Cache } from '@warp-drive/core-types/cache';
import JSONAPICache from '@ember-data/json-api';
import {
  registerDerivations,
  SchemaService,
  withDefaults,
} from '@warp-drive/schema-record/schema';
import {
  instantiateRecord,
  teardownRecord,
} from '@warp-drive/schema-record/hooks';
import { SchemaRecord } from '@warp-drive/schema-record/record';
import type { StableRecordIdentifier } from '@warp-drive/core-types';
import type { Type } from '@warp-drive/core-types/symbols';
import StationHandler from 'winds-mobi-client-web/handlers/station';
import HistoryHandler from 'winds-mobi-client-web/handlers/history';

const StationSchema = withDefaults({
  type: 'station',
  fields: [
    { name: 'altitude', kind: 'field' },
    { name: 'latitude', kind: 'field' },
    { name: 'longitude', kind: 'field' },
    { name: 'isPeak', kind: 'field' },
    { name: 'providerName', kind: 'field' },
    { name: 'providerUrl', kind: 'field' },
    { name: 'name', kind: 'field' },
    { name: 'last', kind: 'object' },
  ],
});

const HistorySchema = withDefaults({
  type: 'history',
  fields: [
    { name: 'direction', kind: 'field' },
    { name: 'speed', kind: 'field' },
    { name: 'gusts', kind: 'field' },
    { name: 'temperature', kind: 'field' },
    { name: 'humidity', kind: 'field' },
    { name: 'timestamp', kind: 'field' },
  ],
});

export type Station = {
  id: string;
  altitude: number;
  latitude: number;
  longitude: number;
  isPeak: boolean;
  providerName: string;
  providerUrl: string;
  name: string;
  last: {
    direction: number;
    speed: number;
    gusts: number;
    temperature: number;
    humidity: number;
    pressure: number;
    rain: number;
  };

  [Type]: 'station';
};

export type History = {
  id: string;
  direction: number;
  speed: number;
  gusts: number;
  temperature: number;
  humidity: number;
  timestamp: number;

  [Type]: 'history';
};

export default class StoreService extends Store {
  constructor(args: unknown) {
    super(args);
    this.requestManager = new RequestManager();
    this.requestManager.use([HistoryHandler, StationHandler, Fetch]);
    this.requestManager.useCache(CacheHandler);

    this.lifetimes = new CachePolicy({
      apiCacheHardExpires: 60 * 60 * 1000,
      apiCacheSoftExpires: 60 * 1000,
    });
  }

  createCache(capabilities: CacheCapabilitiesManager): Cache {
    return new JSONAPICache(capabilities);
  }

  createSchemaService() {
    const schema = new SchemaService();
    schema.registerResource(StationSchema);
    schema.registerResource(HistorySchema);
    registerDerivations(schema);
    return schema;
  }

  instantiateRecord(
    identifier: StableRecordIdentifier,
    createRecordArgs: { [key: string]: unknown },
  ) {
    return instantiateRecord(this, identifier, createRecordArgs);
  }

  teardownRecord(record: SchemaRecord): void {
    teardownRecord(record);
  }
}
