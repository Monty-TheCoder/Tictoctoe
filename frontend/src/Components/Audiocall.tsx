import io from 'socket.io-client';
import { Peer } from "peerjs";
import { useEffect, useRef } from 'react';
const socket = io('https://6f55-202-131-112-74.ngrok-free.app', {
    extraHeaders: {
        'ngrok-skip-browser-warning': 'true',
    },
});

const Audiocall = () => {
    const peer = new Peer();
    const audioRef = useRef<any>(null)
    const secondAudioRef = useRef<any>(null)
    useEffect(() => {
        socket.on('getUserId', async (id) => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const call = peer.call(id, stream);
            call.on('stream', (stream) => {
                if (!audioRef.current) return;
                audioRef.current.srcObject = stream
            })

        })
        socket.on('requested', async () => {
            const hasCall = confirm('You have a call. Want to answer it?');
            if (hasCall) {
                const newPeer = new Peer();
                newPeer.on('open', (id) => {
                    console.log('id-->', id);
                    socket.emit('userId', id);
                });

                newPeer.on('call', async (call) => {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    call.answer(stream)
                    if (!secondAudioRef.current) return;
                    secondAudioRef.current.srcObject = stream
                })
            } else {
                console.log('Call Declined');
            }

        })
        peer.on('open', (id) => {
            console.log('id-->', id);
            socket.emit('userId', id);
        });
    }, []);
    const letsCall = () => {
        socket.emit('call_request');
    }

    return (
        <>
            <div className='justify-content-center'>
                <button onClick={() => letsCall()}>Audiocall</button>
                <audio autoPlay ref={audioRef} />
                <audio autoPlay ref={secondAudioRef} />
            </div>
        </>
    )
}

export default Audiocall