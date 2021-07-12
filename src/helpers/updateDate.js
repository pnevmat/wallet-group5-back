const updateStartDate = (month, year) => {
    return new Date(
        `${year}-${prepareMonth(month)}-01T00:00`
    ).toISOString();
};

const updateEndDate = (month, year) => {
    if (month === '12') {
        return new Date(`${parseInt(year) + 1}-01-01T00:00`);
    } else {
        return new Date(
            `${year}-${prepareMonth((parseInt(month) + 1).toString())}-01T00:00`
        );
    };
};

const prepareMonth = (month) => {
    if (parseInt(month.length) === 2) {
        return month
    } else return `0${month}`
};

module.exports = {
    updateStartDate,
    updateEndDate,
}