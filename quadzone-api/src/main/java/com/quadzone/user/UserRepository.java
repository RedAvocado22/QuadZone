package com.quadzone.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    User getUsersById(Long id);

    @Query("""
            SELECT u
            FROM User u
            WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
            """)
    Page<User> search(@Param("keyword") String keyword, Pageable pageable);

    List<User> findByRole(UserRole role);

}
