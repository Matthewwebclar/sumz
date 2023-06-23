//Using RTK Query reactjs endpoints to get API responses and interact with them
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const rapidApiKey = import.meta.env.VITE_RAPID_API_ARTICLE_KEY

export const articleApi = createApi({
    /* `reducerPath` is a property in the configuration object passed to `createApi` function in RTK Query.
    It specifies the name of the slice in the Redux store where the generated reducers and actions will
    be stored. In this case, `reducerPath: 'artcleApi'` sets the name of the slice to `artcleApi`. This
    allows us to access the generated reducers and actions using `artcleApi.reducer` and
    `artcleApi.actions` respectively. */
    reducerPath: 'artcleApi',

    /* `baseQuery` is a configuration object that is passed to `createApi` function in RTK Query. It is
    used to configure the underlying `fetch` function that is used to make API requests. */
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://article-extractor-and-summarizer.p.rapidapi.com/',

        prepareHeaders: (headers) => {
            headers.set('X-RapidAPI-Key', rapidApiKey);
            headers.set('X-RapidAPI-Host', 'article-extractor-and-summarizer.p.rapidapi.com'
            );
            return headers
        }
    }),

    endpoints: (builder) => ({
        getSummary: builder.query({
            query: (params) => `summarize?url=${encodeURIComponent(params.articleUrl)}&length=2`
        })
    })
})
export const { useLazyGetSummaryQuery } = articleApi