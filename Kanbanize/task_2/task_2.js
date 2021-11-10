// Задача 2:
// Имаме система, която следи работата по дадени задачи.
// Имаме задача (пр: провеждане на обучение), която е започната на дата X. Системата игнорира неработните дни, съответно ако датата X е почивен ден искаме да покажем, че задачата е започнала в първия работен ден след X.
// Всеки клиент може да си конфигурира от кога започва и кога свършва работната седмица.
// Напишете функция, която по посочени първи и последен работен ден от седмицата и дата, връща първия работен ден спрямо тази дата.
// Пример: 
// enum WeekDays {
//     Monday = 1,
//     Tuesday,
//     Wednesday,
//     Thursday,
//     Friday,
//     Saturday,
//     Sunday
// }
// getWorkday(firstWorkday: number, lastWorkday: number, date: Date): Date
// const firstWorkday = getWorkday(WeekDays.Monday, WeekDays.Friday, new Date(2021, 5, 5));
// console.log(firstWorkday); // Mon Jun 07 2021 00:00:00
// const firstWorkday = getWorkday(WeekDays.Thursday, WeekDays.Monday, new Date(2021, 5, 5));
// console.log(firstWorkday); // Mon Jun 05 2021 00:00:00
var WeekDays;
(function (WeekDays) {
    WeekDays[WeekDays["Monday"] = 1] = "Monday";
    WeekDays[WeekDays["Tuesday"] = 2] = "Tuesday";
    WeekDays[WeekDays["Wednesday"] = 3] = "Wednesday";
    WeekDays[WeekDays["Thursday"] = 4] = "Thursday";
    WeekDays[WeekDays["Friday"] = 5] = "Friday";
    WeekDays[WeekDays["Saturday"] = 6] = "Saturday";
    WeekDays[WeekDays["Sunday"] = 7] = "Sunday";
})(WeekDays || (WeekDays = {}));
function getNextWorkDay(start, end, date) {
    const dayOfWeek = date.getDay() ? date.getDay() : 7;
    const dateCopy = date;
    if (start < end) {
        if (dayOfWeek >= start && dayOfWeek <= end) {
            return date.toUTCString();
        }
        else {
            dateCopy.setDate(date.getDate() + (start - dayOfWeek + 7) % 7);
            return dateCopy.toUTCString();
        }
    }
    else {
        if (dayOfWeek >= start || dayOfWeek <= end) {
            return date.toUTCString();
        }
        else {
            dateCopy.setDate(date.getDate() + (start - dayOfWeek + 7) % 7);
            return dateCopy.toUTCString();
        }
    }
}
console.log(getNextWorkDay(WeekDays.Monday, WeekDays.Friday, new Date("2021-09-13")));
