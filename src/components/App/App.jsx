import { useState } from 'react';
import './app.scss';

function App() {
    const [count, setCount] = useState(0);

    const countHandler = () => {
        setCount(count + 1);
    }

    return (
        <>
            <div className='App'>
                <table>
                    <tr>
                        <td>{count}</td>
                        <button onClick={countHandler}>Click me!</button>
                    </tr>
                </table>
            </div>
        </>
    );
}

export default App;
