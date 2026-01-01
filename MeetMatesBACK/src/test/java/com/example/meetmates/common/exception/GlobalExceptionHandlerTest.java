package com.example.meetmates.common.exception;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.meetmates.security.JwtAuthenticationFilter;

@WebMvcTest(
    controllers = GlobalExceptionHandlerTest.TestController.class,
    excludeAutoConfiguration = SecurityAutoConfiguration.class,
    excludeFilters = @Filter(
        type = FilterType.ASSIGNABLE_TYPE,
        classes = JwtAuthenticationFilter.class
    )
)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void should_return_404_for_user_not_found_api_exception() throws Exception {
        mockMvc.perform(get("/test"))
                .andExpect(status().isNotFound());
    }

    @RestController
    static class TestController {

        @GetMapping("/test")
        public void test() {
            throw new ApiException(ErrorCode.USER_NOT_FOUND);
        }
    }
}
