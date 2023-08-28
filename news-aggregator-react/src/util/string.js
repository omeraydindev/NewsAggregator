export const stripHtml = (html) => {
    return html.replace(/<[^>]+>/g, '');
};

export const escapeRegex = (str) => {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

export const splitCaseInsensitive = (str, delimiter) => {
    return str.split(new RegExp(escapeRegex(delimiter), 'ig'));
};
