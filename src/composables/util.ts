import dayjs from "dayjs";

const formatDate = (date: Date) => {
    return dayjs(date).format('DD/MM/YYYY');
}

export default formatDate;