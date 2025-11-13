package com.quadzone.utils;

import com.quadzone.user.User;
import com.quadzone.user.dto.CurrentUserResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ObjectMapper {
    @PersistenceContext
    private EntityManager em;

    public CurrentUserResponse toCurrentUserResponse(User user) {
        //NOTE: User lấy từ spring security bị detached nên phải dùng cái của nợ này để merge lại vào.
        return CurrentUserResponse.from(em.merge(user));
    }

}
