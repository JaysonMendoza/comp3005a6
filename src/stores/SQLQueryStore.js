import create from "zustand";

export const useSQLQuery = create( set => ({
    sqlQueryString : "",
    setSqlQueryString : (queryString) => set(state => state.sqlQueryString=queryString)
}));

export const setSqlQueryString = (queryString) => useSQLQuery.getState().setSqlQueryString(queryString);
// useSQLQuery.getState().setSqlQueryString(queryString);