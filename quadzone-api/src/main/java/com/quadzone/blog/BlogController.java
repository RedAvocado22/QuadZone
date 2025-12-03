package com.quadzone.blog;

import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/blogs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Blog API", description = "Blog management API for creating, updating, and managing blog posts. Supports admin operations for full blog CRUD.")
public class BlogController {

    

}
