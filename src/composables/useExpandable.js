import { ref, computed } from 'vue';
export function useExpandable(props, emit) {
    const internalExpanded = ref([]);
    const loadingMap = ref(new Map());
    const expandedRows = computed({
        get: () => props.expanded ?? internalExpanded.value,
        set: (val) => {
            if (props.expanded !== undefined) {
                emit('update:expanded', val);
            }
            else {
                internalExpanded.value = val;
            }
        },
    });
    function getRowId(row, index) {
        if (typeof props.rowKey === 'function')
            return props.rowKey(row, index);
        if (typeof props.rowKey === 'string' && row[props.rowKey] !== undefined)
            return row[props.rowKey];
        return index;
    }
    function isRowExpanded(row, index) {
        const rowId = getRowId(row, index);
        return expandedRows.value.includes(rowId);
    }
    function toggleRowExpansion(row, index) {
        const rowId = getRowId(row, index);
        const isExpanded = expandedRows.value.includes(rowId);
        let newExpanded;
        if (isExpanded) {
            newExpanded = expandedRows.value.filter((id) => id !== rowId);
            emit('collapseRow', { row, index, rowId });
        }
        else {
            newExpanded = props.accordion ? [rowId] : [...expandedRows.value, rowId];
            emit('expandRow', { row, index, rowId });
        }
        expandedRows.value = newExpanded;
    }
    function isRowLoading(row, index) {
        const rowId = getRowId(row, index);
        return loadingMap.value.get(rowId) === true;
    }
    function setRowLoading(rowId, loading) {
        loadingMap.value.set(rowId, loading);
    }
    return {
        expandedRows,
        isRowExpanded,
        toggleRowExpansion,
        getRowId,
        setRowLoading,
        isRowLoading
    };
}
