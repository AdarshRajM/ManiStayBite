import java.io.*;
import java.nio.file.*;
import java.util.*;

public class Revert {
    public static void main(String[] args) throws Exception {
        String entityDir = "src/main/java/com/example/staybite_backend/entity";
        String repoDir = "src/main/java/com/example/staybite_backend/repository";
        String controllerDir = "src/main/java/com/example/staybite_backend/controller";
        String serviceDir = "src/main/java/com/example/staybite_backend/service";

        System.out.println("Starting Revert...");

        // 1. Entities
        File eDir = new File(entityDir);
        if (eDir.exists()) {
            for (File f : eDir.listFiles()) {
                String name = f.getName();
                if (name.endsWith(".java") && !name.equals("AuditLog.java") && !name.equals("Role.java")) {
                    String content = new String(Files.readAllBytes(f.toPath()));
                    
                    content = content.replace("import org.springframework.data.annotation.Id;\nimport org.springframework.data.mongodb.core.mapping.Document;\nimport org.springframework.data.mongodb.core.mapping.DBRef;", "import jakarta.persistence.*;");
                    content = content.replace("import org.springframework.data.annotation.Id;\nimport org.springframework.data.mongodb.core.mapping.Document;", "import jakarta.persistence.*;");
                    
                    String tableName = name.replace(".java", "").toLowerCase() + "s";
                    if (name.equals("Hotel.java")) tableName = "hotels";
                    else if (name.equals("User.java")) tableName = "users";
                    else if (name.equals("Room.java")) tableName = "rooms";
                    else if (name.equals("Order.java")) tableName = "orders";
                    else if (name.equals("Attendance.java")) tableName = "attendance";
                    else if (name.equals("EventBooking.java")) tableName = "event_bookings";
                    else if (name.equals("Food.java")) tableName = "foods";
                    else if (name.equals("ResortService.java")) tableName = "resort_services";
                    else if (name.equals("Review.java")) tableName = "reviews";
                    else if (name.equals("Subscription.java")) tableName = "subscriptions";
                    else if (name.equals("SupportTicket.java")) tableName = "support_tickets";
                    else if (name.equals("Wallet.java")) tableName = "wallets";
                    
                    content = content.replace("@Document(collection = \"" + tableName + "\")", "@Entity\n@Table(name = \"" + tableName + "\")");
                    content = content.replace("@Id\n    private String ", "@Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long ");
                    content = content.replace("private String orderId;", "private Long orderId;");
                    content = content.replace("private String roomId;", "private Long roomId;");
                    content = content.replace("private String reviewId;", "private Long reviewId;");
                    content = content.replace("private String foodId;", "private Long foodId;");
                    content = content.replace("private String eventId;", "private Long eventId;");
                    
                    // Specific JoinColumn fixes
                    if (name.equals("User.java")) {
                        content = content.replace("@DBRef\n    private Hotel hotel;", "@ManyToOne\n    @JoinColumn(name = \"hotel_id\")\n    private Hotel hotel;");
                    } else if (name.equals("Hotel.java")) {
                        content = content.replace("@DBRef\n    private User owner;", "@ManyToOne\n    @JoinColumn(name = \"owner_id\", nullable = false)\n    private User owner;");
                    } else if (name.equals("Room.java") || name.equals("Food.java") || name.equals("Order.java")) {
                        content = content.replace("@DBRef\n    private Hotel hotel;", "@ManyToOne\n    @JoinColumn(name = \"hotel_id\")\n    private Hotel hotel;");
                        if (name.equals("Order.java")) {
                            content = content.replace("@DBRef\n    private User user;", "@ManyToOne\n    @JoinColumn(name = \"user_id\", nullable = false)\n    private User user;");
                            content = content.replace("@DBRef\n    private User employee;", "@ManyToOne\n    @JoinColumn(name = \"employee_id\")\n    private User employee;");
                        }
                    } else if (name.equals("Attendance.java")) {
                        content = content.replace("@DBRef\n    private User employee;", "@ManyToOne\n    @JoinColumn(name = \"employee_id\", nullable = false)\n    private User employee;");
                    } else if (name.equals("EventBooking.java") || name.equals("Review.java") || name.equals("SupportTicket.java") || name.equals("ResortService.java")) {
                        content = content.replace("@DBRef\n    private User user;", "@ManyToOne\n    @JoinColumn(name = \"user_id\", nullable = false)\n    private User user;");
                        if(name.equals("ResortService.java")) {
                            content = content.replace("@JoinColumn(name = \"user_id\", nullable = false)", "@JoinColumn(name = \"user_id\")");
                        }
                    } else if (name.equals("Subscription.java") || name.equals("Wallet.java")) {
                        if(name.equals("Subscription.java")) {
                            content = content.replace("@DBRef\n    private Hotel hotel;", "@OneToOne\n    @JoinColumn(name = \"hotel_id\", nullable = false)\n    private Hotel hotel;");
                        } else {
                            content = content.replace("@DBRef\n    private User user;", "@OneToOne\n    @JoinColumn(name = \"user_id\", nullable = false)\n    private User user;");
                        }
                    }
                    
                    if (name.equals("Review.java")) {
                        content = content.replace("private String entityId;", "private Long entityId;");
                    }

                    Files.write(f.toPath(), content.getBytes());
                    System.out.println("Updated " + f.getName());
                }
            }
        }

        // 2. Repositories
        File rDir = new File(repoDir);
        if (rDir.exists()) {
            for (File f : rDir.listFiles()) {
                String name = f.getName();
                if (name.endsWith(".java") && !name.equals("AuditLogRepository.java")) {
                    String content = new String(Files.readAllBytes(f.toPath()));
                    content = content.replace("org.springframework.data.mongodb.repository.MongoRepository", "org.springframework.data.jpa.repository.JpaRepository");
                    content = content.replace("extends MongoRepository<", "extends JpaRepository<");
                    content = content.replace(", String>", ", Long>");
                    content = content.replace("String employeeId", "Long employeeId");
                    content = content.replace("String userId", "Long userId");
                    content = content.replace("String hotelId", "Long hotelId");
                    content = content.replace("String entityId", "Long entityId");
                    Files.write(f.toPath(), content.getBytes());
                    System.out.println("Updated " + f.getName());
                }
            }
        }

        // 3. Controllers and Services
        String[] dirs = {controllerDir, serviceDir};
        for (String d : dirs) {
            File dir = new File(d);
            if (dir.exists()) {
                for (File f : dir.listFiles()) {
                    if (f.getName().endsWith(".java")) {
                        String content = new String(Files.readAllBytes(f.toPath()));
                        content = content.replace("String userId", "Long userId");
                        content = content.replace("String id", "Long id");
                        content = content.replace("String orderId", "Long orderId");
                        content = content.replace("String ticketId", "Long ticketId");
                        content = content.replace("String hotelId", "Long hotelId");
                        content = content.replace("String employeeId", "Long employeeId");
                        content = content.replace("String attendanceId", "Long attendanceId");
                        Files.write(f.toPath(), content.getBytes());
                        System.out.println("Updated " + f.getName());
                    }
                }
            }
        }

        System.out.println("Done.");
    }
}
