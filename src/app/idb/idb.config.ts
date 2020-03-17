import { DBConfig } from 'ngx-indexed-db';

export const dbConfig: DBConfig = {
    name: 'FBcache',
    version: 1,
    objectStoresMeta: [{
        store: 'exchangeheader',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
            { name: 'LastDownload', keypath: 'LastDownload', options: { unique: false } }
        ]
    },
    {
        store: 'LocaleChangedID',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
            { name: 'WebGoodID', keypath: 'WebGoodID', options: { unique: true } }
        ]
    },

    {
        store: 'WebGoods',
        storeConfig: { keyPath: 'id', autoIncrement: false },
        storeSchema: [
            { name: 'id', keypath: 'id', options: { unique: true } },
            { name: 'name', keypath: 'name', options: { unique: false } },
            { name: 'isFolder', keypath: 'isFolder', options: { unique: false } },
            { name: 'parentid', keypath: 'parentid', options: { unique: false } },
            { name: 'externalid', keypath: 'externalid', options: { unique: false } },
            { name: 'lastmodified', keypath: 'lastmodified', options: { unique: false } },
            { name: 'filials', keypath: 'filials', options: { unique: false } }
        ]
    },
    {
        store: 'DirtyGoods',
        storeConfig: { keyPath: 'id', autoIncrement: false },
        storeSchema: [
            { name: 'id', keypath: 'id', options: { unique: true } },
            { name: 'name', keypath: 'name', options: { unique: false } },
            { name: 'isFolder', keypath: 'isFolder', options: { unique: false } },
            { name: 'parentid', keypath: 'parentid', options: { unique: false } },
            { name: 'externalid', keypath: 'externalid', options: { unique: false } },
            { name: 'lastmodified', keypath: 'lastmodified', options: { unique: false } },
            { name: 'filial', keypath: 'filial', options: { unique: false } }
        ]
    },


    ],
    migrationFactory
};

export function migrationFactory() {
    return {
        1: (db, transaction) => {
            const store = transaction.objectStore('exchangeheader');
            const initdate = new Date(2000,0,0);
            const initheader = { LastDownload: initdate  };
            store.add(initheader);
        }
    };
}