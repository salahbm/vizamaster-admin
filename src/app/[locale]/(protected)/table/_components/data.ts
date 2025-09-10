import { roles, statusOptions } from './columns';

const allData = Array.from({ length: 100 }, (_, i) => {
  // Generate random date within the last 2 years
  const randomDaysAgo = Math.floor(Math.random() * 730); // 2 years in days
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - randomDaysAgo);

  // Generate random date for last login (more recent than creation date)
  const daysAfterCreation = Math.floor(Math.random() * randomDaysAgo);
  const lastLogin = new Date(createdAt);
  lastLogin.setDate(lastLogin.getDate() + daysAfterCreation);

  // Random status
  const status =
    statusOptions[Math.floor(Math.random() * statusOptions.length)];

  // Random role
  const role = roles[Math.floor(Math.random() * roles.length)];

  return {
    id: `USR${(i + 1).toString().padStart(3, '0')}`,
    username: `user${i + 1}`,
    fullName: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: role,
    status: status.value,
    createdAt: createdAt,
    lastLogin: lastLogin,
    loginCount: Math.floor(Math.random() * 100),
  };
});

// Function to get paginated data (simulates API call)
function getPaginatedData({
  page,
  size,
  sorting = [],
}: {
  page: number;
  size: number;
  sorting?: { id: string; desc: boolean }[];
}) {
  // Apply sorting (simplified example)
  let sortedData = [...allData];
  if (sorting.length > 0) {
    const { id, desc } = sorting[0];
    sortedData.sort((a: any, b: any) => {
      if (desc) {
        return a[id] > b[id] ? -1 : 1;
      } else {
        return a[id] > b[id] ? 1 : -1;
      }
    });
  }
  const totalPages = Math.ceil(sortedData.length / size);
  const totalElements = sortedData.length;

  // Calculate pagination
  const start = page * size;
  const end = start + size;
  const paginatedData = sortedData.slice(start, end);

  // Return paginated data with total count
  return {
    data: paginatedData,
    paging: {
      page: page,
      size: size,
      totalPages: totalPages,
      totalElements: totalElements,
    },
  };
}

export { allData, getPaginatedData };
