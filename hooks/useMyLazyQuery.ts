import { ApolloQueryResult, OperationVariables, QueryOptions, TypedDocumentNode, useApolloClient } from '@apollo/client';
import { useCallback, useRef, useState } from 'react';

export type MyLazyQueryResult<T> = Omit<ApolloQueryResult<T>, 'networkStatus' | 'data'> & { data: T | undefined };

export default  function useMyLazyQuery<T = any, TVariables = OperationVariables>(
  query: TypedDocumentNode<T, TVariables>,
  options: Omit<QueryOptions<TVariables, T>, 'query'>
): [() => Promise<void>, MyLazyQueryResult<T>] {
  const client = useApolloClient();
  const self = useRef<undefined | {}>(undefined);
  const [result, setResult] = useState<MyLazyQueryResult<T>>({
    loading: false,
    data: undefined,
  });
  const execQuery = useCallback(async () => {
    const current = {};
    self.current = current;
    try {
      setResult({
        loading: true,
        data: undefined,
      });
      const queryResult = await client.query({
        query,
        ...options,
      });
      if (self.current !== current) {
        // query canceled
        return;
      }
      setResult({
        loading: false,
        data: queryResult.data,
        error: queryResult.error,
      });
    } catch (error: any) {
      if (self.current !== current) {
        // query canceled
        return;
      }
      setResult({
        loading: false,
        data: undefined,
        error,
      });
    }
  }, [client, query, options]);
  return [execQuery, result];
}