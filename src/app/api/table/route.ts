import { NextRequest, NextResponse } from 'next/server';

// Define possible status values and their colors
const statusOptions = [
  { value: 'active', label: 'Active', color: 'bg-green-500' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
  { value: 'inactive', label: 'Inactive', color: 'bg-gray-500' },
  { value: 'blocked', label: 'Blocked', color: 'bg-red-500' },
];

// Define possible roles
const roles = ['Admin', 'User', 'Editor', 'Viewer', 'Moderator'];

// Generate all data (this would typically come from a database)
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

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '0');
  const size = parseInt(searchParams.get('size') || '10');
  const sortField = searchParams.get('sortField') || 'id';
  const sortDirection = searchParams.get('sortDirection') || 'asc';

  // Apply sorting
  let sortedData = [...allData];
  sortedData.sort((a: any, b: any) => {
    if (sortDirection === 'desc') {
      return a[sortField] > b[sortField] ? -1 : 1;
    } else {
      return a[sortField] > b[sortField] ? 1 : -1;
    }
  });

  // Calculate pagination
  const totalElements = sortedData.length;
  const totalPages = Math.ceil(totalElements / size);
  const start = page * size;
  const end = start + size;
  const paginatedData = sortedData.slice(start, end);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Return paginated data with pagination info
  return NextResponse.json({
    data: paginatedData,
    paging: {
      page,
      size,
      totalPages,
      totalElements,
    },
  });
}
