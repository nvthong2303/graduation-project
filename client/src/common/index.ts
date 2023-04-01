const country = 'Austria';

export const collapseString = (str: string, maxLength: number, lengthShow: number) => {
    let strCollapse = str;
    if (str.length > maxLength) {
        strCollapse = str.slice(0, lengthShow) + '...';
    }
    return strCollapse;
};

export {}