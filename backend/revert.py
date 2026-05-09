import os
import re

entity_dir = r"e:\ManiStayBite\backend\src\main\java\com\example\staybite_backend\entity"
repo_dir = r"e:\ManiStayBite\backend\src\main\java\com\example\staybite_backend\repository"
controller_dir = r"e:\ManiStayBite\backend\src\main\java\com\example\staybite_backend\controller"
service_dir = r"e:\ManiStayBite\backend\src\main\java\com\example\staybite_backend\service"

def replace_in_file(filepath, replacements):
    with open(filepath, 'r') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements:
        if callable(old):
            new_content = old(new_content)
        else:
            new_content = new_content.replace(old, new)
            
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

# 1. Revert Entities
skip_entities = ["AuditLog.java", "Role.java"]
for filename in os.listdir(entity_dir):
    if filename.endswith(".java") and filename not in skip_entities:
        filepath = os.path.join(entity_dir, filename)
        table_name = filename.replace(".java", "").lower() + "s"
        if filename == "Hotel.java": table_name = "hotels"
        elif filename == "User.java": table_name = "users"
        elif filename == "Room.java": table_name = "rooms"
        elif filename == "Order.java": table_name = "orders"
        elif filename == "Attendance.java": table_name = "attendance"
        elif filename == "EventBooking.java": table_name = "event_bookings"
        elif filename == "Food.java": table_name = "foods"
        elif filename == "ResortService.java": table_name = "resort_services"
        elif filename == "Review.java": table_name = "reviews"
        elif filename == "Subscription.java": table_name = "subscriptions"
        elif filename == "SupportTicket.java": table_name = "support_tickets"
        elif filename == "Wallet.java": table_name = "wallets"

        replacements = [
            ("import org.springframework.data.annotation.Id;\nimport org.springframework.data.mongodb.core.mapping.Document;\nimport org.springframework.data.mongodb.core.mapping.DBRef;", "import jakarta.persistence.*;"),
            ("import org.springframework.data.annotation.Id;\nimport org.springframework.data.mongodb.core.mapping.Document;", "import jakarta.persistence.*;"),
            (f'@Document(collection = "{table_name}")', f'@Entity\n@Table(name = "{table_name}")'),
            ("@Id\n    private String ", "@Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long "),
            ("@DBRef", "@ManyToOne"), # Default, will manually fix ones that were OneToOne or needed JoinColumn
            ("private String orderId;", "private Long orderId;"),
            ("private String roomId;", "private Long roomId;"),
            ("private String reviewId;", "private Long reviewId;"),
            ("private String foodId;", "private Long foodId;"),
            ("private String eventId;", "private Long eventId;"),
            ("private String entityId;", "private Long entityId;"),
        ]
        replace_in_file(filepath, replacements)

# 2. Revert Repositories
skip_repos = ["AuditLogRepository.java"]
for filename in os.listdir(repo_dir):
    if filename.endswith(".java") and filename not in skip_repos:
        filepath = os.path.join(repo_dir, filename)
        replacements = [
            ("org.springframework.data.mongodb.repository.MongoRepository", "org.springframework.data.jpa.repository.JpaRepository"),
            ("extends MongoRepository<", "extends JpaRepository<"),
            (", String>", ", Long>"),
            ("String employeeId", "Long employeeId"),
            ("String userId", "Long userId"),
            ("String hotelId", "Long hotelId"),
            ("String entityId", "Long entityId"),
        ]
        replace_in_file(filepath, replacements)

# 3. Revert Controllers and Services
for directory in [controller_dir, service_dir]:
    for filename in os.listdir(directory):
        if filename.endswith(".java"):
            filepath = os.path.join(directory, filename)
            replacements = [
                ("String userId", "Long userId"),
                ("String id", "Long id"),
                ("String orderId", "Long orderId"),
                ("String ticketId", "Long ticketId"),
                ("String hotelId", "Long hotelId"),
                ("String employeeId", "Long employeeId"),
                ("String attendanceId", "Long attendanceId"),
            ]
            replace_in_file(filepath, replacements)

print("Revert completed.")
