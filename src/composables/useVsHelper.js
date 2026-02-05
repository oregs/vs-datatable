// Helper functions for VsDataTable
export const formatNumber = (value) => {
    return new Intl.NumberFormat().format(value);
};
export const formatDate = (date, locale = 'en-US') => {
    return new Intl.DateTimeFormat(locale).format(new Date(date));
};
export const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength) + '...';
};
export const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? '';
};
export const capitalizeFirstLetter = (word) => {
    if (typeof word !== 'string' || word.length === 0) {
        return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
};
