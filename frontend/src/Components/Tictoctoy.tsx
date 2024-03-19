import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import io from 'socket.io-client'


const socket = io('https://6f55-202-131-112-74.ngrok-free.app', {
    extraHeaders: {
        'ngrok-skip-browser-warning': 'true'
    }
})

const Tictoctoe = () => {
    const [currentPlayer, setCurrentPlayer] = useState('√');
    const [count, setCount] = useState(1);
    const [arr, setArr] = useState(new Array(9).fill(''));
    const calculateWinner = () => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (arr[a] && arr[a] === arr[b] && arr[a] === arr[c]) {
                return arr[a];
            }
        }
        return null;
    };
    const handleClick = (i: number) => {
        if (arr[i] === '' && !calculateWinner()) {
            socket.emit('handleClick', i)
        }
    };
    const winner = calculateWinner();
    const restart = () => {
        socket.emit('restart')
    }
    useEffect(() => {
        socket.on('initialData', (data) => {
            setArr(data.arr)
        })
        socket.on('received_On_click', (data) => {
            setArr(data.arr),
                setCount(data.count),
                setCurrentPlayer(data.currentPlayer)
        })
        socket.on('update', (data) => {
            setArr(data.arr),
                setCount(data.count),
                setCurrentPlayer(data.currentPlayer)
        })
    }, [])
    return (
        <>
            <nav className="justify-content-between">
                <Link to="/audio">Audio Chat</Link><span>&nbsp;|&nbsp;</span>
                <Link to="/debounce">Debounce</Link><span>&nbsp;|&nbsp;</span>
            </nav>
            <div className="justify-content-center">
                {
                    !arr.includes('') && !winner ?
                        <div className="" style={{ marginBottom: '20px' }}>
                            <span> Game Over !!!</span>
                        </div>
                        :
                        <div className="" style={{ marginBottom: '20px' }}>{winner ? `Winner is ${currentPlayer === "X" ? "√" : "X"}` : `Next Player:${currentPlayer}`}</div>
                }
                <button onClick={() => restart()}>Restart</button>
                <div className="row g-0 " style={{ height: 300, width: 300 }}>
                    {
                        arr.map((item, i) => (
                            <div className="col-4 border justify-content-center fw-bold pt-4" onClick={() => handleClick(i)} style={{ height: 100 }} key={i}>{item}</div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default Tictoctoe