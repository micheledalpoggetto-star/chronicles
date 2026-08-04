/*
==========================================
CHRONICLES
Service Worker
Development Version 2
==========================================
*/

const CACHE_NAME = "chronicles-dev-v2";

const STATIC_ASSETS = [
    "./manifest.webmanifest",
    "./icon-192.png",
    "./icon-512.png"
];


/*
==========================================
INSTALL
==========================================
*/

self.addEventListener(
    "install",
    event => {

        self.skipWaiting();

        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(cache =>
                    cache.addAll(
                        STATIC_ASSETS
                    )
                )

        );

    }
);


/*
==========================================
ACTIVATE
Elimina tutte le vecchie cache Chronicles
==========================================
*/

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()
                .then(keys =>

                    Promise.all(

                        keys
                            .filter(
                                key =>
                                    key !== CACHE_NAME
                            )
                            .map(
                                key =>
                                    caches.delete(key)
                            )

                    )

                )
                .then(() =>
                    self.clients.claim()
                )

        );

    }
);


/*
==========================================
FETCH
==========================================

Durante lo sviluppo:

HTML / JS / JSON
=> SEMPRE rete

Immagini / manifest
=> cache possibile

==========================================
*/

self.addEventListener(
    "fetch",
    event => {

        const request =
            event.request;


        if(
            request.method !== "GET"
        ){
            return;
        }


        const url =
            new URL(
                request.url
            );


        /*
        Non intercettiamo richieste
        verso Cloudflare o altri domini.
        */

        if(
            url.origin !==
            self.location.origin
        ){
            return;
        }


        const pathname =
            url.pathname.toLowerCase();


        /*
        ======================================
        FILE DI SVILUPPO

        Sempre versione più recente.
        ======================================
        */

        if(
            pathname.endsWith(".js")
            ||
            pathname.endsWith(".json")
            ||
            pathname.endsWith(".html")
            ||
            pathname.endsWith("/")
        ){

            event.respondWith(

                fetch(
                    request,
                    {
                        cache: "no-store"
                    }
                )
                .catch(() =>
                    caches.match(request)
                )

            );

            return;

        }


        /*
        ======================================
        FILE STATICI

        Cache con fallback rete.
        ======================================
        */

        event.respondWith(

            caches
                .match(request)
                .then(cached => {

                    if(cached){
                        return cached;
                    }


                    return fetch(request)
                        .then(response => {

                            if(
                                !response
                                ||
                                response.status !== 200
                            ){
                                return response;
                            }


                            const copy =
                                response.clone();


                            caches
                                .open(CACHE_NAME)
                                .then(cache =>
                                    cache.put(
                                        request,
                                        copy
                                    )
                                );


                            return response;

                        });

                })

        );

    }
);
