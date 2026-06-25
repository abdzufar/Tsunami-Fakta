function formattedDate(dateObj) {
    const day = String(dateObj.getDate()).padStart(2, '0');

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[dateObj.getMonth()];
    
    const year = dateObj.getFullYear();
    
    return `${day}-${month}-${year}`;
}

module.exports = formattedDate;