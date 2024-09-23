import { IUser } from "@/models/IUser";
import dayjs from "dayjs";
import { get as getFromStore } from "@/localStorage";
import { computed } from "vue";

const loggedUser = computed(() => getFromStore("logged.username"));

const formatDate = (date: Date) => {
  return dayjs(date).format("DD/MM/YYYY");
};

export default formatDate;

export const extractValues = (data: any) => {
  var names = data.map((item: any) => {
    return item[String(Object.keys(item))];
  });
  return names;
};

export const filterNoAdminUsers = (users: IUser[]) => {
  let filteredData = users.filter(
    (user: IUser) => user.username !== loggedUser.value
  );
  return filteredData;
};
