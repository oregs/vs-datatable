/**
 * DataTable Search Composable
 */
export function useDataTableSearch(emit, searchQuery) {
    const onInputTyped = (value) => {
        searchQuery.value = value;
        emit('inputTyped', value);
    };
    const clearSearch = () => {
        searchQuery.value = '';
        emit('inputTyped', '');
    };
    const setSearchQuery = (query) => {
        searchQuery.value = query;
        emit('inputTyped', query);
    };
    const searchHelpers = {
        searchQuery,
        onInputTyped
    };
    return {
        searchQuery,
        onInputTyped,
        clearSearch,
        setSearchQuery,
        searchHelpers,
    };
}
