function validateSignupInputForm() {
    let valid = true;
    let x = document.getElementsByClassName("tab");
    let y = x[currentTab].querySelectorAll('input[required]');
    for (let i = 0; i < y.length; i++) {
        if (y[i].value === "") {
            y[i].className += " invalid";
            valid = false;
        }
    }

    switch (currentTab) {
        case 0: // first tab
            const dayInput = document.getElementsByName('day')[0];
            const monthInput = document.getElementsByName('month')[0];
            const yearInput = document.getElementsByName('year')[0];

            if ((dayInput.value && monthInput.value && yearInput.value) &&
                !isValidDate(
                    parseInt(dayInput.value, 10),
                    parseInt(monthInput.value, 10),
                    parseInt(yearInput.value, 10))) {
                dayInput.classList.add('invalid');
                monthInput.classList.add('invalid');
                yearInput.classList.add('invalid');
                valid = false;
            }
            break;
    }

    return valid;
}

function isValidPassword(pwd, repeatPwd) {
    return pwd === repeatPwd;

}

function isValidDate(day, month, year) {
    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month === 0 || month > 12)
        return false;

    let monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}
