import { logo } from '../assets'

const Hero = () => {
    return (
        <header className='w-full flex items-center justify-center flex-col'>
            <nav className='flex justify-between items-center w-full mb-10 pt-3'>
                <img src={logo} alt='summarizer-logo' className='w-28 object-contain' />

                <button type='button' onClick={() => window.open('https://github.com/Matthewwebclar?tab=repositories', '_blank')}
                    className='black_btn'>Github</button>
            </nav>

            <h1 className='head_text'>
                Summarize any article
            </h1>

            <h2 className='desc'>
                Sumz helps you summarize any piece of text into concise, easy to digest content so you can free yourself from information overload.
            </h2>
        </header>
    )
}

export default Hero