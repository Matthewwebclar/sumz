import { useState, useEffect } from 'react';
import { copy, linkIcon, loader, tick } from '../assets'
import { useLazyGetSummaryQuery } from '../services/article'

const Demo = () => {
  /* Initializing a state variable called `article` using the `useState` hook. The initial state of
  `article` is an object with two properties: `url` and `summary`, both of which are empty strings.
  The `setArticle` function is used to update the state of `article`. */
  const [article, setArticle] = useState({
    url: '',
    summary: ''
  })

  /* `const [allArticles, setAllArticles] = useState([])` is initializing a state variable called
  `allArticles` using the `useState` hook. The initial state of `allArticles` is an empty array. The
  `setAllArticles` function is used to update the state of `allArticles`. This state variable is
  used to store an array of all the articles that have been fetched and their summaries, so that
  they can be displayed in the UI and also persisted in local storage. */
  const [allArticles, setAllArticles] = useState([])

  /* `const [copied, setCopied] = useState('')` is initializing a state variable called `copied` using
  the `useState` hook. The initial state of `copied` is an empty string. The `setCopied` function is
  used to update the state of `copied`. This state variable is used to keep track of whether a URL has
  been copied to the clipboard or not, so that a message can be displayed to the user indicating that
  the URL has been copied. */
  const [copied, setCopied] = useState('')

  //RTK Lazy query
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  //Load data from local storage on mount
  /* This code is using the `useEffect` hook to load data from local storage when the component mounts.
  It retrieves an array of articles from local storage using the `getItem` method of the
  `localStorage` object, and then parses the JSON string using the `JSON.parse` method. If there are
  articles in local storage, it sets the `allArticles` state variable to the retrieved array using the
  `setAllArticles` function. The empty array `[]` passed as the second argument to `useEffect` ensures
  that this code only runs once when the component mounts, and not on subsequent re-renders. */
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(localStorage.getItem('articles'))

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage)
    }
  }, [])


  //Hanlde submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    /* `const existingArticle = allArticles.find((item) => item.url === article.url)` is finding an
    article in the `allArticles` array that has the same `url` property as the `url` property of the
    `article` state variable. If such an article exists, it is assigned to the `existingArticle`
    variable. This is used to check if the article has already been fetched and stored in the
    `allArticles` array, so that it doesn't need to be fetched again. */
    const existingArticle = allArticles.find((item) => item.url === article.url)
    /* `if (existingArticle) return setArticle(existingArticle)` is checking if an article with the same
    URL as the one entered by the user already exists in the `allArticles` array. If it does, it sets
    the `article` state variable to the existing article, so that the summary for that article can be
    displayed instead of fetching it again. The `return` statement is used to exit the function early
    if an existing article is found, so that the rest of the code in the function is not executed. */
    if (existingArticle) return setArticle(existingArticle)

    /* `const { data } = await getSummary({ articleUrl: article.url });` is making a call to the
    `getSummary` function returned by the `useLazyGetSummaryQuery` hook, passing in an object with an
    `articleUrl` property set to the `url` property of the `article` state variable. The `await`
    keyword is used to wait for the response from the server. The response is then destructured to
    extract the `data` property, which contains the summary of the article fetched from the server. */
    const { data } = await getSummary({ articleUrl: article.url });

    /* This code is checking if the `data` object returned from the server has a `summary` property. If it
    does, it creates a new object called `newArticle` using the spread operator to copy all the
    properties of the `article` state variable, and sets the `summary` property to the `summary`
    property of the `data` object. It then creates a new array called `updatedAllArticles` by adding
    the `newArticle` object to the beginning of the `allArticles` array using the spread operator. */
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary }
      const updatedAllArticles = [newArticle, ...allArticles]

      //Update state and local storage
      /* These lines of code are updating the state of the `article` and `allArticles` variables, and
      also updating the data stored in local storage. */
      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      /* `localStorage.setItem('article', updatedAllArticles)` is st oring the `updatedAllArticles` array
      in the browser's local storage under the key `'article'`. This allows the data to persist even
      if the user refreshes or closes the page, so that the previously fetched articles can be
      displayed in the UI. */
      localStorage.setItem('article', JSON.stringify(updatedAllArticles))
    }
  }

  //Copy the url and toggle the icon for user feedback
  /**
   * This function sets a URL to be copied to the clipboard and displays a message indicating that it has
   * been copied.
   */
  const handleCopy = (copyUrl) => {
    /* `setCopied(copyUrl)` is updating the state of the `copied` variable with the value of `copyUrl`.
    This is used to display a message indicating that the URL has been copied to the clipboard when
    the user clicks on the copy icon next to the URL. */
    setCopied(copyUrl);
    /* `navigator.clipboard.writeText(copyUrl);` is a method that writes the specified text to the
    clipboard. In this code, it is used to copy the URL of an article to the user's clipboard when
    they click on the copy icon next to the URL. */
    navigator.clipboard.writeText(copyUrl);
    /* `setTimeout(() => setCopied(false), 3000);` is setting a timeout of 3000 milliseconds (3
    seconds) before setting the `copied` state variable to `false`. This is used to display a
    message indicating that the URL has been copied to the clipboard for a short period of time
    before hiding the message. The `setCopied(false)` function call sets the `copied` state variable
    to `false`, which causes the message to disappear from the UI. */
    setTimeout(() => setCopied(false), 3000);
  }
  //handle keypress
  const handleKeyDown = (e) => {
    /* This code is checking if the key pressed by the user is the "Enter" key (keyCode 13) and if it
    is, it calls the `handleSubmit` function. This allows the user to submit the form by pressing the
    "Enter" key in addition to clicking the submit button. */
    if (e.keycode === 13) {
      handleSubmit(e)
    }
  }

  return (
    <section className='mt-16 w-full max-w-xl'>
      {/* Search*/}
      <div className='flex flex-col w-full gap-2'>
        <form className='relative flex justify-center items-center' onSubmit={handleSubmit}>
          <img src={linkIcon} alt='link-icon' className='absolute left-0 my-2 ml-3 w-5' />
          <input type='url' value={article.url} onKeyDown={handleKeyDown} required onChange={(e) => setArticle({ ...article, url: e.target.value })} placeholder='Paste the article link' className='url_input peer' />
          <button type='submit' className='submit_btn peer-focus:boder-gray-700 peer-focus:text-gray-700'>
            <p>↵</p>
          </button>
        </form>

        {/*Browse History */}
        <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
          {
            allArticles.reverse().map((item, index) => (
              <div key={`link-${index}`} onClick={() => setArticle(item)} className="link_card" >

                <div className='copy_btn' onClick={() => handleCopy(item.url)}>
                  <img
                    className='w-[40%] h-[40%] object-contain'
                    src={copied === item.url ? tick : copy}
                    alt={copied === item.url ? 'tick_icon' : 'copy_icon'}
                  />
                </div>

                <p className='flex-1 font-satoshi font-medium text-red-700 truncate'>{item.url}</p>
              </div>
            ))
          }
        </div>
      </div>

      {/*Display results*/}
      <div className='my-2 flex justify-center items-center max-w-full'>
        {
          isFetching ? (
            <img src={loader} alt='loader' className='w-20 h-20 object-contain' />

          ) : error ? (<p className='font-bold text-black text-center font-inter'>
            Well, that wasn&lsquo;t supposed to happen...

            <br />
            <span className='font-satoshi text-gray-700 font-normal'>{error?.data.error}</span>
          </p>) : article.summary && (
            <div className='flex flex-col gap-3'>
              <h2>Article <span className='blue_gradient'>Summary</span></h2>

              <div className='summarry_box'>
                <p>Article <span className='font-inter font-medium text-sm text-gray-700'>{article.summary}</span></p>
              </div>
            </div>
          )
        }
      </div>
    </section>
  )
}

export default Demo