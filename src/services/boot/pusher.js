import React from 'react';
import Echo from 'laravel-echo';
import * as AxiosConf from './axios';

window.Pusher = require('pusher-js');
window.Echo = null
// const token = Axios.getToken();

const echo = async (Token) => {
    if (window.Echo === null) {
        window.Echo = new Echo({
            authEndpoint : `http://192.168.0.18/broadcasting/auth`,
            broadcaster: 'pusher',
            key: 'anyKey',
            wsHost: '192.168.0.18',
            wsPort: 6001,
            // cluster: process.env.MIX_PUSHER_APP_CLUSTER,
            forceTLS: false,
            disableStats: true,
            auth: {
                headers: {
                    Authorization: 'Bearer ' + Token
                },
            },
        });
    }
    return window.Echo
}
// let action = echo(token);

// // console.log(action)

// // const ast = await Pusher(token)

// setTimeout(() => {
//     action.private(`test-channel`)
//     .listen('App\\Events\\TestEvent', (e) => {
//         console.log(e);
//     })
// }, 3000)


export default echo