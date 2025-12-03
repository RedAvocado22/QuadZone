package com.quadzone.user;

import com.quadzone.exception.user.UserAlreadyExistsException;
import com.quadzone.exception.user.UserNotFoundException;
import com.quadzone.global.dto.PagedResponse;
import com.quadzone.user.dto.UserProfileDTO;
import com.quadzone.user.dto.UserProfileRequest;
import com.quadzone.user.dto.*;
import com.quadzone.utils.EntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;

    private final EntityMapper objectMapper;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.getUsersById(id);
    }
    
    public UserProfileDTO getUserProfile(Long userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDTO(user);
    }
    @Transactional
    public UserProfileDTO updateUserProfile(Long userId, UserProfileRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPhoneNumber(request.phoneNumber());
        user.setAddress(request.address());
        user.setCity(request.city());
        user.setUpdatedAt(LocalDateTime.now());
        user.setDateOfBirth(LocalDate.now());

        User updatedUser = userRepository.save(user);
        return mapToDTO(updatedUser);
    }
    @Transactional
    public UserProfileDTO updateUserAvatar(Long userId, String avatarUrl) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        user.setAvatarUrl(avatarUrl);
        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);
        return mapToDTO(updatedUser);
    }
    private UserProfileDTO mapToDTO(User user) {
        return UserProfileDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .city(user.getCity())
                .dateOfBirth(user.getDateOfBirth())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    public UserResponse getUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        return objectMapper.toUserResponse(user);
    }

    public UserResponse createUser(UserRegisterRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new UserAlreadyExistsException("User with email " + request.email() + " already exists");
        }

        User user = UserRegisterRequest.toUser(request);
        return objectMapper.toUserResponse(
                userRepository.save(user)
        );
    }

    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        // Check if email is being updated and if it already exists
        if (request.email() != null && !request.email().equals(user.getEmail())) {
            if (userRepository.findByEmail(request.email()).isPresent()) {
                throw new UserAlreadyExistsException("User with email " + request.email() + " already exists");
            }
        }

        user.updateFrom(request);

        return objectMapper.toUserResponse(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException(id);
        }
        userRepository.deleteById(id);
    }

    // Admin methods
    @Transactional(readOnly = true)
    public PagedResponse<UserResponse> findUsers(int page, int size, String search) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1), Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<User> resultPage;
        if (search != null && !search.isBlank()) {
            resultPage = userRepository.search(search.trim(), pageable);
        } else {
            resultPage = userRepository.findAll(pageable);
        }

        var users = resultPage.stream()
                .map(objectMapper::toUserResponse)
                .toList();

        return new PagedResponse<>(
                users,
                resultPage.getTotalElements(),
                resultPage.getNumber(),
                resultPage.getSize()
        );
    }

    @Transactional(readOnly = true)
    public UserAdminResponse findByIdForAdmin(Long id) {
        return userRepository.findById(id)
                .map(objectMapper::toUserAdminResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + id));
    }

    /**
     * Get all users by role
     */
    @Transactional(readOnly = true)
    public List<UserResponse> getUsersByRole(UserRole role) {
        List<User> users = userRepository.findByRole(role);
        return users.stream()
                .map(objectMapper::toUserResponse)
                .toList();
    }
}

