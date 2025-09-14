/* eslint-disable @typescript-eslint/no-explicit-any */
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
const allData = Array.from({ length: 11 }, (_, i) => {
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
  // Convert from 1-based (client) to 0-based (internal)
  const page = Math.max(0, parseInt(searchParams.get('page') || '1') - 1);
  const size = parseInt(searchParams.get('size') || '10');
  const sortParam = searchParams.get('sort');
  const search = searchParams.get('search') || '';

  // Apply sorting
  let sortedData = [...allData];

  // Parse the sort parameter if it exists
  if (sortParam) {
    try {
      // Try to parse the sort parameter as JSON
      let sortOptions;

      try {
        // First attempt: direct JSON parsing
        sortOptions = JSON.parse(sortParam);
      } catch (error) {
        // Ignore first parsing error and try second method
        // Second attempt: try decoding URI component first
        try {
          sortOptions = JSON.parse(decodeURIComponent(sortParam));
        } catch (decodeError) {
          // If both attempts fail, log the error and use default sorting
          console.error('Error parsing sort parameter:', decodeError);
          throw decodeError; // Re-throw to trigger the catch block below
        }
      }

      if (Array.isArray(sortOptions) && sortOptions.length > 0) {
        // Apply each sort option in order
        sortedData.sort((a: any, b: any) => {
          // Loop through each sort option
          for (const { id, desc } of sortOptions) {
            if (a[id] !== b[id]) {
              // If values are different, determine sort order based on desc flag
              if (desc) {
                // Descending order
                return a[id] > b[id] ? -1 : 1;
              } else {
                // Ascending order
                return a[id] > b[id] ? 1 : -1;
              }
            }
            // If values are equal, continue to next sort option
          }
          return 0; // If all values are equal
        });
      }
    } catch (error) {
      console.error('Error parsing sort parameter:', error);
    }
  } else {
    // Default sorting by ID if no sort parameter
    sortedData.sort((a: any, b: any) => (a.id > b.id ? 1 : -1));
  }

  if (search) {
    sortedData = sortedData.filter((item: any) => {
      return (
        item.username.toLowerCase().includes(search.toLowerCase()) ||
        item.fullName.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.role.toLowerCase().includes(search.toLowerCase()) ||
        item.status.toLowerCase().includes(search.toLowerCase())
      );
    });
  }

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
      // Convert back to 1-based for client
      page: page + 1,
      size,
      totalPages,
      totalElements,
    },
  });
}
