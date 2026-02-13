export const getLocalStorage = (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
};

export const setLocalStorage = (key, item) => {
    localStorage.setItem(key, JSON.stringify(item));
};
