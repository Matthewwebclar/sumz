import { configureStore } from "@reduxjs/toolkit";
import { articleApi } from "./article";


/* This code is creating a Redux store using the `configureStore` function from the `@reduxjs/toolkit`
library. The store has a single reducer, which is the reducer generated by the `articleApi` object.
The `articleApi` object is an instance of the `createApi` function from the `@reduxjs/toolkit/query`
library, which generates a set of Redux actions and a reducer for making API requests. The
`middleware` property is an array of middleware functions that will be applied to all dispatched
actions. In this case, the `articleApi.middleware` function is added to the default middleware
provided by `getDefaultMiddleware()`. */

export const store = configureStore({
    /* This code is defining the reducer for the Redux store. It is using the `articleApi.reducerPath`
    property as the key and the `articleApi.reducer` function as the value. The
    `articleApi.reducerPath` is a string that represents the name of the slice of state managed by
    the `articleApi` object. The `articleApi.reducer` function is a generated reducer function that
    handles the state updates for the API requests made by the `articleApi` object. By including this
    reducer in the store configuration, the state updates for the API requests will be managed by the
    Redux store. */
    reducer: {
        [articleApi.reducerPath]: articleApi.reducer
    },

    /* This line of code is adding the middleware function generated by the `articleApi` object to the
    default middleware provided by `getDefaultMiddleware()`. The `getDefaultMiddleware()` function
    returns an array of middleware functions that are included by default in a Redux store created
    with `configureStore()`. The `concat()` method is used to combine the default middleware with the
    middleware generated by the `articleApi` object. This ensures that all dispatched actions,
    including those generated by the `articleApi` object, will pass through the middleware functions
    before reaching the reducers. */
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(articleApi.middleware),
}) 
