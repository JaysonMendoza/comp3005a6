import React from "react";
import {useSQLQuery} from '../stores/SQLQueryStore'
import {CopyBlock,vs2015 } from 'react-code-blocks'

export default function SQLQueryString(props) {
    const sqlQueryString = useSQLQuery(state => state.sqlQueryString);
    return <CopyBlock
            text={sqlQueryString}
            language={"sql"}
            showLineNumbers={false}
            theme={vs2015}
            wrapLines
        />;
}