/**
 * VsDataTable Utility Functions
 */
/**
 * Get nested value from object using dot notation
 * @param obj - The object to traverse
 * @param path - The path to the value (e.g., 'user.profile.name')
 * @returns The value at the path or empty string
 */
// export function getValue(obj: any, path: string): any {
//   return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? ''
// }
export const getValue = (row, field) => {
    if (!field)
        return ''; // ✅ Prevent undefined field error
    return field.split('.').reduce((acc, key) => acc && acc[key], row);
};
/**
 * Get row key for identification
 * @param item - The row item
 * @param index - The row index
 * @param rowKey - The row key field or function
 * @returns The unique key for the row
 */
export function getRowKey(item, index, rowKey = 'id') {
    if (typeof rowKey === 'function') {
        return rowKey(item, index);
    }
    return item[rowKey] || index;
}
/**
 * Check if a row is selected
 * @param item - The row item to check
 * @param selectedItems - Array of selected items
 * @param rowKey - The row key field or function
 * @returns True if the row is selected
 */
export function isRowSelected(item, selectedItems, rowKey = 'id') {
    return selectedItems.some(selected => getRowKey(selected, -1, rowKey) === getRowKey(item, -1, rowKey));
}
/**
 * Calculate total columns including checkbox column
 * @param columns - Array of column definitions
 * @param hasCheckbox - Whether checkbox column is present
 * @returns Total number of columns
 */
export function calculateTotalColumns(columns, hasCheckbox, hasExtendable) {
    const countLeafColumns = (cols) => {
        return cols.reduce((count, col) => {
            if (col.children && col.children.length > 0) {
                // Only count child columns, not the parent
                return count + countLeafColumns(col.children);
            }
            return count + 1;
        }, 0);
    };
    const totalColumns = countLeafColumns(columns);
    return totalColumns + (hasCheckbox ? 1 : 0) + (hasExtendable ? 1 : 0);
}
// export function calculateTotalColumns(columns: Column[], hasCheckbox: boolean, hasExtendable: boolean): number {
//   return columns.length + (hasCheckbox ? 1 : 0) + (hasExtendable ? 1 : 0)
// }
/**
 * Sort array of objects by multiple criteria
 * @param array - Array to sort
 * @param sortCriteria - Array of sort criteria
 * @returns Sorted array
 */
export function sortArray(array, sortCriteria) {
    if (!sortCriteria.length)
        return array;
    const getNested = (obj, path) => path.split('.').reduce((acc, key) => acc?.[key], obj) ?? '';
    return [...array].sort((a, b) => {
        for (const { field, order } of sortCriteria) {
            const aValue = getNested(a, field);
            const bValue = getNested(b, field);
            if (aValue === bValue)
                continue;
            if (order === 'asc')
                return aValue > bValue ? 1 : -1;
            return aValue < bValue ? 1 : -1;
        }
        return 0;
    });
}
/**
 * Generic paginate function
 * @param rows - Array of sorted rows
 * @param page - Current page
 * @param rowsPerPage - Number of rows per page
 * @returns Object with start and end indices
 */
export function paginateRows(rows, page, rowsPerPage) {
    if (!rowsPerPage)
        return rows;
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return rows.slice(start, end);
}
/**
 * Calculate record range for pagination display
 * @param page - Current page number
 * @param rowsPerPage - Number of rows per page
 * @param totalRecords - Total number of records
 * @returns Object with start and end indices
 */
export function calculateRecordRange(page, rowsPerPage, totalRecords) {
    const start = (page - 1) * rowsPerPage + 1;
    const end = Math.min(page * rowsPerPage, totalRecords);
    return { start, end };
}
/**
 * Validate column configuration
 * @param columns - Array of column definitions
 * @returns Array of validation errors
 */
export function validateColumns(columns) {
    const errors = [];
    if (!Array.isArray(columns)) {
        errors.push('Columns must be an array');
        return errors;
    }
    if (columns.length === 0) {
        errors.push('At least one column is required');
        return errors;
    }
    columns.forEach((column, index) => {
        if (!column.label) {
            errors.push(`Column ${index}: label is required`);
        }
        if (!column.field) {
            errors.push(`Column ${index}: field is required`);
        }
        if (column.width && !/^\d+%?$/.test(column.width)) {
            errors.push(`Column ${index}: width must be a number or percentage`);
        }
    });
    return errors;
}
/**
 * Generate unique table ID
 * @param prefix - Prefix for the ID
 * @returns Unique table ID
 */
export function generateTableId(prefix = 'vs-table') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Check if server-side mode is active
 * @param serverOptions - Server options object
 * @returns True if server-side mode is active
 */
export function isServerMode(serverOptions) {
    return serverOptions !== null && serverOptions !== undefined;
}
/**
 * Deep clone an object
 * @param obj - Object to clone
 * @returns Cloned object
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object')
        return obj;
    if (obj instanceof Date)
        return new Date(obj.getTime());
    if (obj instanceof Array)
        return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
    return obj;
}
/**
 * Calculate total pages
 * @param totalRecords - total records
 * @param rowsPerPage - rows per page
 * @returns total number of pages
 */
export function calcTotalPages(totalRecords, rowsPerPage) {
    return Math.ceil(totalRecords / rowsPerPage);
}
/**
 * Filter
 * @param totalRecords - total records
 * @param rowsPerPage - rows per page
 * @returns total number of pages
 */
export function filterRowsByQuery(resultRows, query, columns) {
    if (!query || query.trim() === "")
        return resultRows;
    const lowerQuery = query.toLowerCase();
    return resultRows.filter(row => {
        // if columns are specified, only search those
        if (columns && columns.length > 0) {
            return columns.some(col => String(row[col] ?? "").toLowerCase().includes(lowerQuery));
        }
        // otherwise search across all fields in row
        return Object.values(row).some(value => String(value ?? "").toLowerCase().includes(lowerQuery));
    });
}
/**
 * Convert active column filters into a flat object
 * useful for server API params, like:
 *   { status_type: 'select', status_val: 'Pending' }
 */
export function serializeFilters(filters) {
    const params = {};
    for (const [field, f] of Object.entries(filters)) {
        if (!f)
            continue;
        // Base info
        params[`${field}_type`] = f.type ?? '';
        if ('operator' in f && f.operator)
            params[`${field}_op`] = f.operator;
        // Values
        if (Array.isArray(f.value)) {
            params[`${field}_val[]`] = f.value;
        }
        else if (f.value !== undefined && f.value !== null && f.value !== '') {
            params[`${field}_val`] = f.value;
        }
        // Range / date range support
        if ('min' in f && f.min != null)
            params[`${field}_min`] = f.min;
        if ('max' in f && f.max != null)
            params[`${field}_max`] = f.max;
        if ('start' in f && f.start)
            params[`${field}_start`] = f.start;
        if ('end' in f && f.end)
            params[`${field}_end`] = f.end;
    }
    return params;
}
/**
 * Flattens grouped columns into a single-level array.
 * Handles nested `children` columns gracefully.
 */
export function getFlatColumns(columns = []) {
    const result = [];
    const flatten = (cols) => {
        cols.forEach((col) => {
            if (Array.isArray(col.children) && col.children.length) {
                flatten(col.children);
            }
            else {
                result.push(col);
            }
        });
    };
    flatten(columns);
    return result;
}
