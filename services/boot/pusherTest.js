import React from 'react';
import PusherNative from 'pusher-js/react-native';
import Echo from 'laravel-echo';

export default (token) => {
    let options = {
        forceTLS: false,
        // encrypted: true,
        key: 'anyKey',
        wsHost: '192.168.0.16',
        wsPort: 6001,
        disableStats: true,
        authEndpoint: `http://192.168.0.16/broadcasting/auth`,
        logToConsole: true,
        auth: {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        }
    };

    let PusherClient = new PusherNative(options.key, options);

    // PusherClient.connection.bind( 'initialized', () => console.log('PusherClient::initialized', arguments));
    // PusherClient.connection.bind( 'connecting', () => console.log('PusherClient::connecting', arguments));
    // PusherClient.connection.bind( 'connected', () => console.log('PusherClient::connected', arguments));
    // PusherClient.connection.bind( 'error', () => console.log('PusherClient::error', arguments));
    // PusherClient.connection.bind( 'unavailable', () => console.log('PusherClient::unavailable', arguments));
    // PusherClient.connection.bind( 'failed', () => console.log('PusherClient::failed', arguments));
    // PusherClient.connection.bind( 'disconnected', () => console.log('PusherClient::disconnected', arguments));

    return new Echo({
        broadcaster: 'pusher',
        client: PusherClient,
        ...options
    });
};