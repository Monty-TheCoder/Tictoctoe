import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('https://567f-202-131-112-74.ngrok-free.app', {
    extraHeaders: {
        'ngrok-skip-browser-warning': 'true',
    },
});

function AudioChat() {
    const [roomId, setRoomId] = useState('');
    const audioRef = useRef(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        const getAudioStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const audio = new Audio();
                audio.srcObject = stream
                audio.play
                console.log('dfdfdfdfdfdf', stream);

                setLocalStream(stream);
            } catch (error) {
                console.error('Error accessing microphone:', error);
                // Handle microphone access error gracefully (e.g., display a message)
            }
        };

        getAudioStream();

        socket.on('user-connected', (userId) => {
            console.log('User connected:', userId);
        });

        return () => {
            socket.disconnect(); // Clean up socket connection on unmount
            localStream?.getTracks().forEach((track) => track.stop()); // Stop local audio track on unmount
        };
    }, []);

    const createRoom = async () => {
        socket.emit('create_room', roomId);
        console.log('room->', roomId);
    };

    const joinRoom = async (id: any) => {
        console.log("join-room", id);

        setRoomId(id);
        socket.emit('join-room', id);
    };

    useEffect(() => {
        socket.on('audio-stream', (remoteStream) => {
            console.log("sadfa", remoteStream);
            setRemoteStream(remoteStream);

            if (audioRef.current) {
                (audioRef.current as HTMLAudioElement).srcObject = remoteStream;
                (audioRef.current as HTMLAudioElement).autoplay = true; // Set autoplay for convenience
            }
        });
    }, [socket]);
    return (
        <div className='justify-content-center'>
            {remoteStream && <audio ref={audioRef} autoPlay />}
            <button onClick={createRoom}>Create Room</button>
            <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
            <button onClick={() => joinRoom(roomId)}>Join Room</button>
        </div>
    );
}

export default AudioChat;
