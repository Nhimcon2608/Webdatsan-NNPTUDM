# Hướng Dẫn Triển Khai Cơ Chế Phân Trang (Pagination)

## 📋 Giới Thiệu

Cơ chế phân trang giúp tối ưu hóa hiệu suất API bằng cách chia dữ liệu thành các trang nhỏ hơn, giảm tải cho server và cải thiện tốc độ phản hồi.

## 📦 Các File Được Tạo

### 1. **PaginationResponse.java** - DTO cho response phân trang
Một generic class giúp bạn trả về dữ liệu phân trang có cấu trúc:
```json
{
  "content": [...],
  "pageNumber": 0,
  "pageSize": 10,
  "totalElements": 100,
  "totalPages": 10,
  "isFirst": true,
  "isLast": false
}
```

### 2. **PaginationRequest.java** - DTO cho request phân trang
Validate các tham số phân trang từ client

### 3. **PaginationUtil.java** - Utility class
Cung cấp các hàm tiện ích để tạo Pageable và kiểm tra trạng thái trang

### 4. Cập Nhật **TemporaryRecruitmentService.java**
- Thêm method `getAllPaginated()` với hỗ trợ custom sort

### 5. Cập Nhật **TemporaryRecruitmentController.java**
- Thêm endpoint `/temporary-recruitments/paginated` mới

## 🚀 Cách Sử Dụng

### Gọi API với phân trang:

**URL:**
```
GET /temporary-recruitments/paginated?page=0&size=10&sortBy=createAt&sortDirection=DESC
```

**Tham số:**
- `page` (int, default=0): Trang hiện tại (0-indexed)
- `size` (int, default=10): Số item mỗi trang (max=100)
- `sortBy` (String, default="createAt"): Trường để sắp xếp
- `sortDirection` (String, default="DESC"): Hướng sắp xếp (ASC/DESC)

**Ví dụ Response:**
```json
{
  "content": [
    {
      "id": "temp001",
      "createAt": "2025-11-13T10:30:00",
      "quantity": 5,
      "isAvailable": true,
      "reservationId": "res123",
      "content": "Content here"
    }
  ],
  "pageNumber": 0,
  "pageSize": 10,
  "totalElements": 150,
  "totalPages": 15,
  "isFirst": true,
  "isLast": false
}
```

## 📝 Hướng Dẫn Áp Dụng cho Service Khác

### Bước 1: Thêm Method vào Service

```java
import com.bcb.backend.mysql.dto.response.PaginationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

public PaginationResponse<YourResponseDTO> getAllPaginated(
        int page, int size, String sortBy, String sortDirection) {
    page = page < 0 ? 0 : page;
    size = size <= 0 ? 10 : (size > 100 ? 100 : size);
    
    Sort.Direction direction = "ASC".equalsIgnoreCase(sortDirection) 
        ? Sort.Direction.ASC 
        : Sort.Direction.DESC;
    
    var pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
    
    Page<YourResponseDTO> pageResult = repository.findAll(pageable)
            .map(mapper::toDTO);
    
    return PaginationResponse.<YourResponseDTO>builder()
            .content(pageResult.getContent())
            .pageNumber(pageResult.getNumber())
            .pageSize(pageResult.getSize())
            .totalElements(pageResult.getTotalElements())
            .totalPages(pageResult.getTotalPages())
            .isFirst(pageResult.isFirst())
            .isLast(pageResult.isLast())
            .build();
}
```

### Bước 2: Thêm Endpoint vào Controller

```java
@GetMapping("/paginated")
public ResponseEntity<PaginationResponse<YourResponseDTO>> getAllPaginated(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "id") String sortBy,
        @RequestParam(defaultValue = "DESC") String sortDirection) {
    PaginationResponse<YourResponseDTO> response = 
        service.getAllPaginated(page, size, sortBy, sortDirection);
    return ResponseEntity.ok(response);
}
```

## 🔧 Cách Sử Dụng PaginationUtil

```java
import com.bcb.backend.mysql.util.PaginationUtil;

// Tạo Pageable từ các tham số
var pageable = PaginationUtil.createPageable(0, 10, "createAt", "DESC");

// Sử dụng trong repository
Page<Entity> page = repository.findAll(pageable);

// Kiểm tra trạng thái
boolean isFirst = PaginationUtil.isFirstPage(page);
boolean isLast = PaginationUtil.isLastPage(page);
int totalPages = PaginationUtil.getTotalPages(page);
long totalElements = PaginationUtil.getTotalElements(page);
```

## ⚙️ Validation Rules

- **Page:** Phải >= 0, mặc định là 0
- **Size:** Phải > 0, mặc định 10, tối đa 100 (tránh query quá nhiều dữ liệu)
- **SortBy:** Phải là field hợp lệ của entity, mặc định "id"
- **SortDirection:** "ASC" hoặc "DESC", mặc định "DESC"

## 💡 Lợi Ích

✅ **Giảm tải server**: Chỉ trả về dữ liệu cần thiết  
✅ **Tốc độ nhanh hơn**: Phản hồi API nhanh chóng  
✅ **Tiết kiệm bandwidth**: Giảm lượng dữ liệu truyền  
✅ **Trải nghiệm UX tốt hơn**: UI có thể load từng trang  
✅ **Dễ mở rộng**: Có thể áp dụng cho tất cả service  

## 🎯 Best Practices

1. **Luôn validate tham số phân trang** từ client
2. **Set giới hạn size** tối đa (trong trường hợp này là 100)
3. **Sử dụng indexed fields** cho sortBy để tối ưu performance
4. **Cache kết quả** nếu dữ liệu không thay đổi thường xuyên
5. **Trả về metadata phân trang** đầy đủ cho client

---

**Tạo bởi:** GitHub Copilot  
**Ngày:** 13/11/2025
