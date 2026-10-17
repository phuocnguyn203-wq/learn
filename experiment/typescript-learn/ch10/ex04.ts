interface ApiResponse<Data> {
  data: Data;
  status: number;
  fetchedAt: Date;
}

interface Paginated<Item> {
  items: Item[];
  page: number;
  totalPages: number;
}

interface User {
  id: number;
  name: string;
}

let pageRes: ApiResponse<Paginated<User>> = {
  data: {
    items: [{ id: 201, name: "John"}],
    page: 1,
    totalPages: 20,
  },
  status: 200,
  fetchedAt: new Date()

};

const firstName: string = pageRes.data.items[0].name;
console.log(firstName);