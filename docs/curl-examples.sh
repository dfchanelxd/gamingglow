#!/bin/bash

# ============================================
# GAMINGGLOW API - cURL Examples
# ============================================

# Set base URL
BASE_URL="http://localhost:3000"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}GAMINGGLOW API Examples${NC}"
echo "========================"
echo ""

# ============================================
# AUTHENTICATION
# ============================================

echo -e "${GREEN}1. Admin Login${NC}"
curl -X POST "${BASE_URL}/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gamingglow.local",
    "password": "Admin123!Staging"
  }' \
  -c cookies.txt

echo ""
echo ""

echo -e "${GREEN}2. Verify 2FA (if enabled)${NC}"
curl -X PUT "${BASE_URL}/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gamingglow.local",
    "token": "123456"
  }' \
  -c cookies.txt

echo ""
echo ""

echo -e "${GREEN}3. Logout${NC}"
curl -X POST "${BASE_URL}/api/admin/logout" \
  -b cookies.txt

echo ""
echo ""

# ============================================
# ADMIN DASHBOARD
# ============================================

echo -e "${GREEN}4. Get Dashboard Stats${NC}"
curl -X GET "${BASE_URL}/api/admin/stats" \
  -b cookies.txt

echo ""
echo ""

echo -e "${GREEN}5. Get Audit Logs${NC}"
curl -X GET "${BASE_URL}/api/admin/logs?page=1&limit=50" \
  -b cookies.txt

echo ""
echo ""

# ============================================
# PRODUCTS (ADMIN)
# ============================================

echo -e "${GREEN}6. List Products${NC}"
curl -X GET "${BASE_URL}/api/admin/products?page=1&limit=20&status=published" \
  -b cookies.txt

echo ""
echo ""

echo -e "${GREEN}7. Create Product${NC}"
curl -X POST "${BASE_URL}/api/admin/products" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "New Awesome Game",
    "tagline": "An epic adventure awaits",
    "description": "This is an amazing game with incredible graphics and gameplay.",
    "type": "game",
    "category": "action",
    "publisher": "Awesome Studio",
    "developer": "Awesome Studio",
    "tags": ["action", "adventure", "multiplayer"],
    "languages": ["Indonesia", "English"],
    "status": "draft"
  }'

echo ""
echo ""

echo -e "${GREEN}8. Update Product${NC}"
curl -X PUT "${BASE_URL}/api/admin/products" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "status": "published"
  }'

echo ""
echo ""

echo -e "${GREEN}9. Delete Product${NC}"
curl -X DELETE "${BASE_URL}/api/admin/products?id=660e8400-e29b-41d4-a716-446655440000" \
  -b cookies.txt

echo ""
echo ""

# ============================================
# PUBLIC API
# ============================================

echo -e "${GREEN}10. Get Product Details (Public)${NC}"
curl -X GET "${BASE_URL}/api/public/products/cyber-odyssey-2077"

echo ""
echo ""

echo -e "${GREEN}11. Generate Download URL${NC}"
curl -X POST "${BASE_URL}/api/generate-download" \
  -H "Content-Type: application/json" \
  -d '{
    "productSlug": "cyber-odyssey-2077",
    "version": "1.0.5",
    "email": "user@example.com"
  }'

echo ""
echo ""

echo -e "${GREEN}12. Report DMCA${NC}"
curl -X POST "${BASE_URL}/api/report-dmca" \
  -H "Content-Type: application/json" \
  -d '{
    "claimantName": "John Doe",
    "claimantEmail": "john@example.com",
    "claimantAddress": "123 Main Street, City, Country",
    "productSlug": "cyber-odyssey-2077",
    "infringingMaterial": "The game uses my copyrighted music track without permission.",
    "originalMaterial": "My original music track released in 2023, available at https://example.com/my-music",
    "goodFaithStatement": true,
    "accuracyStatement": true,
    "signature": "John Doe"
  }'

echo ""
echo ""

# ============================================
# 2FA MANAGEMENT
# ============================================

echo -e "${GREEN}13. Get 2FA Status${NC}"
curl -X GET "${BASE_URL}/api/admin/2fa" \
  -b cookies.txt

echo ""
echo ""

echo -e "${GREEN}14. Setup 2FA${NC}"
curl -X POST "${BASE_URL}/api/admin/2fa" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "action": "setup"
  }'

echo ""
echo ""

echo -e "${GREEN}15. Verify and Enable 2FA${NC}"
curl -X POST "${BASE_URL}/api/admin/2fa" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "action": "verify",
    "token": "123456"
  }'

echo ""
echo ""

echo -e "${GREEN}16. Disable 2FA${NC}"
curl -X POST "${BASE_URL}/api/admin/2fa" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "action": "disable",
    "token": "123456"
  }'

echo ""
echo ""

echo -e "${BLUE}Done!${NC}"

# Cleanup
rm -f cookies.txt
