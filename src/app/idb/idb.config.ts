import { DBConfig } from 'ngx-indexed-db';

export const dbConfig: DBConfig = {
    name: 'FBcache',
    version: 7,
    objectStoresMeta: [{
        store: 'exchangeheader',
        storeConfig: { keyPath: 'id', autoIncrement: false },
        storeSchema: [
            
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
            { name: 'sortdefoult', keypath: 'sortdefoult', options: { unique: false } },
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
            { name: 'sortdefoult', keypath: 'sortdefoult', options: { unique: false } },
            { name: 'parentid', keypath: 'parentid', options: { unique: false } },
            { name: 'externalid', keypath: 'externalid', options: { unique: false } },
            { name: 'lastmodified', keypath: 'lastmodified', options: { unique: false } },
            { name: 'filial', keypath: 'filial', options: { unique: false } }
        ]
    },
    /////////////////   Добавлено в версии 2 ///////////////////////////////////
    {
        store: 'Streets',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
            { name: 'name', keypath: 'name', options: { unique: false } }
        ]
    },


    ],
    migrationFactory
};

export function migrationFactory() {
    return {
        1: (db, transaction) => {
            const store = transaction.objectStore('exchangeheader');
            const initdate = new Date(2000,1,1);
            const initheader = {id:1, LastDownload: initdate  };
            store.add(initheader);
        },

        3: (db, transaction) => {
            const store = transaction.objectStore('WebGoods');
            store.createIndex('price', 'price', { unique: false });
        },
        
        
        4:(db, transaction) => {
            const store = transaction.objectStore('WebGoods');
            store.createIndex('picture', 'picture', { unique: false });
        },

        5:(db, transaction) => {
            const store = transaction.objectStore('WebGoods');
            store.createIndex('mCategory', 'mCategory', { unique: false });
            store.createIndex('mType', 'mType', { unique: false });
            store.createIndex('mShowOnMobile', 'mShowOnMobile', { unique: false });
            store.createIndex('mNumber', 'pictumNumberre', { unique: false });
            
        },

        6:(db, transaction) => {
            const store = transaction.objectStore('WebGoods');
            store.createIndex('mSize', 'mSize', { unique: false });
            store.createIndex('mName', 'mName', { unique: false });
        },
        7:(db, transaction) => {
            const store = transaction.objectStore('WebGoods');
            store.createIndex('mDescription', 'mDescription', { unique: false });
            
        }

    };
}