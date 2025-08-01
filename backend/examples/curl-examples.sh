#!/bin/bash

# Movie Management API - cURL Examples
# Make sure to start the server with: npm run dev

BASE_URL="http://localhost:3000"

echo "🎬 Movie Management API Examples"
echo "================================"

echo -e "\n1. Health Check"
curl -X GET "$BASE_URL/health" | jq

echo -e "\n2. Get All Media (First 5 items)"
curl -X GET "$BASE_URL/api/media?page=1&limit=5" | jq

echo -e "\n3. Search for 'Inception'"
curl -X GET "$BASE_URL/api/media?search=inception" | jq

echo -e "\n4. Get Movies Only"
curl -X GET "$BASE_URL/api/media?type=MOVIE&limit=10" | jq

echo -e "\n5. Filter by Science Fiction Genre"
curl -X GET "$BASE_URL/api/media?genre=SCIENCE_FICTION" | jq

echo -e "\n6. Create New Movie"
curl -X POST "$BASE_URL/api/media" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Interstellar",
    "type": "MOVIE",
    "director": "Christopher Nolan",
    "budget": 165000000,
    "location": "Alberta, Canada",
    "duration": 169,
    "year": 2014,
    "genre": "SCIENCE_FICTION",
    "rating": 8.6,
    "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.",
    "language": "English",
  }' | jq

echo -e "\n7. Get Statistics"
curl -X GET "$BASE_URL/api/media/stats/overview" | jq

echo -e "\n8. Update Media (ID 1 - adjust as needed)"
curl -X PUT "$BASE_URL/api/media/1" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 9.1,
    "description": "Updated description with enhanced details."
  }' | jq

echo -e "\n9. Get Single Media Item (ID 1)"
curl -X GET "$BASE_URL/api/media/1" | jq

echo -e "\n10. Advanced Search with Multiple Filters"
curl -X GET "$BASE_URL/api/media?type=MOVIE&genre=CRIME&sortBy=rating&sortOrder=desc&limit=5" | jq

echo -e "\n✅ Examples completed!"